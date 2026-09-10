<!--
SPDX-FileCopyrightText: Copyright (c) 1.4.2 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
SPDX-License-Identifier: Apache-2.0
-->

# DeepSeek-V4.1-Flash Recipes

Recipes for [DeepSeek-V4.1-Flash](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash) on Dynamo + vLLM.

DeepSeek-V4.1-Flash is a multimodal Mixture-of-Experts model with **552B total parameters**
(8B active per prompt token, 16B per output token) and a **Causal Encoder-Decoder (CED)**
architecture with **Compressed Sparse Attention 2 (CSA2)**. The model natively processes
images and text, and supports contexts of up to 1,048,576 tokens.

Key architectural innovations:

- **CED**: 20-layer causal encoder + 20-layer decoder. Decoder KV cache projected
  from encoder hidden states — asymmetric activation (8B prefill / 16B decode).
- **CSA2**: Full/Reindex/Reuse attention modes share main KV and indexer K across layers.
- **SWA Bounded Replay**: Reconstructs missing SWA KV states by replaying recent tokens,
  reducing persistent KV cache to ~1/8 of V4-Flash.
- **DSpark**: 3-stage speculative decoding (5 draft tokens, 128 experts per stage).
- **Engram tables**: 196.6B parameters of N-gram lookup memory (~189 GiB).
- **Hyper-Connections**: 4 parallel residual streams with learned combine coefficients.

The checkpoint uses **mixed MXFP4/MXFP8 quantization** (experts MXFP4, rest MXFP8,
embedding/LM-head BF16). ~511 GB on disk, ~614 GB VRAM minimum.

## Configurations

Dynamo + vLLM deployment profiles for the B200 agentic workload (Mooncake trace: 64K median
ISL / 400 median OSL, constructed for ~90% prefix reuse):

|                          | B200 Aggregated (4-GPU)                      | B200 Disaggregated (1P1D)                       |
| ------------------------ | -------------------------------------------- | ------------------------------------------------ |
| **GPU** (per worker)     | 4x B200                                      | 4x B200 prefill + 4x B200 decode                |
| **Total GPUs**           | 4                                            | 8 (1P1D)                                        |
| **Nodes**                | 1                                            | 1 (preferred affinity)                           |
| **Mode**                 | Aggregated                                   | Prefill/decode disaggregated                    |
| **Framework**            | vLLM                                         | vLLM                                            |
| **Precision**            | MXFP4 experts + MXFP8 rest                  | MXFP4 experts + MXFP8 rest                      |
| **Parallelism**          | TP4 + expert parallel                        | TP4 + expert parallel, both roles              |
| **Routing**              | KV-aware                                     | KV-aware                                        |
| **Speculative decoding** | DSpark (5 tokens)                            | DSpark (5 tokens)                               |
| **Context length**       | 1,048,576                                    | 1,048,576                                        |
| **KV transfer**          | —                                            | NIXL over UCX (rc_x + rc + cuda_copy + cuda_ipc) via InfiniBand RDMA |
| **Prefix caching**       | Enabled                                      | Enabled                                          |
| **RDMA devices**         | —                                            | `rdma/rdma_shared_device_a: 4` per worker      |
| **hostIPC**              | —                                            | Not required (RDMA handles cross-pod transfer)  |
| **Prefill `--max-num-seqs`** | —                                         | 32 (reduced from 64 to avoid prefill OOM)       |

## Supported features

- Modalities: **Text + Images** (multimodal; recipes use `--language-model-only` for agentic text-only workload)
- Reasoning (`deepseek_v4` reasoning parser)
- Tool calling (`deepseek_v4` tool-call parser)
- DSpark speculative decoding (5 draft tokens)
- Expert parallelism
- KV-aware routing and prefix caching
- PD disaggregation

## Prerequisites

1. **Dynamo Platform installed** — see [Kubernetes Deployment Guide](../../../docs/fern/pages/kubernetes/getting-started/quickstart.mdx).
2. **vLLM image**: `vllm/vllm-openai:deepseekv41-flash-0909` — a model-specific vLLM 0.30.0+
   build with CED/CSA2/SWA Bounded Replay/DSpark kernels. No pip wheel serves this
   architecture; `ai-dynamo==1.4.2` is pip-installed at worker pod startup.
3. **Frontend image**: `nvcr.io/nvidia/ai-dynamo/dynamo-frontend-nightly:latest` — latest
   nightly with ai-dynamo baked in.
