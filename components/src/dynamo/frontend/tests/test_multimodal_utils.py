# SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0

import pytest

from dynamo.frontend.utils import extract_mm_urls

pytestmark = [
    pytest.mark.unit,
    pytest.mark.gpu_0,
    pytest.mark.pre_merge,
]


def test_returns_none_for_text_only():
    messages = [
        {"role": "user", "content": "What is the capital of France?"},
    ]
    assert extract_mm_urls(messages) == (None, None)


def test_returns_none_for_empty_messages():
    assert extract_mm_urls([]) == (None, None)


def test_extracts_image_urls():
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {"url": "https://example.com/cat.png"},
                },
                {"type": "text", "text": "What is this?"},
            ],
        }
    ]
    mm_data, mm_uuids = extract_mm_urls(messages)
    assert mm_data == {"image_url": [{"Url": "https://example.com/cat.png"}]}
    assert mm_uuids is None  # no uuids supplied → keeps pre-PR shape


def test_extracts_audio_urls():
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "audio_url",
                    "audio_url": {"url": "data:audio/wav;base64,UklGRg=="},
                },
                {"type": "text", "text": "What sound is this?"},
            ],
        }
    ]
    mm_data, mm_uuids = extract_mm_urls(messages)
    assert mm_data == {"audio_url": [{"Url": "data:audio/wav;base64,UklGRg=="}]}
    assert mm_uuids is None


def test_extracts_video_urls():
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "video_url",
                    "video_url": {"url": "https://example.com/clip.mp4"},
                },
            ],
        }
    ]
    mm_data, mm_uuids = extract_mm_urls(messages)
    assert mm_data == {"video_url": [{"Url": "https://example.com/clip.mp4"}]}
    assert mm_uuids is None


def test_extracts_mixed_modalities():
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {"url": "https://example.com/img.jpg"},
                },
                {
                    "type": "audio_url",
                    "audio_url": {"url": "https://example.com/audio.wav"},
                },
                {
                    "type": "video_url",
                    "video_url": {"url": "https://example.com/video.mp4"},
                },
                {"type": "text", "text": "Describe all of these."},
            ],
        }
    ]
    mm_data, mm_uuids = extract_mm_urls(messages)
    assert mm_data == {
        "image_url": [{"Url": "https://example.com/img.jpg"}],
        "audio_url": [{"Url": "https://example.com/audio.wav"}],
        "video_url": [{"Url": "https://example.com/video.mp4"}],
    }
    assert mm_uuids is None


def test_extracts_multiple_items_per_modality():
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {"url": "https://example.com/a.png"},
                },
                {
                    "type": "image_url",
                    "image_url": {"url": "https://example.com/b.png"},
                },
                {"type": "text", "text": "Compare these images."},
            ],
        }
    ]
    mm_data, mm_uuids = extract_mm_urls(messages)
    assert mm_data == {
        "image_url": [
            {"Url": "https://example.com/a.png"},
            {"Url": "https://example.com/b.png"},
        ]
    }
    assert mm_uuids is None


def test_ignores_non_user_messages():
    messages = [
        {"role": "system", "content": "You are helpful."},
        {
            "role": "assistant",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {"url": "https://example.com/fake.png"},
                },
            ],
        },
        {"role": "user", "content": "Hello"},
    ]
    assert extract_mm_urls(messages) == (None, None)


def test_handles_malformed_content_non_dict():
    """Non-dict items in content list should be skipped, not crash."""
    messages = [
        {
            "role": "user",
            "content": [
                "a plain string instead of a dict",
                42,
                None,
                {
                    "type": "image_url",
                    "image_url": {"url": "https://example.com/ok.png"},
                },
            ],
        }
    ]
    mm_data, mm_uuids = extract_mm_urls(messages)
    assert mm_data == {"image_url": [{"Url": "https://example.com/ok.png"}]}
    assert mm_uuids is None


# -- OpenAI cached-MM uuid extension --


