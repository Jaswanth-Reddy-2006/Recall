"""Centralised configuration — reads from .env (or environment variables).

All other modules should import `settings` from here rather than reading
os.environ directly so configuration is validated at startup.
"""

from functools import lru_cache
from typing import List

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Ollama ──────────────────────────────────────────────────────────────
    ollama_base_url: str = "http://localhost:11434"
    qwen_text_model: str = "qwen3:8b"
    qwen_vision_model: str = "qwen2.5vl:3b"
    embedding_model: str = "nomic-embed-text:v1.5"

    # ── Server ───────────────────────────────────────────────────────────────
    ai_server_port: int = 8000
    ai_server_host: str = "0.0.0.0"

    # ── Timeouts (seconds) ───────────────────────────────────────────────────
    ai_request_timeout: int = 120
    ai_vision_timeout: int = 180

    # ── CORS ─────────────────────────────────────────────────────────────────
    cors_allowed_origins: str = (
        "http://localhost:8081,http://localhost:19006,http://localhost:3000"
    )

    # ── Logging ──────────────────────────────────────────────────────────────
    log_level: str = "INFO"

    # ── Model settings ───────────────────────────────────────────────────────
    # Low temperature is intentional — extraction tasks need determinism.
    vision_temperature: float = 0.1
    reasoning_temperature: float = 0.1

    @property
    def cors_origins_list(self) -> List[str]:
        """Return CORS origins as a Python list."""
        return [o.strip() for o in self.cors_allowed_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    """Return the cached Settings singleton."""
    return Settings()


# Convenience alias used throughout the app
settings: Settings = get_settings()
