#!/bin/bash
# SPDX-FileCopyrightText: Copyright (c) 2025-2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#
# Prefill as a Service using vLLM's direct NIXL connector: prefill node.
# Run this script on the prefill cluster (e.g. a high-compute cluster).
# Run nixl_decode_frontend.sh on the decode cluster simultaneously.
#
# Prerequisites:
#   - ETCD_ENDPOINTS points to a shared etcd reachable from BOTH clusters
#   - NATS_SERVER points to a shared NATS server reachable from BOTH clusters
#   - VLLM_NIXL_SIDE_CHANNEL_HOST set to this node's IP reachable from decode cluster
#
# Example:
#   ETCD_ENDPOINTS=http://10.0.1.5:2379 \
#   NATS_SERVER=nats://10.0.1.5:4222 \
#   VLLM_NIXL_SIDE_CHANNEL_HOST=10.0.2.10 \
#   ./nixl_prefill_worker.sh

set -e

MODEL="${MODEL:-Qwen/Qwen3-0.6B}"
GPU_MEM_UTIL="${GPU_MEM_UTIL:-0.85}"

SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
source "$SCRIPT_DIR/../../../../common/launch_utils.sh"

pick_worker_module dynamo.vllm dynamo.vllm.unified_main "$@"
set -- "${REMAINING_ARGS[@]}"

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
    echo "Usage: MODEL=<hf-id> $0 [--unified]"
    echo "  MODEL                         HuggingFace model ID (default: Qwen/Qwen3-0.6B)"
    echo "  ETCD_ENDPOINTS                Shared etcd URL (e.g. http://10.0.1.5:2379)"
    echo "  NATS_SERVER                   Shared NATS URL (e.g. nats://10.0.1.5:4222)"
    echo "  VLLM_NIXL_SIDE_CHANNEL_HOST   This node's IP reachable from decode cluster"
    echo "  VLLM_NIXL_SIDE_CHANNEL_PORT   NIXL port (default: 20097)"
    exit 0
fi

: "${ETCD_ENDPOINTS:?ETCD_ENDPOINTS must be set to a shared etcd reachable from both clusters}"
: "${NATS_SERVER:?NATS_SERVER must be set to a shared NATS reachable from both clusters}"
: "${VLLM_NIXL_SIDE_CHANNEL_HOST:?VLLM_NIXL_SIDE_CHANNEL_HOST must be set to this node IP reachable from decode cluster}"

trap 'echo Cleaning up...; kill 0' EXIT

HTTP_PORT="${DYN_HTTP_PORT:-8000}"
print_launch_banner "Launching Cross-Cluster Disaggregated Serving (prefill node)" "$MODEL" "$HTTP_PORT"

VLLM_NIXL_SIDE_CHANNEL_PORT="${VLLM_NIXL_SIDE_CHANNEL_PORT:-20097}"

# Force UCX TCP transport — required for cross-cluster KV transfer.
# Without this, UCX attempts RDMA which fails across WAN, causing EngineDeadError.
export UCX_TLS="${UCX_TLS:-tcp}"
export UCX_SOCKADDR_TLS_PRIORITY="${UCX_SOCKADDR_TLS_PRIORITY:-tcp}"
export NIXL_UCX_TLS="${NIXL_UCX_TLS:-tcp}"

DYN_SYSTEM_PORT="${DYN_SYSTEM_PORT:-8082}" \
VLLM_NIXL_SIDE_CHANNEL_PORT="$VLLM_NIXL_SIDE_CHANNEL_PORT" \
VLLM_NIXL_SIDE_CHANNEL_HOST="$VLLM_NIXL_SIDE_CHANNEL_HOST" \
python3 -m "$WORKER_MODULE" \
    --model "$MODEL" \
    --disaggregation-mode prefill \
    --kv-transfer-config '{"kv_connector":"NixlConnector","kv_role":"kv_both","kv_connector_extra_config":{"enforce_handshake_compat":false}}' \
    --kv-events-config "{\"publisher\":\"zmq\",\"topic\":\"kv-events\",\"endpoint\":\"tcp://*:20081\",\"enable_kv_cache_events\":true}" \
    --gpu-memory-utilization "$GPU_MEM_UTIL" \
    "$@" &

wait_any_exit
