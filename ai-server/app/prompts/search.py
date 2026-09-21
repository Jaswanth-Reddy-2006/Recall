"""Prompts for Qwen3 search explanation generation."""

from typing import List, Optional

SEARCH_EXPLANATION_SYSTEM_PROMPT = """You are Recall's search explanation engine.

Given a user query and a retrieved memory, write a short explanation (one sentence, ≤ 20 words) 
of WHY this memory is relevant to the query.

Rules:
- Base the explanation ONLY on information in the memory metadata provided.
- Do NOT invent connections.
- Do NOT use numbers or scores.
- Start with "Matched because" or "Relevant because".
- Return ONLY the explanation sentence — no JSON, no markdown."""


def build_search_explanation_message(
    query: str,
    memory_title: str,
    memory_summary: Optional[str],
    memory_topics: List[str],
    memory_tags: List[str],
    memory_category: str,
) -> str:
    topic_str = ", ".join(memory_topics[:4]) if memory_topics else "—"
    tag_str = ", ".join(memory_tags[:4]) if memory_tags else "—"
    return (
        f"User query: {query}\n\n"
        f"Memory title: {memory_title}\n"
        f"Category: {memory_category}\n"
        f"Topics: {topic_str}\n"
        f"Tags: {tag_str}\n"
        f"Summary: {memory_summary or '—'}\n\n"
        "Write the one-sentence explanation now."
    )
