#!/usr/bin/env python3
# SPDX-FileCopyrightText: Copyright (c) 2025-2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#
# Throughput benchmark for Prefill as a Service using a lognormal ISL
# distribution to model real-world request patterns.
#
# Usage:
#   python3 lognormal_throughput.py \
#       --endpoint http://<decode_node>:8000 \
#       --n 200 --concurrency 8 --osl 256
#
# The lognormal(mu=7, sigma=1.5) distribution clipped to [256, 8192] tokens
# matches the SOLBench / Chatbot Arena shape: median ~1100 tokens, p95 ~3900.

import argparse
import json
import math
import random
import statistics
import string
import threading
import time
from urllib.request import Request, urlopen


def sample_lognormal_isl(
    n: int,
    mu: float = 7.0,
    sigma: float = 1.5,
    min_isl: int = 256,
    max_isl: int = 8192,
    seed: int = 42,
) -> list[int]:
    rng = random.Random(seed)
    samples = []
    while len(samples) < n:
        # Box-Muller transform for lognormal
        u1, u2 = rng.random(), rng.random()
        z = math.sqrt(-2 * math.log(u1)) * math.cos(2 * math.pi * u2)
        v = int(math.exp(mu + sigma * z))
        if min_isl <= v <= max_isl:
            samples.append(v)
    return samples


def make_prompt(isl_tokens: int, run_id: str) -> str:
    salt = "".join(random.choices(string.ascii_lowercase, k=8))
    base = "the quick brown fox jumps over the lazy dog " * 2000
    chars = isl_tokens * 4
    return f"[id={run_id}][salt={salt}] {base[:chars]}"


def send_request(
    endpoint: str,
    model: str,
    prompt: str,
    osl: int,
    timeout: int = 300,
) -> tuple[float, int, int]:
    body = json.dumps(
        {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": osl,
            "stream": False,
            "extra_body": {"enable_thinking": False, "ignore_eos": True},
        }
    ).encode()
    t0 = time.time()
    try:
        req = Request(
            endpoint
            if endpoint.endswith("/v1/chat/completions")
            else endpoint.rstrip("/") + "/v1/chat/completions",
            data=body,
            headers={"Content-Type": "application/json"},
        )
        with urlopen(req, timeout=timeout) as resp:
            data = json.loads(resp.read())
            elapsed = time.time() - t0
            code = resp.status
            completion_tokens = data.get("usage", {}).get("completion_tokens", 0)
            return elapsed, code, completion_tokens
    except Exception:
        return time.time() - t0, -1, 0


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--endpoint", default="http://localhost:8000")
    ap.add_argument("--model", default="deepseek-ai/DeepSeek-R1-Distill-Llama-8B")
    ap.add_argument("--n", type=int, default=200, help="Total requests")
    ap.add_argument("--concurrency", type=int, default=8)
    ap.add_argument("--osl", type=int, default=256, help="Output tokens per request")
    ap.add_argument("--mu", type=float, default=7.0, help="Lognormal mu")
    ap.add_argument("--sigma", type=float, default=1.5, help="Lognormal sigma")
    ap.add_argument("--min-isl", type=int, default=256)
    ap.add_argument("--max-isl", type=int, default=8192)
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument(
        "--warmup", type=int, default=1, help="Warmup requests before timing"
    )
    ap.add_argument("--output", default="", help="JSON output file path")
    args = ap.parse_args()

    isls = sample_lognormal_isl(
        args.n + args.warmup,
        mu=args.mu,
        sigma=args.sigma,
        min_isl=args.min_isl,
        max_isl=args.max_isl,
        seed=args.seed,
    )

    print(
        f"ISL distribution: lognormal(mu={args.mu}, sigma={args.sigma}) "
        f"clipped [{args.min_isl}, {args.max_isl}]"
    )
    print(
        f"  median={statistics.median(isls[:args.n]):.0f} "
        f"p95={sorted(isls[:args.n])[int(0.95*args.n)]:.0f} "
        f"p99={sorted(isls[:args.n])[int(0.99*args.n)]:.0f} tokens"
    )
    print(f"N={args.n}  concurrency={args.concurrency}  osl={args.osl}\n")

    # Warmup
    if args.warmup > 0:
        print(
            f"Warmup ({args.warmup} request, establishing NIXL connection)...",
            flush=True,
        )
        for i in range(args.warmup):
            t, code, _ = send_request(
                args.endpoint,
                args.model,
                make_prompt(isls[args.n + i], f"warmup-{i}"),
                args.osl,
            )
            print(f"  warmup[{i}]: {t:.2f}s  HTTP {code}", flush=True)
        time.sleep(2)

    # Benchmark
    results: list[tuple[float, int, int]] = []
    lock = threading.Lock()
    sem = threading.Semaphore(args.concurrency)

    def worker(idx: int) -> None:
        isl = isls[idx]
        prompt = make_prompt(isl, f"req-{idx}")
        with sem:
            t, code, completion = send_request(
                args.endpoint, args.model, prompt, args.osl
            )
        with lock:
            results.append((t, code, completion))
            done = len(results)
            if done % 20 == 0:
                print(
                    f"  {done}/{args.n}  last={t:.2f}s  isl={isl}  http={code}",
                    flush=True,
                )

    print(f"Starting benchmark at {time.strftime('%H:%M:%S')}...", flush=True)
    t0 = time.time()
    threads = [threading.Thread(target=worker, args=(i,)) for i in range(args.n)]
    for th in threads:
        th.start()
    for th in threads:
        th.join()
    total_time = time.time() - t0

    # Compute stats
    success = [(t, c, tok) for t, c, tok in results if c == 200]
    lats = sorted(t for t, _, _ in success)
    n = len(lats)

    out = {
        "scenario": "nixl_lognormal_throughput",
        "topology": "prefill_as_a_service",
        "config": {
            "model": args.model,
            "N": args.n,
            "concurrency": args.concurrency,
            "osl": args.osl,
            "isl_distribution": f"lognormal(mu={args.mu}, sigma={args.sigma}) clipped [{args.min_isl}, {args.max_isl}]",
            "isl_median": statistics.median(isls[: args.n]),
            "isl_p95": sorted(isls[: args.n])[int(0.95 * args.n)],
        },
        "results": {
            "n_success": n,
            "n_total": args.n,
            "total_s": round(total_time, 2),
            "throughput_req_per_s": round(n / total_time, 3) if total_time > 0 else 0,
            "latency_p50_s": round(lats[n // 2], 3) if n >= 2 else None,
            "latency_p95_s": round(lats[min(int(n * 0.95), n - 1)], 3)
            if n >= 20
            else None,
            "latency_p99_s": round(lats[min(int(n * 0.99), n - 1)], 3)
            if n >= 100
            else None,
            "http_codes": {
                str(c): sum(1 for _, code, _ in results if code == c)
                for c in set(code for _, code, _ in results)
            },
        },
    }

    print("\n=== Lognormal throughput results ===")
    print(f"  Throughput:   {out['results']['throughput_req_per_s']} req/s")
    print(f"  P50 latency:  {out['results']['latency_p50_s']}s")
    print(f"  P95 latency:  {out['results']['latency_p95_s']}s")
    print(f"  P99 latency:  {out['results']['latency_p99_s']}s")
    print(f"  Success:      {n}/{args.n}")
    print(json.dumps(out, indent=2))

    if args.output:
        with open(args.output, "w") as f:
            json.dump(out, f, indent=2)
        print(f"\nResults saved to {args.output}")


if __name__ == "__main__":
    main()
