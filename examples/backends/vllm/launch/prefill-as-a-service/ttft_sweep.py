#!/usr/bin/env python3
# SPDX-FileCopyrightText: Copyright (c) 2025-2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#
# TTFT sweep for Prefill as a Service using vLLM's direct NIXL connector.
# Measures TTFT at increasing input sequence lengths to characterize network
# overhead in the KV transfer path.
#
# Usage:
#   python3 ttft_sweep.py --endpoint http://<decode_node>:8000
#   python3 ttft_sweep.py --endpoint http://<decode_node>:8000 --max-isl 32768
#
# Notes:
#   - Run AFTER both prefill and decode workers are registered (check /health endpoint)
#   - Each ISL point uses a unique random salt to prevent vLLM prefix cache hits
#   - A warmup request is sent first to establish the NIXL connection
#   - max_tokens=1 isolates TTFT from generation latency

import argparse
import json
import random
import string
import subprocess
import time


def ttft(
    endpoint: str, prompt: str, max_tokens: int = 1, timeout: int = 120
) -> tuple[float, int]:
    body = json.dumps(
        {
            "model": "deepseek-ai/DeepSeek-R1-Distill-Llama-8B",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": max_tokens,
        }
    )
    t0 = time.time()
    r = subprocess.run(
        [
            "curl",
            "-s",
            "-o",
            "/dev/null",
            "-w",
            "%{http_code}",
            "-X",
            "POST",
            endpoint,
            "-H",
            "Content-Type: application/json",
            "-d",
            body,
        ],
        capture_output=True,
        text=True,
        timeout=timeout,
    )
    return time.time() - t0, int(r.stdout.strip() or "0")


def make_prompt(target_chars: int, run_id: str) -> str:
    salt = "".join(random.choices(string.ascii_lowercase, k=24))
    base = "the quick brown fox jumps over the lazy dog " * 2000
    return f"[id={run_id}][salt={salt}] Summarize: {base[:target_chars]}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--endpoint",
        default="http://localhost:8000/v1/chat/completions",
        help="Frontend /v1/chat/completions URL",
    )
    ap.add_argument(
        "--max-isl",
        type=int,
        default=16384,
        help="Maximum ISL to sweep (tokens, approximate). Default: 16384",
    )
    ap.add_argument(
        "--runs", type=int, default=3, help="Measurement runs per ISL point"
    )
    args = ap.parse_args()

    endpoint = args.endpoint
    if not endpoint.endswith("/v1/chat/completions"):
        endpoint = endpoint.rstrip("/") + "/v1/chat/completions"

    # ISL configs: (label, approx_chars) — chars ≈ tokens * 4 for repetitive ASCII
    all_configs = [
        ("~4K", 15_000),
        ("~8K", 30_000),
        ("~16K", 60_000),
        ("~32K", 120_000),
    ]
    isl_configs = [
        (label, chars) for label, chars in all_configs if chars <= args.max_isl * 4
    ]

    print("Warmup (establishing NIXL connection)...", flush=True)
    t, code = ttft(endpoint, make_prompt(200, "warmup"), max_tokens=3)
    print(f"  warmup: {t:.2f}s  HTTP {code}", flush=True)
    if code not in (200, 500):
        print(
            f"  WARNING: unexpected HTTP {code} on warmup — check that workers are registered",
            flush=True,
        )
    time.sleep(3)

    print("\n=== Cross-cluster ISL sweep ===")
    print(f"Endpoint: {endpoint}")
    print(f"Runs per ISL: {args.runs}\n")

    results = {}
    for label, chars in isl_configs:
        run_times = []
        for i in range(args.runs):
            prompt = make_prompt(chars, f"{label}-{i}")
            t, code = ttft(endpoint, prompt)
            run_times.append(t)
            print(f"  {label} [{i+1}/{args.runs}]  {t:.3f}s  HTTP {code}", flush=True)
            if code not in (200, 500):
                print(
                    "    ERROR: non-200/500 response — decode worker may have died, "
                    "stopping this ISL",
                    flush=True,
                )
                break
            time.sleep(2)
        if run_times:
            avg = sum(run_times) / len(run_times)
            results[label] = (avg, run_times)
            print(f"  {label} avg: {avg:.3f}s\n", flush=True)

    print("=== Results summary ===")
    for label, (avg, runs) in results.items():
        runs_str = "  ".join(f"{t:.3f}s" for t in runs)
        print(f"  {label}: avg={avg:.3f}s  runs=[{runs_str}]")

    print("\nCompare measured TTFT against the theoretical KV transfer table in")
    print("docs/backends/vllm/vllm-cross-cluster-disagg.md to validate your bandwidth.")


if __name__ == "__main__":
    main()
