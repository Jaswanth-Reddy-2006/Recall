"""POST /embed — generate Nomic embeddings.

The client sends texts that already include the appropriate Nomic prefix:
  "search_document: ..."  for memory storage
  "search_query: ..."     for user queries
"""

import logging
import time

from fastapi import APIRouter, HTTPException, status

from app.config import settings
from app.schemas.search import EmbedRequest, EmbedResponse
from app.services.embedding_service import EmbeddingServiceError, embedding_service

router = APIRouter(prefix="/embed", tags=["embeddings"])
logger = logging.getLogger(__name__)

MAX_TEXTS_PER_REQUEST = 50


@router.post("", response_model=EmbedResponse, summary="Generate Nomic embeddings")
async def embed(request: EmbedRequest) -> EmbedResponse:
    """Generate embeddings for one or more text strings.

    The caller must include the Nomic task prefix in each string:
    - ``search_document: <text>`` when indexing a memory
    - ``search_query: <text>``    when embedding a search query

    Returns one embedding vector per input text.
    """
    if len(request.texts) > MAX_TEXTS_PER_REQUEST:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Too many texts ({len(request.texts)}). Maximum is {MAX_TEXTS_PER_REQUEST}.",
        )

    t0 = time.monotonic()
    try:
        vectors = await embedding_service.embed_raw(request.texts)
    except EmbeddingServiceError as exc:
        logger.error("Embedding failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Embedding model error: {exc}",
        )

    elapsed_ms = int((time.monotonic() - t0) * 1000)
    return EmbedResponse(
        embeddings=vectors,
        model=settings.embedding_model,
        latency_ms=elapsed_ms,
    )
