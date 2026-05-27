#!/usr/bin/env bash
# SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#
# Unified driver for the Qwen3.5-397B-A17B-FP8 2-node KV-routed benchmark.
# Idempotent — re-running steps that already completed is a no-op.
#
# Two axes:
#   --hw <name>      → sources hw/<name>.env (VLLM_IMAGE, HW_NODE_SELECTOR,
#                      HW_NODE_SELECTOR_VLLM_SERVE, HW_TOLERATIONS)
#   --config <name>  → resolves to DEPLOY_KIND, DEPLOY_NAME, BENCH_POD inline
#
# Usage:
#   ./run-benchmark.sh -n <namespace> --hw h100 --config vllm-serve
#   ./run-benchmark.sh -n <namespace> --hw h100 --config dynamo --step deploy
#
# Steps: pvc | download | dataset | deploy | bench | retrieve | clean | all
#   pvc/download/dataset are config-agnostic (idempotent prep).
#   deploy/bench/retrieve/clean are config-specific.
set -euo pipefail

NAMESPACE=""
STEP="all"
HW="h100"
CONFIG=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    -n|--namespace) NAMESPACE="$2"; shift 2 ;;
    --step) STEP="$2"; shift 2 ;;
    --hw) HW="$2"; shift 2 ;;
    --config) CONFIG="$2"; shift 2 ;;
    -h|--help)
      grep '^#' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "unknown arg: $1" >&2; exit 2 ;;
  esac
done
if [[ -z "$NAMESPACE" ]]; then
  echo "ERROR: -n <namespace> required" >&2; exit 2
fi
HERE="$(cd "$(dirname "$0")" && pwd)"

# Per-config metadata.
#   DEPLOY_KIND branches deploy() + clean():
#     deployment → kubectl rollout status + delete Deployment+Service
#     dgd        → kubectl wait on operator-stamped DGD pod labels + delete DGD
#   BENCH_POD       — name of the aiperf Pod for this config.
#   BENCH_FRONTEND  — service name the bench Pod hits at $FRONTEND:8000.
#                     vllm-serve: a plain Service; DGD: `<dgd-name>-frontend`
#                     created automatically by the dynamo operator.
#   BENCH_RUN_LABEL — sub-directory written under /perf-cache/artifacts/
#                     so the 2 configs' aiperf artifacts don't collide.
case "$CONFIG" in
  vllm-serve)
    DEPLOY_KIND="deployment"
    DEPLOY_NAME="qwen397-vllm-serve"
    BENCH_POD="qwen397-vllm-serve-bench"
    BENCH_FRONTEND="qwen397-vllm-serve"
    BENCH_RUN_LABEL="vllm-serve"
    ;;
  dynamo)
    DEPLOY_KIND="dgd"
    DEPLOY_NAME="qwen397-dynamo-2node"
    BENCH_POD="qwen397-dynamo-bench"
    BENCH_FRONTEND="qwen397-dynamo-2node-frontend"
    BENCH_RUN_LABEL="dynamo"
    ;;
  "")
    echo "ERROR: --config <name> required" >&2
    echo "Available: vllm-serve dynamo" >&2
    exit 2 ;;
  *)
    echo "ERROR: unknown config: $CONFIG" >&2
    echo "Available: vllm-serve dynamo" >&2
    exit 2 ;;
esac
export BENCH_POD BENCH_FRONTEND BENCH_RUN_LABEL

HW_ENV="$HERE/hw/${HW}.env"
if [[ ! -f "$HW_ENV" ]]; then
  echo "ERROR: hardware env file not found: $HW_ENV" >&2
  echo "Available: $(ls "$HERE/hw/" 2>/dev/null | tr '\n' ' ')" >&2
  exit 2
fi
DEPLOY_TPL="$HERE/deploy/${CONFIG}.yaml"

if ! command -v envsubst >/dev/null 2>&1; then
  echo "ERROR: envsubst missing. Install gettext-base (apt) or gettext (brew)." >&2
  exit 2
fi

