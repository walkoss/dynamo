# SPDX-FileCopyrightText: Copyright (c) 2025-2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0

"""Shared AIC session helpers used by internal Dynamo integrations."""

from __future__ import annotations

import logging

logger = logging.getLogger(__name__)

DEFAULT_BACKEND_VERSIONS = {
    "vllm": "0.14.0",
    "sglang": "0.5.6.post2",
}
DEFAULT_STATIC_STRIDE = 32

# Historical mocker KV-cache block count, used as the fallback when AIC cannot
# produce a memory estimate (not installed, unsupported model/system, or missing
# inputs). Mirrors the mocker/replay defaults so behavior is unchanged when AIC
# estimation is unavailable.
DEFAULT_NUM_GPU_BLOCKS = 16384

# Backend -> the memory-fraction kind AIC expects. TRT-LLM applies the fraction
# to FREE memory; vLLM/SGLang apply it to TOTAL memory. Mirrors AIC's own
# `aiconfigurator.sdk.memory._BACKEND_FRACTION_KIND` so we never pass a kind the
# backend rejects.
_MEMORY_FRACTION_KIND = {
    "trtllm": "of_free",
    "vllm": "of_total",
    "sglang": "of_total",
}

_ONE_GIB = 1 << 30

# Messages already emitted by `_warn_once`, so a multi-worker launch logs each
# distinct fallback reason once instead of once per worker.
_WARNED: set[str] = set()


def resolve_backend_version(backend_name: str, backend_version: str | None) -> str:
    """Return the pinned backend version used for AIC perf lookups."""
    if backend_version is not None:
        return backend_version
    return DEFAULT_BACKEND_VERSIONS.get(backend_name, DEFAULT_BACKEND_VERSIONS["vllm"])


def _warn_once(message: str) -> None:
    """Log ``message`` at WARNING level at most once per process."""
    if message in _WARNED:
        return
    _WARNED.add(message)
    logger.warning("%s", message)


def _resolve_gpu_capacity_bytes(system: str, backend: str, version: str) -> int | None:
    """Per-rank GPU memory capacity (bytes) from AIC's perf-DB SystemSpec.

    Used only for the naive fallback, which (unlike the native path) does not read
    the SystemSpec itself. ``get_database`` returns ``None`` (it does not raise)
    for an unknown system/backend/version, so null-check before indexing. Any
    failure returns ``None`` -> the caller drops to the default block count.
    """
    try:
        from aiconfigurator.sdk import perf_database

        database = perf_database.get_database(
            system=system, backend=backend, version=version
        )
        if database is None:
            return None
        capacity = database.system_spec["gpu"]["mem_capacity"]
        return int(capacity) if capacity and capacity > 0 else None
    except Exception:  # pragma: no cover - defensive; AIC internals vary by version
        return None


