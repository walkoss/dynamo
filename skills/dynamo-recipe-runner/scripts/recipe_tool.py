#!/usr/bin/env python3
# SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0

"""Discover and lightly validate Dynamo recipes."""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Iterable

FRAMEWORKS = {"vllm", "sglang", "trtllm", "tokenspeed"}
PLACEHOLDER_RE = re.compile(r"(<[^>]+>|your-|change-me|changeme|my-tag|TODO)", re.I)
# Recipes declare GPUs either as the DynamoGraphDeployment shorthand
# (`limits.gpu: "4"`) or the standard Kubernetes `nvidia.com/gpu: 4`; match both.
GPU_RE = re.compile(r"(?:nvidia\.com/gpu|(?<![\w./-])gpu):\s*[\"']?(\d+)")


@dataclass
class Recipe:
    model: str
    framework: str
    mode: str
    path: str
    deploy_yaml: str
    perf_yaml: str | None
    model_cache_dir: str | None
    gpu_count_hint: int | None
    # True when the recipe is a kustomize overlay (deploy via `kubectl apply -k`
    # the recipe dir) rather than a literal deploy.yaml (`kubectl apply -f`).
    kustomize: bool = False


def repo_root(start: Path) -> Path:
    for path in [start, *start.parents]:
        if (path / "recipes").is_dir() and (path / ".git").exists():
            return path
    raise SystemExit("Could not find Dynamo repo root from current directory")


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return path.read_text(errors="replace")


def render_kustomize(directory: Path) -> str | None:
    """Render a kustomize overlay to a manifest, or None if kubectl is missing
    or the build fails (callers fall back to scanning the raw overlay files)."""
    if not shutil.which("kubectl"):
        return None
    try:
        result = subprocess.run(
            ["kubectl", "kustomize", str(directory)],
            capture_output=True,
            text=True,
            timeout=120,
        )
    except (OSError, subprocess.TimeoutExpired):
        return None
    return result.stdout if result.returncode == 0 else None


def recipe_parts(rel_parts: tuple[str, ...]) -> tuple[str, str, str]:
    """Map a recipe path (relative to recipes/, ending at the recipe dir) to
    (model, framework, mode)."""
    framework_index = next(
        (i for i, part in enumerate(rel_parts) if part in FRAMEWORKS), None
    )
    if framework_index is None:
        return rel_parts[0], "unknown", "/".join(rel_parts[1:]) or "unknown"
    model = "/".join(rel_parts[:framework_index])
    framework = rel_parts[framework_index]
    mode_parts = rel_parts[framework_index + 1 :]
    return model, framework, "/".join(mode_parts) if mode_parts else "unknown"


def gpu_values_in_yaml_blocks(text: str, block_name: str) -> list[int]:
    values: list[int] = []
    in_block = False
    block_indent = 0
    for line in text.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        indent = len(line) - len(line.lstrip())
        if stripped == f"{block_name}:":
            in_block = True
            block_indent = indent
            continue
        if in_block and indent <= block_indent:
            in_block = False
        if in_block:
            match = GPU_RE.search(line)
            if match:
                values.append(int(match.group(1)))
    return values


def gpu_count_hint(text: str) -> int | None:
    limits = gpu_values_in_yaml_blocks(text, "limits")
    if limits:
        return sum(limits)
    requests = gpu_values_in_yaml_blocks(text, "requests")
    if requests:
        return sum(requests)
    values = [int(match) for match in GPU_RE.findall(text)]
    return max(values) if values else None


def is_kustomize_overlay(kustomization: Path) -> bool:
    """A kustomize overlay (deployable recipe) references a base and/or carries
    patches; a bare base (e.g. _base/) just lists local resources. Bases live in
    directories named with a leading underscore by convention and are skipped."""
    if any(part.startswith("_") for part in kustomization.parent.parts):
        return False
    text = read_text(kustomization)
    return "patches" in text or "components" in text or "../" in text


