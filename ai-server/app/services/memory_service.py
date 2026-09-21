"""Memory service — cosine similarity, hybrid ranking, and explanation generation.

This service performs server-side semantic search when the client sends
pre-computed embeddings. It also generates human-readable explanations via Qwen3.

Scoring weights (internal only — never shown to users):
  semantic similarity:  70%
  keyword overlap:      20%
  category/topic match: 10%
"""

import logging
import math
import time
from typing import List, Optional, Tuple

from app.config import settings
from app.prompts.relation import (
    RELATION_EXPLANATION_SYSTEM_PROMPT,
    build_relation_explanation_message,
)
from app.prompts.search import (
    SEARCH_EXPLANATION_SYSTEM_PROMPT,
    build_search_explanation_message,
)
from app.schemas.search import (
    MemoryForSearch,
    RelatedResponse,
    RelatedResultItem,
    SearchRequest,
    SearchResponse,
    SearchResultItem,
)
from app.services.embedding_service import EmbeddingService
from app.services.ollama_client import OllamaClient, OllamaError

logger = logging.getLogger(__name__)

# Scoring weights
W_SEMANTIC = 0.70
W_KEYWORD = 0.20
W_META = 0.10

# Minimum semantic similarity to include a result
MIN_SEMANTIC_THRESHOLD = 0.25


def cosine_similarity(a: List[float], b: List[float]) -> float:
    """Compute cosine similarity between two vectors."""
    if len(a) != len(b):
        return 0.0
    dot = sum(x * y for x, y in zip(a, b))
    mag_a = math.sqrt(sum(x * x for x in a))
    mag_b = math.sqrt(sum(x * x for x in b))
    if mag_a == 0.0 or mag_b == 0.0:
        return 0.0
    return dot / (mag_a * mag_b)


def keyword_score(query_tokens: List[str], memory: MemoryForSearch) -> float:
    """Normalised keyword overlap score in [0, 1]."""
    if not query_tokens:
        return 0.0
    text = " ".join(
        filter(None, [memory.title, memory.summary or "", memory.category or ""]
               + memory.tags + memory.topics)
    ).lower()
    hits = sum(1 for t in query_tokens if t in text)
    return hits / len(query_tokens)


def meta_score(query_tokens: List[str], memory: MemoryForSearch) -> float:
    """Category and topic match bonus in [0, 1]."""
    if not query_tokens:
        return 0.0
    meta_text = " ".join(
        [memory.category or ""] + memory.tags + memory.topics
    ).lower()
    hits = sum(1 for t in query_tokens if t in meta_text)
    return min(hits / max(len(query_tokens), 1), 1.0)