def test_url_with_uuid_emits_uuid_in_parallel_map():
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://example.com/cat.png",
                        "uuid": "img-aabbccdd",
                    },
                },
            ],
        }
    ]
    mm_data, mm_uuids = extract_mm_urls(messages)
    assert mm_data == {"image_url": [{"Url": "https://example.com/cat.png"}]}
    assert mm_uuids == {"image_url": ["img-aabbccdd"]}


def test_uuid_only_emits_uuid_only_variant():
    """uuid-only image part — no decode, backend resolves via mm_processor_cache."""
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {"uuid": "img-aabbccdd"},
                },
            ],
        }
    ]
    mm_data, mm_uuids = extract_mm_urls(messages)
    assert mm_data == {"image_url": [{"UuidOnly": "img-aabbccdd"}]}
    assert mm_uuids == {"image_url": ["img-aabbccdd"]}


def test_five_images_one_fresh_four_uuid_only_repeats():
    """
    5-image-per-request scenario the user spec'd: first image is a fresh
    decode (url+uuid), the remaining 4 are uuid-only repeats of cache entries
    from prior turns. Each slot is aligned by index.
    """
    messages = [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Compare these"},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://example.com/new.png",
                        "uuid": "img-new",
                    },
                },
                {"type": "image_url", "image_url": {"uuid": "img-rep1"}},
                {"type": "image_url", "image_url": {"uuid": "img-rep2"}},
                {"type": "image_url", "image_url": {"uuid": "img-rep3"}},
                {"type": "image_url", "image_url": {"uuid": "img-rep4"}},
            ],
        }
    ]
    mm_data, mm_uuids = extract_mm_urls(messages)
    assert mm_data == {
        "image_url": [
            {"Url": "https://example.com/new.png"},
            {"UuidOnly": "img-rep1"},
            {"UuidOnly": "img-rep2"},
            {"UuidOnly": "img-rep3"},
            {"UuidOnly": "img-rep4"},
        ]
    }
    assert mm_uuids == {
        "image_url": ["img-new", "img-rep1", "img-rep2", "img-rep3", "img-rep4"]
    }


def test_five_images_one_fresh_four_overlapping_same_uuid():
    """
    Pinned-image scenario: every later turn reuses the SAME image as the first.
    All 4 repeats carry the same uuid as the leading url+uuid part. (vLLM's
    processor cache will hit on every repeat after the first.)
    """
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://example.com/img1.png",
                        "uuid": "img-aa",
                    },
                },
                {"type": "image_url", "image_url": {"uuid": "img-aa"}},
                {"type": "image_url", "image_url": {"uuid": "img-aa"}},
                {"type": "image_url", "image_url": {"uuid": "img-aa"}},
                {"type": "image_url", "image_url": {"uuid": "img-aa"}},
            ],
        }
    ]
    mm_data, mm_uuids = extract_mm_urls(messages)
    assert mm_data == {
        "image_url": [
            {"Url": "https://example.com/img1.png"},
            {"UuidOnly": "img-aa"},
            {"UuidOnly": "img-aa"},
            {"UuidOnly": "img-aa"},
            {"UuidOnly": "img-aa"},
        ]
    }
    assert mm_uuids == {"image_url": ["img-aa"] * 5}


def test_uuid_dropped_when_empty_string():
    """Empty/missing uuid string is treated as no-uuid."""
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {"url": "https://example.com/x.png", "uuid": ""},
                },
            ],
        }
    ]
    mm_data, mm_uuids = extract_mm_urls(messages)
    assert mm_data == {"image_url": [{"Url": "https://example.com/x.png"}]}
    assert mm_uuids is None  # empty uuid → no parallel map


def test_uuid_only_with_empty_uuid_skipped():
    """Empty uuid AND no url → defensive skip (Rust preprocessor handles error case)."""
    messages = [
        {
            "role": "user",
            "content": [
                {"type": "image_url", "image_url": {"uuid": ""}},
            ],
        }
    ]
    mm_data, mm_uuids = extract_mm_urls(messages)
    assert mm_data is None
    assert mm_uuids is None