def discover(root: Path) -> list[Recipe]:
    recipes_dir = root / "recipes"
    recipes: list[Recipe] = []
    seen_dirs: set[Path] = set()
    for deploy in sorted(recipes_dir.rglob("deploy.yaml")):
        rel = deploy.relative_to(recipes_dir)
        # Skip kustomize base manifests (e.g. cloud-providers/_base/deploy.yaml);
        # they are not independently deployable recipes.
        if any(part.startswith("_") for part in rel.parts[:-1]):
            continue
        model, framework, mode = recipe_parts(rel.parts[:-1])
        recipe_dir = deploy.parent
        seen_dirs.add(recipe_dir)
        model_cache = recipes_dir / model / "model-cache"
        perf = recipe_dir / "perf.yaml"
        text = read_text(deploy)
        recipes.append(
            Recipe(
                model=model,
                framework=framework,
                mode=mode,
                path=str(recipe_dir.relative_to(root)),
                deploy_yaml=str(deploy.relative_to(root)),
                perf_yaml=str(perf.relative_to(root)) if perf.exists() else None,
                model_cache_dir=str(model_cache.relative_to(root))
                if model_cache.exists()
                else None,
                gpu_count_hint=gpu_count_hint(text),
            )
        )

    # Kustomize-native recipes: a recipe dir with a kustomization.yaml (overlay)
    # instead of a literal deploy.yaml — deployed with `kubectl apply -k`.
    for kustomization in sorted(recipes_dir.rglob("kustomization.yaml")):
        recipe_dir = kustomization.parent
        if recipe_dir in seen_dirs or not is_kustomize_overlay(kustomization):
            continue
        rel = recipe_dir.relative_to(recipes_dir)
        model, framework, mode = recipe_parts(rel.parts)
        model_cache = recipes_dir / model / "model-cache"
        rendered = render_kustomize(recipe_dir)
        has_perf = bool(rendered and re.search(r"^\s*app:\s*benchmark", rendered, re.M))
        recipes.append(
            Recipe(
                model=model,
                framework=framework,
                mode=mode,
                path=str(recipe_dir.relative_to(root)),
                deploy_yaml=str(kustomization.relative_to(root)),
                perf_yaml=str(kustomization.relative_to(root)) if has_perf else None,
                model_cache_dir=str(model_cache.relative_to(root))
                if model_cache.exists()
                else None,
                gpu_count_hint=gpu_count_hint(rendered) if rendered else None,
                kustomize=True,
            )
        )
    return recipes


def match_recipes(
    recipes: Iterable[Recipe],
    query: str | None,
    framework: str | None,
    mode: str | None,
) -> list[Recipe]:
    out = []
    for recipe in recipes:
        haystack = " ".join(
            [recipe.model, recipe.framework, recipe.mode, recipe.path]
        ).lower()
        if query and query.lower() not in haystack:
            continue
        if framework and recipe.framework != framework:
            continue
        if mode and mode.lower() not in recipe.mode.lower():
            continue
        out.append(recipe)
    return out


def print_table(recipes: list[Recipe]) -> None:
    headers = ["model", "framework", "mode", "gpus", "perf", "path"]
    rows = [
        [
            recipe.model,
            recipe.framework,
            recipe.mode,
            "" if recipe.gpu_count_hint is None else str(recipe.gpu_count_hint),
            "yes" if recipe.perf_yaml else "no",
            recipe.path,
        ]
        for recipe in recipes
    ]
    widths = [
        max(len(str(row[i])) for row in [headers, *rows]) if rows else len(headers[i])
        for i in range(len(headers))
    ]
    print("  ".join(headers[i].ljust(widths[i]) for i in range(len(headers))))
    print("  ".join("-" * widths[i] for i in range(len(headers))))
    for row in rows:
        print("  ".join(str(row[i]).ljust(widths[i]) for i in range(len(headers))))


def metadata_names_in(text: str) -> list[str]:
    return [
        match.group(1)
        for match in re.finditer(
            r"(?m)^metadata:\n(?:  .*\n)*?  name:\s*([A-Za-z0-9_.-]+)", text
        )
    ]


def metadata_names(path: Path) -> list[str]:
    return metadata_names_in(read_text(path))


def model_cache_dir_for(root: Path, recipe_dir: Path) -> Path | None:
    """Locate the model-level model-cache dir that sits beside a recipe.

    Recipes live at ``recipes/<model>/<framework>/<mode>`` while the
    model-cache manifests live at the sibling ``recipes/<model>/model-cache``,
    so validating only the recipe subtree would miss them.
    """
    recipes_dir = root / "recipes"
    try:
        rel = recipe_dir.relative_to(recipes_dir)
    except ValueError:
        return None
    if not rel.parts:
        return None
    candidate = recipes_dir / rel.parts[0] / "model-cache"
    return candidate if candidate.is_dir() else None


