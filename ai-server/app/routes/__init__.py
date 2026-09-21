"""Routes package."""
from .health import router as health_router
from .analyze import router as analyze_router
from .embeddings import router as embeddings_router
from .search import router as search_router
from .warmup import router as warmup_router

__all__ = [
    "health_router",
    "analyze_router",
    "embeddings_router",
    "search_router",
    "warmup_router",
]
