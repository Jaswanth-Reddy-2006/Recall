"""Embedding service — wraps Nomic Embed v1.5 via OllamaClient.

Key responsibilities:
- Add the required Nomic task prefixes (search_document / search_query)
- Call OllamaClient.embed()
- Return clean float[][] vectors

Nomic Embed v1.5 requires task-specific prefixes for best performance:
  "search_document: ..."  — when indexing a memory
  "search_query: ..."     — when embedding a user search query

See: https://huggingface.co/nomic-ai/nomic-embed-text-v1.5
"""

import logging
import time
from enum import Enum
from typing import List

from app.config import settings
from app.services.ollama_client import OllamaClient, OllamaError

logger = logging.getLogger(__name__)


class EmbedPrefix(str, Enum):
    DOCUMENT = "search_document"
    QUERY = "search_query"


class EmbeddingServiceError(Exception):
    pass


def build_memory_embedding_text(
    title: str,
    summary: str = "",
    category: str = "",
    topics: List[str] = (),
    tags: List[str] = (),
    action_titles: List[str] = (),
    source_context: str = "",
) -> str:
    """Construct a rich embedding document from memory fields.

    This is the canonical representation used for indexing. Keep it stable —
    changing the format would invalidate all stored embeddings.
    """
    parts = [title]
    if category:
        parts.append(category)
    if summary:
        parts.append(summary)
    if topics:
        parts.append(". ".join(topics))
    if tags:
        parts.append(". ".join(tags))
    if action_titles:
        parts.append(". ".join(action_titles))
    if source_context:
        parts.append(source_context)
    return ". ".join(filter(None, parts))


class EmbeddingService:
    """Generates Nomic embeddings for memories and search queries."""

    def __init__(self, client: OllamaClient) -> None:
        self._client = client

    async def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Embed one or more memory document strings.

        Automatically prepends the "search_document:" prefix.
        """
        prefixed = [f"{EmbedPrefix.DOCUMENT}: {t}" for t in texts]
        return await self._embed(prefixed)

    async def embed_query(self, query: str) -> List[float]:
        """Embed a user search query string.

        Automatically prepends the "search_query:" prefix.
        """
        prefixed = [f"{EmbedPrefix.QUERY}: {query}"]
        vectors = await self._embed(prefixed)
        return vectors[0]

    async def embed_raw(self, texts: List[str]) -> List[List[float]]:
        """Embed texts that already include their Nomic prefix.

        Use this when the caller has already added the prefix (e.g. from the
        React Native client's /embed endpoint).
        """
        return await self._embed(texts)

    async def _embed(self, texts: List[str]) -> List[List[float]]:
        start = time.monotonic()
        try:
            vectors = await self._client.embed(
                model=settings.embedding_model,
                texts=texts,
            )
        except OllamaError as exc:
            raise EmbeddingServiceError(f"Embedding failed: {exc}") from exc

        elapsed_ms = int((time.monotonic() - start) * 1000)
        logger.info(
            "embedding.embed texts=%d latency=%dms dim=%d",
            len(texts),
            elapsed_ms,
            len(vectors[0]) if vectors else 0,
        )
        return vectors


# Singleton (client injected at startup)
embedding_service = EmbeddingService(client=None)  # type: ignore[arg-type]
