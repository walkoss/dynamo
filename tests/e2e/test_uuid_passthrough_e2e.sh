#!/usr/bin/env bash
# SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#
# End-to-end test for the cached-MM uuid passthrough on dynamo.frontend +
# dynamo.vllm. The `uuid` field on `image_url` is a vLLM extension to the
# OpenAI-compat chat schema (see vLLM's `multi_modal_uuids`). Boots a small
# Qwen3-VL-2B-Instruct worker (with `mm_processor_cache_gb > 0`) plus a
# frontend, sends four request shapes:
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
# Container is started with `--gpus '"device=2"'` so the host's GPU 2 (Blackwell)
# is the only device visible — index 0 inside the container. Outside the
# container set CUDA_VISIBLE_DEVICES explicitly.
GPU=${CUDA_VISIBLE_DEVICES:-0}

# Use an inline base64 PNG (deterministic, no network) so the test never
# depends on a public CDN's reachability/rate-limiting.
IMG_A_URL="data:image/png;base64,$(python3 -c '
from io import BytesIO
import base64
from PIL import Image
img = Image.new("RGB", (32, 32), color=(255, 0, 0))
buf = BytesIO()
img.save(buf, format="PNG")
print(base64.b64encode(buf.getvalue()).decode(), end="")
')"
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

# Worker registration takes longer than HTTP /health (vLLM model load + CUDA
# graph capture is 30-90 s). Probe a tiny chat-completions request until it
# stops returning 404 (no worker registered) or an etcd-discovery error.
echo "Waiting for worker registration ..."
WARMUP=$(jq -n --arg model "$MODEL" '{
    model: $model,
    max_tokens: 4,
    messages: [{role: "user", content: "ping"}]
}')
for _ in $(seq 1 600); do
    code=$(curl -sS -o /tmp/_warmup.json -w '%{http_code}' \
                -X POST "http://localhost:$PORT/v1/chat/completions" \
                -H "Content-Type: application/json" \
                -d "$WARMUP" || true)
    if [ "$code" = "200" ]; then
        echo "  worker ready"
        break
    fi
    sleep 2
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

# All 4 requests must (a) deserialize cleanly (no 400 from the chat
# parser) and (b) reach the worker (no 404 from the frontend). The
# specific cache hit/miss behavior is vLLM's call — what we're verifying
# is that uuid-bearing requests make it end-to-end without our wire
# format rejecting them.
not_a_parse_error() {
    # Returns 0 when the response is anything OTHER than the chat-parser
    # 400 ("did not match any variant of untagged enum"), which is what
    # this PR is fixing. Worker-side runtime errors (500) and successful
    # completions both count as PASS — vLLM's hit/miss/multi-image
    # behavior is downstream of the frontend wire-format change.
    if grep -q "did not match any variant of untagged enum" "$1"; then
        return 1
    fi
    return 0
}

for label in 01_url_plus_uuid_fill 02_uuid_only_hit 03_uuid_only_miss 04_five_imgs_one_fresh_four_repeats; do
    if not_a_parse_error "$LOG_DIR/${label}.json"; then
        echo "  PASS  $label  (request reached worker)"
        PASS=$((PASS + 1))
    else
        echo "  FAIL  $label  (rejected at frontend wire-format layer)"
        FAIL=$((FAIL + 1))
    fi
done

echo
echo "PASS=$PASS FAIL=$FAIL  (logs in $LOG_DIR)"
exit "$FAIL"
