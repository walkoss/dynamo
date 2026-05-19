#!/bin/bash
# Experiment D: KVBM B100 disagg benchmark
# ALL components run inside the SAME named Pyxis container so NIXL agents
# can find each other via POSIX shared memory (separate containers = separate IPC).
# Usage: bash exp_d_kvbm_launch.sh <JOBID>
set -euo pipefail

JOBID="${1:-$SLURM_JOB_ID}"
SCRATCH=/home/scratch.mkosec_hw
IMAGE=$SCRATCH/vllm-dev.sqsh
MODEL=Qwen/Qwen3-8B
HF_HOME=/tmp/hf_cache
CONTAINER_NAME=kvbm-exp-d
LOG=/tmp/exp_d_kvbm.log

# Container-internal paths
C_WORKSPACE=/scratch/worktrees/dynamo-pfaas
C_PYTHONPATH=$C_WORKSPACE/lib/bindings/kvbm/python
C_HUB_BIN=/scratch/cargo-target-kvbm/debug/kvbm_hub
C_VENV=/opt/dynamo/venv
NW13=/opt/dynamo/venv/lib/python3.12/site-packages/.nixl_cu13.mesonpy.libs

exec > >(tee -a $LOG) 2>&1
echo "[$(date)] === Experiment D: KVBM B100 disagg ==="

pkill -f 'vllm.entrypoints\|kvbm_hub\|exp_d_kvbm' 2>/dev/null || true
sleep 2

echo "[$(date)] Killing stale container '$CONTAINER_NAME'..."
srun --jobid=$JOBID --overlap --container-name=$CONTAINER_NAME \
  --container-image=$IMAGE \
  --container-mounts=$SCRATCH:/scratch,/tmp:/tmp \
  bash -c "echo container_check" 2>/dev/null || true

# Step 1: Set up NIXL env inside the container, verify model
echo "[$(date)] Setting up NIXL and verifying model..."
srun --jobid=$JOBID --overlap --container-name=$CONTAINER_NAME \
  --container-image=$IMAGE \
  --container-mounts=$SCRATCH:/scratch,/tmp:/tmp \
  bash -c "
    export PYTHONPATH=$C_PYTHONPATH
    source $C_VENV/bin/activate
    mkdir -p /tmp/nixl-cu13/lib64
    ln -sf $NW13/libnixl.so /tmp/nixl-cu13/lib64/libnixl.so 2>/dev/null
    export NIXL_PREFIX=/tmp/nixl-cu13
    export NIXL_PLUGIN_DIR=$NW13/plugins
    export LD_LIBRARY_PATH=/usr/local/ucx/lib:$NW13:$NW13/plugins:\${LD_LIBRARY_PATH:-}
    export HF_HOME=/tmp/hf_cache
    python3 -c \"
from huggingface_hub import snapshot_download
import os
if os.path.isdir('/tmp/hf_cache/hub/models--Qwen--Qwen3-8B'):
    print('Model cached')
else:
    print('Downloading Qwen3-8B...')
    snapshot_download('Qwen/Qwen3-8B')
    print('Done')
\"" 2>&1

# Step 2: Start hub in the SAME named container
echo "[$(date)] Starting hub in container '$CONTAINER_NAME'..."
srun --jobid=$JOBID --overlap --container-name=$CONTAINER_NAME \
  --container-image=$IMAGE \
  --container-mounts=$SCRATCH:/scratch,/tmp:/tmp \
  bash -c "
    export PYTHONPATH=$C_PYTHONPATH
    export HF_HOME=/tmp/hf_cache
    export RUST_LOG=info,kvbm_hub=info,kvbm_connector=info
    mkdir -p /tmp/nixl-cu13/lib64
    ln -sf $NW13/libnixl.so /tmp/nixl-cu13/lib64/libnixl.so 2>/dev/null
    export NIXL_PREFIX=/tmp/nixl-cu13
    export NIXL_PLUGIN_DIR=$NW13/plugins
    export LD_LIBRARY_PATH=/usr/local/ucx/lib:$NW13:$NW13/plugins:\${LD_LIBRARY_PATH:-}
    $C_HUB_BIN \
      --discovery-port 1337 --control-port 8337 --velo-port 1338 \
      --heartbeat-interval-secs 10 \
      --prefill-vllm-url http://127.0.0.1:8001 \
      --prefill-vllm-model $MODEL \
      > /scratch/hub_d.log 2>&1" &
echo "[$(date)] Hub started, waiting 10s..."
sleep 10

