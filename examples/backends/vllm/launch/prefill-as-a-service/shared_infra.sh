#!/bin/bash
# SPDX-FileCopyrightText: Copyright (c) 2025-2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#
# Start shared etcd + NATS on the current node. Run this before launching
# prefill and decode workers. Requires Docker.
#
# Both services bind to all interfaces (0.0.0.0) and advertise the node's
# primary IP so remote workers can reach them.
#
# Usage:
#   bash shared_infra.sh
#
# After running, export the printed values on your prefill and decode nodes:
#   export ETCD_ENDPOINTS=http://<this_ip>:2379
#   export NATS_SERVER=nats://<this_ip>:4222

set -e

INFRA_IP="${INFRA_IP:-$(hostname -I | awk '{print $1}')}"

echo "Starting etcd + NATS on ${INFRA_IP}"

docker rm -f etcd nats 2>/dev/null || true

docker run -d --name etcd --net=host \
  quay.io/coreos/etcd:v3.5.12 etcd \
  --listen-client-urls=http://0.0.0.0:2379 \
  --advertise-client-urls="http://${INFRA_IP}:2379"

docker run -d --name nats --net=host \
  nats:latest -js

# Wait for etcd health
for i in $(seq 1 20); do
  sleep 1
  HTTP=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:2379/health 2>/dev/null)
  [ "$HTTP" = "200" ] && break
done

curl -s http://127.0.0.1:2379/health
docker ps --format "{{.Names}} {{.Status}}" | grep -E "^(etcd|nats) "

echo ""
echo "Export on prefill and decode nodes:"
echo "  export ETCD_ENDPOINTS=http://${INFRA_IP}:2379"
echo "  export NATS_SERVER=nats://${INFRA_IP}:4222"
