#!/bin/bash
# SPDX-FileCopyrightText: Copyright (c) 2025-2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#
# Prefill as a Service using vLLM's direct NIXL connector: decode node.
# Run this script on the decode cluster.
# Run nixl_prefill_worker.sh on the prefill cluster simultaneously.
#
# Prerequisites:
#   - ETCD_ENDPOINTS points to a shared etcd reachable from BOTH clusters
#   - NATS_SERVER points to a shared NATS server reachable from BOTH clusters
#   - Network connectivity from decode cluster to prefill cluster (decode initiates all connections)
#
# Example (2 decode workers + frontend on a 2-GPU node):
#   ETCD_ENDPOINTS=http://10.0.1.5:2379 \
#   NATS_SERVER=nats://10.0.1.5:4222 \
#   ./nixl_decode_frontend.sh

set -e

MODEL="${MODEL:-Qwen/Qwen3-0.6B}"
DECODE_GPUS="${DECODE_GPUS:-0}"

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
source "$SCRIPT_DIR/../../../../common/launch_utils.sh"

pick_worker_module dynamo.vllm dynamo.vllm.unified_main "$@"
set -- "${REMAINING_ARGS[@]}"

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
    echo "Usage: MODEL=<hf-id> DECODE_GPUS=<comma-list> $0 [--unified]"
    echo "  MODEL           HuggingFace model ID (default: Qwen/Qwen3-0.6B)"
    echo "  DECODE_GPUS     Comma-separated GPU indices for decode workers (default: 0)"
    echo "                  Example: DECODE_GPUS=0,1 runs 2 decode workers"
    echo "  ETCD_ENDPOINTS  Shared etcd URL"
    echo "  NATS_SERVER     Shared NATS URL"
    exit 0
fi

: "${ETCD_ENDPOINTS:?ETCD_ENDPOINTS must be set to a shared etcd reachable from both clusters}"
: "${NATS_SERVER:?NATS_SERVER must be set to a shared NATS reachable from both clusters}"

trap 'echo Cleaning up...; kill 0' EXIT

# Force UCX TCP transport — required for cross-cluster KV transfer.
export UCX_TLS="${UCX_TLS:-tcp}"
export UCX_SOCKADDR_TLS_PRIORITY="${UCX_SOCKADDR_TLS_PRIORITY:-tcp}"
export NIXL_UCX_TLS="${NIXL_UCX_TLS:-tcp}"

HTTP_PORT="${DYN_HTTP_PORT:-8000}"
print_launch_banner "Launching Cross-Cluster Disaggregated Serving (decode node)" "$MODEL" "$HTTP_PORT"

python -m dynamo.frontend &

# Start one decode worker per GPU in DECODE_GPUS
port=8081
IFS=',' read -ra GPUS <<< "$DECODE_GPUS"
for gpu in "${GPUS[@]}"; do
    CUDA_VISIBLE_DEVICES="$gpu" \
    DYN_SYSTEM_PORT="$port" \
    python3 -m "$WORKER_MODULE" \
        --model "$MODEL" \
        --disaggregation-mode decode \
        --kv-transfer-config '{"kv_connector":"NixlConnector","kv_role":"kv_both","kv_connector_extra_config":{"enforce_handshake_compat":false}}' \
        --kv-events-config '{"enable_kv_cache_events":false}' \
        "$@" &
    ((port++))
done

wait_any_exit
