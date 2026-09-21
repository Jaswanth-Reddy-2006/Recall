"""POST /warmup — sequentially warm up models.

Sends a trivial prompt to each model to load it into Ollama's memory.
Uses sequential loading to avoid RAM pressure on the development laptop.
"""

import asyncio
import logging
import time
from typing import Dict, List

from fastapi import APIRouter
from pydantic import BaseModel

from app.config import settings
from app.services.ollama_client import OllamaError, ollama_client

router = APIRouter(tags=["warmup"])
logger = logging.getLogger(__name__)


class WarmupModelResult(BaseModel):
    model: str
    success: bool
    latency_ms: int
    error: str | None = None


class WarmupResponse(BaseModel):
    results: List[WarmupModelResult]
    total_ms: int


@router.post("/warmup", response_model=WarmupResponse, summary="Warm up AI models")
async def warmup() -> WarmupResponse:
    """Sequentially warm up Qwen3, Qwen2.5-VL, and Nomic Embed.

    Sends a trivial request to each model so Ollama pre-loads them into memory.
    Sequential (not parallel) to avoid RAM pressure on the development laptop.
    """
    start_total = time.monotonic()
    results: List[WarmupModelResult] = []

    # Warm up text model
    t0 = time.monotonic()
    try:
        await ollama_client.chat(
            model=settings.qwen_text_model,
            messages=[{"role": "user", "content": "Hi"}],
            temperature=0.0,
            timeout=60.0,
        )
        results.append(WarmupModelResult(
            model=settings.qwen_text_model,
            success=True,
            latency_ms=int((time.monotonic() - t0) * 1000),
        ))
    except OllamaError as exc:
        results.append(WarmupModelResult(
            model=settings.qwen_text_model,
            success=False,
            latency_ms=int((time.monotonic() - t0) * 1000),
            error=str(exc),
        ))

    # Warm up embedding model (skip if text model failed)
    t0 = time.monotonic()
    try:
        await ollama_client.embed(
            model=settings.embedding_model,
            texts=["search_document: warmup"],
            timeout=30.0,
        )
        results.append(WarmupModelResult(
            model=settings.embedding_model,
            success=True,
            latency_ms=int((time.monotonic() - t0) * 1000),
        ))
    except OllamaError as exc:
        results.append(WarmupModelResult(
            model=settings.embedding_model,
            success=False,
            latency_ms=int((time.monotonic() - t0) * 1000),
            error=str(exc),
        ))

    # Vision model warmup — omitted by default to avoid loading a large model
    # unnecessarily. Uncomment if you want eager loading:
    # results.append(await _warmup_vision())

    total_ms = int((time.monotonic() - start_total) * 1000)
    logger.info("Warmup complete in %dms: %s", total_ms, [r.model for r in results if r.success])
    return WarmupResponse(results=results, total_ms=total_ms)