4. **Hugging Face access** to `deepseek-ai/DeepSeek-V4.1-Flash`.
5. **Host memory**: ≥ 16 GB per worker.
6. **RDMA device plugin** (disaggregated only): The disagg manifests request
   `rdma/rdma_shared_device_a` resources. Install an RDMA device plugin on your cluster
   and adjust the resource name to match (e.g. `rdma/ib` on other clusters). See the
   [Dynamo RDMA Setup](../../../docs/fern/pages/kubernetes/installation/rdma-setup/overview.md)
   guide for configuration details. Without it, disagg pods will remain Pending.

## Quick Start

### 1. Create namespace and secret

```bash
export NAMESPACE=your-namespace
kubectl create namespace ${NAMESPACE}
kubectl create secret generic hf-token-secret \
  --from-literal=HF_TOKEN="your-token" \
  -n ${NAMESPACE}
```

### 2. Create storage

> [!NOTE]
> Edit `model-cache/model-cache.yaml` and set `storageClassName` to a ReadWriteMany storage class
> available on the target cluster — `kubectl get storageclass` lists the candidates. The default
> value is `"csi-mounted-fs-path-sc"` and must be replaced before applying if unavailable.

```bash
kubectl apply -f model-cache/model-cache.yaml -n ${NAMESPACE}
```

The PVC must be `Bound` before proceeding to the model download step:

```bash
kubectl wait --for=jsonpath='{.status.phase}'=Bound pvc/model-cache -n ${NAMESPACE} --timeout=300s
```

### 3. Download the model

> [!IMPORTANT]
> The model-download Job mounts the `model-cache` PVC. Ensure the PVC is `Bound` (step 2) before
> applying the Job — if the PVC is still `Pending`, the Job will fail.

```bash
kubectl apply -f model-cache/model-download.yaml -n ${NAMESPACE}
kubectl wait --for=condition=Complete job/model-download -n ${NAMESPACE} --timeout=14400s
```

> [!WARNING]
> The MXFP4/MXFP8 checkpoint is ~511 GiB. First-load time is bounded by the storage backend,
> not the GPUs. The startup probe budgets 60 minutes per worker; raise it if your storage is slower.

### 4. Deploy

```bash
# Aggregated (4-GPU, 1 worker × TP4)
kubectl apply -f vllm/agg-b200-agentic/deploy.yaml -n ${NAMESPACE}

# Disaggregated (1P1D, InfiniBand RDMA)
kubectl apply -f vllm/disagg-b200-agentic/deploy.yaml -n ${NAMESPACE}
```

### 5. Smoke test

```bash
kubectl port-forward svc/dsv41-flash-agg-b200-agentic-frontend 8000:8000 -n ${NAMESPACE} &

curl -s http://localhost:8000/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "deepseek-ai/DeepSeek-V4.1-Flash",
    "messages": [{"role": "user", "content": "Explain how Causal Encoder-Decoder architecture differs from standard transformers."}],
    "max_tokens": 256
  }'
```

