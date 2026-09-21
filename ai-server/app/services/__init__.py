"""Services package — exposes singleton instances."""
from .ollama_client import OllamaClient, OllamaError, ollama_client
from .vision_service import VisionService, VisionServiceError, vision_service
from .reasoning_service import ReasoningService, ReasoningServiceError, reasoning_service
from .embedding_service import EmbeddingService, EmbeddingServiceError, embedding_service
from .memory_service import MemoryService, memory_service

__all__ = [
    "OllamaClient", "OllamaError", "ollama_client",
    "VisionService", "VisionServiceError", "vision_service",
    "ReasoningService", "ReasoningServiceError", "reasoning_service",
    "EmbeddingService", "EmbeddingServiceError", "embedding_service",
    "MemoryService", "memory_service",
]