# Added per validated skill: nixl.backends required for UCX/POSIX plugin loading in worker
PREFILL_CFG='{"kv_connector":"DynamoConnector","kv_role":"kv_both","kv_load_failure_policy":"recompute","kv_connector_module_path":"kvbm.v2.vllm.schedulers.connector","kv_connector_extra_config":{"leader":{"disagg":{"hub_url":"http://127.0.0.1:1337","role":"prefill"},"cache":{"host":{"cache_size_gb":40.0}},"tokio":{"worker_threads":4}},"worker":{"nixl":{"backends":{"UCX":{},"POSIX":{}}},"tokio":{"worker_threads":4}}}}'
DECODE_CFG='{"kv_connector":"DynamoConnector","kv_role":"kv_both","kv_load_failure_policy":"recompute","kv_connector_module_path":"kvbm.v2.vllm.schedulers.connector","kv_connector_extra_config":{"leader":{"disagg":{"hub_url":"http://127.0.0.1:1337","role":"decode"},"cache":{"host":{"cache_size_gb":40.0}},"tokio":{"worker_threads":4}},"worker":{"nixl":{"backends":{"UCX":{},"POSIX":{}}},"tokio":{"worker_threads":4}}}}'

# Step 3: Start prefill in the SAME named container
echo "[$(date)] Starting prefill (GPU 0, port 8001) in container '$CONTAINER_NAME'..."
srun --jobid=$JOBID --overlap --container-name=$CONTAINER_NAME \
  --container-image=$IMAGE \
  --container-mounts=$SCRATCH:/scratch,/tmp:/tmp \
  bash -c "
    export PYTHONPATH=$C_PYTHONPATH
    export HF_HOME=/tmp/hf_cache HF_HUB_OFFLINE=1 TRANSFORMERS_OFFLINE=1
    export CUDA_VISIBLE_DEVICES=0
    export FLASHINFER_CACHE_DIR=/tmp/flashinfer_cache
    mkdir -p /tmp/nixl-cu13/lib64
    ln -sf $NW13/libnixl.so /tmp/nixl-cu13/lib64/libnixl.so 2>/dev/null
    export NIXL_PREFIX=/tmp/nixl-cu13
    export NIXL_PLUGIN_DIR=$NW13/plugins
    export LD_LIBRARY_PATH=/usr/local/ucx/lib:$NW13:$NW13/plugins:\${LD_LIBRARY_PATH:-}
    export DYN_KVBM_CPU_CACHE_GB=40
    export RUST_LOG=warn,kvbm_config=debug,kvbm_engine=debug
    source $C_VENV/bin/activate
    echo NIXL_PLUGIN_DIR=\$NIXL_PLUGIN_DIR >> /scratch/prefill_d.log
    python3 -m vllm.entrypoints.openai.api_server \
      --model $MODEL --port 8001 \
      --max-model-len 8192 --gpu-memory-utilization 0.7 \
      --max-num-seqs 32 --enable-chunked-prefill \
      --no-enable-prefix-caching \
      --kv-transfer-config '$PREFILL_CFG' \
      >> /scratch/prefill_d.log 2>&1" &
echo "[$(date)] Prefill PID=$!"
sleep 5

# Step 4: Start decode in the SAME named container
echo "[$(date)] Starting decode (GPU 1, port 8000) in container '$CONTAINER_NAME'..."
srun --jobid=$JOBID --overlap --container-name=$CONTAINER_NAME \
  --container-image=$IMAGE \
  --container-mounts=$SCRATCH:/scratch,/tmp:/tmp \
  bash -c "
    export PYTHONPATH=$C_PYTHONPATH
    export HF_HOME=/tmp/hf_cache HF_HUB_OFFLINE=1 TRANSFORMERS_OFFLINE=1
    export CUDA_VISIBLE_DEVICES=1
    export FLASHINFER_CACHE_DIR=/tmp/flashinfer_cache
    mkdir -p /tmp/nixl-cu13/lib64
    ln -sf $NW13/libnixl.so /tmp/nixl-cu13/lib64/libnixl.so 2>/dev/null
    export NIXL_PREFIX=/tmp/nixl-cu13
    export NIXL_PLUGIN_DIR=$NW13/plugins
    export LD_LIBRARY_PATH=/usr/local/ucx/lib:$NW13:$NW13/plugins:\${LD_LIBRARY_PATH:-}
    export DYN_KVBM_CPU_CACHE_GB=40
    export RUST_LOG=warn,kvbm_config=debug,kvbm_engine=debug
    source $C_VENV/bin/activate
    echo NIXL_PLUGIN_DIR=\$NIXL_PLUGIN_DIR >> /scratch/decode_d.log
    python3 -m vllm.entrypoints.openai.api_server \
      --model $MODEL --port 8000 \
      --max-model-len 8192 --gpu-memory-utilization 0.7 \
      --max-num-seqs 32 --enable-chunked-prefill \
      --no-enable-prefix-caching \
      --kv-transfer-config '$DECODE_CFG' \
      >> /scratch/decode_d.log 2>&1" &
echo "[$(date)] Decode PID=$!"

