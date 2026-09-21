"""Prompts package."""
from .vision import VISION_SYSTEM_PROMPT, build_vision_user_message
from .extraction import (
    EXTRACTION_SYSTEM_PROMPT,
    CORRECTION_SYSTEM_PROMPT,
    build_text_extraction_message,
    build_vision_extraction_message,
    build_link_extraction_message,
    build_correction_message,
)
from .search import SEARCH_EXPLANATION_SYSTEM_PROMPT, build_search_explanation_message
from .relation import RELATION_EXPLANATION_SYSTEM_PROMPT, build_relation_explanation_message

__all__ = [
    "VISION_SYSTEM_PROMPT",
    "build_vision_user_message",
    "EXTRACTION_SYSTEM_PROMPT",
    "CORRECTION_SYSTEM_PROMPT",
    "build_text_extraction_message",
    "build_vision_extraction_message",
    "build_link_extraction_message",
    "build_correction_message",
    "SEARCH_EXPLANATION_SYSTEM_PROMPT",
    "build_search_explanation_message",
    "RELATION_EXPLANATION_SYSTEM_PROMPT",
    "build_relation_explanation_message",
]