def estimate_num_gpu_blocks(
    *,
    model_path: str | None,
    system: str | None,
    backend: str | None,
    block_size: int,
    max_num_tokens: int | None,
    max_batch_size: int | None,
    backend_version: str | None = None,
    tp_size: int = 1,
    moe_tp_size: int | None = None,
    moe_ep_size: int | None = None,
    attention_dp_size: int = 1,
    memory_fraction: float = 0.9,
    gpu_memory_capacity_gb: float | None = None,
    tolerance_fraction: float | None = None,
    default_num_gpu_blocks: int = DEFAULT_NUM_GPU_BLOCKS,
) -> int:
    """Estimate the per-rank KV-cache GPU block count via AIC's memory API.

    Wraps ``aiconfigurator.sdk.memory.estimate_num_gpu_blocks`` (PR #1201). The
    estimate is **per rank** (per single GPU / engine instance): ``tp_size`` shards
    the KV cache (more tokens per rank), while ``attention_dp_size`` replicates it
    (each DP rank holds the full per-token KV). The parallel mapping is forwarded
    verbatim and the per-rank result is returned directly -- callers MUST NOT scale
    by the mocker's data-parallel replica count, which is orthogonal.

    Never raises: every failure path (AIC missing, unsupported model/system/backend,
    missing inputs) logs once via :func:`_warn_once` and returns
    ``default_num_gpu_blocks`` so a launch is never blocked on the estimate.

    Args:
        backend: ``vllm``/``sglang``/``trtllm``; defaults to ``vllm`` when ``None``.
            Selects the memory-fraction kind (``of_total`` vs ``of_free``).
        block_size: scheduler KV block size in tokens (must be positive).
        gpu_memory_capacity_gb: explicit per-rank GPU capacity. When set it wins
            over AIC's SystemSpec capacity (on both the native and naive paths) and
            enables the naive fallback for models AIC cannot build natively.
        tolerance_fraction: optional KV safety margin in ``[0, 1)``.
    """
    if not model_path or not system:
        _warn_once(
            "AIC num_gpu_blocks estimation skipped (model_path/system not set); "
            f"using default {default_num_gpu_blocks}"
        )
        return default_num_gpu_blocks
    if block_size <= 0:
        _warn_once(
            f"AIC num_gpu_blocks estimation skipped (block_size={block_size!r} <= 0); "
            f"using default {default_num_gpu_blocks}"
        )
        return default_num_gpu_blocks

    try:
        from aiconfigurator.sdk import memory
    except (ImportError, AttributeError):
        _warn_once(
            "aiconfigurator with the sdk.memory API is not installed; "
            f"using default num_gpu_blocks {default_num_gpu_blocks}"
        )
        return default_num_gpu_blocks

    backend = backend or "vllm"
    version = resolve_backend_version(backend, backend_version)
    kind = _MEMORY_FRACTION_KIND.get(backend, "of_total")
    capacity_bytes = (
        int(gpu_memory_capacity_gb * _ONE_GIB)
        if gpu_memory_capacity_gb is not None
        else None
    )
    common = dict(
        scheduler_block_size=block_size,
        max_num_tokens=max_num_tokens or 8192,
        max_batch_size=max_batch_size or 256,
        memory_fraction_kind=kind,
        memory_fraction_value=memory_fraction,
        tp_size=tp_size or 1,
        attention_dp_size=attention_dp_size or 1,
        moe_tp_size=moe_tp_size,
        moe_ep_size=moe_ep_size,
        tolerance_fraction=tolerance_fraction,
    )

    # Attempt 1: native. Pass the explicit capacity override only if the user gave
    # one (otherwise None, so AIC uses its exact per-rank SystemSpec capacity).
    try:
        return int(
            memory.estimate_num_gpu_blocks(
                model_path,
                system,
                backend,
                backend_version=version,
                gpu_memory_capacity_bytes_override=capacity_bytes,
                allow_naive_fallback=False,
                **common,
            )
        )
    except ValueError as native_exc:
        unsupported = native_exc  # model/system/backend AIC cannot build natively
    except Exception as native_exc:  # pragma: no cover - defensive
        _warn_once(
            f"AIC native num_gpu_blocks estimation errored ({native_exc}); "
            f"using default {default_num_gpu_blocks}"
        )
        return default_num_gpu_blocks

    # Attempt 2: naive fallback. Needs a capacity; use the explicit flag or the
    # perf-DB SystemSpec (loaded only here, on the unsupported branch).
    resolved_capacity = capacity_bytes or _resolve_gpu_capacity_bytes(
        system, backend, version
    )
    if resolved_capacity is None:
        _warn_once(
            f"AIC could not estimate num_gpu_blocks (native unsupported: {unsupported}) "
            "and no GPU capacity is available; pass --gpu-memory-capacity-gb to enable "
            f"the naive fallback. Using default {default_num_gpu_blocks}"
        )
        return default_num_gpu_blocks
    try:
        return int(
            memory.estimate_num_gpu_blocks(
                model_path,
                system,
                backend,
                backend_version=version,
                gpu_memory_capacity_bytes_override=resolved_capacity,
                allow_naive_fallback=True,
                allow_hf_config_download=False,
                **common,
            )
        )
    except Exception as naive_exc:
        _warn_once(
            f"AIC naive num_gpu_blocks fallback failed ({naive_exc}); "
            f"using default {default_num_gpu_blocks}"
        )
        return default_num_gpu_blocks


def _load_aiconfigurator():
    try:
        from aiconfigurator.sdk import config
        from aiconfigurator.sdk.backends.factory import get_backend
        from aiconfigurator.sdk.inference_session import InferenceSession
        from aiconfigurator.sdk.models import get_model
        from aiconfigurator.sdk.perf_database import (
            get_database,
            get_supported_databases,
        )
    except (
        ImportError
    ) as exc:  # pragma: no cover - exercised in integration environments
        raise RuntimeError(
            "aiconfigurator is required for AIC perf modeling but is not installed"
        ) from exc

    return {
        "config": config,
        "get_backend": get_backend,
        "InferenceSession": InferenceSession,
        "get_model": get_model,
        "get_database": get_database,
        "get_supported_databases": get_supported_databases,
    }


