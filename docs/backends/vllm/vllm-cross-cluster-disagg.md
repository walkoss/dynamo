---
title: Cross-Cluster Disaggregated Serving (Prefill as a Service)
description: Run prefill workers on a dedicated cluster and decode workers on a separate cluster
---

# Cross-Cluster Disaggregated Serving (Prefill as a Service)

## What is Prefill as a Service?

In Dynamo's disaggregated serving, every request passes through two stages:

1. **Prefill worker** — reads the prompt, runs the "understanding" computation, produces a KV cache
2. **Decode worker** — receives the KV cache and generates output tokens one by one

Normally both run on the same cluster. **Prefill as a Service (PrfaaS)** takes this further: the prefill workers live on a *dedicated, separate cluster*, and serve their computed KV caches to one or more decode clusters over the network.

```
Prefill cluster                      Decode cluster(s)
┌──────────────────────────────┐     ┌──────────────────────────────────┐
│  Prefill workers             │────►│  Frontend :8000                   │
│  (compute-dense GPUs)        │ KV  │  Decode workers (many)            │
│  Single shared fleet         │     │  (memory-bandwidth GPUs)          │
└──────────────────────────────┘     └──────────────────────────────────┘
          │ shared etcd + NATS │
          └────────────────────┘
```

### Why run prefill and decode on separate clusters?

**Hardware specialization**: Prefill is compute-bound (matrix multiplications over the full prompt). Decode is memory-bandwidth-bound (reading weights once per token). These have different optimal GPU profiles. A compute-dense GPU (H100 HBM3, A100) excels at prefill; a high-memory GPU (H100 NVL, A100 80GB) is more efficient for decode. Cross-cluster serving lets you match hardware to the workload.

**Independent scaling**: Prefill and decode have different saturation points. At high request rate, prefill saturates first. With PrfaaS you add prefill capacity without changing the decode pool.

**Multi-tenant prefill**: A single prefill fleet can serve multiple decode clusters — different teams, different datacenters — sharing the compute cost of long-context prefill.

## The bandwidth constraint

The catch: the KV cache must travel over the network between clusters. Whether this is feasible depends on model architecture and context length.

### KV cache sizes and cross-cluster transfer overhead

KV size per token depends on model architecture. For a standard dense attention layer:

**KV per token** = `layers × 2 (K+V) × kv_heads × head_dim × dtype_bytes`

For DeepSeek-R1-Distill-Llama-8B (32 layers, 8 GQA heads, dim=128, bfloat16):
KV per token = 32 × 2 × 8 × 128 × 2 = **128 KB/token**