def validate(root: Path, target: Path) -> dict[str, object]:
    target = target if target.is_absolute() else root / target
    if target.is_file():
        files = [target]
        recipe_dir = target.parent
    else:
        recipe_dir = target
        files = sorted(target.rglob("*.yaml")) + sorted(target.rglob("*.yml"))

    if not files:
        raise SystemExit(f"No YAML files found under {target}")

    # Pull in the sibling model-level model-cache manifests so storage-class
    # and model-download blockers are not silently skipped.
    if not any("model-cache" in path.parts for path in files):
        mc_dir = model_cache_dir_for(root, recipe_dir)
        if mc_dir:
            files = (
                files + sorted(mc_dir.rglob("*.yaml")) + sorted(mc_dir.rglob("*.yml"))
            )

    deploy_files = [path for path in files if path.name == "deploy.yaml"]
    perf_files = [path for path in files if path.name == "perf.yaml"]
    model_cache_files = [path for path in files if "model-cache" in path.parts]

    # Kustomize-native recipe: render the overlay so the checks below see the
    # effective manifest (deploy.yaml lives in ../_base, not under the target).
    kustomization = recipe_dir / "kustomization.yaml"
    is_overlay = (
        target.is_dir()
        and not deploy_files
        and kustomization.exists()
        and is_kustomize_overlay(kustomization)
    )
    rendered_text: str | None = render_kustomize(recipe_dir) if is_overlay else None

    # (label, text, is_deploy) tuples to scan — files plus the rendered overlay.
    documents: list[tuple[str, str, bool]] = [
        (
            str(path.relative_to(root)) if path.is_relative_to(root) else str(path),
            read_text(path),
            path.name == "deploy.yaml",
        )
        for path in files
    ]
    if rendered_text is not None:
        documents.append(
            (f"{kustomization.relative_to(root)} (kustomize build)", rendered_text, True)
        )

    warnings: list[str] = []
    blockers: list[str] = []

    for label, text, is_deploy in documents:
        if PLACEHOLDER_RE.search(text):
            warnings.append(f"{label}: contains placeholder-looking values")
        if is_deploy and "image:" not in text:
            warnings.append(f"{label}: no image field found")
        if "HF_TOKEN" in text or "HUGGING_FACE" in text or "HUGGINGFACE" in text:
            if "hf-token-secret" not in text and "secretKeyRef" not in text:
                warnings.append(
                    f"{label}: references Hugging Face env vars without an obvious secret"
                )
        if "storageClassName" in text and PLACEHOLDER_RE.search(text):
            blockers.append(f"{label}: storageClassName appears to be a placeholder")

    if is_overlay and rendered_text is None:
        warnings.append(
            f"{kustomization.relative_to(root)}: could not render overlay "
            "(kubectl missing or build failed); validated raw files only"
        )
    if not deploy_files and not is_overlay:
        blockers.append("No deploy.yaml or kustomization.yaml found for this target")
    if not model_cache_files and (
        recipe_dir.parts and "model-cache" not in recipe_dir.parts
    ):
        warnings.append(
            "No model-cache YAML found under target; check the model-level model-cache directory"
        )

    deployment_names: list[str] = []
    for path in deploy_files:
        deployment_names.extend(metadata_names(path))
    if rendered_text is not None:
        deployment_names.extend(metadata_names_in(rendered_text))

    def doc_hits(pattern: re.Pattern[str]) -> list[str]:
        hits: list[str] = []
        for label, text, _ in documents:
            for lineno, line in enumerate(text.splitlines(), start=1):
                if pattern.search(line):
                    hits.append(f"{label}:{lineno}: {line.strip()}")
        return hits

    gpu_hint = sum(
        value
        for value in (
            gpu_count_hint(text) for _, text, is_deploy in documents if is_deploy
        )
        if value
    ) or None

    return {
        "target": str(
            target.relative_to(root) if target.is_relative_to(root) else target
        ),
        "deploy_kind": "kustomize" if is_overlay else "deploy.yaml",
        "deploy_files": [str(path.relative_to(root)) for path in deploy_files]
        or ([str(kustomization.relative_to(root))] if is_overlay else []),
        "perf_files": [str(path.relative_to(root)) for path in perf_files],
        "model_cache_files": [
            str(path.relative_to(root)) for path in model_cache_files
        ],
        "deployment_names": deployment_names,
        "gpu_count_hint": gpu_hint,
        "interesting_lines": {
            "storageClassName": doc_hits(re.compile(r"storageClassName")),
            "images": doc_hits(re.compile(r"^\s*image:\s*")),
            "hf_secret": doc_hits(re.compile(r"hf-token-secret|HF_TOKEN|HUGGING")),
            "router": doc_hits(re.compile(r"DYN_ROUTER|router-mode|router_mode")),
        },
        "warnings": warnings,
        "blockers": blockers,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)

    list_parser = sub.add_parser("list", help="List recipe deployment candidates")
    list_parser.add_argument("--query")
    list_parser.add_argument("--framework")
    list_parser.add_argument("--mode")
    list_parser.add_argument("--format", choices=["json", "table"], default="json")

    validate_parser = sub.add_parser("validate", help="Validate a recipe path")
    validate_parser.add_argument("target", help="Recipe directory or YAML file")

    args = parser.parse_args()
    root = repo_root(Path.cwd().resolve())

    if args.command == "list":
        recipes = match_recipes(discover(root), args.query, args.framework, args.mode)
        if args.format == "table":
            print_table(recipes)
        else:
            print(json.dumps([asdict(recipe) for recipe in recipes], indent=2))
        return 0

    if args.command == "validate":
        print(json.dumps(validate(root, Path(args.target)), indent=2))
        return 0

    return 1


if __name__ == "__main__":
    sys.exit(main())
