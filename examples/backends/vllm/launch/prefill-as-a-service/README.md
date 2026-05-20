# Prefill as a Service launch and benchmark helpers

These scripts support cross-cluster disaggregated serving runs where prefill
workers run on one cluster and decode workers run on another. The directory is
organized by benchmark intent rather than experiment letter so the scripts stay
useful as the guide evolves.

## Direct NIXL connector launch path

Use the launch scripts when testing vLLM's direct `NixlConnector` path. This is the
right path for proving KV transfer works, measuring fixed-ISL TTFT, and
measuring serving throughput without KVBM hub or scheduler effects.

| Script | Run location | Purpose |
|---|---|---|
| `shared_infra.sh` | Shared infrastructure node | Starts etcd and NATS reachable from both clusters |
| `nixl_prefill_worker.sh` | Prefill node | Starts a `dynamo.vllm` prefill worker with UCX TCP for cross-cluster KV transfer |
| `nixl_decode_frontend.sh` | Decode node | Starts `dynamo.frontend` and one or more decode workers |
| `ttft_sweep.py` | Client node | Measures TTFT across fixed ISL points for network-transfer slope |
| `lognormal_throughput.py` | Client node | Measures request throughput with a lognormal ISL distribution |

`ttft_sweep.py` and `lognormal_throughput.py` are endpoint benchmarks. They can
run against either direct `NixlConnector` deployments or KVBM/P2P deployments as
long as the frontend exposes `/v1/chat/completions`.

## Scenario mapping

| Scenario | Scripts |
|---|---|
| Fixed-ISL cross-cluster TTFT sweep | `shared_infra.sh`, `nixl_prefill_worker.sh`, `nixl_decode_frontend.sh`, `ttft_sweep.py` |
| Direct-NIXL same-node or cross-cluster lognormal throughput | `nixl_prefill_worker.sh`, `nixl_decode_frontend.sh`, `lognormal_throughput.py` |
| KVBM/P2P same-node vs cross-cluster lognormal comparison | KVBM/P2P launch helpers, then `lognormal_throughput.py` |

KVBM/P2P launch helpers should live alongside these scripts but remain clearly
named as KVBM/P2P. KVBM adds the `DynamoConnector`, hub, scheduler, peer
transfer, and cache-tier behavior; direct-NIXL measurements should not be
confused with KVBM pipeline measurements.