The following table shows KV cache sizes (FP8) and estimated TTFT overhead at **30 Gbps** — the effective bandwidth measured in the Experiment B results above. For BF16 KV cache, double the sizes and transfer times. Data sourced from [roofline.cc](https://roofline.cc).

| Model | Architecture | 4K ISL | 16K ISL | 32K ISL | 64K ISL |
|-------|-------------|--------|---------|---------|---------|
| DeepSeek-V4-Flash | DSV4 (Hybrid-sparse) | 30 MB (+8ms) | 76 MB (+20ms) | 137 MB (+37ms) | 259 MB (+69ms) |
| Nemotron-3-Super-120B | Hybrid-linear | 57 MB (+15ms) | 105 MB (+28ms) | 169 MB (+45ms) | 297 MB (+79ms) |
| DeepSeek-V4-Pro | DSV4 (Hybrid-sparse) | 44 MB (+12ms) | 110 MB (+29ms) | 198 MB (+53ms) | 373 MB (+99ms) |
| Qwen3.5-122B-A10B | Hybrid-linear | 195 MB (+52ms) | 339 MB (+90ms) | 531 MB (+141ms) | 915 MB (+244ms) |
| Qwen3.5-397B-A17B | Hybrid-linear | 243 MB (+65ms) | 423 MB (+113ms) | 663 MB (+177ms) | 1.12 GB (+306ms) |
| GPT-OSS-120B | Hybrid-SWA | 74 MB (+20ms) | 290 MB (+77ms) | 578 MB (+154ms) | 1.13 GB (+309ms) |
| MiMo-V2.5-Pro | Hybrid-SWA | 119 MB (+32ms) | 419 MB (+112ms) | 819 MB (+218ms) | 1.58 GB (+431ms) |
| DeepSeek-V3 | MLA | 137 MB (+37ms) | 549 MB (+146ms) | 1.07 GB (+292ms) | 2.14 GB (+584ms) |
| DeepSeek-R1 | MLA | 137 MB (+37ms) | 549 MB (+146ms) | 1.07 GB (+292ms) | 2.14 GB (+584ms) |
| Kimi-K2.6 | MLA | 137 MB (+37ms) | 549 MB (+146ms) | 1.07 GB (+292ms) | 2.14 GB (+584ms) |
| Gemma-4-31B | Hybrid-SWA | 560 MB (+149ms) | 1.02 GB (+279ms) | 1.64 GB (+448ms) | 2.89 GB (+790ms) |
| GLM-5.1 | MLA | 216 MB (+58ms) | 863 MB (+230ms) | 1.69 GB (+461ms) | 3.37 GB (+920ms) |
| Llama-3.1-8B-Instruct | Dense MHA | 256 MB (+68ms) | 1.00 GB (+273ms) | 2.00 GB (+546ms) | 4.00 GB (+1.09s) |
| Qwen3-235B-A22B-2507 | Dense MHA | 376 MB (+100ms) | 1.47 GB (+401ms) | 2.94 GB (+803ms) | 5.88 GB (+1.61s) |
| MiniMax-M2.7 | Dense MHA | 496 MB (+132ms) | 1.94 GB (+530ms) | 3.88 GB (+1.06s) | 7.75 GB (+2.12s) |
| Qwen2.5-72B / Llama-3.1-70B | Dense MHA | 640 MB (+171ms) | 2.50 GB (+683ms) | 5.00 GB (+1.37s) | 10.00 GB (+2.73s) |
| GLM-4.7 | Dense MHA | 736 MB (+196ms) | 2.88 GB (+786ms) | 5.75 GB (+1.57s) | 11.50 GB (+3.14s) |

**Key takeaway**: Hybrid-linear and hybrid-sparse models have 5–20× smaller KV caches than dense MHA models at the same ISL, making them significantly more viable for cross-cluster PrfaaS even over slower inter-datacenter links.

To calibrate to your link: run `iperf3 -c <prefill_node_ip> -t 10 -P 4` to measure actual bandwidth, then multiply transfer times by `30 / your_bandwidth_gbps`.

Plus ~80ms overhead (2 × RTT) per request regardless of ISL.

The PrfaaS-PD paper (Qin et al., Moonshot AI + Tsinghua, [arXiv:2604.15039](https://arxiv.org/abs/2604.15039)) first quantified this: hybrid-attention models like Kimi Linear-1T at 128K ISL require only 4.88 Gbps, making cross-datacenter deployment on commodity 100 Gbps Ethernet practical.

## Experiments

This guide covers six experiments, each targeting a different question:

| Experiment | Question | Status |
|---|---|---|
| A | Does PrfaaS work with mismatched GPU types? | **Done** — TTFT sweep, A10→H100 NVL |
| B | How much does network distance cost? | **Done** — TTFT vs RTT, same-fabric vs 41.5ms WAN |
| C | What is the throughput and tail-latency overhead of disaggregation? | **Done** — N=100 c=8 bench, NixlConnector, 2×A100 same-node |
| D | Can conditional disagg (KVBM) run end-to-end on short prompts? | **Done** — historical bringup, 4.408 req/s at ISL=12 tokens (2×H100 same-node) |
| E | What is the throughput on a realistic lognormal request distribution? | **Done** — lognormal(μ=7, σ=1.5) ISL, N=200 c=8, 2×H100 same-node |
| F | What happens under realistic cross-cluster KVBM load? | **Done** — lognormal ISL, N=200 c=8, H100 prefill + H100 decode over WAN |

### Experiment A: Hardware specialization (heterogeneous)

**Prefill cluster: A10 (24 GB VRAM, compute-dense)**
**Decode cluster: H100 NVL (94 GB VRAM, memory-bandwidth)**
**Inter-cluster RTT: ~2ms (same-campus fabric)**

Demonstrates that PrfaaS works with mismatched GPU types. The A10 prefill worker sends KV to the H100 decode worker across a genuine inter-cluster link. Model: `deepseek-ai/DeepSeek-R1-Distill-Llama-8B`.

**Measured results** (warm NIXL connection, `max_tokens=1`, ~2ms inter-cluster RTT):

| ISL | TTFT |
|-----|------|
| ~4K tokens | **0.144s** |
| ~8K tokens | **0.161s** |
| ~16K tokens | **0.281s** |

The A10 (24 GB VRAM) can serve up to ~16K context for this model (weights ~16 GB + 2 GB KV = 18 GB).

### Experiment B: Network overhead isolation

**Same-fabric baseline** (Experiment A, 2ms RTT): measured in Experiment A above
**Cross-datacenter test**: prefill on A10 cluster, decode on H100 NVL cluster, **41.5ms RTT**

Isolates the pure network cost by comparing TTFT across different network distances with the same prefill hardware (A10) and decode hardware (H100 NVL).

**Measured results** (cross-datacenter, 41.5ms RTT, UCX TCP, warm NIXL connection):

| ISL | Same-fabric TTFT | Cross-datacenter TTFT | Overhead | % slower |
|-----|------------------|-----------------------|----------|---------|
| ~4K tokens | 0.144s | **0.139s** | ~0ms | 0% |
| ~8K tokens | 0.161s | **0.291s** | +0.130s | +81% |
| ~16K tokens | 0.281s | **0.720s** | +0.439s | +156% |
| ~32K tokens | ~0.56s† | **1.647s** | +1.087s | +194% |

† Same-fabric 32K extrapolated as 2× 16K (not directly measured). Requires `enforce_handshake_compat: false` on both workers when using mixed GPU architectures — see Troubleshooting.

The **overhead scales linearly with KV size** (8K→16K doubles the KV, overhead increases from 0.13s to 0.44s), confirming the bottleneck is network transfer, not per-request protocol overhead. The implied effective bandwidth between these clusters is ~30–40 Gbps — higher than the theoretical 10 Gbps column in the table above, which would predict +0.41s/+0.82s/+1.64s. Your results will vary with your inter-cluster link speed.

Note: a cold NIXL connection (first request after worker startup) adds ~0.79s of connection establishment overhead regardless of ISL. The numbers above are measured after a warmup request. See the benchmark script for details.

This experiment requires two clusters with a genuine inter-datacenter link. Use the KV size table above to predict expected transfer times at your measured bandwidth (`iperf3 -c <prefill_ip> -t 10 -P 4`) and compare against measured TTFT delta.

### Experiment E: Realistic throughput (lognormal ISL, same-node H100+H100)

**Hardware: 2×H100 PCIe (81 GB VRAM each), same-node**
**NIXL transport: POSIX shared memory (SHM) — no UCX TCP**
**Image:** Dynamo vLLM runtime image built from the tested source revision

Experiments A/B measured TTFT at fixed ISLs with `max_tokens=1`, which isolates the prefill+transfer path but doesn't capture realistic serving load. This experiment runs a sustained throughput benchmark with a lognormal ISL distribution matching real-world request patterns.

**Why same-node instead of cross-cluster**: A cross-cluster attempt (A10 prefill → H100 decode) was blocked by a UCX TCP bug in Docker containers — see `nixlUcxSharedThread` in Troubleshooting. Same-node NIXL uses POSIX SHM, bypassing UCX TCP entirely and giving clean, reproducible results. The cross-cluster TTFT data is in Experiments A/B.

**Distribution**: lognormal(μ=7, σ=1.5), clipped [256, 8192] tokens — median ~1100 tokens, 95th percentile ~3900 tokens. This matches the SOLBench / Chatbot Arena shape where most requests are short but a long tail drives KV transfer costs.

**Setup**:
1. GPU 0: prefill worker (`dynamo.vllm --disaggregation-mode prefill`, `NixlConnector`)
2. GPU 1: decode worker + frontend (`dynamo.vllm --disaggregation-mode decode` + `dynamo.frontend`)
3. etcd + NATS on same node
4. No cross-cluster config needed — same-node NIXL auto-selects SHM transport

**Benchmark parameters**:
- N=200 requests, c=8 concurrency
- ISL: sampled from lognormal(μ=7, σ=1.5), clipped [256, 8192]
- OSL: 256 tokens fixed
- `enable_thinking: false`, `ignore_eos: true`
- 1 warmup request before timing

**Measured results** (DeepSeek-R1-Distill-Llama-8B, BF16, max-model-len 8192, benchmark duration 130.96s):

| Metric | Value |
|--------|-------|
| Request throughput | **1.53 req/s** |
| Output token throughput | **390.92 tokens/s** |
| TTFT P50 | **2,440ms** |
| TTFT P99 | **5,071ms** |
| Request latency P50 | **5,235ms** |
| Request latency P90 | **7,612ms** |
| Request latency P99 | **7,867ms** |
| Inter-token latency | **10.95ms** (std=0.02ms — very tight) |
| Success rate | **200/200** |

**Relation to Experiments A/B/C**: Exp C measured same-node throughput at fixed ISL=2048 (2.361 req/s, N=100). Exp E extends this with a lognormal ISL distribution and 2× more requests for tighter confidence intervals.

To reproduce, launch a same-node prefill/decode pair using the same topology as Experiment C, then run the AIPerf workload with the parameters above:

```bash
# 1. Allocate a 2-GPU node and start prefill + decode + frontend.
# Use the same-node launch pattern from Experiment C.

# 2. Wait for health on :8000, then run AIPerf with the benchmark parameters above.
aiperf profile run ...
```

### Experiment F: Cross-cluster KVBM lognormal (H100 prefill + hub ↔ H100 decode)

**Hardware:** H100 prefill worker + KVBM hub on one cluster; H100 decode worker on a second cluster (cross-datacenter link, ~34ms RTT measured in Experiment B)
**Stack:** KVBM v2 (`DynamoConnector`), `kvbm_hub`, and cross-cluster transfer (not same-node POSIX SHM)
**Image:** Dynamo vLLM image that includes the KVBM v2 `RustScheduler` fix

This is the realistic cross-datacenter serving shape: lognormal ISL under load, not the fixed-ISL TTFT sweeps in Experiments A/B.

**Distribution:** lognormal(μ=7, σ=1.5) median ~1101 tokens (AIPerf `--isl 1101` or custom JSONL via `KVBM_BENCH_INPUT_FILE`), OSL=256, N=200, c=8.

**Measured results** (2026-05-19, DeepSeek-R1-Distill-Llama-8B or Qwen3-8B class model, 393s benchmark):

| Metric | Value |
|--------|-------|
| Requests | **200/200**, error_count=0 |
| TTFT avg / p50 | **14,978ms / 14,994ms** |
| ITL avg / p50 | **1.87ms / 1.81ms** |
| Request throughput | **0.509 req/s** |
| Output token throughput | **130 tok/s** |

**Prefill log signals:** 200× `create_slot` with `has_kv_transfer=true`; 152× `prefill_finalize_observer_drained` (full G1→G2 disagg path); 48 unaccounted (possible `kv_load_failure_policy: recompute` fallback).

**What we ruled out for the 15s TTFT:**

| Hypothesis | Result |
|------------|--------|
| WAN RTT (~34ms between clusters) | Negligible vs 15s |
| G1→G2 offload watchdog (`wait_secs=10`) on H100 prefill | **0 watchdog fires** on H100 (unlike A10 runs where this dominated) |
| Decode slowness | ITL ~1.9ms — decode is fast once tokens arrive |

**Open question:** The ~15s TTFT is **~67×** same-node aggregated KVBM bench (~223ms) and **~6×** Experiment E same-node lognormal TTFT p50 (2.4s). The bottleneck is in the **cross-cluster KVBM dispatch pipeline** (hub/connector coordination or prefill queueing at c=8), not raw network transfer.

**Recommended decomposition runs:**

KVBM v2 uses `block_size=16`; the Rust scheduler needs **≥2 G1 blocks** (ISL≥24). TTFT sweeps must use **≥32 tokens** on input and output (2 blocks), not `max_tokens=1`.

1. Fixed-ISL TTFT sweep: ISL=1101, OSL=32 (2 blocks), `c=1`, N=20 — isolate per-request pipeline without queue overlap
2. Same with `c=8` — separate queueing from per-request cost
3. `disagg_multi_cluster_benchmark.py` with `--min-blocks 2` (default) for fixed-ISL TTFT sweeps
4. Compare same-node `lognormal-bench.sh` vs cross-cluster setup

## Prerequisites

### Shared etcd and NATS

Both clusters need access to a shared etcd and NATS server:

```bash
# Run on a neutral host (e.g. a CPU-only allocation), get its IP
INFRA_IP=$(hostname -I | awk '{print $1}')

docker run -d --name etcd --net=host quay.io/coreos/etcd:v3.5.12 etcd \
  --listen-client-urls=http://0.0.0.0:2379 \
  --advertise-client-urls=http://${INFRA_IP}:2379

docker run -d --name nats --net=host nats:latest -js
```

### Network connectivity

All TCP connections are initiated by the decode cluster **toward** the prefill cluster — prefill workers only listen. One-way firewall rules (decode → prefill) are sufficient.

Verify before starting:
```bash
# From a decode node, ping the prefill node
ping -c 3 <prefill_node_ip>

# Check actual bandwidth (needed to validate results against the table)
iperf3 -c <prefill_node_ip> -t 10 -P 4
```

## Quick Start

### Step 1: Start prefill (on prefill cluster)

```bash
export ETCD_ENDPOINTS=http://<infra_ip>:2379
export NATS_SERVER=nats://<infra_ip>:4222
export VLLM_NIXL_SIDE_CHANNEL_HOST=$(hostname -I | awk '{print $1}')
export MODEL=deepseek-ai/DeepSeek-R1-Distill-Llama-8B

./examples/backends/vllm/launch/disagg_multi_cluster_prefill.sh
```

### Step 2: Start decode + frontend (on decode cluster)

```bash
export ETCD_ENDPOINTS=http://<infra_ip>:2379
export NATS_SERVER=nats://<infra_ip>:4222
export MODEL=deepseek-ai/DeepSeek-R1-Distill-Llama-8B
export DECODE_GPUS=0,1  # multiple decode workers

./examples/backends/vllm/launch/disagg_multi_cluster_decode.sh
```

### Step 3: Test

```bash
curl http://<decode_node_ip>:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-ai/DeepSeek-R1-Distill-Llama-8B",
       "messages":[{"role":"user","content":"Explain quantum entanglement."}],
       "max_tokens":100}'
```

## Critical: UCX transport configuration

**`UCX_TLS=tcp` is required for cross-cluster NIXL KV transfer.** By default, UCX attempts RDMA (InfiniBand/RoCE), which fails across WAN boundaries and causes `EngineDeadError` on the first request. The launch scripts set this automatically, but verify when deploying manually:

```bash
export UCX_TLS=tcp
export UCX_SOCKADDR_TLS_PRIORITY=tcp
export NIXL_UCX_TLS=tcp
```

Set on **both** prefill and decode workers.

## Container deployment on NIS/LDAP clusters

On clusters where the user is managed by NIS or LDAP (not in local `/etc/passwd`):

```bash
# Create a minimal passwd with your user entry
cat /etc/passwd > /tmp/container-passwd
echo "$(whoami):x:$(id -u):$(id -g):$(whoami):/tmp:/bin/bash" >> /tmp/container-passwd
# Pass: -v /tmp/container-passwd:/etc/passwd:ro
```

If `nsswitch.conf` includes NIS but the NIS client library is absent in the container:
```bash
printf 'passwd: files\ngroup: files\n' > /tmp/nsswitch.conf
# Pass: -v /tmp/nsswitch.conf:/etc/nsswitch.conf:ro
```

For pre-cached models, set `HF_HUB_OFFLINE=1 TRANSFORMERS_OFFLINE=1` to skip download attempts.

## Configuration Reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `ETCD_ENDPOINTS` | Yes | — | Shared etcd URL |
| `NATS_SERVER` | Yes | — | Shared NATS URL |
| `VLLM_NIXL_SIDE_CHANNEL_HOST` | Yes (prefill) | — | Prefill node IP reachable from decode cluster |
| `VLLM_NIXL_SIDE_CHANNEL_PORT` | No | `20097` | NIXL side channel port |
| `UCX_TLS` | Yes (cross-datacenter) | `tcp` | Force TCP transport for cross-cluster NIXL |
| `HF_HUB_OFFLINE` | Recommended | — | Use cached model without API calls |
| `MODEL` | No | `deepseek-ai/DeepSeek-R1-Distill-Llama-8B` | HuggingFace model ID |
| `DECODE_GPUS` | No | `0` | Comma-separated GPU indices for decode workers |

## Troubleshooting

### `No available memory for the cache blocks` on A10 (24 GB) with vLLM v0.19+

vLLM v0.19 enables CUDA graph memory profiling by default, reserving ~0.53 GB for CUDA graphs during KV cache allocation. On an A10 (24 GB) running DeepSeek-R1-Distill-Llama-8B (weights ~16 GB), `--gpu-memory-utilization 0.7` leaves only ~0.8 GB — not enough for both CUDA graphs and KV cache blocks.

**Fix**: increase to `--gpu-memory-utilization 0.85`, giving ~4 GB for KV cache after accounting for weights and CUDA graphs. Alternatively, reduce `--max-model-len` to lower graph memory requirements.

```bash
python3 -m dynamo.vllm \
  --model deepseek-ai/DeepSeek-R1-Distill-Llama-8B \
  --gpu-memory-utilization 0.85 \   # was 0.7 — A10 needs 0.85 with v0.19 CUDA graph profiling
  --max-model-len 8192 \
  ...
```

### Segfault in `nixlUcxSharedThread` on first cross-cluster request

A race condition in UCX's TCP active-message handler (`uct_tcp_ep_am_bcopy` → `ucp_get_req_handler`) can crash the NIXL UCX shared thread on the prefill side during the first KV GET. Typical symptom:

```
!!!!!!! Segfault encountered !!!!!!!
  File "<unknown>", line 0, in uct_tcp_ep_am_bcopy
  File "<unknown>", line 0, in ucp_get_req_handler
  ...
  File "<unknown>", line 0, in nixlUcxSharedThread::run()
```

The prefill Python process survives but the UCX worker thread is dead, causing all subsequent KV transfers to hang. **Fix**: restart both containers. The race is a cold-connection initialization issue and does not recur after the NIXL connection is established.

If the segfault recurs on every restart, check whether the KV buffer address alignment matches UCX's TCP transport requirements (set `UCX_TCP_PUT_ENABLE=n` to disable TCP PUT if the issue persists).

### `EngineDeadError` on first request
UCX defaulted to RDMA. Set `UCX_TLS=tcp UCX_SOCKADDR_TLS_PRIORITY=tcp NIXL_UCX_TLS=tcp` on **both** prefill and decode workers.

### `CUDA error: unknown error` inside container / `Unable to determine device handle`
The compute node has a GPU hardware fault at the NVML level. `nvidia-smi` on the bare host may still return clean output — this is a known false negative. Release the allocation and request a new node.

### `Connection refused` on NATS at startup
The shared NATS/etcd node is down or unreachable. Verify the infra containers are running: `docker ps | grep -E "nats|etcd"` on the infra host.

### `getpwuid` errors / `permission denied` inside container (NIS/LDAP clusters)
The container cannot resolve your UID because NIS client libraries are absent in the image. Create a minimal `/etc/passwd` entry and override `nsswitch.conf`:
```bash
cat /etc/passwd > /tmp/container-passwd
echo "$(whoami):x:$(id -u):$(id -g):$(whoami):/tmp:/bin/bash" >> /tmp/container-passwd
printf 'passwd: files\ngroup: files\n' > /tmp/min-nsswitch.conf
# Then mount both into the container:
# -v /tmp/container-passwd:/etc/passwd:ro -v /tmp/min-nsswitch.conf:/etc/nsswitch.conf:ro
```

### NIXL compatibility hash mismatch (heterogeneous hardware)

When prefill and decode run on different GPU architectures (e.g. A10 on SM80 vs H100 on SM90), the attention backend can differ, causing NIXL to reject the handshake:

```
NIXL compatibility hash mismatch. Local: <hash>, Remote: <hash>.
Prefill and decode instances have incompatible configurations.
```

Disable the check on **both** workers:

```bash
--kv-transfer-config '{"kv_connector":"NixlConnector","kv_role":"kv_both",
  "kv_connector_extra_config":{"enforce_handshake_compat":false}}'
```

This is safe when you have verified both workers use the same model, dtype, and block size. Only the attention kernel implementation differs due to hardware architecture.

### `NIXL_ERR_REMOTE_DISCONNECT` on same-node disagg
`UCX_TLS=tcp` breaks CUDA IPC for same-node KV transfer. Only set UCX TCP overrides for cross-cluster deployments; omit them for single-node disaggregation.

### `Hybrid KV cache manager is disabled but failed to convert the KV cache specs to one unified type`

Affects hybrid-attention models (NemotronH, Mamba-Hybrid, SWA variants). These models mix full-attention and SWA/Mamba layers with incompatible KV formats. The standard vLLM KV cache manager requires a single unified type across all layers and fails at startup.

**Workaround**: use the KVBM-based disagg path (PR [#9393](https://github.com/ai-dynamo/dynamo/pull/9393)), which handles per-layer KV format negotiation. For dense-attention models (Llama, Qwen-dense, DeepSeek-R1-Distill) this is not an issue.

### FlashInfer cubin `Permission denied` when running as NIS/LDAP user

On clusters with NIS-managed users, FlashInfer attempts to write compiled CUDA kernels to its cache directory inside the container:

```
PermissionError: [Errno 13] Permission denied: '/opt/dynamo/venv/lib/.../flashinfer_cubin/cubins/flashinfer'
```

**Fix**: redirect the cache to a writable location:
```bash
-e FLASHINFER_CACHE_DIR=/tmp/flashinfer_cache
```

### Decode worker crashes after each request with `Counters can only be incremented by non-negative amounts`

The vLLM disagg metrics path reports `cached_tokens` as a negative value after KV transfer from prefill, crashing the Prometheus counter in `vllm/v1/metrics/loggers.py`:

```
ValueError: Counters can only be incremented by non-negative amounts.
counter_prompt_tokens_cached
```

**Workaround**: restart the decode worker between ISL measurement points. The request itself completes successfully (the crash happens in post-request metrics recording). Send a warmup request after each restart to re-establish the NIXL connection before timed measurements.

**Upstream fix**: `max(0, pts.cached_tokens)` in `loggers.py` line ~1124, or fix the NIXL disagg connector to never emit negative token deltas. Tracked as a known vLLM v0.19.1 disagg metrics bug.

### KVBM connector fails with `No UCX plugin found` or `No POSIX plugin found`

When using the KVBM conditional disagg connector (`kvbm.v2.vllm.schedulers.connector`), workers fail at KV cache initialization with:

```
Exception: No UCX plugin found
# or
Exception: No POSIX plugin found
```

**Root cause**: NIXL's plugin discovery (`nixl_agent.cpp`) looks for backend plugins (UCX, POSIX, CUDA) as shared libraries installed at the system level. On some managed SLURM clusters, those plugins are available on the host but are not injected into Docker containers. Pyxis or `srun`-launched containers may have access to the host-level plugins when plain Docker does not.

**Fix**: if Docker cannot see the NIXL plugins, use the cluster-supported container runtime, such as Pyxis (`srun --container-image=...`):

```bash
srun --jobid=$JOBID --overlap --container-name=my-session \
  bash -c "source env.sh && ./examples/backends/vllm/launch/disagg_multi_cluster_prefill.sh"
```

This is only relevant when using KVBM disagg (PR #9393). Standard vLLM disagg (`NixlConnector`) handles transport differently and works in Docker.

### Decode worker fails with `LlamaForCausalLM failed to be inspected`
Two workers loading the model from NFS simultaneously can race on config file locks. Add a 10-second stagger between decode worker starts.

## Experiment C: Same-Node Disagg Overhead (NixlConnector, 2× A100)

**Setup**: NixlConnector disaggregated path on 2×A100-PCIE-80GB, same physical node. GPU 0 = prefill worker, GPU 1 = decode worker + frontend. UCX transport auto-detected (no TCP override — see Troubleshooting: same-node UCX TCP override causes segfault via CUDA IPC conflict). N=100, concurrency=8, ISL≈2016 tokens, OSL=256.

> **Limitation**: Both workers run on the same physical node with UCX loopback. This isolates the disaggregation coordination overhead (prefill router dispatch + NIXL KV transfer) from genuine cross-cluster network cost. For true cross-cluster overhead, see Experiment B (TTFT-only) and Experiment F (KVBM under load).

**Headline result**: Disaggregation adds **+66ms to median latency** and **+28% to tail latency** (P95) versus a single-worker baseline on the same hardware.

| Metric | Baseline (1×A100) | PrfaaS disagg (2×A100) | Δ | % change |
|--------|:-----------------:|:----------------------:|:-:|:--------:|
| Throughput | 2.455 req/s | 2.361 req/s | −0.094 | **−3.8%** |
| Mean latency | 3.136s | 3.270s | +0.134s | **+4.3%** |
| P50 latency | 3.080s | 3.146s | +0.066s | **+2.1%** |
| P95 latency | 3.630s | 4.655s | +1.025s | **+28.2%** |
| P99 latency | 3.631s | 4.656s | +1.025s | **+28.3%** |
| Success rate | 100/100 | 100/100 | — | — |

The P50 +2% reflects the constant per-request overhead: prefill router dispatch (~10ms) plus NIXL KV transfer of ~126 MB at loopback bandwidth (~50 GB/s → ~3ms transfer). The P95/P99 +28% jump reflects occasional KV transfer stalls at the UCX loopback layer; cross-node RDMA or dedicated NICs would reduce this significantly.

For reference: KV size at ISL=2016 tokens for Qwen3-8B (32 layers, 8 GQA heads, dim=128, BF16) = **~126 MB**. At UCX loopback bandwidth this completes in <100ms, consistent with the P50 delta of ~66ms.

**Hardware** | Qwen/Qwen3-8B BF16 | vLLM 0.19.0 + dynamo.vllm | 2×A100 same-node

**Reproducing this benchmark:**
```bash
# Disagg launch:
./examples/backends/vllm/launch/disagg_multi_cluster_prefill.sh
./examples/backends/vllm/launch/disagg_multi_cluster_decode.sh

# Or run bench manually against a running endpoint:
python3 examples/backends/vllm/launch/disagg_multi_cluster_benchmark.py

# Baseline single-worker:
python3 benchmarks/benchmark_serving.py ...
```

## Experiment D: KVBM Conditional Disagg Bringup (Historical)

**Goal**: KVBM v2 conditional disagg (`DynamoConnector`) on a 2×GPU same-node setup, Qwen3-8B BF16, host CPU KV cache (POSIX shared memory).

**Status:** this earlier bringup validated the short-prompt KVBM path at ISL=12 tokens. For the current ≥2-block cross-cluster KVBM path, use a build that includes the RustScheduler fix and see Experiment F.

### Benchmark results (N=100, c=8, ISL=12 tokens, OSL=256)

| Metric | Value |
|--------|-------|
| Hardware | 2×H100-80GB same-node |
| Model | Qwen/Qwen3-8B BF16 |
| Connector | DynamoConnector (KVBM v2, vLLM scheduler fallback) |
| Working ISL | **12 tokens** (≤1 KV block — see limitation below) |
| N requests | 100 |
| Concurrency | 8 |
| **Throughput** | **4.408 req/s** |
| **Mean latency** | **1.747s** |
| **P50 latency** | **1.772s** |
| **P95 latency** | **1.782s** |
| **P99 latency** | **1.789s** |
| Success rate | **100/100** |

Tight P50/P95/P99 clustering (~10ms spread) reflects decode-dominated latency: at ISL=12 tokens the prefill is instantaneous; all 256 decode tokens run on H100 with consistent throughput. Full results in `bench_d_results.json`.

### What was validated (2×H100 same-node)

- `_core.abi3.so` rebuilt with `cargo rustc --lib --crate-type cdylib --features v1,v2` ✓
- `DYN_KVBM_CPU_CACHE_GB=40` env var required — JSON `cache.host` alone not sufficient (Figment profile parsing issue) ✓
- Hub starts on ports 1337/8337/1338 with CD prefill dispatcher ✓
- `NIXL_PLUGIN_DIR` must be exported inside `bash -c` to override the container's baked-in ENV (`/opt/nvidia/nvda_nixl/lib64/plugins` has no UCX) ✓
- Workers run in shared IPC container via `--container-name=kvbm-exp-d` — required for NIXL agent discovery ✓
- KVBM v2 workers initialize: `NIXL registered layouts=[G1, G2]`, `All workers initialized successfully` ✓
- **Short prompts (≤~9 tokens) complete successfully** — handled locally without disaggregation ✓

### The conditional disagg threshold

KVBM "conditional" disagg decides per-request whether to route to a separate prefill worker. Short prompts are processed locally (hub not involved). Long prompts are dispatched via the hub's CD dispatcher to the prefill worker. Verified by inspection: a 9-token "hi" request does NOT appear in hub logs; ISL~2016 tokens DOES trigger hub dispatch.

### Historical runtime blocker for long ISL

Earlier KVBM v2 builds could dispatch long prompts to the hub and prefill worker, but the decode-side transfer kick was missing in the fallback scheduler path:

1. Decode worker sends request to hub
2. Hub dispatches `PrefillRequest` to prefill (:8001) — **confirmed working** in hub log
3. Prefill processes prompt and finishes — **confirmed working** in prefill log
4. Prefill waits for decode to send "onboard kick" to begin KV transfer — **stuck here**
5. Decode never sends the kick because that fallback path does not manage the handshake
6. Hub retries the same request every 10 seconds indefinitely

Use the RustScheduler-enabled KVBM build for long-prompt or cross-cluster validation. The results in Experiment F were collected with that path.

### Hard-won bringup notes (preserved for when scheduler is ported)

- `DYN_KVBM_CPU_CACHE_GB=40` env var is required — JSON `cache.host.cache_size_gb` does not properly reach the Rust config via Figment profile selection
- `cache.device` is NOT a valid KVBM tier — only `host` (G2/CPU) and `disk` (G3)
- `srun -e KEY=VAL` means `--error` (stderr redirect), NOT env var — use `export` inside `bash -c "..."`
- Container images may set `NIXL_PLUGIN_DIR` to a path without UCX/POSIX plugins — override it to the plugin directory available in your runtime inside `bash -c`
- All KVBM components must share `--container-name` so NIXL agents can find each other via POSIX shared memory
- Keep the launch setup in repo-local scripts so cluster names, private paths, and credentials do not leak into this guide

## See Also

- [Disaggregated Serving design doc](../../../docs/design-docs/disagg-serving.md)
- [Single-cluster disagg example](disagg.sh)
- [ISL benchmark script](disagg_multi_cluster_benchmark.py) — reproduce the ISL sweep from this guide
- [PrfaaS-PD paper](https://arxiv.org/abs/2604.15039) — Qin et al. (Moonshot AI + Tsinghua, 2026)