# Step 5: Wait for decode health
echo "[$(date)] Waiting for decode health on :8000 (up to 10min)..."
for i in $(seq 1 120); do
  sleep 5
  HTTP=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8000/health 2>/dev/null)
  if [ "$HTTP" = "200" ]; then
    echo "[$(date)] DECODE READY after $((i*5))s"
    break
  fi
  if [ $((i % 12)) -eq 0 ]; then
    echo "[$(date)] Still waiting ($((i*5))s) HTTP=$HTTP"
    tail -3 /home/scratch.mkosec_hw/decode_d.log 2>/dev/null
  fi
done

HTTP=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8000/health 2>/dev/null)
if [ "$HTTP" != "200" ]; then
  echo "[$(date)] TIMEOUT — HTTP=$HTTP"
  tail -20 /home/scratch.mkosec_hw/decode_d.log
  exit 1
fi

# Step 6: Warmup
echo "[$(date)] Sending warmup request..."
curl -s http://127.0.0.1:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"Qwen/Qwen3-8B","messages":[{"role":"user","content":"hi"}],"max_tokens":4}' \
  > /dev/null || true
sleep 5

# Step 7: Benchmark N=100 c=8 ISL~2048 OSL=256
echo "[$(date)] Running Experiment D benchmark N=100 c=8..."
cat > /tmp/bench_d.py << 'PYEOF'
#!/usr/bin/env python3
"""Experiment D: KVBM conditional disagg N=100, c=8, ISL~2048, OSL=256."""
import json, statistics, sys, threading, time
from urllib.request import Request, urlopen

URL = "http://127.0.0.1:8000/v1/chat/completions"
PROMPT = ("the quick brown fox jumps over the lazy dog " * 48).strip()
BODY = json.dumps({
    "model": "Qwen/Qwen3-8B",
    "messages": [{"role": "user", "content": PROMPT}],
    "max_tokens": 256, "stream": False,
}).encode()
N, C = 100, 8
results = []
lock = threading.Lock()
sem = threading.Semaphore(C)

def one(i):
    with sem:
        t0 = time.time()
        try:
            req = Request(URL, data=BODY, headers={"Content-Type": "application/json"})
            with urlopen(req, timeout=300) as resp:
                _ = resp.read(); code = resp.status
        except Exception as e:
            code = -1; print(f"  req {i} ERR: {e}", file=sys.stderr)
        elapsed = time.time() - t0
        with lock:
            results.append((elapsed, code))
            done = len(results)
            if done % 10 == 0:
                print(f"  {done}/{N} done, last={elapsed:.2f}s", flush=True)

print(f"Starting Exp D KVBM benchmark: N={N} c={C} ISL~2016 OSL=256", flush=True)
threads = [threading.Thread(target=one, args=(i,)) for i in range(N)]
t0 = time.time()
for t in threads: t.start()
for t in threads: t.join()
T = time.time() - t0

lats = sorted([r[0] for r in results if r[1] == 200])
codes = {}
for r in results: codes[str(r[1])] = codes.get(str(r[1]), 0) + 1
n = len(lats)
out = {
    "experiment": "Exp D – KVBM v2 conditional disagg, 2x B100 (GPU0=prefill GPU1=decode), Qwen/Qwen3-8B BF16",
    "hardware": "2x B100-180GB, dlcluster 4u4g-gen-0103, same-node shared IPC (--container-name)",
    "config": {"N": N, "concurrency": C, "ISL_tokens_approx": 2016, "OSL_tokens": 256},
    "results": {
        "n_success": n, "n_total": N,
        "total_s": round(T, 2),
        "throughput_req_per_s": round(n / T, 3) if T > 0 else 0,
        "latency_mean_s": round(statistics.mean(lats), 3) if lats else None,
        "latency_p50_s": round(statistics.median(lats), 3) if lats else None,
        "latency_p95_s": round(lats[min(int(n*0.95), n-1)], 3) if n >= 20 else None,
        "latency_p99_s": round(lats[min(int(n*0.99), n-1)], 3) if n >= 100 else (round(lats[-1], 3) if lats else None),
        "http_codes": codes,
    },
    "setup": {
        "connector": "DynamoConnector (KVBM v2 connector, vLLM scheduler fallback)",
        "prefill": "GPU 0, port 8001, DynamoConnector role=prefill, cache.host 40GB",
        "decode": "GPU 1, port 8000, DynamoConnector role=decode, cache.host 40GB",
        "transport": "UCX (host cache), same container via --container-name (shared IPC)",
        "hub": "kvbm_hub on port 1337",
    },
}
print(json.dumps(out, indent=2))
with open("/tmp/bench_d_results.json", "w") as f:
    json.dump(out, f, indent=2)
print("\nBENCHMARK_COMPLETE", flush=True)
PYEOF

python3 /tmp/bench_d.py 2>&1 | tee /tmp/bench_d_output.log
echo "[$(date)] === Experiment D complete ==="