class AicSession:
    """Wrap an AIC InferenceSession with direct prefill/decode predictors."""

    def __init__(
        self,
        backend_name: str,
        system: str,
        model_path: str,
        tp_size: int,
        backend_version: str | None = None,
        moe_tp_size: int | None = None,
        moe_ep_size: int | None = None,
        attention_dp_size: int | None = None,
    ):
        aic = _load_aiconfigurator()
        version = resolve_backend_version(backend_name, backend_version)

        database = aic["get_database"](
            system=system, backend=backend_name, version=version
        )
        if database is None:
            supported = (
                aic["get_supported_databases"]().get(system, {}).get(backend_name, [])
            )
            supported_versions = ", ".join(supported) if supported else "<none>"
            raise RuntimeError(
                "AIC perf database not found for "
                f"system={system!r}, backend={backend_name!r}, version={version!r}. "
                f"Supported versions for this system/backend: {supported_versions}"
            )

        model_config = aic["config"].ModelConfig(
            tp_size=tp_size,
            moe_tp_size=moe_tp_size,
            moe_ep_size=moe_ep_size,
            attention_dp_size=attention_dp_size or 1,
        )
        model = aic["get_model"](
            model_path=model_path,
            model_config=model_config,
            backend_name=backend_name,
        )
        backend = aic["get_backend"](backend_name)
        self._session = aic["InferenceSession"](
            model=model, database=database, backend=backend
        )
        self._database = database
        self._model = model
        self._model_name = getattr(model, "model_name", None) or model_path
        logger.info(
            "AIC session initialized: backend=%s, system=%s, model=%s, tp=%d",
            backend_name,
            system,
            model_path,
            tp_size,
        )

    def _predict_context_latency(
        self, batch_size: int, effective_isl: int, prefix: int
    ) -> float:
        if effective_isl <= 0:
            raise ValueError(
                f"effective_isl must be positive, got effective_isl={effective_isl}"
            )

        total_latency = 0.0
        for op in self._model.context_ops:
            op_name = getattr(op, "_name", "")
            x = batch_size if "logits_gemm" in op_name else batch_size * effective_isl
            result = op.query(
                self._database,
                x=x,
                batch_size=batch_size,
                beam_width=1,
                s=effective_isl,
                prefix=prefix,
                model_name=self._model_name,
                seq_imbalance_correction_scale=1.0,
            )
            total_latency += float(result)

        return total_latency

    def _predict_generation_latency(self, batch_size: int, isl: int, osl: int) -> float:
        if osl <= 1:
            return 0.0

        effective_batch_size = batch_size * (self._model._nextn + 1)
        total_latency = 0.0

        for step in range(0, osl - 1, DEFAULT_STATIC_STRIDE):
            step_latency = 0.0
            for op in self._model.generation_ops:
                result = op.query(
                    self._database,
                    x=effective_batch_size,
                    batch_size=effective_batch_size,
                    beam_width=1,
                    s=isl + step + 1,
                    model_name=self._model_name,
                    gen_seq_imbalance_correction_scale=1.0,
                )
                step_latency += float(result)

            repeat_count = min(DEFAULT_STATIC_STRIDE, osl - 1 - step)
            total_latency += step_latency * repeat_count

        return total_latency

    def predict_prefill(
        self, batch_size: int, effective_isl: int, prefix: int
    ) -> float:
        """Predict prefill latency in ms from uncached tokens and cached prefix."""
        return self._predict_context_latency(batch_size, effective_isl, prefix)

    def predict_decode(self, batch_size: int, isl: int, osl: int) -> float:
        """Predict decode (generation) latency in ms."""
        return self._predict_generation_latency(batch_size, isl, osl)


def create_session(
    backend_name: str,
    system: str,
    model_path: str,
    tp_size: int,
    backend_version: str | None = None,
    moe_tp_size: int | None = None,
    moe_ep_size: int | None = None,
    attention_dp_size: int | None = None,
) -> AicSession:
    """Factory function called from Rust via PyO3."""
    return AicSession(
        backend_name,
        system,
        model_path,
        tp_size,
        backend_version,
        moe_tp_size,
        moe_ep_size,
        attention_dp_size,
    )
