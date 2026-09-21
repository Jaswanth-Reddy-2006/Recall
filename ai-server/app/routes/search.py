"""POST /search and POST /related — server-side semantic search and relation finding."""

import logging

from fastapi import APIRouter, HTTPException, status

from app.schemas.search import (
    RelatedRequest,
    RelatedResponse,
    SearchRequest,
    SearchResponse,
)
from app.services.memory_service import memory_service

router = APIRouter(tags=["search"])
logger = logging.getLogger(__name__)


@router.post("/search", response_model=SearchResponse, summary="Hybrid semantic search")
async def search(request: SearchRequest) -> SearchResponse:
    """Hybrid semantic + keyword search over a provided list of memories.

    The client sends its stored memories (with pre-computed embeddings where
    available) and the user query. The server returns ranked results with
    human-readable explanations — no raw scores are exposed to the UI.
    """
    if not request.query.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Query is empty.",
        )
    if not request.memories:
        return SearchResponse(results=[], latency_ms=0)

    return await memory_service.search(request)


@router.post("/related", response_model=RelatedResponse, summary="Find related memories")
async def related(request: RelatedRequest) -> RelatedResponse:
    """Find memories related to a given target memory.

    Uses cosine similarity on pre-computed embeddings plus metadata overlap.
    Returns explanations grounded in shared topics — never invented connections.
    """
    if not request.candidates:
        return RelatedResponse(related=[], latency_ms=0)

    return await memory_service.find_related(
        target=request.target,
        candidates=request.candidates,
        top_k=request.top_k,
    )
