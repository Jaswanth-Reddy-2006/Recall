"""Recall AI Server — FastAPI application factory.

Start with:
    cd ai-server
    py -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

Or use the setup script:
    .\\..\\scripts\\setup-ai.ps1
"""

import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes import (
    analyze_router,
    embeddings_router,
    health_router,
    search_router,
    warmup_router,
)
from app.services.ollama_client import ollama_client
from app.services.vision_service import vision_service
from app.services.reasoning_service import reasoning_service
from app.services.embedding_service import embedding_service
from app.services.memory_service import memory_service

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper(), logging.INFO),
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)


# ── Service dependency injection ──────────────────────────────────────────────
def _init_services() -> None:
    """Wire the shared OllamaClient singleton into all services.

    Services are created as module-level singletons with `client=None` so that
    the import graph doesn't form a cycle. We inject the real client here at
    startup, after all modules have been imported.
    """
    vision_service._client = ollama_client
    reasoning_service._client = ollama_client
    embedding_service._client = ollama_client
    memory_service._client = ollama_client
    memory_service._embed = embedding_service


# ── Lifespan ──────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Startup and shutdown logic."""
    _init_services()
    logger.info("=" * 60)
    logger.info("  RECALL AI SERVER")
    logger.info("  Ollama: %s", settings.ollama_base_url)
    logger.info("  Text model:   %s", settings.qwen_text_model)
    logger.info("  Vision model: %s", settings.qwen_vision_model)
    logger.info("  Embed model:  %s", settings.embedding_model)
    logger.info("=" * 60)

    # Check Ollama status at startup (informational only — don't block startup)
    ollama_alive = await ollama_client.health()
    if ollama_alive:
        try:
            installed = await ollama_client.list_models()
            logger.info("Ollama is running. Installed models: %s", installed)
        except Exception:
            pass
    else:
        logger.warning(
            "Ollama is NOT reachable at %s. "
            "Start Ollama and pull the required models before making inference requests. "
            "The server will still start — health endpoint will report status accurately.",
            settings.ollama_base_url,
        )

    yield

    logger.info("Recall AI Server shutting down.")


# ── App factory ───────────────────────────────────────────────────────────────
def create_app() -> FastAPI:
    app = FastAPI(
        title="Recall AI Server",
        description=(
            "Local AI gateway for the Recall personal context app. "
            "Routes inference requests to Ollama (Qwen3, Qwen2.5-VL, Nomic Embed)."
        ),
        version="1.0.0",
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # ── CORS ──────────────────────────────────────────────────────────────────
    # Development: allow configured origins (Expo Metro, web dev server).
    # NOTE: We do NOT use allow_origins=["*"] — even in development, we limit
    # to the origins listed in .env CORS_ALLOWED_ORIGINS.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Routers ───────────────────────────────────────────────────────────────
    app.include_router(health_router)
    app.include_router(analyze_router)
    app.include_router(embeddings_router)
    app.include_router(search_router)
    app.include_router(warmup_router)

    return app


app = create_app()
