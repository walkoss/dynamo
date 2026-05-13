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

### KV cache sizes for DeepSeek-R1-Distill-Llama-8B

Architecture: 32 layers, 8 GQA KV heads, head_dim=128, bfloat16.

KV size per token = 32 layers × 2 (K+V) × 8 heads × 128 dim × 2 bytes = **131,072 bytes (128 KB)**

| ISL | KV cache size | Transfer @ 10 Gbps | Transfer @ 25 Gbps | Transfer @ 100 Gbps |
|-----|---------------|--------------------|--------------------|--------------------|
| 4K tokens | **512 MB** | 0.41s | 0.16s | 0.04s |
| 8K tokens | **1.0 GB** | 0.82s | 0.33s | 0.08s |
| 16K tokens | **2.0 GB** | 1.64s | 0.66s | 0.16s |
| 32K tokens | **4.1 GB** | 3.28s | 1.31s | 0.33s |

Plus ~70ms overhead (2 × 34ms RTT) for TCP handshake/ACK on a typical inter-DC link.

**Use these to validate measured results**: measured TTFT delta (cross-DC − same-DC) should be within ~10–20% of the table values at your measured bandwidth. Large deviations indicate UCX transport misconfiguration or unexpected bottlenecks.

### Model architecture matters

| Model type | KV reduction | Cross-DC Ethernet viable? |
|---|---|---|
| Dense attention (Llama-3, DeepSeek-R1-Distill) | 1× | Needs fast fabric at ISL > 8K |
| GQA (8 KV heads, e.g. Qwen3-8B) | ~4× | Marginal at 10 Gbps for ISL > 16K |
| Hybrid attention (Kimi Linear, 3:1–7:1 linear:full) | ~36× | Viable over standard Ethernet |

The PrfaaS-PD paper (Qin et al., Moonshot AI + Tsinghua, [arXiv:2604.15039](https://arxiv.org/abs/2604.15039)) first quantified this: hybrid-attention models like Kimi Linear-1T at 128K ISL require only 4.88 Gbps, making cross-DC deployment on commodity 100 Gbps Ethernet practical.

## Two experiments

This guide covers two distinct use cases:

### Experiment A: Hardware specialization (heterogeneous)

**Prefill cluster: computelab A10 (24 GB VRAM)**
**Decode cluster: dlcluster H100 NVL (94 GB VRAM)**
**Inter-cluster RTT: 34ms**

Demonstrates that PrfaaS works with mismatched GPU types. The A10 prefill worker sends KV to the H100 decode worker across a genuine inter-datacenter link. Results show functional correctness and provide a baseline for ISL ≤ 8K where A10 VRAM is sufficient.

### Experiment B: Network overhead isolation (homogeneous hardware)

**Same-DC baseline**: prefill and decode on the same node (in-node PCIe NIXL transfer)
**Cross-DC test**: prefill on computelab H100 HBM3, decode on dlcluster H100 NVL, 34ms RTT

Isolates the pure network cost by measuring TTFT delta = cross-DC TTFT − same-DC TTFT. Compare against the theoretical table above to validate your inter-cluster bandwidth.

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
| `UCX_TLS` | Yes (cross-DC) | `tcp` | Force TCP transport for cross-cluster NIXL |
| `HF_HUB_OFFLINE` | Recommended | — | Use cached model without API calls |
| `MODEL` | No | `Qwen/Qwen3-0.6B` | HuggingFace model ID |
| `DECODE_GPUS` | No | `0` | Comma-separated GPU indices for decode workers |

## See Also

- [Disaggregated Serving design doc](../../../docs/design-docs/disagg-serving.md)
- [Single-cluster disagg example](disagg.sh)
- [PrfaaS-PD paper](https://arxiv.org/abs/2604.15039) — Qin et al. (Moonshot AI + Tsinghua, 2026)
