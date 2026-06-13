# SPDX-FileCopyrightText: Copyright (c) 2025-2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0

"""Unit tests for AIC-driven num_gpu_blocks estimation on the replay path.

The shared AIC helper (`dynamo._internal.aic.estimate_num_gpu_blocks`) is
monkeypatched so these stay hermetic -- no perf DB / model build. They assert
the wiring in `dynamo.replay.main._load_engine_args`:
- an explicit `num_gpu_blocks` in the args JSON wins verbatim (no AIC call);
- otherwise the value is estimated from the engine-args' aic_* fields, with the
  top-level `--aic-*` CLI flags as fallbacks.
"""

import json
from types import SimpleNamespace

import pytest

from dynamo.replay.main import _load_engine_args

pytestmark = [
    pytest.mark.gpu_0,
    pytest.mark.parallel,
    pytest.mark.pre_merge,
    pytest.mark.unit,
]


def _patch_estimator(monkeypatch, return_value):
    import dynamo.replay.main as rmain

    calls = []

    def fake(**kwargs):
        calls.append(kwargs)
        return return_value

    monkeypatch.setattr(rmain, "estimate_num_gpu_blocks", fake)
    return calls


def _cli(**overrides):
    defaults = dict(
        aic_model_path=None,
        aic_system=None,
        aic_backend=None,
        aic_backend_version=None,
        aic_tp_size=None,
    )
    defaults.update(overrides)
    return SimpleNamespace(**defaults)


def test_explicit_num_gpu_blocks_wins(monkeypatch):
    calls = _patch_estimator(monkeypatch, 99999)
    raw = json.dumps(
        {"engine_type": "vllm", "num_gpu_blocks": 2048, "aic_system": "h200_sxm"}
    )

    engine_args = _load_engine_args(raw, cli_args=_cli())

    assert engine_args.num_gpu_blocks == 2048
    assert calls == []


def test_estimates_from_engine_args_aic_fields(monkeypatch):
    calls = _patch_estimator(monkeypatch, 54321)
    raw = json.dumps(
        {
            "engine_type": "vllm",
            "aic_model_path": "Qwen/Qwen3-0.6B",
            "aic_system": "h200_sxm",
            "aic_tp_size": 2,
        }
    )

    engine_args = _load_engine_args(raw, cli_args=_cli())

    assert engine_args.num_gpu_blocks == 54321
    assert len(calls) == 1
    kw = calls[0]
    assert kw["model_path"] == "Qwen/Qwen3-0.6B"
    assert kw["system"] == "h200_sxm"
    assert kw["backend"] == "vllm"
    assert kw["block_size"] == 64  # normalized
    assert kw["tp_size"] == 2


def test_falls_back_to_cli_aic_flags(monkeypatch):
    calls = _patch_estimator(monkeypatch, 31337)
    raw = json.dumps({"engine_type": "vllm"})  # no aic fields in JSON
    cli = _cli(aic_model_path="Qwen/Qwen3-0.6B", aic_system="h200_sxm")

    engine_args = _load_engine_args(raw, cli_args=cli)

    assert engine_args.num_gpu_blocks == 31337
    kw = calls[0]
    assert kw["model_path"] == "Qwen/Qwen3-0.6B"
    assert kw["system"] == "h200_sxm"
    assert kw["backend"] == "vllm"  # no engine_type getter -> default


def test_helper_default_passthrough(monkeypatch):
    # Helper returns its fallback (16384) on internal failure; replay carries it.
    _patch_estimator(monkeypatch, 16384)
    raw = json.dumps({"engine_type": "vllm"})

    engine_args = _load_engine_args(raw, cli_args=_cli())

    assert engine_args.num_gpu_blocks == 16384


def test_none_raw_returns_none(monkeypatch):
    calls = _patch_estimator(monkeypatch, 1)
    assert _load_engine_args(None, cli_args=_cli()) is None
    assert calls == []