# shellcheck disable=SC1090
set -a; . "$HW_ENV"; set +a
echo "[hw]     $HW → image=$VLLM_IMAGE worker_selector=$HW_NODE_SELECTOR"
echo "[config] $CONFIG → kind=$DEPLOY_KIND deploy=$DEPLOY_NAME bench-pod=$BENCH_POD"

K="kubectl -n $NAMESPACE"
# Limit envsubst to our own template vars so embedded ${MODEL_NAME} /
# ${KEEP_INPUTS_JSON:-} shell vars inside perf.yaml's inline bash stay
# literal. $BENCH_* drive the shared perf.yaml; $VLLM_IMAGE / $HW_*
# drive deploy.yaml + perf.yaml. HW_NODE_SELECTOR_VLLM_SERVE is the
# vllm-serve-only hostname pin (Dynamo workers use HW_NODE_SELECTOR).
TPL_VARS='$VLLM_IMAGE $HW_NODE_SELECTOR $HW_NODE_SELECTOR_VLLM_SERVE $HW_TOLERATIONS $BENCH_POD $BENCH_FRONTEND $BENCH_RUN_LABEL'
APPLY_TPL() { envsubst "$TPL_VARS" <"$1" | $K apply -f -; }

# ---------------- config-agnostic prep ----------------

pvc() {
  if ! $K get pvc shared-model-cache >/dev/null 2>&1; then
    echo "[pvc] ERROR: PVC 'shared-model-cache' not found in namespace '$NAMESPACE'" >&2
    echo "[pvc] See README.md → 'Storage: shared-model-cache' for provisioning guidance." >&2
    exit 1
  fi
  $K get pvc shared-model-cache
}

bench_can_see_dataset() {
  # Validate the generator actually produced the expected jsonl at the
  # subPath the bench Pod will mount. Avoids "already complete" false
  # positives where a prior Job succeeded against a different subPath.
  $K run dataset-check-$$ --restart=Never --rm -i --image=busybox \
    --overrides='{"spec":{"containers":[{"name":"c","image":"busybox","command":["sh","-c","test -f /perf-cache/datasets/30u_8t_5w_8000word_base64.jsonl"],"volumeMounts":[{"name":"d","mountPath":"/perf-cache","subPath":"qiwa-qwen397-2node/perf-cache"}]}],"volumes":[{"name":"d","persistentVolumeClaim":{"claimName":"shared-model-cache"}}]}}' \
    >/dev/null 2>&1
}

download() {
  if $K get job qwen397-model-download >/dev/null 2>&1; then
    if [[ "$($K get job qwen397-model-download -o jsonpath='{.status.succeeded}')" == "1" ]]; then
      echo "[download] already complete"
      return
    fi
    echo "[download] previous job present but not Complete — deleting and re-applying"
    $K delete job qwen397-model-download
  fi
  $K apply -f "$HERE/model-cache/model-download.yaml"
  # 397B FP8 is ~400 GB. Allow 60 min to be safe.
  $K wait --for=condition=Complete job/qwen397-model-download --timeout=3600s
}

dataset() {
  if $K get job qwen397-generate-datasets -o jsonpath='{.status.succeeded}' 2>/dev/null | grep -q 1 \
     && bench_can_see_dataset; then
    echo "[dataset] already complete + output verified"
    return
  fi
  $K delete job qwen397-generate-datasets --ignore-not-found
  $K apply -f "$HERE/data-gen-job.yaml"
  $K wait --for=condition=Complete job/qwen397-generate-datasets --timeout=1800s
  $K logs job/qwen397-generate-datasets | tail -20
}

# ---------------- config-specific lifecycle ----------------

