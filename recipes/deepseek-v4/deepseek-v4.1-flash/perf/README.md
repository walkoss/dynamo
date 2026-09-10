# SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0

# DeepSeek-V4.1-Flash Benchmark Recipe

A single [AIPerf](https://github.com/ai-dynamo/aiperf) trace-replay Job — [perf.yaml](perf.yaml) — covers every DeepSeek-V4.1-Flash DGD variant. The benchmark is identical across variants; only `ENDPOINT`, `TRACE_FILE`, `TRACE_URL`, `TRACE_SHA256`, and `TARGET_MODEL` need to change.

The Job waits for `GET /v1/models` on the DGD frontend to return the configured `TARGET_MODEL` (up to ~1h by default), runs a warmup (32 requests from the actual Mooncake trace at the target concurrency to fill the shared system prompt prefix), then replays the configured trace at a single `CONCURRENCY` value and writes raw artifacts to the shared `model-cache` PVC.

The bench pod is **co-located** with the DGD frontend (`podAffinity` on the frontend's host) so client → server traffic stays on a single node.

## Targeting a variant

Edit the `env` block in [perf.yaml](perf.yaml):

| Variant target | `ENDPOINT` | `TARGET_MODEL` | `TRACE_FILE` |
| ------------------------ | -------------------------------------------------- | ----------------------------------- | ----------------------------------------------------------------------- |
| B200 agg (4-GPU) | `dsv41-flash-agg-b200-agentic-frontend:8000` | `deepseek-ai/DeepSeek-V4.1-Flash` | `/model-cache/traces/64k_400_90kv_agent_new_noschedule_short_15perc.jsonl` |
| B200 disagg (1P1D) | `dsv41-flash-disagg-b200-agentic-frontend:8000` | `deepseek-ai/DeepSeek-V4.1-Flash` | `/model-cache/traces/64k_400_90kv_agent_new_noschedule_short_15perc.jsonl` |

Also update the `podAffinity` `values` list to include your deployed DGD name, and `metadata.name` / `labels.app` if you run multiple jobs in the same namespace.

## Dataset

The benchmark replays a [Mooncake-format](https://github.com/kvcache-ai/Mooncake) trace via `aiperf --custom-dataset-type mooncake_trace`. Each JSONL line describes one request (`input_length`, `output_length`, `hash_ids`).

**Agentic trace** — `64k_400_90kv_agent_new_noschedule_short_15perc.jsonl`:

| Metric | Value |
| ------ | ----- |
| Requests | 3,541 (15% subset) |
| ISL median | 67,585 |
| ISL p90 | 101,392 |
| OSL median | 399 |
| OSL p90 | 6,943 |
| Prefix reuse (trace design) | ~90% (shared ~57.6K-token system prompt) |
| Measured prefix-cache hit | 68–77% at C=24 |

For shorter runs (smoke tests, faster iteration), use a smaller subset. Typical staging:

```text
/model-cache/traces/<flavour>.jsonl                 # full
/model-cache/traces/<flavour>_short_30perc.jsonl    # ~30% subset
/model-cache/traces/<flavour>_short_15perc.jsonl    # ~15% subset
```

These are workload-shape traces (not model-specific). Stage your own Mooncake-format JSONLs at the path you set in `TRACE_FILE`.

## Running a concurrency sweep

The perf.yaml runs a single concurrency. To sweep:

1. Edit `CONCURRENCY` in perf.yaml
2. Delete and redeploy the DGD workers (so KV cache and prefix-cache state are reset)
3. Apply the perf Job
4. Wait for completion, collect artifacts
5. Repeat for each concurrency value

Recommended concurrency sweep for B200: C=4, 8, 16, 24, 32, 48, 64.

Pick the **floor-pick**: the highest concurrency where user output tok/s (P50) stays above 50. This is the recipe's maximum throughput while keeping the per-user SLA.

## Tunable environment variables

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `ENDPOINT` | `dsv41-flash-agg-b200-agentic-frontend:8000` | DGD frontend service URL |
| `TRACE_FILE` | `/model-cache/traces/64k_400_90kv_agent_new_noschedule_short_15perc.jsonl` | Path to Mooncake trace on PVC |
| `TRACE_URL` | `https://media.githubusercontent.com/.../64k_400_90kv_agent_new_noschedule_short_15perc.jsonl` | Auto-download URL if trace not on PVC |
| `TRACE_SHA256` | `f20d3f2bc83dd130...` | SHA-256 checksum for trace validation |
| `CONCURRENCY` | `24` | Number of concurrent requests |
| `TARGET_MODEL` | `deepseek-ai/DeepSeek-V4.1-Flash` | Must match `--served-model-name` on the DGD frontend |
| `ROOT_ARTIFACT_DIR` | `/model-cache/perf` | Root directory for benchmark artifacts |

## Artifacts

Results are written to:

```text
/model-cache/perf/<epoch>_<job-name>/
  warmup/
  DeepSeek-V4.1-Flash_trace_c<concurrency>_<timestamp>/
    profile_export_aiperf.json
    profile_export_aiperf.csv
    inputs.json
    ...
```

## Workflow

### 1. Deploy the DGD

```bash
# Aggregated (4-GPU, 1 worker × TP4)
kubectl apply -f vllm/agg-b200-agentic/deploy.yaml -n ${NAMESPACE}

# Disaggregated (1P1D, 2 workers × TP4, InfiniBand RDMA)
kubectl apply -f vllm/disagg-b200-agentic/deploy.yaml -n ${NAMESPACE}
```

### 2. Stage the trace on the PVC

No manual staging is required — the perf Job auto-downloads the trace if not already on the PVC.

### 3. Run the benchmark

```bash
kubectl apply -f perf/perf.yaml -n ${NAMESPACE}
kubectl logs -f -l job-name=dsv41-flash-bench -n ${NAMESPACE}
```

### 4. Fetch artifacts

First, create a helper pod with the PVC mounted:

```bash
kubectl run pvc-helper --image=alpine --restart=Never -- sleep 300 -n ${NAMESPACE}
kubectl wait --for=condition=Ready pod/pvc-helper -n ${NAMESPACE} --timeout=60s
kubectl cp ${NAMESPACE}/pvc-helper:/model-cache/perf/<epoch>_dsv41-flash-bench ./results
kubectl delete pod pvc-helper -n ${NAMESPACE}
```

### 5. Cleanup

```bash
kubectl delete job dsv41-flash-bench -n ${NAMESPACE}
```
