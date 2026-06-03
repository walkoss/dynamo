# Qwen3-32B 1P1D Cross-CSP Benchmark Family

A family of disaggregated prefill+decode (1P1D) recipes for **Qwen3-32B (BF16)**, one per cloud/RDMA fabric. Same workload, same topology, same NIXL KV-transfer protocol — only the provider-specific bits change. Designed so the per-CSP delta in KV bandwidth, TTFT, and goodput is directly comparable.

## What's in this folder

| Variant | Provider | Testing Hardware | Transport |
|---|---|---|---|
| [`disagg-1p1d-aws-efa/`](disagg-1p1d-aws-efa/) | AWS EKS (p5.48xlarge) | H100 | AWS EFA + libfabric |
| [`disagg-1p1d-gke-roce/`](disagg-1p1d-gke-roce/) | GCP GKE (A4X) | GB200 | RoCEv2 (CX-7) + UCX |
| [`disagg-1p1d-aks-ib/`](disagg-1p1d-aks-ib/) | Azure AKS (ND A100-class) | A100-SXM4-80GB | HDR InfiniBand (CX-6) + UCX |
| [`disagg-1p1d-nebius-ib/`](disagg-1p1d-nebius-ib/) | Nebius MK8S | H200 | NDR InfiniBand + UCX |
| [`disagg-1p1d-nscale-ib/`](disagg-1p1d-nscale-ib/) | Nscale | B200 | NDR InfiniBand + UCX |

### Layout (kustomize: DRY base + per-CSP overlays)

