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
| DeepSeek-V4-Flash | Hybrid-sparse | 30 MB (+8ms) | 76 MB (+20ms) | 137 MB (+37ms) | 259 MB (+69ms) |
| NVIDIA Nemotron-3-Super-120B | Hybrid-linear | 57 MB (+15ms) | 105 MB (+28ms) | 169 MB (+45ms) | 297 MB (+79ms) |
| DeepSeek-V4-Pro | Hybrid-sparse | 44 MB (+12ms) | 110 MB (+29ms) | 198 MB (+53ms) | 373 MB (+99ms) |
| Qwen3.5-122B-A10B | Hybrid-linear | 195 MB (+52ms) | 339 MB (+90ms) | 531 MB (+142ms) | 915 MB (+244ms) |
| GPT-OSS-120B | Hybrid-SWA | 74 MB (+20ms) | 290 MB (+77ms) | 578 MB (+154ms) | 1.1 GB (+301ms) |
| DeepSeek-V3 / R1 | MLA | 137 MB (+37ms) | 549 MB (+146ms) | 1.07 GB (+292ms) | 2.14 GB (+584ms) |
| Llama-3.1-8B-Instruct | Dense MHA | 256 MB (+68ms) | 1.0 GB (+273ms) | 2.0 GB (+546ms) | 4.0 GB (+1.09s) |
| Qwen3-235B-A22B | Dense MHA | 376 MB (+100ms) | 1.47 GB (+392ms) | 2.94 GB (+784ms) | 5.88 GB (+1.57s) |
| Llama-3.1-70B / Qwen2.5-72B | Dense MHA | 640 MB (+171ms) | 2.5 GB (+683ms) | 5.0 GB (+1.37s) | 10 GB (+2.73s) |
| GLM-4.7 | Dense MHA | 736 MB (+196ms) | 2.88 GB (+768ms) | 5.75 GB (+1.53s) | 11.5 GB (+3.07s) |

**Key takeaway**: Hybrid-linear and hybrid-sparse models have 5–20× smaller KV caches than dense MHA models at the same ISL, making them significantly more viable for cross-cluster PrfaaS even over slower inter-datacenter links.

To calibrate to your link: run `iperf3 -c <prefill_node_ip> -t 10 -P 4` to measure actual bandwidth, then multiply transfer times by `30 / your_bandwidth_gbps`.

Plus ~80ms overhead (2 × RTT) per request regardless of ISL.

The PrfaaS-PD paper (Qin et al., Moonshot AI + Tsinghua, [arXiv:2604.15039](https://arxiv.org/abs/2604.15039)) first quantified this: hybrid-attention models like Kimi Linear-1T at 128K ISL require only 4.88 Gbps, making cross-datacenter deployment on commodity 100 Gbps Ethernet practical.

## Two experiments

This guide covers two distinct use cases:

### Experiment A: Hardware specialization (heterogeneous)

**Prefill cluster: A10 (24 GB VRAM, compute-dense)**
**Decode cluster: H100 NVL (94 GB VRAM, memory-bandwidth)**
**Inter-cluster RTT: ~2ms (same-campus fabric)**

Demonstrates that PrfaaS works with mismatched GPU types. The A10 prefill worker sends KV to the H100 decode worker across a genuine inter-cluster link. Model: `deepseek-ai/DeepSeek-R1-Distill-Llama-8B`.

**Measured results** (fresh-prompt TTFT after NIXL warmup, `max_tokens=1`):

| ISL | Cross-cluster TTFT | Same-node baseline |
|-----|-------------------|--------------------|
| ~4K tokens | 0.144s | 3.41s |
| ~8K tokens | 0.161s | 5.04s |

Cross-cluster is faster than same-node here because the same-node baseline used in-node PCIe NIXL transfer on a PCIe-limited 2-GPU node, while the cross-cluster path uses TCP over a fast campus fabric. The A10 (24 GB VRAM) can serve up to 16K context for this model (weights ~16 GB + 2 GB KV = 18 GB).

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

### Decode worker fails with `LlamaForCausalLM failed to be inspected`
Two workers loading the model from NFS simultaneously can race on config file locks. Add a 10-second stagger between decode worker starts.

## See Also

- [Disaggregated Serving design doc](../../../docs/design-docs/disagg-serving.md)
- [Single-cluster disagg example](disagg.sh)
- [ISL benchmark script](disagg_multi_cluster_benchmark.py) — reproduce the ISL sweep from this guide
- [PrfaaS-PD paper](https://arxiv.org/abs/2604.15039) — Qin et al. (Moonshot AI + Tsinghua, 2026)