class MemoryService:
    """Server-side memory search and relation finding."""

    def __init__(
        self,
        ollama_client: OllamaClient,
        embedding_service: EmbeddingService,
    ) -> None:
        self._client = ollama_client
        self._embed = embedding_service

    async def search(self, request: SearchRequest) -> SearchResponse:
        """Hybrid semantic + keyword search over a list of memories.

        The client is responsible for sending pre-computed memory embeddings.
        If none are present, falls back to keyword-only search.
        """
        start = time.monotonic()

        query_tokens = [
            t for t in request.query.lower().split() if len(t) > 1
        ]

        # Get query embedding (use provided or generate now)
        query_embedding: Optional[List[float]] = request.query_embedding
        if query_embedding is None:
            try:
                query_embedding = await self._embed.embed_query(request.query)
            except Exception as exc:
                logger.warning("Failed to embed query, falling back to keyword: %s", exc)

        results: List[Tuple[MemoryForSearch, float, float, float]] = []

        for memory in request.memories:
            # Semantic score
            sem = 0.0
            if query_embedding and memory.embedding:
                sem = cosine_similarity(query_embedding, memory.embedding)
                if sem < MIN_SEMANTIC_THRESHOLD and not keyword_score(query_tokens, memory):
                    continue  # Skip clearly irrelevant memories

            kw = keyword_score(query_tokens, memory)
            mt = meta_score(query_tokens, memory)
            combined = (W_SEMANTIC * sem) + (W_KEYWORD * kw) + (W_META * mt)

            if combined > 0:
                results.append((memory, combined, sem, kw))

        # Sort descending
        results.sort(key=lambda x: x[1], reverse=True)
        top = results[: request.top_k]

        # Build result items — generate explanations for top 5
        items: List[SearchResultItem] = []
        for i, (memory, score, sem, kw) in enumerate(top):
            reason = await self._generate_search_explanation(
                request.query, memory
            ) if i < 5 else self._fallback_reason(memory)

            matched_topics = [
                t for t in memory.topics + memory.tags
                if any(tok in t.lower() for tok in query_tokens)
            ][:3]

            items.append(SearchResultItem(
                memory_id=memory.id,
                score=round(score, 4),
                semantic_score=round(sem, 4),
                keyword_score=round(kw, 4),
                reason=reason,
                matched_topics=matched_topics,
            ))

        elapsed_ms = int((time.monotonic() - start) * 1000)
        return SearchResponse(results=items, latency_ms=elapsed_ms)

    async def find_related(
        self,
        target: MemoryForSearch,
        candidates: List[MemoryForSearch],
        top_k: int = 5,
    ) -> RelatedResponse:
        """Find memories related to `target` using embedding + metadata similarity."""
        start = time.monotonic()

        scored: List[Tuple[MemoryForSearch, float]] = []
        for candidate in candidates:
            if candidate.id == target.id:
                continue
            sem = 0.0
            if target.embedding and candidate.embedding:
                sem = cosine_similarity(target.embedding, candidate.embedding)

            # Metadata overlap bonus
            target_set = set(
                (target.topics + target.tags + [target.category or ""])
            )
            cand_set = set(
                (candidate.topics + candidate.tags + [candidate.category or ""])
            )
            shared = target_set & cand_set
            meta_bonus = min(len(shared) * 0.05, 0.3)

            score = min(sem + meta_bonus, 1.0)
            if score > 0.1:
                scored.append((candidate, score))

        scored.sort(key=lambda x: x[1], reverse=True)
        top = scored[:top_k]

        related_items: List[RelatedResultItem] = []
        for candidate, score in top:
            target_set = set(target.topics + target.tags)
            cand_set = set(candidate.topics + candidate.tags)
            shared = list(target_set & cand_set)
            explanation = await self._generate_relation_explanation(
                target, candidate, shared
            )
            related_items.append(RelatedResultItem(
                memory_id=candidate.id,
                score=round(score, 4),
                explanation=explanation,
            ))

        elapsed_ms = int((time.monotonic() - start) * 1000)
        return RelatedResponse(related=related_items, latency_ms=elapsed_ms)

    # ── Explanation generation (Qwen3) ────────────────────────────────────────

    async def _generate_search_explanation(
        self, query: str, memory: MemoryForSearch
    ) -> str:
        user_msg = build_search_explanation_message(
            query=query,
            memory_title=memory.title,
            memory_summary=memory.summary,
            memory_topics=memory.topics,
            memory_tags=memory.tags,
            memory_category=memory.category or "Other",
        )
        try:
            explanation = await self._client.chat(
                model=settings.qwen_text_model,
                messages=[
                    {"role": "system", "content": SEARCH_EXPLANATION_SYSTEM_PROMPT},
                    {"role": "user", "content": user_msg},
                ],
                temperature=0.2,
                timeout=30.0,
            )
            return explanation.strip()
        except OllamaError:
            return self._fallback_reason(memory)

    async def _generate_relation_explanation(
        self,
        target: MemoryForSearch,
        candidate: MemoryForSearch,
        shared_topics: List[str],
    ) -> str:
        user_msg = build_relation_explanation_message(
            memory_a_title=target.title,
            memory_a_topics=target.topics,
            memory_a_tags=target.tags,
            memory_a_category=target.category or "Other",
            memory_b_title=candidate.title,
            memory_b_topics=candidate.topics,
            memory_b_tags=candidate.tags,
            memory_b_category=candidate.category or "Other",
            shared_topics=shared_topics,
        )
        try:
            explanation = await self._client.chat(
                model=settings.qwen_text_model,
                messages=[
                    {"role": "system", "content": RELATION_EXPLANATION_SYSTEM_PROMPT},
                    {"role": "user", "content": user_msg},
                ],
                temperature=0.2,
                timeout=30.0,
            )
            return explanation.strip()
        except OllamaError:
            shared_str = ", ".join(shared_topics[:3]) if shared_topics else "similar topics"
            return f"Related because both discuss {shared_str}."

    @staticmethod
    def _fallback_reason(memory: MemoryForSearch) -> str:
        topics = memory.topics[:2] or memory.tags[:2]
        if topics:
            return f"Matched because: {' · '.join(topics)}"
        return f"Matched content in {memory.category or 'your memories'}"


# Singleton (injected at startup)
memory_service = MemoryService(ollama_client=None, embedding_service=None)  # type: ignore
