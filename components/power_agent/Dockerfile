# SPDX-FileCopyrightText: Copyright (c) 2025-2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#
# Power Agent image — supports both NVML and DCGM actuator paths.
# Referenced by deploy/helm/charts/power-agent/values.yaml (image.repository)
# and built by the `power-agent` CI job (.github/workflows/pr.yaml,
# post-merge-ci.yml).
#
# Multi-stage build:
#   Stage 1 (dcgm-vendor) copies pydcgm Python bindings + libdcgm.so
#     from the upstream nvcr.io/nvidia/cloud-native/dcgm image. We
#     vendor (rather than pip-install) for two reasons: (1) pydcgm
#     isn't on PyPI, and (2) version pinning the Python bindings to
#     the libdcgm.so they ship with eliminates a class of dlopen
#     mismatch failures.
#   Stage 2 (runtime) layers the agent's Python deps + sources on top
#     of a slim Python base, then copies the vendored DCGM artifacts
#     into /opt/dcgm/. PYTHONPATH + LD_LIBRARY_PATH wire them up.
#
# The image still works when the agent runs in actuator: nvml mode
# (the chart default) — pydcgm is imported lazily by DcgmActuator
# methods, so an NVML deployment never opens libdcgm.so. The
# vendoring is dormant overhead (~12 MB image bloat) for NVML users
# and the only deployment path for DCGM users. See
# docs/design-docs/power-agent-dual-actuator.md §9 for the rationale.
#
#   docker build -t power-agent:dev -f components/power_agent/Dockerfile \
#       components/power_agent

# DOCKER_PROXY lets CI route the base image through the ECR Docker Hub mirror
# (e.g. <acct>.dkr.ecr.<region>.amazonaws.com/dockerhub/). Empty by default so
# `docker build` works unchanged for local/dev use straight from Docker Hub.
ARG DOCKER_PROXY=

# -----------------------------------------------------------------------------
# Stage 1: extract pydcgm + libdcgm.so from the upstream DCGM image
# -----------------------------------------------------------------------------
# Pin a specific DCGM version. Bump in lockstep with the GPU Operator's
# nvidia-dcgm tag — the hostengine and the bindings should share a
# major version (DCGM guarantees backward compat within a major, not
# across).
ARG DCGM_IMAGE=nvcr.io/nvidia/cloud-native/dcgm:4.2.3-2-ubuntu22.04
FROM ${DCGM_IMAGE} AS dcgm-vendor

RUN set -eux; \
    mkdir -p /vendor/dcgm-python /vendor/dcgm-lib; \
    cp -a /usr/local/dcgm/bindings/python3/*.py /vendor/dcgm-python/; \
    cp -a /usr/lib/x86_64-linux-gnu/libdcgm.so* /vendor/dcgm-lib/

# -----------------------------------------------------------------------------
# Stage 2: runtime image
# -----------------------------------------------------------------------------
# Slim base — the NVIDIA Container Toolkit injects libnvidia-ml.so at runtime
# via runtimeClassName: nvidia (set by the Helm chart), so the image does NOT
# bake pynvml's native dependency. nvmlInit() resolves the host driver lib.
FROM ${DOCKER_PROXY}python:3.11-slim-bookworm AS runtime

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PYTHONPATH=/opt/dcgm/python \
    LD_LIBRARY_PATH=/opt/dcgm/lib

# Runtime deps. pynvml (NVML bindings), kubernetes (pod listing),
# prometheus_client (metrics). pydcgm bindings are vendored below.
RUN pip install --no-cache-dir \
    pynvml==12.0.* \
    kubernetes==30.* \
    prometheus-client==0.20.*

COPY --from=dcgm-vendor /vendor/dcgm-python /opt/dcgm/python
COPY --from=dcgm-vendor /vendor/dcgm-lib    /opt/dcgm/lib

WORKDIR /app
COPY power_agent.py actuator.py /app/

USER 0

ENTRYPOINT ["python", "/app/power_agent.py"]
CMD ["--help"]
