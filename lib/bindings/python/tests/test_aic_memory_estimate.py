# SPDX-FileCopyrightText: Copyright (c) 2025-2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0

"""Unit tests for `dynamo._internal.aic.estimate_num_gpu_blocks`.

`aiconfigurator.sdk.memory.estimate_num_gpu_blocks` and the GPU-capacity
resolver are monkeypatched, so the tests assert the helper's own logic --
backend->fraction-kind derivation, the native-then-naive two-attempt order, and
the never-raise fallback to the default block count -- without a perf DB.
"""

import logging

import pytest

import dynamo._internal.aic as aic

pytestmark = [
    pytest.mark.gpu_0,
    pytest.mark.parallel,
    pytest.mark.pre_merge,
    pytest.mark.unit,
]

_BASE = dict(
    model_path="some/model",
    system="h200_sxm",
    backend="vllm",
    block_size=64,
    max_num_tokens=8192,
    max_batch_size=256,
)


@pytest.fixture(autouse=True)
def _reset_warn_cache():
    aic._WARNED.clear()
    yield
    aic._WARNED.clear()


def _patch_memory(monkeypatch, side_effect):
    """Patch aiconfigurator.sdk.memory.estimate_num_gpu_blocks; record calls."""
    memory = pytest.importorskip("aiconfigurator.sdk.memory")
    calls = []

    def fake(model_path, system, backend, **kwargs):
        calls.append(
            {"model_path": model_path, "system": system, "backend": backend, **kwargs}
        )
        return side_effect(calls, kwargs)

    monkeypatch.setattr(memory, "estimate_num_gpu_blocks", fake)
    return calls


def test_missing_inputs_return_default_without_calling_aic(monkeypatch):
    calls = _patch_memory(monkeypatch, lambda calls, kw: 123)

    assert (
        aic.estimate_num_gpu_blocks(**{**_BASE, "system": None})
        == aic.DEFAULT_NUM_GPU_BLOCKS
    )
    assert (
        aic.estimate_num_gpu_blocks(**{**_BASE, "model_path": None})
        == aic.DEFAULT_NUM_GPU_BLOCKS
    )
    assert (
        aic.estimate_num_gpu_blocks(**{**_BASE, "block_size": 0})
        == aic.DEFAULT_NUM_GPU_BLOCKS
    )
    assert calls == []


@pytest.mark.parametrize(
    "backend,expected_kind",
    [("vllm", "of_total"), ("sglang", "of_total"), ("trtllm", "of_free")],
)
def test_fraction_kind_derived_from_backend(monkeypatch, backend, expected_kind):
    calls = _patch_memory(monkeypatch, lambda calls, kw: 777)

    result = aic.estimate_num_gpu_blocks(**{**_BASE, "backend": backend})

    assert result == 777
    assert calls[0]["memory_fraction_kind"] == expected_kind


def test_native_success_skips_naive(monkeypatch):
    calls = _patch_memory(monkeypatch, lambda calls, kw: 100)

    assert aic.estimate_num_gpu_blocks(**_BASE) == 100
    assert len(calls) == 1
    assert calls[0]["allow_naive_fallback"] is False
    assert calls[0]["gpu_memory_capacity_bytes_override"] is None


def test_native_then_naive_two_attempt(monkeypatch):
    monkeypatch.setattr(
        aic, "_resolve_gpu_capacity_bytes", lambda *a, **k: 141 * (1 << 30)
    )

    def side_effect(calls, kw):
        if not kw["allow_naive_fallback"]:
            raise ValueError("unsupported model/backend/GPU")
        return 42

    calls = _patch_memory(monkeypatch, side_effect)

    assert aic.estimate_num_gpu_blocks(**_BASE) == 42
    assert len(calls) == 2
    assert calls[0]["allow_naive_fallback"] is False
    assert calls[0]["gpu_memory_capacity_bytes_override"] is None
    assert calls[1]["allow_naive_fallback"] is True
    assert calls[1]["gpu_memory_capacity_bytes_override"] == 141 * (1 << 30)


def test_naive_without_capacity_returns_default(monkeypatch):
    monkeypatch.setattr(aic, "_resolve_gpu_capacity_bytes", lambda *a, **k: None)

    def side_effect(calls, kw):
        raise ValueError("unsupported model/backend/GPU")

    calls = _patch_memory(monkeypatch, side_effect)

    assert aic.estimate_num_gpu_blocks(**_BASE) == aic.DEFAULT_NUM_GPU_BLOCKS
    assert len(calls) == 1  # native attempted, naive skipped (no capacity)


def test_explicit_capacity_threaded_into_native(monkeypatch):
    calls = _patch_memory(monkeypatch, lambda calls, kw: 9)

    aic.estimate_num_gpu_blocks(**{**_BASE, "gpu_memory_capacity_gb": 80})

    assert calls[0]["gpu_memory_capacity_bytes_override"] == 80 * (1 << 30)


def test_warn_once_dedup(monkeypatch, caplog):
    _patch_memory(monkeypatch, lambda calls, kw: 1)

    with caplog.at_level(logging.WARNING, logger=aic.logger.name):
        aic.estimate_num_gpu_blocks(**{**_BASE, "system": None})
        aic.estimate_num_gpu_blocks(**{**_BASE, "system": None})

    warnings = [r for r in caplog.records if "estimation skipped" in r.getMessage()]
    assert len(warnings) == 1


def test_custom_default_used(monkeypatch):
    _patch_memory(monkeypatch, lambda calls, kw: 1)

    assert (
        aic.estimate_num_gpu_blocks(
            **{**_BASE, "system": None}, default_num_gpu_blocks=4096
        )
        == 4096
    )
