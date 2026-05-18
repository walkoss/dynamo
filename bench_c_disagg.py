#!/usr/bin/env python3
"""Experiment C disagg benchmark: N=100, c=8, ISL~2048, OSL=256. Stdlib only."""
import json
import statistics
import sys
import threading
import time
from urllib.request import Request, urlopen

URL = "http://127.0.0.1:8000/v1/chat/completions"
PROMPT = ("the quick brown fox jumps over the lazy dog " * 48).strip()
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
            req = Request(URL, data=BODY, headers={"Content-Type": "application/json"})
            with urlopen(req, timeout=300) as resp:
                _ = resp.read()
                code = resp.status
        except Exception as e:
            code = -1
            print(f"  req {i} ERR: {e}", file=sys.stderr)
        elapsed = time.time() - t0
        with lock:
            results.append((elapsed, code))
            done = len(results)
            if done % 10 == 0:
                print(f"  {done}/{N} done, last={elapsed:.2f}s", flush=True)


print(f"Starting DISAGG benchmark: N={N} c={C} ISL~2016 OSL=256", flush=True)
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
out = {
    "experiment": "Exp C – disagg PrfaaS, 2x A100-PCIE-80GB (GPU0=prefill GPU1=decode), Qwen/Qwen3-8B BF16, vLLM 0.19.0 + dynamo.vllm",
    "hardware": "2x A100-PCIE-80GB, dlcluster 4u4g-0104, UCX TCP loopback",
    "config": {"N": N, "concurrency": C, "ISL_tokens_approx": 2016, "OSL_tokens": 256},
    "results": {
        "n_success": n,
        "n_total": N,
        "total_s": round(T, 2),
        "throughput_req_per_s": round(n / T, 3),
        "latency_mean_s": round(statistics.mean(lats), 3),
        "latency_p50_s": round(statistics.median(lats), 3),
        "latency_p95_s": round(lats[min(int(n * 0.95), n - 1)], 3) if n >= 20 else None,
        "latency_p99_s": round(lats[min(int(n * 0.99), n - 1)], 3)
        if n >= 100
        else round(lats[-1] if lats else 0, 3),
        "http_codes": codes,
    },
    "setup": {
        "prefill": "GPU 0, port 8001, dynamo.vllm --disaggregation-mode prefill, NixlConnector",
        "decode": "GPU 1, port 8000, dynamo.vllm --disaggregation-mode decode, NixlConnector",
        "transport": "UCX TCP (UCX_TLS=tcp) loopback on same physical node",
        "kv_transfer": "NixlConnector, kv_role=kv_both",
    },
}
print(json.dumps(out, indent=2))
with open("/home/scratch.mkosec_hw/bench_disagg_results.json", "w") as f:
    json.dump(out, f, indent=2)
print("\nBENCHMARK_COMPLETE", flush=True)
