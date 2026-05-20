# Power Agent — Helm Chart Packaging Plan

**Status:** Implemented — chart shipped at `deploy/helm/charts/power-agent/`
(`Chart.yaml` `version: 1.1.0`, `appVersion: "1.1.0"`). v1.0.0 of the chart
landed in [PR #9682](https://github.com/ai-dynamo/dynamo/pull/9682) (PR 1a of
the PR-9369 split, base of this plan); v1.1.0 added the DCGM actuator in
[PR #9790](https://github.com/ai-dynamo/dynamo/pull/9790), whose end-to-end
design is captured in `docs/design-docs/power-agent-dual-actuator.md`. The
container image is built from `components/power_agent/Dockerfile` by the
`power-agent` CI job. This plan is the **chart-shape source of truth**.
**Author:** Kai Ma
**Date:** 2026-05-19 (initial); refreshed 2026-06-03 (rebased #9682 build wiring + #9790 dual-actuator alignment)
**Goal:** Replace the raw `deploy/power_agent/{daemonset,rbac,dev-pod}.yaml`
manifests (shipped in [PR #9682](https://github.com/ai-dynamo/dynamo/pull/9682),
PR 1a of the PR-9369 split) with a Helm chart at
`deploy/helm/charts/power-agent/`, modelled on the existing
`deploy/helm/charts/snapshot/` precedent. The chart structurally fixes three
Major CodeRabbit comments on PR9682 about parameterization and reproducibility.
v1.1.0 of the chart layers the DCGM actuator path on top (opt-in via
`agent.actuator: dcgm`, default `nvml`), **extending** §4.2's values
surface with `agent.actuator` + `agent.dcgm.{host,port,enforce}` and
extending §4.4's helper set with `validateActuator` + `validateEnforce`.
The §6 design decisions and the chart shape are unchanged; only the
configuration knobs and the validator surface grew.

### Revision history

| Rev | Date | Changes |
|-----|------|---------|
| v1 | 2026-05-19 | Initial plan. All five §6 decisions from the 2026-05-19 design session locked in: (§6.1) smaller scope — Power Agent only, planner-dev artifacts in PR9683/9687 untouched; (§6.2) Option α — fold chart into PR9682 directly; (§6.3) Option A — `dev-pod.yaml` ships as a gated template inside the same chart; (§6.4) delete the raw `deploy/power_agent/{daemonset,rbac,dev-pod}.yaml` in the same PR as the chart lands; (§6.5) this document. |
| v1.1 | 2026-05-19 | Added §1.4 — End-to-end user flow. Pre-empts the "does this actually deliver a `helm something → ready to run` experience" question by making the post-plan three-command flow (2 × `helm install` + 1 × `kubectl apply` for the workload DGD) explicit, and by mapping every infrastructure primitive a power-aware planner needs to the chart that installs it. No decision change; doc-only refinement. |
| v1.4 | 2026-05-20 | Second-pass review on the v1.3 refresh — five findings, all accepted. (1) **Status header self-contradiction (medium):** v1.3 claimed v1.1.0 added DCGM "without changing the values surface" but §4.2 explicitly extends it; reworded to "extends the values surface … and §4.4's helper set." (2) **§4.2 dev-block comment stale (major):** the inline `values.yaml` example in §4.2 still showed the v1.0.0 single-file `kubectl create configmap` recipe, contradicting both `values.yaml` on disk and §5.3.1. Updated to the actual two-file recipe (`power_agent.py` + `actuator.py`) and added the DCGM dev-image override note. `dev.namespaceRestrictedOverride: false` is now inline in the §4.2 block too, so the standalone `namespaceRestrictedOverride` snippet at the tail of §4.4 is collapsed to a one-sentence pointer rather than a redundant code block. (3) **§4.4 helm-unittest coverage overstated (medium):** v1.3 said `validate_actuator_test.yaml` covers "accidental list" and `validate_enforce_test.yaml` covers `False!` / `disabled` — neither matches the actual test files. Rewrote the coverage prose to match the real cases verified by reading the YAML: 10 actuator tests (happy: default / explicit-nvml / dcgm-default / dcgm-overrides / nvml-omits-dcgm-flags; sad: `NVML` / `DCGM` / `auto` / `typo` / empty), 14 enforce tests (9 happy spellings incl. `"TRUE"`; sad: `treu` / `enabled` / `2` / empty; 1 cross-validator nvml-skip-on-typo). Total 24, matching the §5.4 `helm unittest` expected output. (4) **§5.4 positive `helm template` overlays unrunnable (major):** the four positive overlays in v1.3 didn't include `--set image.tag=v1.1.0`, so each would fail fast on `validateImageTag` before exercising the overlay under test. Rewrote all four as explicit `helm template` commands carrying the tag; the negative "missing tag" case is now gate 3 only (and explicitly the only gate that omits the tag). Gates 4–6 also gain the tag so each isolates the validator under test. (5) **v1.3 changelog still named an internal-dev-environment-setup doc not tracked upstream (low):** v1.3 already removed every live reference but kept the filename in its own changelog summary; v1.4 rewrites the changelog text to describe it as "an internal dev-environment-setup doc not tracked upstream" without naming the file, closing the reviewer's "zero internal-dev-artifact references upstream" ask. No design changes in v1.4 — all five findings were doc-fidelity / runnability fixes on the v1.3 refresh. |
| v1.3 | 2026-05-20 | **PR9790 dual-actuator refresh — this doc was written for the NVML-only v1.0.0 chart and went stale once PR9790 landed `agent.actuator` + `agent.dcgm.*` on top.** Seven targeted fixes, no design reversal: (1) **§1.4.2 / §5.3.1 / §7.4** — install-example `image.tag` bumped `v1.0.0 → v1.1.0` across all four locations (the v1.0.0 image lacks `actuator.py` and rejects the new `--actuator` / `--dcgm-*` flags). The §1.4.2 "Platform Status" sentence (and four other references) pointing at an internal dev-environment-setup doc not tracked upstream were generalised to "in environments where the platform chart is already installed cluster-wide." (2) **§4.1** — chart layout updated: `Chart.yaml` comment shows `version: 1.1.0, appVersion: "1.1.0"`, and the `tests/` directory (added in PR9790 for the v1.1.0 helm-unittest suite) is now part of the layout. File count: 7 templates + 2 unittests + 4 root files = 13. (3) **§4.2** — values surface extended with the actual v1.1.0 keys: `agent.actuator` (`nvml`/`dcgm`, default `nvml`), `agent.dcgm.host` (default `nvidia-dcgm.gpu-operator.svc.cluster.local`), `agent.dcgm.port` (5555), `agent.dcgm.enforce` (default `false`; matches the v1.3 doc-default of `power-agent-dual-actuator.md`). Verified against `power_agent.py:706-804` — every new key has a matching `parser.add_argument`. (4) **§4.4** — added `power-agent.validateActuator` and `power-agent.validateEnforce` template-time helpers (mirror `_parse_bool_strict` in the CLI so `--set agent.dcgm.enforce=treu` is rejected at `helm install` time, not at `kubectl describe pod` time). (5) **§5.2 / §8** — file accounting refreshed (8 templates + `tests/validate_actuator_test.yaml` + `tests/validate_enforce_test.yaml` + 3 root files = 13; ~6,650 insertions across PR9682 + PR9790). (6) **§5.3.1 / dev mode** — the dev-mode ConfigMap recipe MUST now include `actuator.py` alongside `power_agent.py`; the v1.0.0 single-file recipe will `ModuleNotFoundError: No module named 'actuator'` because `power_agent.py:26` does `from actuator import ...` at module load. (7) **§5.4 / §6 risk #5 / §7.1** — `helm-unittest` is no longer "optional/future"; v1.1.0 ships `tests/validate_{actuator,enforce}_test.yaml`, so `helm unittest deploy/helm/charts/power-agent` is now a required validation gate, risk row 5 collapses to "mitigated in v1.1," and §7.1 is reframed from "deferred follow-up" to "implemented in v1.1.0." (8) **§8 post-push** — `kubectl rollout status daemonset/power-agent-agent` was wrong: with release name `power-agent` and chart name `power-agent`, the `fullname` helper renders just `power-agent` (the `if contains $name .Release.Name` branch). Corrected to `daemonset/power-agent`. Net: every actionable reviewer finding on this doc — three blocking, four major, two medium, one low — is now closed; the plan reads as the v1.1.0 chart's source of truth, not the pre-PR9790 v1.0.0 plan it was originally. |
| v1.2 | 2026-05-19 | Incorporated review-cycle feedback (evidence-based accept/reject pass): (1) **§4.2** — removed dead `agent.reconcileIntervalSeconds` knob (verified `power_agent.py:529-552` exposes only 4 CLI flags; `RECONCILE_INTERVAL_S = 15` is a hardcoded module constant with no flag); added a maintenance-window rationale comment to `daemonset.updateStrategy.rollingUpdate.maxUnavailable: 1` explaining why the conservative safety default is kept and when to override for large fleets. (2) **§4.4** — added a third template helper `power-agent.effectiveNamespaceRestricted` that forces namespace-scoped RBAC when `dev.enabled=true` (justified by `power_agent.py:541-546` already accepting `--namespace`; dev mode pins to one node + one namespace, so cluster-wide RBAC is gratuitous). (3) **§5.3** — strengthened chart-README requirements: dev-mode `kubectl create configmap` recipe is now ordered as a *prerequisite* step (before `helm install`), not just a post-install NOTES.txt hint; added a one-line note that the chart uses the canonical NVIDIA monitoring-agent pattern (privileged + `NVIDIA_VISIBLE_DEVICES=all`, no `nvidia.com/gpu` claim — privileged container bypasses the unprivileged-visibility edge case). (4) **§6** risk register — updated row 7 (ConfigMap prerequisite escalation); added row 9 covering the dead-knob audit principle (every `values.yaml` key must have a verified template-side or CLI-side wiring). Three of four reviewer points fully accepted; one (Consideration 1 default change) partial-accepted as "preserve `maxUnavailable: 1` default, document the override for large fleets" because power-cap enforcement is safety-critical and the parameterization the reviewer asked for is already in the proposed values surface. |
| v1.5 | 2026-06-03 | Status-line + build refresh (PR #9682 review by @sttts): (1) flipped the header **Status** from "Draft v1 — no code authored yet" to "Implemented" now that the chart, templates, and `power_agent.py` are all in the tree on this PR — the stale draft marker no longer matched reality. (2) Added a container build: `components/power_agent/Dockerfile` (single-stage `python:3.11-slim-bookworm`, NVML injected at runtime by `runtimeClassName: nvidia`, deps `pynvml` / `kubernetes` / `prometheus-client`) plus a dedicated `power-agent` CI job in `pr.yaml` + `post-merge-ci.yml`, gated on a new `power_agent` changed-files filter — answers the reviewer's "where is it built?" on `values.yaml` `image.repository`. (3) Registry path corrected to `nvcr.io/nvidia/ai-dynamo/power-agent`. |

---

## 1. Context

### 1.1 Where the in-flight PR tree sits

The 6 stacked PRs from `pr9369-split-plan.md` are all open as of
2026-05-19. PR9682 (PR 1a — Power Agent) and PR9683 (PR 1b — Planner
Infrastructure) are out of Draft; the rest are still Draft per the
cascade protocol in §4.5 of the split plan:

| PR | Branch | Base | State | Deploy YAML it introduces |
|----|--------|------|-------|---------------------------|
| **#9682** | `pr1a/power-agent` | `main` (upstream tip `f20ff4e28a`) | Ready | `deploy/power_agent/{daemonset,rbac,dev-pod}.yaml` (293 LOC) |
| **#9683** | `pr1b/planner-infra` | `pr1a/power-agent` | Ready | `deploy/planner-pod-rbac-dev.yaml` (DEPRECATED transitional file); operator chart bump 1.2.0→1.2.1 with planner pod RBAC in `deploy/helm/charts/platform/components/operator/templates/planner.yaml` |
| #9684 | `pr2/power-budget` | `pr1b/...` | Draft | none |
| #9685 | `pr3/aic-optimizer` | `pr2/...` | Draft | none |
| #9686 | `pr4/testbed` | `pr3/...` | Draft | none |
| #9687 | `pr5/docs-devenv` | `pr4/testbed` | Draft | `deploy/planner/dev/{planner-dev-pod,qwen3-quickstart-dgd,llama-quickstart-dgd}.yaml`; `examples/deployments/powerplanner/disagg-{power-aware,conservative-cold-start}.yaml` |

This plan only touches **PR9682**. PR9683/9684/9685/9686/9687 are
explicitly unchanged (see §3.1 for the scope decision and §6.1 for the
PR-isolation rationale).

### 1.2 Reviewer signal that motivated this work

CodeRabbit filed three Major comments on PR9682's deploy YAMLs that all
reduce to "raw manifests can't carry the parameterization this chart
needs":

| File | Line | Severity | Quote |
|------|------|----------|-------|
| `deploy/power_agent/daemonset.yaml` | 35 | 🟠 Major | "The DaemonSet metadata.namespace is hardcoded to `default`, which causes mismatches with the RBAC/service account namespace." |
| `deploy/power_agent/daemonset.yaml` | 58 | 🟠 Major | "Use an immutable image reference instead of `:latest`. Mutable tags make rollouts non-reproducible." |
| `deploy/power_agent/rbac.yaml` | 50 | 🟠 Major | "`${POWER_AGENT_NAMESPACE}` is not a valid Kubernetes value … **Fix: set a concrete namespace … or template this manifest through Helm/Kustomize/envsubst before shipping it.**" |

All three collapse to a single root cause that Helm templating fixes
structurally; the reviewer's third comment names Helm directly as the
intended remedy.

### 1.3 Architectural precedent in-repo

`deploy/helm/charts/snapshot/` (Chart `snapshot` v1.2.0) is structurally
near-identical to the chart we need:

| Property | snapshot chart | proposed power-agent chart |
|----------|----------------|----------------------------|
| Standalone (not a subchart of platform) | ✅ | ✅ |
| Privileged DaemonSet on GPU nodes | ✅ (`privileged: true`, `hostPID: true`) | ✅ (`privileged: true`, `hostPID: true`) |
| `runtimeClassName: nvidia` for `libnvidia-ml.so` injection | ✅ | ✅ |
| Namespace-vs-cluster RBAC toggle | `rbac.namespaceRestricted` | `rbac.namespaceRestricted` |
| ServiceAccount + Role/ClusterRole + binding | ✅ | ✅ |
| ConfigMap with daemon settings | ✅ (config.yaml) | optional — see §4.2 |
| OpenShift SCC annotations | `openshift.enabled` | follow-up (§7.5) |

This plan inherits the snapshot chart's template patterns
verbatim where the structure permits.

### 1.4 End-to-end user flow

This section answers the "does this plan actually deliver `helm
something → ready to run` for a power-aware planner?" question. The
answer is **yes**, with the unavoidable caveat that the workload
itself (a DGD CR) is `kubectl apply`-ed, not `helm install`-ed —
matching the convention of every other DGD example in the repo.

#### 1.4.1 What a power-aware planner needs

The Planner is **not** a standalone Kubernetes deployment. It is a
`Planner:` service block inside a `DynamoGraphDeployment` CR (see
`examples/deployments/powerplanner/disagg-power-aware.yaml`
lines 59–92). The Dynamo Operator (running inside the platform Helm
chart) watches DGDs and spawns the planner Pod from that service
block. There is therefore no "planner deployment YAML" anywhere in
the repo — a fact that constrains the chart-design surface to the
Power Agent only.

The complete infrastructure inventory:

| Component | Kind | Source today | Helm-installable after this plan? |
|-----------|------|-------------|-----------------------------------|
| Dynamo Operator (creates planner pods from DGD specs) | Deployment | `deploy/helm/charts/platform/components/operator/` | ✅ already in **platform chart** |
| Planner pod RBAC (`Role`/`RoleBinding`/`ServiceAccount` with `pods: get/list/watch/patch`) | RBAC | `deploy/helm/charts/platform/components/operator/templates/planner.yaml` (chart 1.2.1+ from PR9683) | ✅ already in **platform chart** |
| Supporting platform deps (nats, etcd, grove, kai-scheduler, prometheus stack) | Various | platform chart's `dependencies:` block | ✅ already in **platform chart** |
| **Power Agent DaemonSet + RBAC** | DaemonSet + ClusterRole/Role + binding + SA | `deploy/power_agent/{daemonset,rbac}.yaml` (raw, PR9682) | ❌ today → ✅ via **new power-agent chart** from this plan |
| Power-aware DGD spec (the workload itself, including the `Planner:` block with `enable_power_awareness: true`) | DGD CR + optional `ConfigMap` for profiling data | `examples/deployments/powerplanner/disagg-power-aware.yaml` (user-customised) | ⚠️ remains `kubectl apply` — see §1.4.3 for why |

#### 1.4.2 Three-command flow after the plan ships

```bash
# 1. Install the Dynamo platform (existing chart; provides operator + planner RBAC + nats/etcd).
helm install dynamo-platform ./deploy/helm/charts/platform \
  --namespace dynamo-system --create-namespace

# 2. Install the Power Agent (NEW chart from this plan).
helm install power-agent ./deploy/helm/charts/power-agent \
  --namespace dynamo-system \
  --set image.tag=v1.1.0 \
  --set agent.safeDefaultWatts=500   # per-SKU; H200=500, H100=490, A100=280
  # Add `--set agent.actuator=dcgm` (and optionally agent.dcgm.{host,port,enforce})
  # on clusters where the GPU Operator runs with dcgm.enabled=true; otherwise
  # leave it at the chart default (nvml). See power-agent-dual-actuator.md.

# 3. Deploy the power-aware DGD workload (a copy of disagg-power-aware.yaml
#    with your own model, total_gpu_power_limit, and image tags).
kubectl apply -f my-power-aware-dgd.yaml -n my-workload-ns
```

Steps 1+2 are the "deployment" the reviewer feedback addresses: every
Kubernetes primitive the planner needs to exist before a power-aware
DGD can be reconciled is created by these two `helm install` commands.
Step 3 is the user's *workload*, which is true of every Dynamo
deployment regardless of power-awareness.

In environments where the Dynamo platform chart is already installed
cluster-wide (a common ops setup — the platform chart, NATS/etcd, Prometheus
stack, and operator/planner RBAC are usually installed once and shared),
the user-facing experience collapses further to **a single `helm install
power-agent ...` command** plus the workload DGD apply.

#### 1.4.3 Why the workload DGD stays `kubectl apply`-ed

By repo convention, **no DGD example is Helm-templated**. As of
2026-05-19 there are 11 DGD examples in the tree
(`examples/global_planner/global-planner-*.yaml`,
`examples/backends/{vllm,sglang,trtllm}/deploy/disagg_planner.yaml`,
`examples/deployments/powerplanner/disagg-*.yaml`,
`components/src/dynamo/planner/tests/manual/scaling/*.yaml`); all of
them ship as raw `kubectl apply`-ready YAML that users copy and edit
in place. DGDs are workload specifications — they encode the user's
model choice, per-engine GPU counts, image tags, and (for power-aware
deployments) the `total_gpu_power_limit` rack-budget number that
depends on the user's specific cluster topology. Parametrising those
inside a Helm chart would invent a new convention divergent from
every other example, for no clear payoff.

The example file `examples/deployments/powerplanner/disagg-power-aware.yaml`
serves the same role for power-aware planners that
`examples/backends/vllm/deploy/disagg_planner.yaml` serves for
power-unaware ones: a starting template users copy and modify.

#### 1.4.4 What this plan does NOT deliver (and the planned follow-ups)

To pre-empt scope questions:

| Not in this plan | Where it lives today | When it gets addressed |
|------------------|---------------------|------------------------|
| `deploy/planner/dev/planner-dev-pod.yaml` (developer iteration console) | PR9687, raw envsubst-style YAML | Future PR after PR9687 merges — see §7.2 |
| `deploy/planner/dev/{qwen3,llama}-quickstart-dgd.yaml` (dev quickstart DGDs) | PR9687, raw YAML | Stays raw — DGD-by-convention; see §1.4.3 |
| `examples/deployments/powerplanner/disagg-*.yaml` (example power-aware DGDs) | PR9687, raw YAML | Stays raw — DGD-by-convention; see §1.4.3 |
| `deploy/planner-pod-rbac-dev.yaml` (DEPRECATED operator-chart ≤1.2.0 workaround) | PR9683, marked DEPRECATED in-file | Auto-retires when target clusters upgrade past chart 1.2.0; no chart needed |
| The planner-dev recipe (manual `kubectl create sa planner-dev-sa` + `kubectl create rolebinding` for the dev console) | PR9687 documentation (an internal-dev-environment-setup doc not tracked upstream) | Captured by §7.2 follow-up (would collapse to `helm install planner-dev …`) |
| OpenShift SCC annotations for the Power Agent DaemonSet | not yet implemented | §7.5 follow-up |

---

## 2. Inventory: every deployment YAML across the 6 PRs

(Reproduced from the 2026-05-19 design session, §2, for self-containment
of this doc.)

| File | PR | Kind | Class | In chart? |
|------|----|------|-------|-----------|
| `deploy/power_agent/daemonset.yaml` | 9682 | DaemonSet | Production | **YES** → `templates/daemonset.yaml` |
| `deploy/power_agent/rbac.yaml` | 9682 | SA + ClusterRole + ClusterRoleBinding | Production | **YES** → `templates/{serviceaccount,role,rolebinding}.yaml` |
| `deploy/power_agent/dev-pod.yaml` | 9682 | Pod (mounts `power_agent.py` via ConfigMap; for iterating on the agent itself) | Dev | **YES** → `templates/dev-pod.yaml`, gated `dev.enabled=false` |
| `deploy/planner-pod-rbac-dev.yaml` | 9683 | Role + RoleBinding | Dev workaround (DEPRECATED in its own header — operator chart 1.2.1+ supersedes it) | NO — file header already self-documents its retirement |
| `deploy/helm/charts/platform/components/operator/templates/planner.yaml` | 9683 | Templated planner RBAC inside the existing operator subchart | Production | Already in a chart; no change |
| `deploy/planner/dev/planner-dev-pod.yaml` | 9687 | Pod (long-lived `sleep infinity`; for iterating on planner Python source) | Dev | NO — different lifecycle (per-developer console, not a deployable). Out of scope per §6.1 decision. |
| `deploy/planner/dev/qwen3-quickstart-dgd.yaml` | 9687 | DGD CR | Dev/example | NO — DGD CRs are user-authored, not Helm-templated |
| `deploy/planner/dev/llama-quickstart-dgd.yaml` | 9687 | DGD CR | Dev/example | NO — same |
| `examples/deployments/powerplanner/disagg-power-aware.yaml` | 9687 | ConfigMap + DGD CR | Example | NO — examples remain in `examples/`, not Helm-packaged |
| `examples/deployments/powerplanner/disagg-conservative-cold-start.yaml` | 9687 | DGD CR | Example | NO — same |

**Net set in scope:** the three files in PR9682 only.

---

## 3. Decisions

### 3.1 Scope = Power Agent only (§6.1)

**Decision: smaller scope.** The chart covers `deploy/power_agent/*.yaml`
exclusively. `deploy/planner/dev/*.yaml`, `deploy/planner-pod-rbac-dev.yaml`,
and `examples/deployments/powerplanner/*.yaml` stay as raw YAML in their
respective PRs (9683 and 9687).

#### Rationale

1. **PR boundary integrity.** The §4.5 cascade protocol in
   `pr9369-split-plan.md` explicitly minimises mid-flight cross-PR
   churn. Helm-ifying PR9687's planner-dev YAML in this PR would force
   synchronised edits to PR9683 (delete `planner-pod-rbac-dev.yaml`)
   and PR9687 (delete `deploy/planner/dev/*.yaml` + adjust the
   accompanying dev-environment doc), violating the single-cascade
   rebase rule.

2. **Architectural cleanliness.** The Power Agent is a production
   runtime DaemonSet; `planner-dev-pod.yaml` is a personal developer
   console. Packaging them together would imply a relationship that
   does not exist in code. Confirmed: `power_agent.py` imports nothing
   from `dynamo.planner`; the planner-dev pod runs no power-agent
   functionality.

3. **Right-time fixes.** The envsubst-placeholder issues in
   `planner-dev-pod.yaml` (`${NS}`, `${DGD}`, `${DYN_NS}`) are real
   and will likely surface the same reviewer feedback we are
   addressing here — but their natural home is a follow-up PR after
   PR9687 merges, not a power-agent feature PR. See §7.2.

#### What we explicitly defer

A separate follow-up `chore(planner-dev): package developer environment
into Helm chart` is recommended after PR9687 merges. It would
package `deploy/planner/dev/` into a second chart at
`deploy/helm/charts/planner-dev/`. Not in scope for this plan; flagged
in §7.2.

### 3.2 PR integration = Option α (§6.2)

**Decision: fold the chart into PR9682 directly** by adding a new commit
on top of the existing `pr1a/power-agent` branch. Force-push is **not**
required (additive commit only).

#### Rationale

1. **Same-PR causality.** CodeRabbit filed the templating ask on PR9682;
   the templating fix lands on PR9682. Diagnosis and remedy are tied
   together in one review cycle.

2. **Cascade-protocol compliance.** Option β (insert a new PR 1c between
   1a and 1b) would force rebases of `pr1b`, `pr2`, `pr3`, `pr4`, and
   `pr5` — exactly the multi-PR churn the §4.5 cascade protocol exists
   to prevent. Option γ (defer to a follow-up after PR9682 merges) leaves
   a window of known-bad raw YAML in `main` between PR9682 merging and
   the follow-up landing, and forces a separate review for the raw-YAML
   deletion.

3. **Manageable size growth.** PR9682 grows from 1,534 → ~1,830 LOC
   (+~300 net: +~450 chart additions, -~150 raw-YAML deletions). Review
   character stays "Low — net-new component, own tests" because the
   chart is structurally a transliteration of three raw files into the
   templated equivalents plus a values-surface declaration; there are
   no algorithmic changes.

#### What changes on PR9682

The branch gains **one new commit** on top of the existing
`ec210811ee feat(power-agent): per-node power-cap enforcement DaemonSet`:

```
feat(power-agent): Helm chart for the DaemonSet + RBAC

Adds deploy/helm/charts/power-agent/, modelled on the existing
snapshot chart. Parameterises namespace, image, safe-default-watts,
RBAC scope (cluster vs namespace), nodeSelector/tolerations/resources.
Supersedes the raw deploy/power_agent/{daemonset,rbac,dev-pod}.yaml
manifests, which this commit removes.

Addresses CodeRabbit review comments on PR #9682:
  - daemonset.yaml:35 (hardcoded namespace: default)
  - daemonset.yaml:58 (mutable :latest image tag)
  - rbac.yaml:50 (${POWER_AGENT_NAMESPACE} envsubst placeholder)
```

### 3.3 Dev-pod placement = Option A (§6.3)

**Decision: `templates/dev-pod.yaml` ships inside the chart**, gated by
`.Values.dev.enabled` (default `false`). When `dev.enabled=true`, the
template renders the Pod and skips the DaemonSet; when `false`, only
the DaemonSet renders. The two are mutually exclusive — a `helm` template-
time `{{- fail }}` enforces that the caller does not enable both
simultaneously.

#### Rationale

1. **Single chart, one install path.** A developer iterating on
   `power_agent.py` runs the same `helm install` command with a
   `--values dev-values.yaml` overlay rather than learning a second
   manifest-apply workflow.

2. **Parameterisation parity.** The dev pod inherits namespace, image,
   safe-default-watts, and resource overrides from the same values
   surface as the production DaemonSet. No duplication.

3. **Mutual exclusion is template-time, not run-time.** The chart fails
   to render if both `daemonset.enabled` and `dev.enabled` are true,
   so misconfiguration surfaces as a clear `helm template` error
   rather than two competing Pods at runtime.

### 3.4 Raw-YAML disposition = Delete in same PR (§6.4)

**Decision: delete `deploy/power_agent/{daemonset,rbac,dev-pod}.yaml`
in the same commit that adds the chart.**

#### Rationale

1. **Single source of truth.** Keeping the raw YAML alongside the chart
   creates two install paths and an unspecified preference. Reviewers
   would reasonably ask "which is canonical?"

2. **GitOps-repo blast radius is small.** The Power Agent has not yet
   shipped on `main` (PR9682 is still open). No production user has
   a GitOps reference to `deploy/power_agent/daemonset.yaml` yet. The
   "breaking change" risk that motivated the "keep one minor version
   with DEPRECATED headers" alternative does not apply at this stage.

3. **Documentation alignment.** `components/power_agent/README.md` and
   `examples/deployments/powerplanner/disagg-power-aware.yaml` both
   reference `kubectl apply -f deploy/power_agent/...`. Those
   references update in the same commit to the `helm install ...`
   invocation. (See §5.3 for the doc-touch surface.)

#### What we do NOT delete

- `components/power_agent/` (the Python source and unit tests) is the
  agent's home, untouched by this plan.
- `components/power_agent/README.md` updates its deployment recipe
  section to reference the chart but is not deleted.

### 3.5 Document persistence (§6.5)

**Decision: this file (`docs/design-docs/power-agent-helm-chart-plan.md`)
ships as a tracked design-doc** in PR9682 alongside the chart. Style
follows the existing `docs/design-docs/pr9369-split-plan.md`
convention (sibling design-doc style adopted across the
`docs/design-docs/power-agent-*.md` series).

#### Rationale

Mirrors how the PR-9369 split itself was documented. A reviewer
looking at PR9682 sees both *what* changed (the chart) and *why* the
chart shape is what it is (this doc) in the same diff. Future
discussions about whether to add a planner-dev chart can be grounded
against the decisions recorded here.

---

## 4. Chart design

### 4.1 Layout

```
deploy/helm/charts/power-agent/
├── Chart.yaml                       # name: power-agent, version: 1.1.0, appVersion: "1.1.0"
├── README.md                        # install + values table + uninstall + troubleshooting
├── values.yaml                      # see §4.2
├── .helmignore                      # copied verbatim from snapshot chart
├── templates/
│   ├── _helpers.tpl                 # power-agent.{name,fullname,labels,selectorLabels,serviceAccountName,validateImageTag,validateMutex,validateActuator,validateEnforce,effectiveNamespaceRestricted}
│   ├── NOTES.txt                    # post-install hints (verify DS rollout, check metrics endpoint, kubectl logs)
│   ├── serviceaccount.yaml          # gated on .Values.serviceAccount.create
│   ├── role.yaml                    # Role OR ClusterRole based on power-agent.effectiveNamespaceRestricted
│   ├── rolebinding.yaml             # RoleBinding OR ClusterRoleBinding (same toggle)
│   ├── daemonset.yaml               # gated on .Values.daemonset.enabled (default true)
│   └── dev-pod.yaml                 # gated on .Values.dev.enabled (default false); ConfigMap created externally
└── tests/                           # helm-unittest suite — required validation gate as of v1.1.0
    ├── validate_actuator_test.yaml  # asserts validateActuator rejects unknown actuator strings at template time
    └── validate_enforce_test.yaml   # asserts validateEnforce rejects non-allowlisted booleans (e.g. `treu`)
```

13 files total (7 templates + 2 helm-unittests + 4 root files). ~1,430 LOC
across chart + tests for v1.1.0 (the v1.0.0 baseline was ~880 LOC; PR9790
adds the DCGM actuator wiring on `daemonset.yaml` / `dev-pod.yaml` /
`_helpers.tpl` plus the two helm-unittest files and the corresponding
`values.yaml` / `README.md` expansion). No PVC, no seccomp, no config
ConfigMap — all 8 CLI knobs the agent's `main()` exposes
(`--safe-default-watts`, `--node-name`, `--namespace`, `--prometheus-port`,
`--actuator`, `--dcgm-host`, `--dcgm-port`, `--dcgm-enforce`; verified
against `power_agent.py:706-804`) pass cleanly via `command:` and `env:`.

### 4.2 Values surface (proposed)

```yaml
# SPDX-FileCopyrightText: Copyright (c) 2025-2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0

# Power Agent — per-node NVML power-cap enforcement DaemonSet.
# See deploy/helm/charts/power-agent/README.md for usage.

image:
  repository: nvcr.io/nvidia/ai-dynamo/power-agent
  # REQUIRED. Pin to a release tag or sha256 digest. No default to avoid the
  # `:latest` reproducibility footgun CodeRabbit flagged on PR #9682.
  tag: ""
  pullPolicy: IfNotPresent

imagePullSecrets: []
# Example for NGC:
#   - name: ngc-secret

agent:
  # Per-SKU safety floor. The agent falls back to this when:
  #   - A multi-pod-per-GPU conflict cannot agree on a single cap.
  #   - A pod is missing the dynamo.nvidia.com/gpu-power-limit annotation
  #     but is running on a GPU the agent previously managed.
  # Recommended: ~70% of the SKU's TDP.
  #   H200 SXM → 500    H100 SXM → 490    A100 SXM (80GB) → 280
  safeDefaultWatts: 500
  # NOTE: the agent's reconcile interval is currently a hardcoded module
  # constant (RECONCILE_INTERVAL_S = 15 in power_agent.py). It is NOT
  # exposed as a CLI flag, so plumbing it through values.yaml would create
  # a dead knob. If a future power_agent.py revision adds a
  # --reconcile-interval flag, add the matching key here at that time.
  prometheusPort: 9100

  # Power-cap actuator (chart v1.1.0+). Mutually exclusive — exactly one
  # path is active per chart install. See
  # docs/design-docs/power-agent-dual-actuator.md for the full rationale.
  #   nvml (default) — Power Agent calls nvmlDeviceSetPowerManagementLimit
  #                    directly. Use on clusters where the GPU Operator
  #                    runs with dcgm.enabled=false (the upstream default).
  #                    Byte-equivalent to PR9682's NVML-only chart.
  #   dcgm — Power Agent connects standalone-TCP to the operator-managed
  #          nvidia-dcgm hostengine and routes cap writes through
  #          dcgmConfigSet. Use on clusters where the operator set
  #          dcgm.enabled=true (i.e. nvidia-dcgm pod is already running).
  # Validated at template time by power-agent.validateActuator (§4.4).
  actuator: nvml

  # DCGM connection settings. Consulted only when actuator: dcgm.
  dcgm:
    # Defaults match the upstream GPU Operator's nvidia-dcgm Service:
    #   metadata.name = "nvidia-dcgm"  metadata.namespace = "gpu-operator"
    host: nvidia-dcgm.gpu-operator.svc.cluster.local
    port: 5555
    # When true, call dcgmConfigEnforce after every dcgmConfigSet so the
    # hostengine re-applies the cap automatically after a GPU reset or
    # reinit (DcgmConfigManager.h:113-117). This is the ONLY automatic
    # re-enforcement DCGM provides — the cap does NOT survive Power
    # Agent restart on either setting (SIGTERM restores default), and
    # external `nvidia-smi -pl` clobbering is repaired only on the
    # agent's next 15-s reconcile, same as NVML. Default false matches
    # NVML's set-and-forget semantics; flip true on sites that see
    # frequent GPU resets. Validated at template time by
    # power-agent.validateEnforce (§4.4), which mirrors
    # power_agent._parse_bool_strict's allowlist so `--set
    # agent.dcgm.enforce=treu` fails at helm install, not at
    # kubectl describe pod.
    enforce: false

# NVIDIA container toolkit needs both runtimeClassName: nvidia AND
# NVIDIA_VISIBLE_DEVICES=all to inject libnvidia-ml.so AND expose every GPU
# WITHOUT consuming a nvidia.com/gpu resource claim. Same pattern DCGM
# exporter uses.
runtimeClassName: nvidia
env:
  NVIDIA_VISIBLE_DEVICES: "all"
  NVIDIA_DRIVER_CAPABILITIES: "compute,utility"

nodeSelector:
  nvidia.com/gpu.present: "true"

tolerations:
  - key: nvidia.com/gpu
    operator: Exists
    effect: NoSchedule

resources:
  requests:
    cpu: "50m"
    memory: "64Mi"
  limits:
    cpu: "200m"
    memory: "128Mi"

# Persisted UUID-gated cold-start state (managed_gpus.json).
state:
  hostPath: /var/lib/dynamo-power-agent

serviceAccount:
  create: true
  name: ""            # auto-generated from fullname if empty
  annotations: {}

rbac:
  create: true
  # true  → Role + RoleBinding; agent only sees pods in {{ .Release.Namespace }}.
  # false → ClusterRole + ClusterRoleBinding; agent sees all pods on its node.
  # Default matches today's raw-YAML behaviour (cluster-scoped).
  namespaceRestricted: false

# Production DaemonSet mode. Mutually exclusive with dev.enabled.
daemonset:
  enabled: true

  # Conservative default by design: when a Power Agent restarts, the GPUs
  # on its node have no NVML cap enforcement until it comes back. If the
  # planner just emitted new annotations expecting them to apply, that
  # propagation stalls. `maxUnavailable: 1` ensures only one node's worth
  # of GPUs ever loses enforcement at a time.
  #
  # Override for large fleets: on clusters with hundreds of GPU nodes,
  # a 1-at-a-time rollout (~30s/pod × N nodes) gets slow. Operators can
  # opt into faster rollouts with --set daemonset.updateStrategy.rollingUpdate.maxUnavailable=10%
  # (or any percentage / integer). The trade-off is more concurrent
  # enforcement gaps during a rollout; safe when the planner's reconcile
  # interval (15s) is much shorter than the rollout duration anyway.
  updateStrategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1

  podLabels: {}
  podAnnotations: {}
  affinity: {}

# In-cluster dev-iteration mode. Renders a single Pod (not a DaemonSet)
# that mounts both power_agent.py AND actuator.py from a ConfigMap.
# The caller is responsible for creating the ConfigMap separately
# BEFORE `helm install`; both files are required because power_agent.py
# does `from actuator import ...` at module load (chart v1.1.0+):
#
#   kubectl create configmap dynamo-power-agent-script \
#     --from-file=power_agent.py=components/power_agent/power_agent.py \
#     --from-file=actuator.py=components/power_agent/actuator.py \
#     -n $NAMESPACE
#
# A single-file ConfigMap will start the pod and ImportError
# immediately (`ModuleNotFoundError: No module named 'actuator'`).
# Mutually exclusive with daemonset.enabled (chart fails to render if both
# are true).
dev:
  enabled: false
  # Required when enabled=true. Pin to the GPU node hosting the workload pod
  # being annotated.
  nodeName: ""
  scriptConfigMap: dynamo-power-agent-script
  # The dev pod uses vllm-runtime (already cached on every GPU node by
  # the quickstart DGDs) which ships with pynvml; the agent pip-installs
  # kubernetes + prometheus-client at container start.
  #
  # NVML actuator only. For DCGM dev mode (agent.actuator=dcgm),
  # override repository + tag to the production power-agent image,
  # which vendors the required pydcgm bindings and libdcgm.so:
  #   --set dev.image.repository=nvcr.io/nvidia/dynamo/power-agent
  #   --set dev.image.tag=v1.1.0
  # Script-iteration via the ConfigMap mount still works against the
  # power-agent image (the /scripts mount overrides /app at runtime).
  image:
    repository: nvcr.io/nvidia/ai-dynamo/vllm-runtime
    tag: "1.0.1"
    pullPolicy: IfNotPresent
  resources:
    requests: { cpu: "50m", memory: "128Mi" }
    limits:   { cpu: "500m", memory: "512Mi" }
  # Set to true ONLY if you genuinely need cluster-wide pod-listing RBAC
  # while iterating on power_agent.py (e.g., testing cross-namespace
  # multi-pod conflict resolution). Default: false — dev mode forces
  # namespace-scoped RBAC for principle of least privilege.
  namespaceRestrictedOverride: false
```

**Why no ConfigMap for chart-rendered config in v1.x.** The agent's CLI
surface — 4 flags in v1.0.0, 8 flags in v1.1.0 after PR9790 added
`--actuator` / `--dcgm-host` / `--dcgm-port` / `--dcgm-enforce` (verified
against `power_agent.py:706-804`) — all pass cleanly as command-line
flags or container env; adding a ConfigMap layer is still premature. If
the settings surface grows substantially later (e.g., a per-SKU caps
table, or a future `--reconcile-interval` flag), we can introduce the
ConfigMap then. Same pattern as the snapshot chart, which only
introduced its ConfigMap when CRIU's option surface justified it.

### 4.3 Structural fixes the chart delivers

Mapping each CodeRabbit-flagged issue to the chart construct that resolves it:

| CodeRabbit comment (raw YAML) | Chart construct | Resolution |
|------------------------------|-----------------|------------|
| `daemonset.yaml:35` namespace hardcoded to `default` | `metadata: { namespace: {{ .Release.Namespace }} }` in `templates/daemonset.yaml` and `templates/dev-pod.yaml` | Namespace flows from `--namespace` flag at install time; no chart edit needed to deploy in a different namespace |
| `daemonset.yaml:58` `:latest` mutable image tag | `tag: ""` in `values.yaml` (no default) + `{{- if not .Values.image.tag }}{{- fail "image.tag is required (pin to a release tag or digest)" }}{{- end }}` in `_helpers.tpl` (rendered as the `power-agent.validateImageTag` helper) | Chart refuses to install without an explicit tag; caller pins via `--set image.tag=v1.1.0` (current `appVersion`) or `--set image.tag=sha256:abc...` |
| `rbac.yaml:50` `${POWER_AGENT_NAMESPACE}` envsubst placeholder | `namespace: {{ .Release.Namespace }}` in `templates/rolebinding.yaml` | No envsubst step; Helm resolves natively |

The chart also resolves an issue CodeRabbit *didn't* file but is worth
addressing: today's raw `rbac.yaml` ships `ClusterRole`+`ClusterRoleBinding`
unconditionally — fine in single-tenant clusters but excessive in
multi-tenant ones. The `rbac.namespaceRestricted` toggle (mirroring
snapshot's pattern) gives both options.

### 4.4 Template-time invariants

Five `_helpers.tpl` constructs that prevent foot-guns at install time
rather than runtime (three in v1.0.0; `validateActuator` and
`validateEnforce` added in v1.1.0 alongside the DCGM actuator):

```gotemplate
{{- define "power-agent.validateImageTag" -}}
{{- if not .Values.image.tag -}}
{{- fail "image.tag is required (pin to a release tag or sha256:digest; :latest is not supported)" -}}
{{- end -}}
{{- end -}}

{{- define "power-agent.validateMutex" -}}
{{- if and .Values.daemonset.enabled .Values.dev.enabled -}}
{{- fail "daemonset.enabled and dev.enabled are mutually exclusive. Set exactly one." -}}
{{- end -}}
{{- if and .Values.dev.enabled (not .Values.dev.nodeName) -}}
{{- fail "dev.enabled requires dev.nodeName (the GPU node to pin the dev pod to)." -}}
{{- end -}}
{{- end -}}

{{- /*
  validateActuator (v1.1.0) — surfaces actuator typos at `helm install` /
  `helm template` time instead of letting the pod CrashLoopBackOff with
  argparse's terse "invalid choice" exit. The agent's --actuator CLI
  flag has the same choices=["nvml","dcgm"] guard
  (power_agent.py:730-744); the template check just gets there earlier
  and with a clearer message.
*/ -}}
{{- define "power-agent.validateActuator" -}}
{{- $a := .Values.agent.actuator | default "" -}}
{{- if not (or (eq $a "nvml") (eq $a "dcgm")) -}}
{{- fail (printf "agent.actuator must be 'nvml' or 'dcgm'; got %q" $a) -}}
{{- end -}}
{{- end -}}

{{- /*
  validateEnforce (v1.1.0) — boolean typo guard for agent.dcgm.enforce.
  The allowlist mirrors power_agent._parse_bool_strict
  (power_agent.py:766-784) so the chart and CLI agree on what's
  accepted. Case-insensitive because Helm preserves user casing when
  stringifying YAML values (`enforce: True` → "True"; `--set
  …=TRUE` → "TRUE"). Only validates when actuator=dcgm — a stray
  value when actuator=nvml is harmless (the chart's daemonset
  template skips the --dcgm-enforce flag entirely in NVML mode).
*/ -}}
{{- define "power-agent.validateEnforce" -}}
{{- if eq (.Values.agent.actuator | default "") "dcgm" -}}
{{- $e := .Values.agent.dcgm.enforce | toString | lower | trim -}}
{{- $allowed := list "true" "1" "yes" "on" "false" "0" "no" "off" -}}
{{- if not (has $e $allowed) -}}
{{- fail (printf "agent.dcgm.enforce must be one of %v (case-insensitive); got %q" $allowed .Values.agent.dcgm.enforce) -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{- /*
  Effective RBAC scope. Dev mode pins to one node and one namespace, so
  cluster-wide pod-listing RBAC would be excessive. The agent's
  --namespace CLI flag (power_agent.py:541-546) already constrains its
  pod queries to a single namespace when set, so namespace-scoped RBAC
  is sufficient. The dev-pod template passes --namespace=$(POD_NAMESPACE)
  via the downward API; this helper makes the RBAC default match.

  An operator can still opt back into cluster-wide RBAC in dev mode by
  explicitly setting --set rbac.namespaceRestricted=false AND
  --set dev.namespaceRestrictedOverride=true. Without that second flag,
  the dev-mode default wins.
*/ -}}
{{- define "power-agent.effectiveNamespaceRestricted" -}}
{{- if and .Values.dev.enabled (not .Values.dev.namespaceRestrictedOverride) -}}
true
{{- else -}}
{{- .Values.rbac.namespaceRestricted | toString -}}
{{- end -}}
{{- end -}}
```

All four `validate*` helpers are called from the top of both
`templates/daemonset.yaml` and `templates/dev-pod.yaml` (each template
opens with `{{- include "power-agent.validateImageTag" . -}}` /
`validateMutex` / `validateActuator` / `validateEnforce`) so the
failures surface at `helm install` / `helm template` time regardless of
which mode is active. `effectiveNamespaceRestricted` is referenced from
`templates/role.yaml` and `templates/rolebinding.yaml` in place of
`.Values.rbac.namespaceRestricted` so the dev-mode default takes effect
for both the Role/ClusterRole kind selection and the Binding kind.

The two helm-unittest files in `tests/` (added in v1.1.0) lock both
new helpers' contracts. Coverage as actually shipped — every case
below has a matching `it:` block in the test file:

- `tests/validate_actuator_test.yaml` (10 tests). Happy paths: default
  actuator (renders `--actuator=nvml`), explicit `actuator: nvml`,
  `actuator: dcgm` with the chart-default `dcgm.host` / `dcgm.port` /
  `dcgm.enforce`, `actuator: dcgm` with all three DCGM knobs
  overridden, and a `notContains` assertion that `actuator: nvml`
  emits zero `--dcgm-*` flags. Negative paths: `actuator: NVML`
  (uppercase typo), `actuator: DCGM` (uppercase typo), `actuator: auto`
  (auto-detect was rejected in v1.2 of the dual-actuator design),
  `actuator: typo` (unknown literal), and `actuator: ""` (empty
  string).
- `tests/validate_enforce_test.yaml` (14 tests). Happy paths: every
  spelling in `_parse_bool_strict`'s allowlist —
  `true` / `false` / `"1"` / `"0"` / `"yes"` / `"no"` / `"on"` /
  `"off"` — plus `"TRUE"` to confirm the case-insensitive lowercasing
  in the helper. Negative paths: `"treu"` (the canonical typo from
  review comment #7), `"enabled"` (sounds-right typo), `"2"`
  (out-of-allowlist number), and `""` (empty string). One
  cross-validator test confirms that `enforce: "treu"` is silently
  accepted when `actuator: nvml` because the chart never renders the
  `--dcgm-enforce` flag on the NVML path.

Total: **24 unittest cases** (10 actuator + 14 enforce). All wired
into the §5.4 validation gates as a required
`helm unittest deploy/helm/charts/power-agent` step.

`effectiveNamespaceRestricted` is supported by the
`dev.namespaceRestrictedOverride` opt-out key already listed in §4.2's
dev block (default `false`; set `true` to opt back into cluster-wide
pod-listing RBAC while iterating in dev mode).

---

## 5. PR mechanics

### 5.1 Commit plan on `pr1a/power-agent`

One additional commit on top of the existing branch tip
`ec210811ee feat(power-agent): per-node power-cap enforcement DaemonSet`:

```
feat(power-agent): Helm chart for the DaemonSet + RBAC

Adds deploy/helm/charts/power-agent/, a standalone chart modelled on
deploy/helm/charts/snapshot/. Parameterises:
  - namespace (Release.Namespace, no more hardcoded default)
  - image (no default tag; required at install time)
  - safe-default-watts, reconcile interval, Prometheus port
  - nodeSelector, tolerations, resources
  - RBAC scope (cluster-wide vs Release.Namespace)
  - production DS mode vs in-cluster dev-pod mode (mutually exclusive)

Supersedes the raw deploy/power_agent/{daemonset,rbac,dev-pod}.yaml
manifests, which this commit removes.

Updates components/power_agent/README.md and the planner power-aware
example to reference `helm install` instead of `kubectl apply -f`.

Addresses CodeRabbit review comments on PR #9682:
  - daemonset.yaml:35 (hardcoded namespace: default)
  - daemonset.yaml:58 (mutable :latest image tag)
  - rbac.yaml:50  (${POWER_AGENT_NAMESPACE} envsubst placeholder)

Design rationale: docs/design-docs/power-agent-helm-chart-plan.md
```

No `--force-push`. No history rewrite. The original
`ec210811ee` stays as-is; reviewers who already started reviewing it
see only the new chart commit on top.

### 5.2 Files added / removed / modified

**Added (chart v1.0.0 in PR9682; refreshed to chart v1.1.0 in PR9790):**

```
docs/design-docs/power-agent-helm-chart-plan.md             1000+   (this doc)
deploy/helm/charts/power-agent/Chart.yaml                     40
deploy/helm/charts/power-agent/README.md                     255
deploy/helm/charts/power-agent/values.yaml                   195
deploy/helm/charts/power-agent/.helmignore                    26
deploy/helm/charts/power-agent/templates/_helpers.tpl        144
deploy/helm/charts/power-agent/templates/NOTES.txt            48
deploy/helm/charts/power-agent/templates/serviceaccount.yaml  19
deploy/helm/charts/power-agent/templates/role.yaml            36
deploy/helm/charts/power-agent/templates/rolebinding.yaml     37
deploy/helm/charts/power-agent/templates/daemonset.yaml      117
deploy/helm/charts/power-agent/templates/dev-pod.yaml        122
deploy/helm/charts/power-agent/tests/validate_actuator_test.yaml  120   (v1.1.0)
deploy/helm/charts/power-agent/tests/validate_enforce_test.yaml   128   (v1.1.0)
```

Chart-only total: **1,287 LOC across 13 files** (7 templates + 2 helm-unittests + 4 root files).

**Removed (-293 LOC, 3 files; PR9682 only):**

```
deploy/power_agent/daemonset.yaml    -115
deploy/power_agent/rbac.yaml          -50
deploy/power_agent/dev-pod.yaml      -128
```

**Modified (PR9682):**

```
components/power_agent/README.md       (replace kubectl-apply recipe with helm-install)
.github/filters.yaml                   (add deploy/helm/charts/power-agent/** to planner-group filter)
```

`examples/deployments/powerplanner/*.yaml` lives in PR9687 and is not
touched by PR9682 or PR9790 — those header-comment refreshes will
happen when PR9687 rebases. The earlier draft of this section assumed
PR9682 would carry them; the rebase cascade absorbed them instead.
(Last item: the planner-group filter already covers `deploy/power_agent/**`
per PR9682. Adding the chart path keeps chart-only changes triggering
the same CI job set.)

**Net delta as actually landed:** PR9682 (v1.0.0) was ~+1,025 chart LOC
net of raw-YAML deletion; PR9790 (v1.1.0) layered the DCGM actuator on
top (+actuator.py + helm-unittests + values/_helpers/daemonset/dev-pod
expansion + dual-actuator design doc). See `git log --stat origin/main..HEAD --
deploy/helm/charts/power-agent/ components/power_agent/` for the
authoritative numbers; the table above reflects current-on-disk LOC,
not the original v1.0.0 size estimates.

### 5.3 Doc-touch ripple

The deletion of raw `deploy/power_agent/*.yaml` invalidates a handful
of references elsewhere in PR9682's tree. All updates land in the same
commit:

| File | Current text | Updated text |
|------|--------------|--------------|
| `components/power_agent/README.md` §Deployment | `kubectl apply -f deploy/power_agent/rbac.yaml` then `daemonset.yaml` | `helm install power-agent ./deploy/helm/charts/power-agent --namespace <ns> --set image.tag=<release>` |
| `examples/deployments/powerplanner/disagg-power-aware.yaml` header | "Deploy the Power Agent DaemonSet: `kubectl apply -f deploy/power_agent/rbac.yaml` …" | "Deploy the Power Agent: `helm install power-agent ./deploy/helm/charts/power-agent …`" |
| `examples/deployments/powerplanner/disagg-conservative-cold-start.yaml` header | (same as above) | (same as above) |
| `.github/filters.yaml` planner-group | covers `deploy/power_agent/**` | also covers `deploy/helm/charts/power-agent/**` |

Note: `examples/deployments/powerplanner/*.yaml` and the planner-pod-rbac-dev
file live in **other** PRs (9687 and 9683 respectively) — those references
will be reconciled when those PRs rebase onto PR9682's updated tip in the
normal cascade flow.

#### 5.3.1 Chart README content requirements (incorporating v1.2 review feedback)

The chart's own `deploy/helm/charts/power-agent/README.md` must include
the following sections explicitly. These are not optional polish — each
addresses a specific point in the v1.2 review-feedback cycle:

1. **Prerequisites** — note that the chart uses the canonical NVIDIA
   monitoring-agent pattern (privileged container + `runtimeClassName: nvidia`
   + `NVIDIA_VISIBLE_DEVICES=all`), so the DaemonSet does **not** consume
   an `nvidia.com/gpu` resource claim. Same pattern as DCGM Exporter and
   the snapshot chart. The privileged container also bypasses the
   `accept-nvidia-visible-devices-envvar-when-unprivileged=false` runtime
   config edge case (addresses Consideration 3).

2. **Production install** — minimal `helm install` recipe with explicit
   `--set image.tag=<pinned>` (addresses CodeRabbit comment on `:latest`).

3. **Dev install** — split into two ordered steps:

   > **Step 1 (REQUIRED before `helm install`):** Create the script ConfigMap.
   > As of chart v1.1.0 the ConfigMap MUST carry BOTH `power_agent.py`
   > AND `actuator.py` — `power_agent.py:26` does
   > `from actuator import Actuator, DcgmActuator, NvmlActuator` at
   > module load, so a v1.0.0-style single-file ConfigMap will start
   > the pod and then immediately ImportError
   > (`ModuleNotFoundError: No module named 'actuator'`).
   >
   > ```bash
   > kubectl create configmap dynamo-power-agent-script \
   >   --from-file=power_agent.py=components/power_agent/power_agent.py \
   >   --from-file=actuator.py=components/power_agent/actuator.py \
   >   -n $NAMESPACE
   > ```
   >
   > Without any ConfigMap the dev pod will stay `Pending` with a
   > `MountVolume.SetUp failed for volume "script"` event. With a
   > single-file ConfigMap the pod will start and ImportError
   > immediately — the `tests/validate_actuator_test.yaml` helm-unittest
   > pins the `actuator.py` mount as a chart contract for v1.1.0+.
   > The chart does not create the ConfigMap automatically because the
   > developer iteration loop is
   > `kubectl create cm --from-file=... --from-file=... --dry-run=client
   > -o yaml | kubectl apply -f -` (faster than `helm upgrade --set-file`).
   >
   > **Step 2:** Install the chart in dev mode (pinned to one GPU node):
   >
   > ```bash
   > helm install power-agent ./deploy/helm/charts/power-agent \
   >   --namespace $NAMESPACE \
   >   --set image.tag=v1.1.0 \
   >   --set daemonset.enabled=false \
   >   --set dev.enabled=true \
   >   --set dev.nodeName=<gpu-node-name>
   > ```
   >
   > Dev mode automatically forces namespace-scoped RBAC (Role +
   > RoleBinding instead of ClusterRole + ClusterRoleBinding) because
   > the pod is pinned to one node and uses `--namespace=$POD_NAMESPACE`
   > (addresses Consideration 2). Override with
   > `--set dev.namespaceRestrictedOverride=true` only if you genuinely
   > need cluster-wide pod visibility while iterating.
   >
   > For **DCGM dev mode** (`--set agent.actuator=dcgm`), additionally
   > override `dev.image` because the default `vllm-runtime:1.0.1`
   > ships `pynvml` only and lacks `pydcgm` + `libdcgm.so`:
   >
   > ```bash
   >   --set dev.image.repository=nvcr.io/nvidia/dynamo/power-agent \
   >   --set dev.image.tag=v1.1.0
   > ```
   >
   > Script iteration via the ConfigMap mount still works against the
   > production power-agent image (the `/scripts` mount overrides
   > `/app` at runtime; the dev-pod command invokes
   > `/scripts/power_agent.py` explicitly).

4. **Values table** — generated/maintained list of all keys with
   defaults and short descriptions, mirroring `deploy/helm/charts/snapshot/README.md`'s
   "Important values" section.

5. **Rollout strategy on large fleets** — one-sentence callout pointing
   at the `daemonset.updateStrategy.rollingUpdate.maxUnavailable` value
   with the trade-off explained (addresses Consideration 1).

6. **Uninstall** — `helm uninstall power-agent -n $NAMESPACE`. The chart
   does **not** clean up `/var/lib/dynamo-power-agent/managed_gpus.json`
   on host nodes — call out that this hostPath state persists until
   manually cleaned (`rm -f /var/lib/dynamo-power-agent/managed_gpus.json`
   on each node) or until the next agent install reads it for cold-start
   orphan recovery.

NOTES.txt (post-install) repeats the dev-mode ConfigMap recipe even
though it's already in the README, so a developer who skipped the docs
gets the recipe at install time too.

### 5.4 Validation gates the commit must pass

Before the commit gets pushed to `pr1a/power-agent` (or to
`pr1b/power-agent-dcgm-actuator` for chart v1.1.0 changes):

1. **`helm lint deploy/helm/charts/power-agent`** — zero errors.
2. **`helm template`** with four representative value overlays
   (the fourth was added in v1.1.0 for the DCGM actuator path). Every
   positive command MUST include `--set image.tag=v1.1.0` — without
   it the chart fails fast via `validateImageTag` before reaching the
   overlay under test, which is the intended behaviour but it means
   a "default install" command is `--set image.tag=v1.1.0` (the
   negative case of an absent tag is exercised separately in gate 3):

   ```bash
   # 2a. default (production DS, cluster RBAC, NVML actuator)
   helm template power-agent ./deploy/helm/charts/power-agent \
     --namespace dynamo-system --set image.tag=v1.1.0

   # 2b. namespace-scoped RBAC
   helm template power-agent ./deploy/helm/charts/power-agent \
     --namespace dynamo-system --set image.tag=v1.1.0 \
     --set rbac.namespaceRestricted=true

   # 2c. dev mode (Pod, not DaemonSet; pinned to one GPU node)
   helm template power-agent ./deploy/helm/charts/power-agent \
     --namespace dynamo-system --set image.tag=v1.1.0 \
     --set daemonset.enabled=false \
     --set dev.enabled=true --set dev.nodeName=<gpu-node>

   # 2d. DCGM actuator (re-run with --set agent.dcgm.enforce=true too)
   helm template power-agent ./deploy/helm/charts/power-agent \
     --namespace dynamo-system --set image.tag=v1.1.0 \
     --set agent.actuator=dcgm
   ```

   Each produces a valid set of manifests (`kubectl --dry-run=client apply -f -` passes),
   and the DCGM overlay must render `--dcgm-host` / `--dcgm-port` /
   `--dcgm-enforce` onto the pod command line.
3. **`helm template`** with no image tag set (and otherwise default
   values) — must fail fast at template time with the message from
   §4.4's `validateImageTag` helper. This is the only gate that
   intentionally omits `--set image.tag=...`.
4. **`helm template`** with `--set image.tag=v1.1.0 --set daemonset.enabled=true --set dev.enabled=true` — must fail fast at template time with the `validateMutex` message.
5. **`helm template`** with `--set image.tag=v1.1.0 --set agent.actuator=invalid` — must fail fast at template time with the `validateActuator` message (v1.1.0+).
6. **`helm template`** with `--set image.tag=v1.1.0 --set agent.actuator=dcgm --set agent.dcgm.enforce=treu` — must fail fast with the `validateEnforce` message (v1.1.0+; mirrors `_parse_bool_strict`).
7. **`helm unittest deploy/helm/charts/power-agent`** — required as of v1.1.0. The `tests/validate_actuator_test.yaml` and `tests/validate_enforce_test.yaml` files in the chart exercise every positive/negative case for the two new template-time validators (see §4.4 closing paragraph). Snapshot of expected output: `24 passed, 0 failed` for the v1.1.0 chart.
8. **Pre-commit hooks pass on the chart files** — the same 8 hooks the v3.3 §7 checklist enforces (isort/black/flake8/codespell/end-of-file-fixer/trailing-whitespace/check-yaml/ruff). `check-yaml` is the relevant one for chart files; the rest don't touch YAML.
9. **No CI regression** — planner-group jobs trigger and pass (the chart sits inside the planner-group path filter; same job set that already covers `deploy/power_agent/**`).

`helm-unittest` was deferred from chart v1.0.0 ("optional, v1.1 follow-up"
per the original §6 risk #5 / §7.1) and landed alongside the dual-actuator
work in PR9790. It is now a **required** validation gate for any chart
change, not an optional polish item — the two `validate_*_test.yaml` files
encode chart contracts the dev-mode iteration loop depends on (e.g. the
`actuator.py` mount in `dev-pod.yaml`).

---

## 6. Risk register

| # | Risk | Likelihood | Mitigation |
|---|------|------------|------------|
| 1 | Chart name collision with another `power-agent` release in some user's cluster | Low (chart is new, no upstream precedent) | Chart name `power-agent` is unique among `deploy/helm/charts/` and `helm search hub` results; no action needed |
| 2 | OpenShift / SCC compatibility — power-agent needs the same `openshift.io/required-scc: privileged` treatment as snapshot agent | Medium | Out of scope for v1 (snapshot took it as a v1.1+ addition too). Capture as follow-up issue; for v1 the chart works on vanilla K8s with no SCC. See §7.5. |
| 3 | Image-tag requirement breaks demo flows that previously used `:latest` | Low (no production users yet — PR9682 is open) | README documents the requirement prominently; demo recipe in `examples/deployments/powerplanner/` will reference a pinned tag |
| 4 | Reviewers ask "why is this in PR9682 and not a separate PR?" | Medium | Pre-empted by §3.2 rationale + §1.2 CodeRabbit linkage in the PR description |
| 5 | `helm-unittest` absence flagged in review (other charts use it) | ✅ **Closed in v1.1.0 (PR9790)** — `tests/validate_actuator_test.yaml` + `tests/validate_enforce_test.yaml` ship with the chart; `helm unittest deploy/helm/charts/power-agent` is now a required §5.4 validation gate. | n/a — historical row kept for the audit trail. |
| 6 | Chart `appVersion` drift from `power_agent.py` over time | Medium (long-term) | Current state: chart `version` and `appVersion` both pin to `"1.1.0"` (bumped in PR9790 alongside the DCGM actuator wiring; v1.0.0 was the PR9682 NVML-only baseline). Document in the chart README that subsequent agent revs bump both in lock-step. If the appVersion gets out of sync in a future PR, that's a release-process bug, not a chart-design bug. The chart-README install examples (and §1.4.2 / §5.3.1 here) MUST be kept current with `appVersion` because earlier images reject newer CLI flags (e.g. v1.0.0 image + v1.1.0 chart → argparse rejects `--actuator`). |
| 7 | `dev.scriptConfigMap` is named externally; users may forget to create it | Medium (only affects dev mode) | **v1.2 update:** the ConfigMap-creation recipe is promoted from a post-install NOTES.txt hint to a **prerequisite step ordered before `helm install`** in the chart README (see §5.3.1 step 3). NOTES.txt repeats the recipe post-install for safety. Chart `helm install` itself does not error if the CM is missing — failure mode is a Pending Pod with a clear `MountVolume.SetUp failed for volume "script"` event, which is debuggable. Auto-creation via Helm pre-install hook was considered and rejected (extra RBAC + Job machinery for a dev-only feature). |
| 8 | Cascade impact: PR9683 base auto-updates when PR9682's tip moves | Low (PR9683 is `pr1b/planner-infra` based on `pr1a/power-agent`; new commit on `pr1a` is a non-conflicting addition to a disjoint file tree) | Confirmed by inspection: PR9683's diff touches `deploy/helm/charts/platform/...`, `deploy/planner-pod-rbac-dev.yaml`, and planner Python files only. None of these collide with `deploy/helm/charts/power-agent/`. PR9683 rebases trivially. |
| 9 | Dead-knob risk: a `values.yaml` key whose name suggests it does something but is never wired to a template or CLI flag (silently no-ops; user thinks they configured it). | Medium (one such case found in v1.1: `agent.reconcileIntervalSeconds`, which had no `power_agent.py` CLI wiring — dropped in v1.2 per the v1.2 revision note) | Apply the **dead-knob audit principle** when authoring: every key in `values.yaml` must trace to either (a) a `{{ .Values.xxx }}` reference in a `templates/*.yaml`, or (b) a CLI flag in `power_agent.py:main()` whose `args.xxx` is consumed by `PowerAgent.__init__`. Audit during the §8 authoring checklist (new sub-bullet). If a desired knob has no current wiring, drop it from `values.yaml` and open a separate Python PR to add the flag first. |

---

## 7. Out of scope / follow-ups

### 7.1 `helm-unittest` tests for the power-agent chart

**Status: ✅ implemented in v1.1.0 (PR9790).** This was originally framed
as a v1.1 follow-up; it shipped as part of the dual-actuator work because
`validateActuator` and `validateEnforce` were too easy to mis-render
without locking their contracts via helm-unittest assertions.
`deploy/helm/charts/power-agent/tests/validate_actuator_test.yaml` and
`tests/validate_enforce_test.yaml` between them cover every positive
spelling of the actuator/enforce values plus the typo classes
(`actuator: ""`, `actuator: AUTO`, `enforce: treu`, `enforce: enabled`,
etc.), and `helm unittest deploy/helm/charts/power-agent` is wired into
§5.4 as a required validation gate. The platform-chart Makefile's
helm-unittest convention is intentionally not adopted (no Makefile in
this chart yet); `helm unittest` is run directly. See `power-agent-dual-
actuator.md` v1.9 changelog entry for the assertion-format history (the
suite was initially written with `matchRegex` against
`spec.template.spec.containers[0].command`, which renders as a list —
rewrote to `contains` to match helm-unittest 1.1.0's list semantics).

### 7.2 Planner-dev Helm chart (`deploy/helm/charts/planner-dev/`)

Recommended as a separate follow-up PR after PR9687 merges. Scope:

- `deploy/planner/dev/planner-dev-pod.yaml` → templated Pod
- `deploy/planner-pod-rbac-dev.yaml` rules (currently in PR9683 as a transitional file) → templated Role + RoleBinding gated on `legacyOperatorCompat: false`
- Optional: `deploy/planner/dev/{qwen3,llama}-quickstart-dgd.yaml` → values-driven DGD ConfigMap

This would also collapse PR9687's accompanying dev-environment-setup
doc's manual `kubectl create sa` / `kubectl create rolebinding` recipe
to one `helm install planner-dev …` invocation. Out of scope for this
plan because:
- It requires PR9687 to be merged or close to it (the source files
  for the chart live in PR9687).
- It does not relate to the CodeRabbit feedback that motivated the
  power-agent chart, so coupling them in one PR would be a category
  error.

### 7.3 Example DGD packaging

`examples/deployments/powerplanner/disagg-*.yaml` are reference DGD
specifications, not Kubernetes primitives a Helm chart owns. Other
DGD examples in the repo (`examples/deployments/Kubernetes/*.yaml`)
remain raw YAML by convention. **No plan to Helm-ify these.** If
users want parametric DGD generation, that belongs in a separate
`dgd-templates/` design discussion.

### 7.4 Power-agent appVersion bumping policy

Current state: chart `version` and `appVersion` both pin to `"1.1.0"`
(bumped together in PR9790 — minor bump per SemVer because the DCGM
actuator is new opt-in functionality with byte-equivalent NVML default
behaviour). The original v1.0.0 baseline landed in PR9682. When
`power_agent.py` next gains a substantive behaviour change, both bump
together. Codifying this as a chart-release policy (e.g., a pre-commit
check that diffs `power_agent.py` LOC against `Chart.yaml` `appVersion`)
is **out of scope for chart v1.x**; capture as a future operational
hygiene task if it becomes a real risk. The v1.0.0 → v1.1.0 lock-step
bump in PR9790 is the first data point that the lock-step convention
holds in practice.

### 7.5 OpenShift SCC support

The snapshot chart's `openshift.enabled` toggle adds
`openshift.io/required-scc: privileged` pod annotations and an OCP
rbac-privileged template. The power-agent needs the same treatment
on OpenShift clusters. **Out of scope for v1** to keep the first
chart cycle focused; flagged as a v1.1 follow-up issue.

---

## 8. Pre-flight checklist

Mirror of `pr9369-split-plan.md` §7, scoped to this work:

**Pre-flight (one-time setup):**

- [ ] Confirm `helm` (v3.13+) is installed and `helm lint` is on PATH.
- [ ] Confirm `kubectl --dry-run=client` is available for the §5.4 step-2 validation.
- [ ] Confirm the `pr1a/power-agent` branch is in sync with origin and has no unpushed local work that would collide.
- [ ] Re-read the CodeRabbit comments on PR9682 to ensure no new templating-related feedback was filed since this plan was drafted.

**Authoring:**

- [ ] Author all 13 chart files following §4.1's layout (7 templates + 2 helm-unittests + 4 root files).
- [ ] Cross-check every Helm value reference (`{{ .Values.xxx }}`) against the §4.2 values schema — no orphaned values, no missing defaults.
- [ ] **Dead-knob audit (v1.2, risk register #9):** confirm every key in the chart's `values.yaml` traces to either a `{{ .Values.xxx }}` reference in `templates/*.yaml` or a CLI flag in `power_agent.py:main()`. If any key has no wiring, drop it from `values.yaml` rather than ship dead configuration surface. (Specifically: the v1.1 draft had `agent.reconcileIntervalSeconds` as such a dead knob — verify it does not reappear. Specifically for v1.1.0: `agent.actuator` traces to `--actuator`, `agent.dcgm.host` to `--dcgm-host`, `agent.dcgm.port` to `--dcgm-port`, `agent.dcgm.enforce` to `--dcgm-enforce` — all verified live in `power_agent.py:730-804`.)
- [ ] **RBAC effective-scope audit (v1.2, helper):** confirm `templates/role.yaml` and `templates/rolebinding.yaml` reference `include "power-agent.effectiveNamespaceRestricted" .` rather than `.Values.rbac.namespaceRestricted` directly. Test `helm template --set dev.enabled=true --set dev.nodeName=foo` produces `Role` + `RoleBinding` (not `ClusterRole`).
- [ ] **Validator coverage audit (v1.3, helpers):** confirm both `templates/daemonset.yaml` and `templates/dev-pod.yaml` open with all four `{{- include "power-agent.validate*" . -}}` lines (validateImageTag, validateMutex, validateActuator, validateEnforce). The dev-pod template was missing the actuator-validator pair pre-PR9790; the §5.4 helm-unittest gate catches regressions.
- [ ] Run `helm lint` on the chart — zero errors.
- [ ] Run the four `helm template` exercises from §5.4 (default / namespace-restricted / dev-mode / DCGM actuator) and confirm each renders to valid manifests.
- [ ] Run the four negative-path `helm template` exercises (missing image tag, mutex violation, invalid actuator, invalid enforce) and confirm all four fail with the §4.4 helper messages.
- [ ] Run `helm unittest deploy/helm/charts/power-agent` — expect `24 passed, 0 failed` on the v1.1.0 chart.

**Doc touch-up:**

- [ ] Update `components/power_agent/README.md` §Deployment to the `helm install` recipe (§5.3).
- [ ] Update both `examples/deployments/powerplanner/*.yaml` headers (§5.3).
- [ ] Update `.github/filters.yaml` planner-group filter (§5.3).
- [ ] Confirm `docs/design-docs/power-agent-helm-chart-plan.md` (this file) is committed.

**Commit + push:**

- [ ] Stage everything as one logical commit with the §5.1 message.
- [ ] `git push origin pr1a/power-agent` — no `--force` flag.
- [ ] On the PR page, post a brief comment summarising what changed and pointing at the three CodeRabbit comments now resolved.
- [ ] Resolve the three CodeRabbit comments on PR9682 with a link to the new chart files (CodeRabbit usually auto-detects resolution from the diff, but a human confirmation closes them definitively).

**Post-push verification:**

- [ ] CI on `pr1a/power-agent` passes (planner-group jobs + any chart-lint jobs).
- [ ] `helm install` against a dev cluster succeeds end-to-end:
  ```bash
  helm install power-agent ./deploy/helm/charts/power-agent \
    --namespace <ns> \
    --set image.tag=v1.1.0 \
    --set agent.safeDefaultWatts=500
  # release name 'power-agent' + chart name 'power-agent' → fullname helper
  # collapses to just 'power-agent' (the `contains $name .Release.Name` branch
  # in _helpers.tpl). The DaemonSet's metadata.name is therefore 'power-agent',
  # NOT 'power-agent-agent' — earlier drafts of this checklist had it wrong.
  kubectl rollout status daemonset/power-agent -n <ns>
  kubectl logs -l app.kubernetes.io/name=power-agent -n <ns> --tail=50
  ```
- [ ] All `components/power_agent/tests/` Python tests still pass (no code changes — sanity smoke only). As of v1.1.0 this is 9 test modules including the actuator-protocol / DCGM-actuator suites added by PR9790; `python3.10 -m pytest components/power_agent/tests/ -v` is the canonical invocation.
