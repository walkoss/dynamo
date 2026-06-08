# Upstream patches

This directory holds patches that need to be applied to engine
codebases (vLLM, SGLang, TRT-LLM) to enable full GMS functionality.
They're tracked here so they can be (re)applied across engine upgrades
and eventually submitted upstream.

## Currently tracked

### `vllm_block_pool_evict_callback.patch`

Adds a public `BlockPool.register_evict_callback(callback)` API to vLLM
v1 so external KV connectors (like GMS's evict-to-host adapter) can
subscribe to prefix-cache eviction events without monkey-patching
`_maybe_evict_cached_block`.

**Status**: integration-ready (we currently monkey-patch the private
method in `integrations/vllm/install_block_persist.py`). This patch
would let us drop the monkey-patch.

**Apply locally**:

```bash
cd .build/vllm   # or your vLLM checkout
git apply /path/to/this/patch
# Re-install:
VLLM_USE_PRECOMPILED=1 uv pip install -e . --torch-backend=auto
```

**Submit upstream**:

The patch is wholly additive, ~30 lines. Before opening a PR:

```bash
gh pr list --repo vllm-project/vllm --state open --search "evict callback in:body"
```

If nothing similar is open, follow `.build/vllm/AGENTS.md` for the PR
process (pre-commit, tests, AI-attribution).

The upstream PR description should:
- Cite the use case: external host-tier KV offload (GMS, LMCache,
  potentially Mooncake's KV store).
- Explain why monkey-patching is fragile across minor releases.
- Confirm zero behavior change when no callback is registered (one
  `if self._evict_callbacks:` check per eviction).

Track this on task XF5 (#70).
