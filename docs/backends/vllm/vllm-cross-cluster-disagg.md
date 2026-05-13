---
title: Cross-Cluster Disaggregated Serving
description: Run prefill and decode workers on separate compute clusters ("Prefill as a Service")
---

# Cross-Cluster Disaggregated Serving

Dynamo's disaggregated serving can span two independent SLURM clusters, placing prefill workers on a dedicated high-compute cluster and decode workers on a separate cluster. This pattern is sometimes called "Prefill as a Service" (PrfaaS).

## When to Use This

Cross-cluster disagg is most effective when:

- **Hardware specialization**: your prefill cluster has higher memory bandwidth (e.g., H100 HBM3) or more compute-dense GPUs than your decode cluster
- **Independent scaling**: prefill and decode queues have different traffic patterns and you want to scale them independently
- **Multi-tenant prefill**: a single prefill fleet serves multiple decode clusters

### Bandwidth Considerations

The viability of cross-cluster KV transfer depends on model architecture and context length:

| Model type | KV size at 32K ISL | Cross-DC Ethernet viable? |
|---|---|---|
| Dense attention (e.g. Llama-3-8B) | ~2.3 GB | Requires high-speed inter-cluster fabric |
| GQA 8-head (e.g. Qwen3-8B) | ~1.1 GB | Marginal at 10 Gbps for ISL > 16K |
| Hybrid attention (e.g. linear-attention variants, 3:1–7:1 ratio) | ~30–100 MB | Viable over standard 100 Gbps Ethernet |

At short ISL (< 4K tokens) or with small models, KV transfer overhead is negligible regardless of network speed.

## Architecture

```
Prefill cluster (e.g. computelab)       Decode cluster (e.g. dlcluster)
┌──────────────────────────────────┐    ┌──────────────────────────────────┐
│  Prefill worker(s)               │    │  Frontend  :8000                  │
│  - registers in shared etcd      │    │  Decode worker(s)                 │
│  - listens on NIXL side channel  │◄───│  - route via shared etcd         │
│  - VLLM_NIXL_SIDE_CHANNEL_HOST   │    │  - pull KV over NIXL TCP         │
│    = this node's routable IP     │    │  - CUDA_VISIBLE_DEVICES=0,1,...  │
└──────────────────────────────────┘    └──────────────────────────────────┘
         │                                         │
         └──────────── Shared etcd ───────────────┘
                       Shared NATS
```

**Connection directions**: All TCP connections are initiated by the decode cluster toward the prefill cluster. Prefill workers are pure listeners. This means one-way firewall rules (decode → prefill) are sufficient.

## Prerequisites

### Shared Infrastructure

You need etcd and NATS reachable from both clusters. A CPU-only allocation on either cluster works:

```bash
# Start etcd (on a neutral host with IP 10.0.1.5)
docker run -d --net=host quay.io/coreos/etcd:v3.5.12 etcd \
  --listen-client-urls http://0.0.0.0:2379 \
  --advertise-client-urls http://10.0.1.5:2379 \
  --listen-peer-urls http://0.0.0.0:2380 \
  --initial-cluster default=http://10.0.1.5:2380

# Start NATS with JetStream (same host)
docker run -d --net=host nats:latest -js
```

### Network Connectivity

Verify the decode cluster can reach the prefill cluster:

```bash
# From a decode node, confirm reachability to prefill node IP
nc -zv <prefill_node_ip> 22     # Should succeed
nc -zv <prefill_node_ip> 20097  # NIXL port (will succeed after prefill starts)
```

Find the prefill node's routable IP:

```bash
# On the prefill node
hostname -I | awk '{print $1}'
```

## Quick Start

### Step 1: Start prefill workers (on prefill cluster)

```bash
export ETCD_ENDPOINTS=http://10.0.1.5:2379
export NATS_SERVER=nats://10.0.1.5:4222
export VLLM_NIXL_SIDE_CHANNEL_HOST=$(hostname -I | awk '{print $1}')
export MODEL=Qwen/Qwen3-0.6B

./examples/backends/vllm/launch/disagg_multi_cluster_prefill.sh
```

### Step 2: Start decode workers + frontend (on decode cluster)

```bash
export ETCD_ENDPOINTS=http://10.0.1.5:2379
export NATS_SERVER=nats://10.0.1.5:4222
export MODEL=Qwen/Qwen3-0.6B
export DECODE_GPUS=0,1  # use both GPUs on this node as decode workers

./examples/backends/vllm/launch/disagg_multi_cluster_decode.sh
```

### Step 3: Send requests

```bash
curl http://<decode_node_ip>:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen3-0.6B",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 50
  }'
```

## Multi-Prefill Deployment

Scale to N prefill + M decode workers by running the prefill script on N nodes and setting `DECODE_GPUS=0,1,...,M-1` on the decode node:

```
PREFILL_NODE_1 ─────┐
PREFILL_NODE_2 ─────┤──── etcd/NATS ────┬── DECODE_NODE (GPU 0, decode)
PREFILL_NODE_N ─────┘                   └── DECODE_NODE (GPU 1, decode)
                                             DECODE_NODE (frontend :8000)
```

The Dynamo PrefillRouter load-balances across all registered prefill workers automatically.

## Configuration Reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `ETCD_ENDPOINTS` | Yes | — | Shared etcd URL (e.g. `http://10.0.1.5:2379`) |
| `NATS_SERVER` | Yes | — | Shared NATS URL (e.g. `nats://10.0.1.5:4222`) |
| `VLLM_NIXL_SIDE_CHANNEL_HOST` | Yes (prefill) | — | Prefill node IP reachable from decode cluster |
| `VLLM_NIXL_SIDE_CHANNEL_PORT` | No | `20097` | NIXL side channel port |
| `MODEL` | No | `Qwen/Qwen3-0.6B` | HuggingFace model ID |
| `DECODE_GPUS` | No | `0` | Comma-separated GPU indices for decode workers |
| `DYN_HTTP_PORT` | No | `8000` | Frontend HTTP port |

## Benchmarking with AIPerf

To measure cross-cluster TTFT overhead:

```bash
# On decode node
aiperf run \
  --target http://<decode_node>:8000 \
  --model Qwen/Qwen3-8B \
  --isl 16384 \
  --osl 128 \
  --num-requests 50
```

Compare against the same-cluster baseline from `disagg.sh` to quantify the NIXL TCP transfer overhead at your target ISL.

## See Also

- [Disaggregated Serving design doc](../../../docs/design-docs/disagg-serving.md)
- [Single-cluster disagg example](disagg.sh)
- [PrfaaS-PD paper](https://arxiv.org/abs/2604.15039) — Qin et al. (Moonshot AI + Tsinghua, 2026) — original analysis of cross-DC prefill with hybrid-attention models
