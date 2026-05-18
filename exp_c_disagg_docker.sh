#!/bin/bash
# Experiment C: DISAGGREGATED PrfaaS with vllm-runtime Docker image
# GPU 0 = prefill worker, GPU 1 = decode worker + frontend
# NixlConnector UCX TCP between P and D

IMG="nvcr.io/nvidian/dynamo-dev/vllm-runtime:mkosec-2da789b71"
NODE_IP=10.63.147.19
MODEL=Qwen/Qwen3-8B
ETCD=http://10.63.147.19:2379
NATS=nats://10.63.147.19:4222
SCRATCH=/home/scratch.mkosec_hw
DYNCFG='{"kv_connector":"NixlConnector","kv_role":"kv_both"}'
EVTCFG_P='{"publisher":"zmq","topic":"kv-events","endpoint":"tcp://*:20081","enable_kv_cache_events":true}'
EVTCFG_D='{"enable_kv_cache_events":false}'

> ${SCRATCH}/prefill_d.log
> ${SCRATCH}/decode_d.log
> ${SCRATCH}/disagg_docker.log

echo "[$(date)] Cleaning up old containers..." | tee -a ${SCRATCH}/disagg_docker.log
docker rm -f disagg-prefill disagg-decode 2>/dev/null

# NIS/LDAP user fix: create minimal passwd+nsswitch for the container
cat /etc/passwd > /tmp/cpw && echo "$(whoami):x:$(id -u):$(id -g):$(whoami):/tmp:/bin/bash" >> /tmp/cpw
printf 'passwd: files\ngroup: files\n' > /tmp/cnss

echo "[$(date)] Starting prefill container (GPU 0, port 8001)..." | tee -a ${SCRATCH}/disagg_docker.log
docker run -d --name disagg-prefill \
  --gpus '"device=0"' \
  --net=host --ipc=host \
  --ulimit memlock=-1 --ulimit stack=67108864 \
  --user "$(id -u):$(id -g)" \
  -v /tmp/cpw:/etc/passwd:ro \
  -v /tmp/cnss:/etc/nsswitch.conf:ro \
  -v ${SCRATCH}:/scratch \
  -e HOME=/tmp \
  -e ETCD_ENDPOINTS=${ETCD} \
  -e NATS_SERVER=${NATS} \
  -e VLLM_NIXL_SIDE_CHANNEL_HOST=${NODE_IP} \
  -e VLLM_NIXL_SIDE_CHANNEL_PORT=20097 \
  -e HF_HOME=/scratch/hf_cache \
  -e HF_HUB_OFFLINE=1 \
  -e TRANSFORMERS_OFFLINE=1 \
  -e FLASHINFER_CACHE_DIR=/tmp/flashinfer_cache \
  -e DYN_HTTP_PORT=8001 \
  -e DYN_SYSTEM_PORT=8082 \
  ${IMG} \
  python3 -m dynamo.vllm \
    --model ${MODEL} \
    --disaggregation-mode prefill \
    --kv-transfer-config "${DYNCFG}" \
    --kv-events-config "${EVTCFG_P}" \
    --max-model-len 8192 --gpu-memory-utilization 0.7 \
  >> ${SCRATCH}/prefill_d.log 2>&1

docker logs -f disagg-prefill >> ${SCRATCH}/prefill_d.log 2>&1 &

echo "[$(date)] Starting decode container (GPU 1, port 8000)..." | tee -a ${SCRATCH}/disagg_docker.log
docker run -d --name disagg-decode \
  --gpus '"device=1"' \
  --net=host --ipc=host \
  --ulimit memlock=-1 --ulimit stack=67108864 \
  --user "$(id -u):$(id -g)" \
  -v /tmp/cpw:/etc/passwd:ro \
  -v /tmp/cnss:/etc/nsswitch.conf:ro \
  -v ${SCRATCH}:/scratch \
  -e HOME=/tmp \
  -e ETCD_ENDPOINTS=${ETCD} \
  -e NATS_SERVER=${NATS} \
  -e HF_HOME=/scratch/hf_cache \
  -e HF_HUB_OFFLINE=1 \
  -e TRANSFORMERS_OFFLINE=1 \
  -e FLASHINFER_CACHE_DIR=/tmp/flashinfer_cache \
  ${IMG} \
  bash -c "python3 -m dynamo.frontend & DYN_SYSTEM_PORT=8081 python3 -m dynamo.vllm --model ${MODEL} --disaggregation-mode decode --kv-transfer-config '${DYNCFG}' --kv-events-config '${EVTCFG_D}' --max-model-len 8192 --gpu-memory-utilization 0.7 && wait" \
  >> ${SCRATCH}/decode_d.log 2>&1

docker logs -f disagg-decode >> ${SCRATCH}/decode_d.log 2>&1 &

echo "[$(date)] Waiting for frontend/decode health on :8000..." | tee -a ${SCRATCH}/disagg_docker.log
for i in $(seq 1 120); do
  sleep 5
  HTTP=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8000/health 2>/dev/null)
  if [ "$HTTP" = "200" ]; then
    echo "[$(date)] DECODE/FRONTEND READY (HTTP 200) after $((i*5))s" | tee -a ${SCRATCH}/disagg_docker.log
    break
  fi
  if [ $((i % 12)) -eq 0 ]; then
    echo "[$(date)] Still waiting... ($((i*5))s) HTTP=$HTTP" | tee -a ${SCRATCH}/disagg_docker.log
    tail -3 ${SCRATCH}/decode_d.log 2>/dev/null | tee -a ${SCRATCH}/disagg_docker.log
  fi
done

HTTP=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8000/health 2>/dev/null)
if [ "$HTTP" != "200" ]; then
  echo "[$(date)] TIMEOUT — HTTP=$HTTP" | tee -a ${SCRATCH}/disagg_docker.log
  tail -30 ${SCRATCH}/decode_d.log
  exit 1
fi

echo "[$(date)] Running disagg benchmark..." | tee -a ${SCRATCH}/disagg_docker.log
python3 ${SCRATCH}/bench_c_disagg.py 2>&1 | tee ${SCRATCH}/bench_disagg_results.json
echo "[$(date)] DONE" | tee -a ${SCRATCH}/disagg_docker.log
