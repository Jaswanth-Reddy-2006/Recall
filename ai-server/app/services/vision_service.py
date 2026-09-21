"""Vision service — Stage 1 of the screenshot pipeline.

Responsibilities:
- Accept an image (bytes or file path)
- Resize/compress if necessary (ImagePreprocessor)
- Encode to base64
- Call Qwen2.5-VL via OllamaClient
- Parse the JSON response into a VisionResult
- Return VisionResult (or raise VisionServiceError)

This service does NOT call Qwen3. The clean separation means failures in the
vision stage can be diagnosed independently of the reasoning stage.
"""

import base64
import io
import json
import logging
import re
import time
from typing import Optional

from PIL import Image

from app.config import settings
from app.prompts.vision import VISION_SYSTEM_PROMPT, build_vision_user_message
from app.schemas.memory import VisionResult
from app.services.ollama_client import OllamaClient, OllamaError

logger = logging.getLogger(__name__)


class VisionServiceError(Exception):
    pass


class ImagePreprocessor:
    """Resize and compress images before sending to the vision model.

    We target a maximum of 1280px on the longest edge — enough for text
    recognition while keeping inference fast. The original bytes are NEVER
    modified; we work on an in-memory copy.
    """

    MAX_LONG_EDGE = 1280
    JPEG_QUALITY = 85

    @classmethod
    def prepare(cls, image_bytes: bytes) -> str:
        """
        Accept raw image bytes, resize if necessary, and return a base64 string
        suitable for the Ollama vision API.

        Returns:
            Base-64 encoded JPEG string (no data URI prefix).
        """
        try:
            img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        except Exception as exc:
            raise VisionServiceError(f"Cannot decode image: {exc}") from exc

        w, h = img.size
        long_edge = max(w, h)
        if long_edge > cls.MAX_LONG_EDGE:
            scale = cls.MAX_LONG_EDGE / long_edge
            new_w, new_h = int(w * scale), int(h * scale)
            img = img.resize((new_w, new_h), Image.LANCZOS)
            logger.debug("ImagePreprocessor: resized %dx%d → %dx%d", w, h, new_w, new_h)

        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=cls.JPEG_QUALITY, optimize=True)
        return base64.b64encode(buf.getvalue()).decode("utf-8")


class VisionService:
    """Orchestrates image → VisionResult using Qwen2.5-VL."""

    def __init__(self, client: OllamaClient) -> None:
        self._client = client

    async def analyse(
        self,
        image_bytes: bytes,
        source_app: Optional[str] = None,
    ) -> VisionResult:
        """
        Stage 1: Run Qwen2.5-VL on the image and return a structured VisionResult.

        Args:
            image_bytes: Raw bytes of the uploaded image.
            source_app: Optional originating app name (e.g. "WhatsApp").

        Returns:
            VisionResult with extracted text, content_type, entities, etc.

        Raises:
            VisionServiceError: If the image cannot be processed or the model fails.
        """
        start = time.monotonic()

        # Step 1: preprocess image
        try:
            image_b64 = ImagePreprocessor.prepare(image_bytes)
        except VisionServiceError:
            raise
        except Exception as exc:
            raise VisionServiceError(f"Image preprocessing failed: {exc}") from exc

        # Step 2: call Qwen2.5-VL
        user_msg = build_vision_user_message(source_app=source_app)
        try:
            raw_response = await self._client.vision(
                model=settings.qwen_vision_model,
                system_prompt=VISION_SYSTEM_PROMPT,
                user_message=user_msg,
                image_base64=image_b64,
                temperature=settings.vision_temperature,
            )
        except OllamaError as exc:
            raise VisionServiceError(f"Vision model error: {exc}") from exc

        # Step 3: parse JSON response
        vision_result = self._parse_vision_response(raw_response)

        elapsed_ms = int((time.monotonic() - start) * 1000)
        logger.info(
            "vision.analyse content_type=%s latency=%dms",
            vision_result.content_type,
            elapsed_ms,
        )
        return vision_result

    def _parse_vision_response(self, raw: str) -> VisionResult:
        """Extract JSON from the model response and validate it as VisionResult."""
        cleaned = self._extract_json(raw)
        try:
            data = json.loads(cleaned)
            return VisionResult(**data)
        except (json.JSONDecodeError, ValueError) as exc:
            logger.warning(
                "VisionService: could not parse model response as VisionResult. "
                "Returning degraded result. Raw: %.200s", raw
            )
            # Return a degraded result — raw text still goes to Qwen3
            return VisionResult(
                raw_text=raw[:2000],
                content_type="unknown",
                visual_summary="Vision model returned non-JSON output.",
            )

    @staticmethod
    def _extract_json(text: str) -> str:
        """Strip markdown code fences and extract the first JSON object/array."""
        # Remove ```json ... ``` fences
        text = re.sub(r"```(?:json)?\s*", "", text).strip().rstrip("`").strip()
        # Find the first { ... } block
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return match.group(0)
        return text


# Singleton
vision_service = VisionService(client=None)  # type: ignore[arg-type]
# Client is injected at app startup via _init_services()
