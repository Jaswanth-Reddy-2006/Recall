"""Pydantic schemas for embedding and search endpoints."""

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


# ── Embedding ────────────────────────────────────────────────────────────────

class EmbedRequest(BaseModel):
    """POST /embed — generate embeddings for one or more text strings.

    Callers MUST include the appropriate Nomic prefix:
      - "search_document: ..." for storing a memory embedding
      - "search_query: ..."   for a user search query
    """

    texts: List[str] = Field(
        description="List of strings (with Nomic prefix) to embed.",
        min_length=1,
    )


class EmbedResponse(BaseModel):
    embeddings: List[List[float]]
    model: str
    # Useful for the diagnostics panel
    latency_ms: Optional[int] = None


# ── Memory representation for server-side search ─────────────────────────────

class MemoryForSearch(BaseModel):
    """Minimal memory representation the client sends for server-side ranking."""

    id: str
    title: str
    summary: Optional[str] = None
    category: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    topics: List[str] = Field(default_factory=list)
    # Pre-computed embedding stored on device; sent back so server can rank
    embedding: Optional[List[float]] = None


# ── Search ───────────────────────────────────────────────────────────────────

class SearchRequest(BaseModel):
    """POST /search."""

    query: str
    memories: List[MemoryForSearch]
    # Query embedding (client may generate it independently; saves a round-trip)
    query_embedding: Optional[List[float]] = None
    top_k: int = Field(default=10, ge=1, le=50)


class SearchResultItem(BaseModel):
    memory_id: str
    score: float
    semantic_score: float
    keyword_score: float
    reason: str          # Human-readable, no raw numbers shown to user
    matched_topics: List[str]


class SearchResponse(BaseModel):
    results: List[SearchResultItem]
    query_understood_as: Optional[str] = None
    latency_ms: Optional[int] = None


# ── Related memories ─────────────────────────────────────────────────────────

class RelatedRequest(BaseModel):
    """POST /related — find related memories for a given memory."""

    target: MemoryForSearch
    candidates: List[MemoryForSearch]
    top_k: int = Field(default=5, ge=1, le=20)


class RelatedResultItem(BaseModel):
    memory_id: str
    score: float
    explanation: str     # "Related because both discuss Redis and caching."


class RelatedResponse(BaseModel):
    related: List[RelatedResultItem]
    latency_ms: Optional[int] = None