See the [recipe README](https://github.com/ai-dynamo/dynamo/blob/main/recipes/deepseek-v4/deepseek-v4.1-flash/README.md) for full smoke tests including tool calling and image input.

## Optimization targets

| Workload | Median ISL | Median OSL | Prefix reuse (trace design) | User output tok/s |
| -------- | ---------- | ---------- | -------------------------- | ----------------- |
| Agentic  | 64k        | 400        | ~90%                       | 50                |

## Performance results

Benchmarked on B200, AIPerf trace-replay with Mooncake agentic trace (15% subset, 3,541 requests).
The trace is constructed for ~90% prefix reuse (shared ~57.6K-token system prompt); measured
prefix-cache hit at C=24 is TBD. DSpark is organic (built-in `method: dspark`). C=24 is the
only concurrency measured. All numbers below are from AIPerf's official `profile_export_aiperf.json`
summary.

| Recipe | SKU | Workers | GPUs | Concurrency | System output tok/s | Per-GPU tok/s | User output tok/s (P50) | TTFT P50 (ms) | TTFT P90 (ms) | ITL P50 (ms) | ITL P90 (ms) | Prefix cache hit |
|--------|------|---------|------|-------------|---------------------|---------------|-------------------------|---------------|---------------|--------------|--------------|-----------------|
| Aggregated | B200 | 1 (TP4) | 4 | 24 | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD |
| Disaggregated (1P1D) | B200 | 1P+1D (TP4×2) | 8 | 24 | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD |

> **Note:** Performance numbers will be filled after benchmarking on B200.

## Configuration notes

Non-obvious knobs, all already set in the manifest:

- **Tokenizer mode.** `--tokenizer-mode deepseek_v41` is required for the V4.1 architecture
  (CED/CSA2). This is different from V4-Flash which uses `deepseek_v4`.
- **MoE backend.** `--moe-backend flashinfer_trtllm` selects FlashInfer TRT-LLM MoE kernels
  for MXFP4 on B200. vLLM 0.28.0+ auto-selects these on Blackwell, but we pin explicitly.
- **Language model only.** `--language-model-only` skips the vision encoder (ViT + aligner)
  for text-only agentic workloads, freeing VRAM for KV cache. Remove this flag to enable
  image inputs.
- **DSpark speculative decoding.** `--speculative-config '{"method":"dspark","num_speculative_tokens":5,"draft_sample_method":"probabilistic"}'`
  uses the built-in DSpark draft head (3 stages, 128 experts per stage, 5 draft tokens).
- **KV cache.** `--kv-cache-dtype fp8 --block-size 256` matches V4-Flash convention.
  V4.1 uses FP8 E2M1 for main KV with FP4 indexer cache.
- **Attention config.** `--attention-config '{"use_fp4_indexer_cache":true}'` enables the
  FP4 indexer cache for CSA2 sparse attention.
- **Compilation.** `--compilation-config '{"cudagraph_mode":"FULL_AND_PIECEWISE","custom_ops":["all"]}'`
  enables full CUDA graph capture with all custom ops.
- **Rust frontend.** `VLLM_USE_RUST_FRONTEND=1` enables the Rust OpenAI frontend (recommended
  by the vLLM recipe for V4.1-Flash).
- **Engine timeout.** `VLLM_ENGINE_READY_TIMEOUT_S=3600` allows up to 1 hour for model loading
  and CUDA graph capture (511 GB checkpoint + 1M context).
- **Image.** Workers use `vllm/vllm-openai:deepseekv41-flash-0909` (model-specific vLLM 0.30.0+
  build with CED/CSA2/SWA/DSpark kernels, pinned by digest). `ai-dynamo==1.4.2` is pip-installed
  at worker pod startup. Frontend uses `dynamo-frontend-nightly:latest` (ai-dynamo baked in).
- **Runtime version override.** `runtimeVersionOverride: "1.4.2"` is required on each component
  when using a non-semver image tag.
- **SYS_RESOURCE capability.** `capabilities.add: ["IPC_LOCK", "SYS_RESOURCE"]` is required for
  `ulimit -l unlimited` to work inside the container.
- **Disaggregated KV transfer over InfiniBand RDMA.** The disagg recipe uses
  `UCX_TLS=rc_x,rc,cuda_copy,cuda_ipc` with `rdma/rdma_shared_device_a: 4` resource requests
  on both worker pods. The RDMA resource name is cluster-specific — adjust to match your
  device plugin. This achieves ~18 GB/s avg KV transfer throughput without `hostIPC`.
  NCCL is configured with `NCCL_IB_DISABLE=0`, `NCCL_IB_HCA=mlx5`, `NCCL_NET_GDR_LEVEL=5`.
- **`--no-async-scheduling` (disagg only).** Disabled on both workers for disagg stability,
  matching the V4-Pro-0813 recipe pattern.
- **Prefill `--max-num-seqs 32` (disagg only).** Reduced from 64 (aggregated) to avoid OOM
  on 260K-token prompts with only 4 GPUs. Decode keeps 256.
- **kv_role.** Prefill uses `kv_producer`, decode uses `kv_consumer`.

## Checkpoint variants

This recipe uses the [public MXFP4/MXFP8 checkpoint](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash)
(~511 GB on disk, ~614 GB VRAM minimum). The checkpoint uses mixed precision:
expert weights are MXFP4, everything else is MXFP8 block-quantized with UE8M0 scales,
and embedding/LM-head are BF16.

## Limitations

- **Single-node only** for aggregated; disagg can span multiple nodes via RDMA.
- **No pip wheel** — the V4.1 architecture requires a model-specific vLLM build
  (`vllm/vllm-openai:deepseekv41-flash-0909`).
- **Frontend nightly** — uses `dynamo-frontend-nightly:latest` which may not be stable.
  Switch to `dynamo-frontend:1.4.2` if compatibility issues arise.
- **No compile cache** — vLLM compilation and CUDA graph capture are ephemeral (emptyDir).
  Each cold start pays ~5-10 minutes for torch.compile + CUDA graph capture.
- **Concurrency sweep not yet performed** — C=24 is the single benchmarked point.
