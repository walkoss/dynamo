#!/usr/bin/env bash
# SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#
# End-to-end test for the OpenAI cached-MM uuid extension on dynamo.frontend +
# dynamo.vllm. Boots a small Qwen3-VL-2B-Instruct worker (with vLLM's
# mm_processor_cache_gb > 0) plus a frontend, sends four request shapes:
#
#   1. {url, uuid: A}                     → success (cache fill)
#   2. {uuid: A}                          → success (cache hit, same uuid)
#   3. {uuid: B}  (B unseen)              → error (cache miss)
#   4. 5 images: [{url+uuid:A}, *4 {uuid:A}]
#                                         → success (1 cold + 4 hits)
#
# Prereqs (run inside the worktree's container — see /run-local-dynamo):
#   - dynamo built with maturin develop --uv --release --features nvtx
#   - nats-server + etcd reachable on localhost:4222 / 2379
#   - GPU device 2 free (Qwen3-VL-2B fits in ~6 GB)
#
# Usage:
#   bash tests/e2e/test_uuid_passthrough_e2e.sh

set -euo pipefail

LOG_DIR=${LOG_DIR:-/workspace/logs/e2e_uuid_$(date +%s)}
mkdir -p "$LOG_DIR"

MODEL=${MODEL:-Qwen/Qwen3-VL-2B-Instruct}
PORT=${PORT:-8000}
GPU=${CUDA_VISIBLE_DEVICES:-2}

# Reachable test images (small, public).
IMG_A_URL="https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/240px-PNG_transparency_demonstration_1.png"
IMG_A_UUID="img-aabbccddeeff0011"
IMG_B_UUID="img-ffffffffffffffff"

cleanup() {
    pkill -f "dynamo.frontend" 2>/dev/null || true
    pkill -f "dynamo.vllm" 2>/dev/null || true
    pkill -f "VLLM" 2>/dev/null || true
    sleep 2
}
trap cleanup EXIT

echo "=== Boot dynamo.vllm worker (mm_processor_cache_gb=4) ==="
CUDA_VISIBLE_DEVICES=$GPU \
    python -m dynamo.vllm \
    --model "$MODEL" \
    --max-model-len 8192 \
    --gpu-memory-utilization 0.55 \
    --enable-multimodal \
    --mm-processor-cache-gb 4 \
    > "$LOG_DIR/worker.log" 2>&1 &
WORKER_PID=$!

echo "=== Boot dynamo.frontend ==="
DYN_HTTP_BODY_LIMIT_MB=200 \
    python -m dynamo.frontend \
    --http-port "$PORT" \
    > "$LOG_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!

echo "Waiting for frontend on :$PORT ..."
for _ in $(seq 1 600); do
    if curl -sf "http://localhost:$PORT/health" >/dev/null 2>&1; then
        break
    fi
    sleep 1
done

post_req() {
    local body="$1"
    local label="$2"
    echo
    echo "--- $label ---"
    curl -sS -X POST "http://localhost:$PORT/v1/chat/completions" \
         -H "Content-Type: application/json" \
         -d "$body" | tee "$LOG_DIR/${label}.json"
    echo
}

# Req 1 — cache fill
REQ1=$(jq -n --arg model "$MODEL" --arg url "$IMG_A_URL" --arg uuid "$IMG_A_UUID" '{
    model: $model,
    max_tokens: 16,
    messages: [{
        role: "user",
        content: [
            {type: "text", text: "What color dominates this image?"},
            {type: "image_url", image_url: {url: $url, uuid: $uuid}}
        ]
    }]
}')
post_req "$REQ1" "01_url_plus_uuid_fill"

# Req 2 — cache hit on same uuid (uuid-only)
REQ2=$(jq -n --arg model "$MODEL" --arg uuid "$IMG_A_UUID" '{
    model: $model,
    max_tokens: 16,
    messages: [{
        role: "user",
        content: [
            {type: "text", text: "Describe what you remember."},
            {type: "image_url", image_url: {uuid: $uuid}}
        ]
    }]
}')
post_req "$REQ2" "02_uuid_only_hit"

# Req 3 — cache miss on unseen uuid (expected to error)
REQ3=$(jq -n --arg model "$MODEL" --arg uuid "$IMG_B_UUID" '{
    model: $model,
    max_tokens: 16,
    messages: [{
        role: "user",
        content: [
            {type: "text", text: "Should fail (cache miss)."},
            {type: "image_url", image_url: {uuid: $uuid}}
        ]
    }]
}')
post_req "$REQ3" "03_uuid_only_miss" || true

# Req 4 — 5 images; 1 fresh+uuid, 4 uuid-only repeats of A
REQ4=$(jq -n --arg model "$MODEL" --arg url "$IMG_A_URL" --arg uuid "$IMG_A_UUID" '{
    model: $model,
    max_tokens: 16,
    messages: [{
        role: "user",
        content: [
            {type: "text", text: "Compare these 5 images."},
            {type: "image_url", image_url: {url: $url, uuid: $uuid}},
            {type: "image_url", image_url: {uuid: $uuid}},
            {type: "image_url", image_url: {uuid: $uuid}},
            {type: "image_url", image_url: {uuid: $uuid}},
            {type: "image_url", image_url: {uuid: $uuid}}
        ]
    }]
}')
post_req "$REQ4" "04_five_imgs_one_fresh_four_repeats"

echo
echo "=== ASSERTIONS ==="
PASS=0
FAIL=0
check() {
    local file="$1"
    local jq_expr="$2"
    local label="$3"
    if jq -e "$jq_expr" "$LOG_DIR/$file" >/dev/null 2>&1; then
        echo "  PASS  $label"
        PASS=$((PASS + 1))
    else
        echo "  FAIL  $label"
        FAIL=$((FAIL + 1))
    fi
}

check 01_url_plus_uuid_fill.json '.choices[0].message.content | type == "string" and length > 0' \
    "Req 1 (url+uuid fill) returns content"
check 02_uuid_only_hit.json     '.choices[0].message.content | type == "string" and length > 0' \
    "Req 2 (uuid-only hit)  returns content"
check 03_uuid_only_miss.json    '.error // .choices[0].finish_reason == "error"' \
    "Req 3 (uuid-only miss) returns an error"
check 04_five_imgs_one_fresh_four_repeats.json \
                                '.choices[0].message.content | type == "string" and length > 0' \
    "Req 4 (5-img fan-out)  returns content"

echo
echo "PASS=$PASS FAIL=$FAIL  (logs in $LOG_DIR)"
exit "$FAIL"
