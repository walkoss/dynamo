# SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0

# TensorRT-LLM V1 GMS Connector Backlog

This file is the recovery manifest for the legacy TensorRT-LLM V1 GMS KV
connector path. The active Dynamo GMS runtime targets TensorRT-LLM
`KVCacheManagerV2`; the V1 connector is intentionally preserved on backlog
branches so it can be revived or compared without keeping the legacy runtime in
the main PR stack.

## Branches

| Repository | Branch | Purpose |
| --- | --- | --- |
| Dynamo | `backlog/gms-trtllm-v1-connector` | Last Dynamo state before removing the TRT-LLM V1 runtime connector. |
| TensorRT-LLM nested repo | `backlog/trtllm-v1-kv-connector-hook` | Upstream TRT-LLM hook series required by the V1 connector. |

The TensorRT-LLM patch branch is preserved separately from the active Dynamo
GMS PR stack. Restore it in a dedicated experimental checkout when V1 support
needs to be evaluated again.

## Required TensorRT-LLM Patches

The nested backlog branch contains these commits on top of `origin/main`:

```text
61314005 [None][fix] nanobind type-cast for allocate_primary_pool trampoline
f5b84f02 integration tests for allocate_kv_caches hook
d4bd8b67 add cuMemMap-based VMM allocator example connector
f0b5cc8f add KvCachePoolLayout helper for byte-level pool addressing
deaf34cf expose custom KV cache pool allocator via connector hook
```

These patches provide the legacy V1 `allocate_kv_caches`/primary-pool hook that
lets a TRT-LLM connector allocate KV from a daemon-owned CUDA VMM pool. Without
that patched TRT-LLM wheel, Dynamo's legacy V1 connector cannot make GMS own the
TRT-LLM KV allocation.

## Dynamo Files Preserved On The Backlog Branch

The Dynamo backlog branch keeps the removed runtime files:

```text
lib/gpu_memory_service/integrations/trtllm/gms_connector.py
lib/gpu_memory_service/integrations/trtllm/install_vmm_ipc_kv.py
```

It also preserves the package-level exports/setup wiring in:

```text
lib/gpu_memory_service/integrations/trtllm/__init__.py
components/src/dynamo/trtllm/workers/llm_worker.py
```

The V1 connector implements scheduler/worker classes for TRT-LLM's legacy
`KvCacheConnector` API, prefix-index persistence, daemon epoch invalidation,
GMS ring spill/restore metadata, VMM-IPC allocation through the patched
`allocate_kv_caches` hook, and cross-node content-hash registration.

## Restore Procedure

To bring the legacy path back into an experimental branch, start from the active
Dynamo branch and restore the preserved Dynamo files:

```bash
git restore --source backlog/gms-trtllm-v1-connector -- \
  lib/gpu_memory_service/integrations/trtllm/gms_connector.py \
  lib/gpu_memory_service/integrations/trtllm/install_vmm_ipc_kv.py \
  lib/gpu_memory_service/integrations/trtllm/__init__.py \
  components/src/dynamo/trtllm/workers/llm_worker.py
```

Then rebuild TensorRT-LLM from the V1 backlog patch branch using the standard
TensorRT-LLM runtime container workflow for the target release.

Run the legacy-focused checks from the restored branch before using it for any
real benchmark or e2e run:

```bash
python3 -m py_compile \
  lib/gpu_memory_service/integrations/trtllm/gms_connector.py \
  lib/gpu_memory_service/integrations/trtllm/install_vmm_ipc_kv.py

pytest lib/gms_kv_ring/tests/test_trtllm_connector.py -q
pytest components/src/dynamo/trtllm/tests/test_trtllm_unit.py -q
```

## Active-Branch Rule

Do not reintroduce the V1 connector into the active GMS PR stack unless the goal
is explicitly to revive the legacy connector. New TRT-LLM work should target
`KVCacheManagerV2` and should not depend on a patched V1 `allocate_kv_caches`
wheel.
