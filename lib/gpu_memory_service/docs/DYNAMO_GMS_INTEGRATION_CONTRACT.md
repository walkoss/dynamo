# SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0

# Dynamo/GMS Integration Contract

This note captures the intended boundary between Dynamo's router/worker
interface and the optional GMS KV management path. The goal is that a GMS-backed
worker remains substitutable with a vanilla Dynamo worker for normal request
serving, and that the router does not learn worker-local GMS daemon sockets or
transport details.

## Vanilla Dynamo Surfaces

GMS must preserve these standard Dynamo surfaces:

| Surface | Direction | Used by vanilla Dynamo | GMS rule |
| --- | --- | --- | --- |
| Model registration / MDC | worker -> discovery | Yes | GMS only adds optional capability metadata under `runtime_data.gms`. |
| `generate` endpoint | router -> worker | Yes | Request/response streaming remains the serving path. |
| KV events | worker -> router/indexer | Yes | GMS uses the same KV-event path when publishing cache state. |
| `worker_kv_indexer_query_dpN` | router -> worker | Yes | Worker-local index recovery remains the same endpoint. |
| Engine maintenance routes | orchestrator -> worker | Yes for maintenance/cutover | GMS may use existing sleep/release/resume-style routes; these are not on the per-request hot path. |

## Current GMS Extensions

The current decode-to-decode GMS transfer prototype is disabled by default and
adds these optional pieces when explicitly enabled with
`--router-gms-decode-transfer` / `DYN_ROUTER_GMS_DECODE_TRANSFER=true`:

1. `runtime_data.gms.control_enabled` in `ModelRuntimeConfig`. The field name
   is kept for backward compatibility, but semantically it is now a GMS
   placement capability bit. Vanilla workers omit it; the router treats omission
   as "no GMS placement available".
2. `gms_placement` metadata on ordinary KV events. GMS publishes NIXL source
   identity and per-block descriptors through the same KV event plane that
   vanilla Dynamo already uses for cache state. The router/indexer stores those
   descriptors keyed by worker and stable GMS content hash.
3. Optional `gms_placement` on `PreprocessedRequest`. When the reference policy
   chooses a less-loaded GMS worker, the router stamps already-indexed placement
   metadata onto the request sent to that destination worker.

There is no router-to-GMS daemon socket and no per-request router-to-source-worker
lookup. Worker-local daemon sockets stay private to the worker process. The only
router-to-worker communication used for cache recovery remains the vanilla
`worker_kv_indexer_query_dpN` endpoint, which is called during router boot,
recovery, or index catch-up rather than on every routed request.

Both indexer deployment modes use the same contract:

- Local-indexer mode applies the worker KV event stream directly and maintains a
  local GMS placement side index.
- Served/remote-indexer mode extends `IndexerQueryRequest` with optional GMS
  content hashes. The served indexer attaches matching placement descriptors to
  the tiered overlap response.

If the capability bit or placement descriptors are absent, the router falls back
to ordinary vanilla routing without attaching `gms_placement`.

## Swappability Guarantees

A vanilla worker remains swappable because:

- The router defaults `router_gms_decode_transfer=false`, so decode-to-decode
  transfer orchestration is inactive unless a deployment explicitly opts in.
- It does not publish `runtime_data.gms.control_enabled`, so it is never selected
  as a GMS transfer source or destination.
- It does not need to implement any GMS-specific router endpoint. The existing
  `worker_kv_indexer_query_dpN` recovery endpoint remains the only cache query
  channel the router may use.
- `gms_placement` is optional in `PreprocessedRequest` and is omitted from
  serialized requests unless a GMS placement was resolved from the indexer.
- Engine code should treat missing or unusable `gms_placement` as recompute, not
  as a request failure.

## Interface Notes

The main simplification is that GMS placement metadata has moved into the same
cache-state plane as vanilla Dynamo KV events. The router does not need NIXL
configuration, daemon socket paths, or worker-local bootstrap APIs. Its only GMS
responsibility is policy: choose whether indexed source placement should be
reused and, if so, forward the already-known descriptors to the selected worker.