deploy() {
  APPLY_TPL "$DEPLOY_TPL"
  case "$DEPLOY_KIND" in
    deployment)
      # 397B FP8 load + cudagraph capture on TP=8 takes 15-20 min on H100.
      $K rollout status "deploy/$DEPLOY_NAME" --timeout=1800s
      ;;
    dgd)
      local sel_fe="nvidia.com/dynamo-graph-deployment-name=$DEPLOY_NAME,nvidia.com/dynamo-component-type=frontend"
      local sel_wk="nvidia.com/dynamo-graph-deployment-name=$DEPLOY_NAME,nvidia.com/dynamo-component-type=worker"
      # The operator takes 5-15 s to reconcile the DGD CR into pods.
      # `kubectl wait -l ...` locks onto whatever matches at first
      # lookup and errors out with "no matching resources found" if
      # nothing matches yet — so poll for existence first.
      echo "[deploy] waiting for operator to stamp DGD pods ..."
      local seen=0
      for _ in $(seq 1 30); do
        if [[ $($K get pod -l "$sel_fe" --no-headers 2>/dev/null | wc -l) -gt 0 ]]; then
          seen=1; break
        fi
        sleep 2
      done
      if [[ "$seen" != "1" ]]; then
        echo "[deploy] ERROR: operator did not stamp Frontend pod within 60s" >&2
        $K describe dynamographdeployment "$DEPLOY_NAME" | tail -40 >&2 || true
        exit 1
      fi
      echo "[deploy] waiting for DGD Frontend pod ..."
      $K wait --for=condition=Ready pod -l "$sel_fe" --timeout=900s
      echo "[deploy] waiting for 2 VllmWorker pods (model load ~15-20 min) ..."
      $K wait --for=condition=Ready pod -l "$sel_wk" --timeout=1800s
      # Sanity: confirm the 2 workers landed on distinct nodes.
      local nodes
      nodes=$($K get pod -l "$sel_wk" -o jsonpath='{range .items[*]}{.spec.nodeName}{"\n"}{end}' | sort -u | wc -l)
      if [[ "$nodes" != "2" ]]; then
        echo "[deploy] WARNING: expected 2 distinct worker nodes, got $nodes" >&2
        $K get pod -l "$sel_wk" -o wide >&2
      else
        echo "[deploy] ok: 2 workers on 2 distinct nodes"
        $K get pod -l "$sel_wk" -o wide
      fi
      ;;
    *)
      echo "ERROR: unknown DEPLOY_KIND=$DEPLOY_KIND" >&2; exit 2 ;;
  esac
}

bench() {
  $K delete pod "$BENCH_POD" --ignore-not-found
  APPLY_TPL "$HERE/perf.yaml"
  $K wait --for=condition=Ready "pod/$BENCH_POD" --timeout=300s
  echo "[bench] polling for 'Run complete.' marker (max 90 min)"
  local deadline=$(( $(date +%s) + 5400 ))
  while (( $(date +%s) < deadline )); do
    if $K logs "$BENCH_POD" --tail=200 2>/dev/null | grep -Fq "Run complete."; then
      echo "[bench] completion marker seen"
      return 0
    fi
    sleep 30
  done
  echo "[bench] ERROR: marker not seen in 90 min" >&2
  $K logs "$BENCH_POD" --tail=80 >&2 || true
  return 1
}

retrieve() {
  local base="${BENCHMARK_RESULTS_DIR:-$HOME/workspace/dynamo-tmp/logs}"
  local dest="$base/$(date +%m-%d)/qwen397-2node-${HW}/${CONFIG}"
  mkdir -p "$dest"
  $K exec "$BENCH_POD" -- \
      tar c --exclude='inputs.json' -C /perf-cache artifacts \
    | tar x -C "$dest"
  echo "[retrieve] landed at $dest"
  find "$dest" -name 'profile_export_aiperf.json' -print
}

clean() {
  $K delete pod "$BENCH_POD" --ignore-not-found
  case "$DEPLOY_KIND" in
    deployment)
      $K delete deploy "$DEPLOY_NAME" --ignore-not-found
      $K delete service "$DEPLOY_NAME" --ignore-not-found
      ;;
    dgd)
      $K delete dynamographdeployment "$DEPLOY_NAME" --ignore-not-found
      ;;
  esac
  # PVCs intentionally NOT deleted — that would force model re-download.
  # To wipe everything:
  #   kubectl -n $NS delete pvc shared-model-cache
}

all() {
  pvc
  download
  dataset
  deploy
  bench
  retrieve
}

case "$STEP" in
  pvc|download|dataset|deploy|bench|retrieve|clean|all) "$STEP" ;;
  *) echo "unknown step: $STEP" >&2; exit 2 ;;
esac
