"""Prompts for Qwen3 related-memory explanation generation."""

from typing import List, Optional

RELATION_EXPLANATION_SYSTEM_PROMPT = """You are Recall's memory connection engine.

Given two memories, write a short explanation (one sentence, ≤ 20 words) of WHY they are related.

Rules:
- Base the explanation ONLY on the shared topics, tags, or category information provided.
- Do NOT invent connections.
- Start with "Related because".
- Return ONLY the explanation sentence — no JSON, no markdown."""


def build_relation_explanation_message(
    memory_a_title: str,
    memory_a_topics: List[str],
    memory_a_tags: List[str],
    memory_a_category: str,
    memory_b_title: str,
    memory_b_topics: List[str],
    memory_b_tags: List[str],
    memory_b_category: str,
    shared_topics: List[str],
) -> str:
    shared_str = ", ".join(shared_topics[:4]) if shared_topics else "similar topics"
    return (
        f"Memory A: {memory_a_title} | Category: {memory_a_category} | Topics: {', '.join(memory_a_topics[:3])}\n"
        f"Memory B: {memory_b_title} | Category: {memory_b_category} | Topics: {', '.join(memory_b_topics[:3])}\n"
        f"Shared topics/tags: {shared_str}\n\n"
        "Write the one-sentence explanation now."
    )