Everything that is identical across providers lives once in [`_base/`](_base/); each
variant is a thin [kustomize](https://kubectl.docs.kubernetes.io/references/kustomize/)
overlay that patches in only its fabric-specific delta. To change the topology, the
vLLM args, or the benchmark workload, edit `_base/` once.

```
_base/                       # fabric-agnostic DynamoGraphDeployment + benchmark Pod (single source of truth)
  deploy.yaml
  perf.yaml
  kustomization.yaml
disagg-1p1d-<csp>/           # one overlay per provider — the CSP delta, nothing more
  kustomization.yaml         # references ../_base + the patches below
  patch-deploy.yaml          # strategic-merge delta (image, RDMA resource, scheduling, mounts)
  patch-deploy.json.yaml     # JSON6902 delta (name, kv-transfer backend, per-worker transport env)
  patch-perf.json.yaml       # benchmark name / FRONTEND / VARIANT_SLUG (+ client resources)
  README.md                  # provider-specific overrides + measured numbers
```

Render any variant to inspect the effective manifest: `kubectl kustomize disagg-1p1d-<csp>/`.

## Deploy

Deploy from the model-level `model-cache/` once, then `kubectl apply -k` the overlay
of your choice (kustomize stitches `_base/` + the CSP delta together):

```bash
export NAMESPACE=your-namespace
# Prereqs: hf-token-secret + the shared-model-cache/perf-cache PVCs (see ../../README.md).
# NOTE: model-cache/cache.yaml creates a PVC named `model-cache`; these recipes expect
# `shared-model-cache` — create/clone it to match, or adjust the PVC name in _base/.
kubectl apply -f ../../model-cache/ -n "$NAMESPACE"

kubectl apply -k disagg-1p1d-aws-efa/ -n "$NAMESPACE"     # or any other variant
kubectl apply -k disagg-1p1d-aws-efa/ -n "$NAMESPACE" --dry-run=server  # preview first
```

## Fixed topology (all variants)

| Role | Replicas | TP | Constraint |
|---|---|---|---|
| Frontend | 1 | — | any CPU node |
| VllmPrefillWorker | 1 | **4** | one GPU node |
| VllmDecodeWorker | 1 | **4** | **different** GPU node — pod anti-affinity on `kubernetes.io/hostname` |

The pod anti-affinity is load-bearing: it forces KV transfer across the provider's RDMA fabric, not the intra-node NVLink/CUDA-IPC shortcut.

## What differs per variant

Each variant overrides **only** what its fabric requires:

| Dimension | AWS (EFA) | GKE (RoCE) | Nebius (IB) | Nscale (IB) | AKS (IB) |
|---|---|---|---|---|---|
| **HW** | H100 | GB200 (A4X) | H200 | B200 | A100 |
| **NIXL backend** | **LIBFABRIC** (`DYN_KVBM_NIXL_BACKEND_LIBFABRIC=true`, `_UCX=false`) | UCX | UCX | UCX | UCX |
| **RDMA resource** | `vpc.amazonaws.com/efa: "32"` | `networking.gke.io.networks/rdma-0..3` (+`.IP`) + `interfaces` annotation + per-net tolerations | `rdma/ib: "1"` | `rdma/ib: "1"` | `rdma/shared_ib: "1"` ⚠️ |
| **`UCX_NET_DEVICES`** | — (n/a) | `mlx5_0:1..3` (4) | `mlx5_0:1..7` (8) | `mlx5_0..5,10,11` (8, subset) ⚠️ | `mlx5_0:1..3` (4) |
| **Device/lib mounts** | EFA libs in image (`/opt/amazon/efa/lib*`) | host `gib`+`nvidia` hostPaths → `/usr/local/gib`,`/nvidia` | `/dev/infiniband` + `/dev/shm` | `/dev/infiniband` + `/dev/shm` | `/dev/infiniband` |
| **EFA-only env** | `FI_PROVIDER=efa`, `FI_EFA_USE_DEVICE_RDMA=1`, `FI_EFA_ENABLE_SHM_TRANSFER=0` | — | — | — | — |

**⚠️ Two cells are easy to get wrong if you template from another variant:**

1. **AKS uses `rdma/shared_ib`, not `rdma/ib`.** AKS schedules RDMA through the NVIDIA Network Operator's *shared* IB device plugin, so the resource key differs from Nebius/Nscale (`rdma/ib`). Same `"1"` slot convention, different key — copying the Nebius/Nscale value leaves the pod without its RDMA resource.
2. **Nscale's `UCX_NET_DEVICES` is a non-contiguous subset (`mlx5_0..5,10,11`).** Its nodes expose a mixed fabric; the listed NICs are the compute fabric and deliberately exclude the side-fabric NICs (`mlx5_6..9`, smaller MTU / different subnet). Listing the "obvious" `mlx5_0..7` (like Nebius) puts transfers on the side fabric and breaks the cross-rank handshake. This value must be derived from `ibv_devinfo` on the actual nodes — it cannot be copied from another CSP.

Everything else (vLLM args, anti-affinity, `IPC_LOCK`, NIXL telemetry, Prometheus annotations, etcd/NATS discovery) is identical and lives once in [`_base/`](_base/) — the overlays carry only the rows of the tables above.

## Workload

The shared [`_base/perf.yaml`](_base/perf.yaml) runs the same aiperf profile across every variant against the [Mooncake conversation trace](https://raw.githubusercontent.com/kvcache-ai/Mooncake/main/FAST25-release/traces/conversation_trace.jsonl): 12,031 requests, ISL avg ~12k tokens, OSL avg ~340 tokens, streaming, goodput SLA `TTFT≤2000ms ∧ ITL≤25ms`.

## Measured KV bandwidth (TP=4, Mooncake trace, formula: `rank0_bytes × TP / wall_time`)

| Variant | KV BW | Per-rank | Mean ITL | Mean TTFT | Completion | Notes |
|---|---:|---:|---:|---:|---:|---|
| GKE A4X (GB200) | **10.71 GB/s** | 2.68 GB/s | 11.38 ms | 3.73 s | 100% | RoCE on CX-7; best aggregate + TTFT |
| Nscale (B200) | **10.71 GB/s** | 2.68 GB/s | ~16 ms | 8.35 s | 100% | NDR-IB on raw HCAs (compute fabric only)|
| Nebius (H200) | 5.96 GB/s | 1.49 GB/s | **9.14 ms** | 1510 s (queue) | 100% | fastest ITL of family |
| AWS p5 (H100) | 5.64 GB/s | 1.41 GB/s | 13.62 ms | 1703 s (queue) | 100% | LIBFABRIC over EFA |
| AKS (A100) | ~1.7 GB/s | ~0.42 GB/s | ~22 ms | 902 s (queue) | did not drain (queue-bound) | A100/CX-6; queue-bound by GPU class |

Per-rank ordering follows GPU generation: GB200 (2.68) > H200 (1.49) > H100 (1.41) > A100 (0.42). Aggregate is per-rank × TP, so it tracks the same order except where wall-time differs across clusters. KV traffic was NOT fabric-bound on any cluster — utilization was <1% of NIC headroom; the bottleneck is GPU/HBM/PCIe.
