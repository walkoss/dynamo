# Qwen3.5-397B-A17B-FP8 — 2-node KV-routed Dynamo benchmark

K8s recipe for benchmarking
[`Qwen/Qwen3.5-397B-A17B-FP8`](https://huggingface.co/Qwen/Qwen3.5-397B-A17B-FP8)
in a **2-node scale-out** topology behind Dynamo's KV-aware router, against
a single-node `vllm serve` baseline:

| Config | Frontend | Workers | Topology | Routing |
|--------|----------|---------|----------|---------|
| `vllm-serve` | (built-in) | 1× TP=8 | 1 node | n/a |
| `dynamo` | `dynamo.frontend` | 2× TP=8 | 2 nodes | `--router-mode kv` |

The 2-node config is the one the recipe exists for; `vllm-serve` is the
apples-to-comparison baseline.

## Topology

```text
                Frontend  (--router-mode kv --router-reset-states)
                  |
            +-----+-----+
            |           |
         Worker-A     Worker-B
         TP=8         TP=8
         node A       node B          (any 2 H100-80GB-HBM3 nodes,
                                       forced to distinct hostnames
                                       via topologySpreadConstraints)
```

The KV router consumes ZMQ-published `kv-events` from each Worker
(block-add / evict / reuse) and picks a Worker based on cached-prefix
overlap with the incoming request. For sliding-window dataset rows
tagged with `session_id=user_<N>`, the router biases toward
worker-affinity per session, so the 8 turns of one user tend to land
on the worker that already cached their prefix.

## Layout

```text
recipes/qwen3.5-397b-fp8-2node/
├── README.md
├── run-benchmark.sh            # driver, branches on --config / --hw / --step
├── run-all-benchmarks.sh       # sequential 2-config orchestrator
├── perf.yaml                   # shared aiperf bench Pod template
├── data-gen-job.yaml           # sliding-window jsonl generator
├── hw/
│   └── h100.env                # GPU-product label + vllm-serve hostname pin
├── model-cache/
│   └── model-download.yaml     # HF download → shared-model-cache PVC
└── deploy/
    ├── vllm-serve.yaml         # baseline: plain vLLM Deployment, replicas: 1, TP=8
    └── dynamo.yaml             # DGD: 1 Frontend (KV-routed) + 2 VllmWorker, TP=8 each
```

## Prerequisites

- Namespace with the `shared-model-cache` PVC pre-provisioned (RWX,
  e.g. FSx Lustre). On `aws-dev-02`'s `qiwa` namespace this is
  pre-provisioned at 24.6 TiB. If your cluster doesn't have it, see
  the "Storage" section below for a copy-pasteable PVC manifest.
- `kubectl`, `envsubst`, `jq` on the laptop running the driver.
- ≥ 2 H100-80GB-HBM3 nodes with **8 free GPUs each at apply time**
  (kai-scheduler accounts for Pending pods too — see precheck below).
- `nvcr.io/nvidia/ai-dynamo/vllm-runtime:1.1.1` reachable from the
  cluster (public, no NGC secret needed).

## Capacity precheck

The 2-node Dynamo config needs 2 nodes that **each** have 8 free
H100s simultaneously. Both pods stay Pending if one node is at
capacity. Survey first (counts Pending pods too, per `kai-scheduler`
gang semantics):

```bash
for n in $(kubectl get nodes -l nvidia.com/gpu.product=NVIDIA-H100-80GB-HBM3 -o name); do
  name=$(basename "$n")
  used=$(kubectl get pods --all-namespaces \
      -o json --field-selector=spec.nodeName=$name \
      | jq '[.items[]
              | select(.status.phase == "Running" or .status.phase == "Pending")
              | .spec.containers[].resources.limits."nvidia.com/gpu" // "0"
              | tonumber] | add // 0')
  echo "$name used=$used"
done
```

Want **at least 2 lines showing `used=0`** before applying `deploy/dynamo.yaml`.

If only one node has 8 free GPUs and the other has 4, `topologySpreadConstraints`
holds both Worker pods Pending until capacity exists. Either wait for
another tenant's job to finish, or scale down to a single-node
config (use the upstream `recipes/qwen3.5-397b-fp8/` if/when PR #9432 lands).

## Quick start

For the lazy path (both configs, sequential, ~3-4 hours including the
one-time 400 GB model download):

```bash
./run-all-benchmarks.sh -n qiwa
```

For step-by-step (first time you use it, do this — it prevents one bad
step from rolling forward):

```bash
HW=h100
NS=qiwa

# 1. PVC sanity check
./run-benchmark.sh -n $NS --hw $HW --config dynamo --step pvc

# 2. Download the 397B model into shared-model-cache (~10-15 min on FSx)
./run-benchmark.sh -n $NS --hw $HW --config dynamo --step download

# 3. Generate the sliding-window jsonl (one-time, ~5 min)
./run-benchmark.sh -n $NS --hw $HW --config dynamo --step dataset

# 4. Deploy the 2-node Dynamo config (15-20 min model load on TP=8)
./run-benchmark.sh -n $NS --hw $HW --config dynamo --step deploy

# 5. Bench (~30-60 min depending on concurrency)
./run-benchmark.sh -n $NS --hw $HW --config dynamo --step bench

# 6. Pull aiperf artifacts to laptop
./run-benchmark.sh -n $NS --hw $HW --config dynamo --step retrieve

# 7. Clean before swapping to vllm-serve baseline
./run-benchmark.sh -n $NS --hw $HW --config dynamo --step clean
```

Then repeat steps 4-7 with `--config vllm-serve` (after editing
`hw/h100.env` to set `HW_NODE_SELECTOR_VLLM_SERVE` to a free hostname).

## KV-routing validation

After `deploy` finishes, sanity-check that the router is actually
making KV-aware decisions and that traffic isn't all landing on one
worker:

```bash
# 1. Confirm 2 workers on 2 distinct nodes.
kubectl -n qiwa get pod -l \
  nvidia.com/dynamo-graph-deployment-name=qwen397-dynamo-2node,\
nvidia.com/dynamo-component-type=worker -o wide
# Expect 2 lines with different NODE columns.

# 2. Check the Frontend's router log for KV-score decisions.
FE=$(kubectl -n qiwa get pod -l \
  nvidia.com/dynamo-graph-deployment-name=qwen397-dynamo-2node,\
nvidia.com/dynamo-component-type=frontend -o name | head -1)
kubectl -n qiwa logs "$FE" --tail=200 | grep -iE 'router|kv_score|worker_id' | tail -20

# 3. Watch traffic split across the 2 workers during a bench run.
for w in $(kubectl -n qiwa get pod -l \
  nvidia.com/dynamo-graph-deployment-name=qwen397-dynamo-2node,\
nvidia.com/dynamo-component-type=worker -o name); do
  echo "=== $w ==="
  kubectl -n qiwa logs "$w" --tail=20 | grep -E 'request|prefix|cache_hit' | tail -5
done
```

Symptoms that the router is **not** distributing traffic:

- All requests showing up in only one worker's log → KV events not
  being received by the Frontend (check `--kv-events-config` ZMQ
  endpoint reachability between pods).
- 50/50 round-robin split irrespective of prefix → KV router fell
  back to default routing (look for `kv_router: failed to lookup` or
  similar in the Frontend log).

## Storage: `shared-model-cache`

The driver's `pvc()` step **asserts** that a PVC named
`shared-model-cache` exists in the target namespace. On clusters
without a pre-provisioned one, apply this once before running the
recipe (adjust `storageClassName` to a RWX/Retain class that exists
on your cluster):

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: shared-model-cache
spec:
  accessModes: [ReadWriteMany]
  storageClassName: dgxc-enterprise-file   # RWX, FSx-backed on aws-dev-02
  resources:
    requests:
      storage: 5Ti                          # 400 GB model + datasets + caches
```

The recipe uses three subPaths under this PVC:

| Container path | subPath | Purpose |
|----------------|---------|---------|
| `/home/dynamo/.cache/huggingface` | (root) | Shared HF Hub cache |
| `/home/dynamo/.cache/vllm` | `qiwa-qwen397-2node/vllm-cache` | vLLM compilation cache |
| `/perf-cache` | `qiwa-qwen397-2node/perf-cache` | datasets + aiperf artifacts |

## Comparison hygiene

Both configs use:
- `--mm-processor-cache-gb 30`
- `--gpu-memory-utilization 0.85`
- `--max-model-len 32768`
- `--enable-prefix-caching`
- Same dataset, same `--concurrency 30`, same `--request-count 240`,
  same `max_tokens 1024`.

The only flag deltas between `vllm-serve` and `dynamo` are the ones
Dynamo's component split forces: the Frontend/Worker split itself,
`--router-mode kv` on the Frontend, and `--kv-events-config` on each
Worker.

## Known unknowns

- **`topologySpreadConstraints` interaction with kai-scheduler gang
  scheduling.** Cluster-level `required` `podAffinity` deadlocks
  under gang scheduling — the recipe uses topology spread instead,
  which is evaluated alongside the gang. If both Worker pods stay
  Pending with `kai-scheduler: no nodes with enough resources` despite
  the precheck saying there's capacity, the fallback is two explicit
  hostname pins (would require splitting the Worker block into two
  identical-except-hostname stanzas — uglier but deterministic).
- **397B parser flags.** This recipe omits the `--dyn-tool-call-parser`
  / `--dyn-reasoning-parser` flags that the 35B and 32B reference
  recipes use; the corresponding parsers for `qwen3_5_moe` are not
  wired up at the time of writing. Add them when upstream lands them.

## Non-goals

- Frontend-decoding (`--frontend-decoding`) and embedding-cache
  (`--multimodal-embedding-cache-capacity-gb`) — explicitly excluded;
  this recipe is for vanilla aggregated Dynamo. Re-add as `dynamo-fd`
  / `dynamo-fd-ec` sibling configs if you want to study those axes
  on top of multi-worker KV routing.
- Disaggregated Prefill / Decode across the 2 nodes — different
  topology entirely; see
  `recipes/qwen3-32b/vllm/disagg-kv-router/deploy.yaml` for that
  shape.
- nsys profiling on K8s.
- CI integration (`recipes/**` is not gated by CI).
