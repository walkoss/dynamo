#  SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
#  SPDX-License-Identifier: Apache-2.0

"""Shared utilities for frontend chat processors (vLLM, SGLang)."""

import logging
import uuid
from typing import Any

_MASK_64_BITS = (1 << 64) - 1


def random_uuid() -> str:
    """Generate a random 16-character hex UUID."""
    return f"{uuid.uuid4().int & _MASK_64_BITS:016x}"


def random_call_id() -> str:
    """Generate a random tool call ID in OpenAI format."""
    return f"call_{uuid.uuid4().int & _MASK_64_BITS:016x}"


def worker_warmup() -> bool:
    """Dummy task to ensure a ProcessPoolExecutor worker is fully initialized."""
    return True


class PreprocessError(Exception):
    """Raised by preprocess workers for user-facing errors (e.g., n!=1).

    Carries a plain message because the worker→main-process boundary
    pickles the exception; the main process re-raises a Dynamo-typed
    exception so PyO3 can route it through the proper backend-error path.
    """

    def __init__(self, message: str):
        super().__init__(message)


# Content part types that carry media URLs, mapped to the key used in the
# multimodal data dict sent to the backend handler.
_MEDIA_CONTENT_TYPES = ("image_url", "audio_url", "video_url")


def extract_mm_urls(
    messages: list[dict[str, Any]],
) -> tuple[dict[str, list[dict[str, Any]]] | None, dict[str, list[str | None]] | None,]:
    """Extract multimodal URLs (and per-part `uuid`s) from chat messages.

    `uuid` is a vLLM extension to the OpenAI-compat chat schema (an opaque
    cache key for vLLM's `multi_modal_uuids` / `mm_processor_cache`).

    Walks user-message content arrays and collects ``image_url``, ``audio_url``,
    and ``video_url`` entries. Each part is one of:

    - ``{url}`` (no uuid)    → ``{"Url": url}`` slot
    - ``{url, uuid}``        → ``{"Url": url}`` slot, uuid stored parallel
    - ``{uuid}`` (no url)    → ``{"UuidOnly": uuid}`` slot — backend resolves
                               via vLLM's mm_processor_cache.

    Returns ``(mm_data, mm_uuids)``:

    - ``mm_data`` matches the pre-PR shape for url-only callers; gains
      ``UuidOnly`` entries when uuid-only parts are present. ``None`` if no
      multimodal content was found.
    - ``mm_uuids`` is the parallel per-modality list of ``str | None`` aligned
      with ``mm_data[modality]``. Forward via ``extra_args["mm_hashes"]`` so the
      worker pipes it into vLLM's ``multi_modal_uuids``. ``None`` if no part
      carried a uuid (preserves the pre-PR wire shape).
    """
    mm_data: dict[str, list[dict[str, Any]]] = {}
    mm_uuids: dict[str, list[str | None]] = {}

    for msg in messages:
        if not isinstance(msg, dict) or msg.get("role") != "user":
            continue
        content = msg.get("content")
        if not isinstance(content, list):
            continue
        for part in content:
            if not isinstance(part, dict):
                continue
            part_type = part.get("type")
            if part_type not in _MEDIA_CONTENT_TYPES:
                continue
            media_value = part.get(part_type)
            if not isinstance(media_value, dict):
                continue
            url = media_value.get("url")
            uuid = media_value.get("uuid")
            url_present = isinstance(url, str) and bool(url)
            uuid_present = isinstance(uuid, str) and bool(uuid)

            if not url_present and not uuid_present:
                # Defensive skip; Rust preprocessor rejects empty parts upstream.
                continue

            if url_present:
                mm_data.setdefault(part_type, []).append({"Url": url})
            else:
                mm_data.setdefault(part_type, []).append({"UuidOnly": uuid})
            mm_uuids.setdefault(part_type, []).append(uuid if uuid_present else None)

    if not mm_data:
        return None, None
    any_uuid = any(any(u is not None for u in v) for v in mm_uuids.values())
    return mm_data, (mm_uuids if any_uuid else None)


def make_backend_error(engine_response: dict[str, Any]) -> dict[str, Any]:
    """Build an OpenAI-style error dict, guarding against None/missing message."""
    backend_msg = engine_response.get("message") or "unknown backend error"
    return {
        "error": {
            "message": backend_msg,
            "type": "backend_error",
        }
    }


def make_internal_error(request_id: str, detail: str | None = None) -> dict[str, Any]:
    """Build an OpenAI-style internal error dict with request-specific fallback."""
    message = detail or f"Invalid engine response for request {request_id}"
    return {
        "error": {
            "message": message,
            "type": "internal_error",
        }
    }


def handle_engine_error(
    engine_response: Any,
    request_id: str,
    logger: logging.Logger,
) -> dict[str, Any]:
    """Classify an invalid engine response and return an OpenAI-style error dict.

    Called when engine_response is None or missing 'token_ids'.
    """
    if isinstance(engine_response, dict) and engine_response.get("status") == "error":
        err = make_backend_error(engine_response)
        logger.error(
            "Backend error for request %s: %s", request_id, err["error"]["message"]
        )
        return err
    logger.error(
        "No outputs from engine for request %s: %s", request_id, engine_response
    )
    return make_internal_error(request_id)
