#!/usr/bin/env python3
"""Experiment D: KVBM conditional disagg benchmark.
Working ISL range: ≤12 tokens (1 KV block threshold).
Runs N=100 c=8 at the max working ISL (n_words=1, ~12 tokens, OSL=256).
"""
import json
import statistics
import sys
import threading
import time
from urllib.request import Request, urlopen

# n_words=1: "the quick brown fox" = 12 tokens — max working ISL for KVBM disagg on this branch
PROMPT = "the quick brown fox"
BODY = json.dumps(
    {
        "model": "Qwen/Qwen3-8B",
        "messages": [{"role": "user", "content": PROMPT}],
        "max_tokens": 256,
        "stream": False,
    }
).encode()

N, C = 100, 8
results = []
lock = threading.Lock()
sem = threading.Semaphore(C)


def one(i):
    with sem:
        t0 = time.time()
        try:
            req = Request(
                "http://127.0.0.1:8000/v1/chat/completions",
                data=BODY,
                headers={"Content-Type": "application/json"},
            )
            with urlopen(req, timeout=60) as resp:
                d = json.loads(resp.read())
                u = d.get("usage", {})
                code = 200
                pt = u.get("prompt_tokens", 0)
                ct = u.get("completion_tokens", 0)
        except Exception as e:
            code = -1
            pt = 0
            ct = 0
            print(f"  req {i} ERR: {e}", file=sys.stderr, flush=True)
        elapsed = time.time() - t0
        with lock:
            results.append((elapsed, code, pt, ct))
            done = len(results)
            if done % 10 == 0:
                ok = sum(1 for r in results if r[1] == 200)
                print(f"  {done}/{N} ({ok} ok) last={elapsed:.2f}s", flush=True)


print(
    f"Exp D KVBM benchmark: N={N} c={C} ISL=~12 tokens (n_words=1) OSL=256", flush=True
)
threads = [threading.Thread(target=one, args=(i,)) for i in range(N)]
t0 = time.time()
for t in threads:
    t.start()
for t in threads:
    t.join()
T = time.time() - t0

lats = sorted([r[0] for r in results if r[1] == 200])
codes = {}
for r in results:
    codes[str(r[1])] = codes.get(str(r[1]), 0) + 1
n = len(lats)
avg_ct = sum(r[3] for r in results if r[1] == 200) // max(n, 1)

out = {
    "experiment": "Exp D - KVBM v2 conditional disagg end-to-end, 2x H100-80GB, Qwen/Qwen3-8B BF16",
    "hardware": "2x H100-80GB, dlcluster 4u4g-0073, same-node --container-name shared IPC",
    "note": (
        "Working ISL range for KVBM conditional disagg on ryan/kvbm-rdma-pull is <=12 tokens "
        "(1 KV block threshold). ISL>=24 tokens triggers the hung disagg path due to deferred "
        "v2 Rust scheduler in v2/mod.rs. This benchmark runs at max working ISL (12 tokens). "
        "DYN_KVBM_CPU_CACHE_GB=40 env var required for NIXL UCX initialization."
    ),
    "config": {
        "N": N,
        "concurrency": C,
        "ISL_tokens": 12,
        "prompt": PROMPT,
        "OSL_tokens": 256,
        "avg_actual_completion_tokens": avg_ct,
    },
    "results": {
        "n_success": n,
        "n_total": N,
        "total_s": round(T, 2),
        "throughput_req_per_s": round(n / T, 3) if T > 0 and n > 0 else 0,
        "latency_mean_s": round(statistics.mean(lats), 3) if lats else None,
        "latency_p50_s": round(statistics.median(lats), 3) if lats else None,
        "latency_p95_s": round(lats[min(int(n * 0.95), n - 1)], 3) if n >= 20 else None,
        "latency_p99_s": round(lats[min(int(n * 0.99), n - 1)], 3)
        if n >= 100
        else (round(lats[-1], 3) if lats else None),
        "http_codes": codes,
    },
}
print(json.dumps(out, indent=2))
with open("/tmp/bench_d_results.json", "w") as f:
    json.dump(out, f, indent=2)
print("\nBENCHMARK_COMPLETE", flush=True)
