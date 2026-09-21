"""GET /health and GET /models — Ollama reachability and model presence.

These endpoints are the source of truth for the React Native AI Engine status panel.
We never assume models are installed — we explicitly query Ollama's /api/tags.
"""

import logging
from typing import Dict

from fastapi import APIRouter
from pydantic import BaseModel

from app.config import settings
from app.services.ollama_client import ollama_client

router = APIRouter(tags=["health"])
logger = logging.getLogger(__name__)


# ── Response schemas ──────────────────────────────────────────────────────────

class ModelStatus(BaseModel):
    text: bool
    vision: bool
    embedding: bool


class HealthResponse(BaseModel):
    status: str            # "ok" | "degraded" | "offline"
    ollama: bool
    models: ModelStatus
    ollama_url: str        # Let the client confirm which Ollama it's talking to


class ModelsResponse(BaseModel):
    qwen_text: str
    qwen_vision: str
    embedding: str
    installed: ModelStatus


# ── Routes ────────────────────────────────────────────────────────────────────

@router.get("/health", response_model=HealthResponse, summary="Ollama health check")
async def health() -> HealthResponse:
    """Check whether Ollama is reachable and the required models are installed.

    The mobile client polls this endpoint to update its AI Engine status panel.
    A `status: "ok"` response means all three models are present and ready.
    """
    ollama_alive = await ollama_client.health()

    if not ollama_alive:
        logger.warning("/health: Ollama is not reachable at %s", settings.ollama_base_url)
        return HealthResponse(
            status="offline",
            ollama=False,
            models=ModelStatus(text=False, vision=False, embedding=False),
            ollama_url=settings.ollama_base_url,
        )

    # Check each model individually — don't assume they're installed
    text_ok = await ollama_client.model_exists(settings.qwen_text_model)
    vision_ok = await ollama_client.model_exists(settings.qwen_vision_model)
    embed_ok = await ollama_client.model_exists(settings.embedding_model)

    all_ok = text_ok and vision_ok and embed_ok
    some_ok = text_ok or vision_ok or embed_ok

    status = "ok" if all_ok else ("degraded" if some_ok else "offline")

    logger.info(
        "/health status=%s text=%s vision=%s embed=%s",
        status, text_ok, vision_ok, embed_ok
    )

    return HealthResponse(
        status=status,
        ollama=True,
        models=ModelStatus(text=text_ok, vision=vision_ok, embedding=embed_ok),
        ollama_url=settings.ollama_base_url,
    )


@router.get("/models", response_model=ModelsResponse, summary="List configured models")
async def models() -> ModelsResponse:
    """Return configured model names and which ones are currently installed."""
    ollama_alive = await ollama_client.health()
    if not ollama_alive:
        return ModelsResponse(
            qwen_text=settings.qwen_text_model,
            qwen_vision=settings.qwen_vision_model,
            embedding=settings.embedding_model,
            installed=ModelStatus(text=False, vision=False, embedding=False),
        )

    text_ok = await ollama_client.model_exists(settings.qwen_text_model)
    vision_ok = await ollama_client.model_exists(settings.qwen_vision_model)
    embed_ok = await ollama_client.model_exists(settings.embedding_model)

    return ModelsResponse(
        qwen_text=settings.qwen_text_model,
        qwen_vision=settings.qwen_vision_model,
        embedding=settings.embedding_model,
        installed=ModelStatus(text=text_ok, vision=vision_ok, embedding=embed_ok),
    )
