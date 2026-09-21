"""Ollama HTTP client — the ONLY module that communicates with Ollama directly.

All other services must go through this client. This isolation means we can
swap Ollama for another inference backend without touching business logic.

Ollama REST API reference:
  POST /api/chat          — text + vision inference
  POST /api/embed         — embedding generation
  GET  /api/tags          — list installed models
  POST /api/show          — model metadata
"""

import logging
import time
from typing import Any, Dict, List, Optional

import httpx

from app.config import settings

logger = logging.getLogger(__name__)


class OllamaError(Exception):
    """Raised when Ollama returns an error or is unreachable."""

    def __init__(self, message: str, status_code: Optional[int] = None):
        super().__init__(message)
        self.status_code = status_code


class OllamaClient:
    """Async HTTP client wrapping the Ollama REST API."""

    def __init__(self) -> None:
        self._base_url = settings.ollama_base_url.rstrip("/")

    # ── Internal helpers ──────────────────────────────────────────────────────

    def _client(self, timeout: float) -> httpx.AsyncClient:
        return httpx.AsyncClient(
            base_url=self._base_url,
            timeout=httpx.Timeout(timeout, connect=10.0),
        )

    # ── Public API ────────────────────────────────────────────────────────────

    async def health(self) -> bool:
        """Return True if Ollama is reachable."""
        try:
            async with self._client(timeout=5.0) as client:
                resp = await client.get("/")
                return resp.status_code == 200
        except Exception as exc:
            logger.debug("Ollama health check failed: %s", exc)
            return False

    async def list_models(self) -> List[str]:
        """Return the list of model names currently installed in Ollama."""
        try:
            async with self._client(timeout=10.0) as client:
                resp = await client.get("/api/tags")
                resp.raise_for_status()
                data = resp.json()
                return [m["name"] for m in data.get("models", [])]
        except httpx.HTTPStatusError as exc:
            raise OllamaError(
                f"Failed to list models: {exc.response.text}", exc.response.status_code
            ) from exc
        except Exception as exc:
            raise OllamaError(f"Cannot reach Ollama: {exc}") from exc

    async def model_exists(self, model_name: str) -> bool:
        """Return True if a specific model is installed.

        Ollama model names may include or omit the ':latest' tag, so we do a
        prefix match as well as an exact match.
        """
        try:
            installed = await self.list_models()
        except OllamaError:
            return False

        # Exact match first
        if model_name in installed:
            return True

        # Prefix match — e.g. "qwen3:8b" matches "qwen3:8b" and
        # handles tags like "qwen3:8b-instruct-q4_K_M"
        base = model_name.split(":")[0]
        tag = model_name.split(":")[1] if ":" in model_name else None
        for installed_name in installed:
            i_base = installed_name.split(":")[0]
            i_tag = installed_name.split(":")[1] if ":" in installed_name else None
            if i_base == base and (tag is None or i_tag == tag):
                return True
        return False

    async def chat(
        self,
        model: str,
        messages: List[Dict[str, Any]],
        temperature: float = 0.1,
        timeout: Optional[float] = None,
    ) -> str:
        """Send a chat request and return the assistant reply as a string.

        Args:
            model: Ollama model name (e.g. "qwen3:8b").
            messages: OpenAI-style message list.
            temperature: Sampling temperature.
            timeout: Override the default timeout.

        Returns:
            The assistant message content string.

        Raises:
            OllamaError: On HTTP error or network failure.
        """
        t = timeout or settings.ai_request_timeout
        payload = {
            "model": model,
            "messages": messages,
            "stream": False,
            "options": {"temperature": temperature},
        }

        start = time.monotonic()
        try:
            async with self._client(timeout=float(t)) as client:
                resp = await client.post("/api/chat", json=payload)
                resp.raise_for_status()
        except httpx.HTTPStatusError as exc:
            raise OllamaError(
                f"Ollama chat error [{exc.response.status_code}]: {exc.response.text}",
                exc.response.status_code,
            ) from exc
        except httpx.TimeoutException as exc:
            raise OllamaError(f"Ollama request timed out after {t}s") from exc
        except Exception as exc:
            raise OllamaError(f"Cannot reach Ollama: {exc}") from exc

        elapsed_ms = int((time.monotonic() - start) * 1000)
        data = resp.json()

        content = data.get("message", {}).get("content", "")
        logger.debug(
            "ollama.chat model=%s latency=%dms tokens_in=%s tokens_out=%s",
            model,
            elapsed_ms,
            data.get("prompt_eval_count", "?"),
            data.get("eval_count", "?"),
        )
        return content

    async def vision(
        self,
        model: str,
        system_prompt: str,
        user_message: str,
        image_base64: str,
        temperature: float = 0.1,
        timeout: Optional[float] = None,
    ) -> str:
        """Send an image + text request to a vision-language model.

        Args:
            model: Ollama VLM name (e.g. "qwen2.5vl:3b").
            system_prompt: System-level instruction.
            user_message: User turn text.
            image_base64: Base-64 encoded image bytes (no data URI prefix).
            temperature: Sampling temperature.
            timeout: Override the default timeout.

        Returns:
            The assistant message content string.
        """
        t = timeout or settings.ai_vision_timeout
        messages = [
            {"role": "system", "content": system_prompt},
            {
                "role": "user",
                "content": user_message,
                "images": [image_base64],
            },
        ]
        return await self.chat(model=model, messages=messages, temperature=temperature, timeout=t)

    async def embed(
        self,
        model: str,
        texts: List[str],
        timeout: Optional[float] = None,
    ) -> List[List[float]]:
        """Generate embeddings for a list of texts.

        Uses Ollama's /api/embed endpoint (batch capable).

        Args:
            model: Embedding model name (e.g. "nomic-embed-text:v1.5").
            texts: List of strings to embed. Include Nomic prefixes before calling.
            timeout: Request timeout override.

        Returns:
            List of embedding vectors (one per input text).
        """
        t = timeout or 60.0
        payload = {"model": model, "input": texts}

        start = time.monotonic()
        try:
            async with self._client(timeout=float(t)) as client:
                resp = await client.post("/api/embed", json=payload)
                resp.raise_for_status()
        except httpx.HTTPStatusError as exc:
            raise OllamaError(
                f"Ollama embed error [{exc.response.status_code}]: {exc.response.text}",
                exc.response.status_code,
            ) from exc
        except httpx.TimeoutException as exc:
            raise OllamaError(f"Ollama embed timed out after {t}s") from exc
        except Exception as exc:
            raise OllamaError(f"Cannot reach Ollama for embedding: {exc}") from exc

        elapsed_ms = int((time.monotonic() - start) * 1000)
        data = resp.json()

        # Ollama returns {"embeddings": [[...]]}
        embeddings = data.get("embeddings", [])
        logger.debug(
            "ollama.embed model=%s texts=%d latency=%dms dim=%d",
            model,
            len(texts),
            elapsed_ms,
            len(embeddings[0]) if embeddings else 0,
        )
        return embeddings


# Singleton instance used by all services
ollama_client = OllamaClient()
