"""Reasoning service — Stage 2 of all capture pipelines and Call Intelligence.

Responsibilities:
- Accept raw text / vision result / URL metadata / Call transcripts
- Build the appropriate Qwen3 prompt
- Parse and validate JSON into RecallMemoryAnalysis or CallAnalysisModel
- Retry once on parse failure with a correction prompt
- Return structured models (or raise ReasoningServiceError)
"""

import json
import logging
import re
import time
from typing import List, Optional

from app.config import settings
from app.prompts.extraction import (
    CALL_EXTRACTION_SYSTEM_PROMPT,
    CORRECTION_SYSTEM_PROMPT,
    EXTRACTION_SYSTEM_PROMPT,
    build_call_extraction_message,
    build_correction_message,
    build_link_extraction_message,
    build_text_extraction_message,
    build_vision_extraction_message,
)
from app.schemas.memory import CallAnalysisModel, RecallMemoryAnalysis, VisionResult
from app.services.ollama_client import OllamaClient, OllamaError

logger = logging.getLogger(__name__)


class ReasoningServiceError(Exception):
    pass


class ReasoningService:
    """Orchestrates Qwen3 for structured memory extraction and Call Intelligence."""

    def __init__(self, client: OllamaClient) -> None:
        self._client = client

    # ── Public pipeline methods ───────────────────────────────────────────────

    async def analyse_text(
        self,
        text: str,
        source_type: str = "note",
        source_app: Optional[str] = None,
        device_datetime: Optional[str] = None,
        timezone: Optional[str] = None,
    ) -> RecallMemoryAnalysis:
        """Analyse plain text / note content."""
        start = time.monotonic()
        user_msg = build_text_extraction_message(
            text=text,
            source_type=source_type,
            source_app=source_app,
            device_datetime=device_datetime,
            timezone=timezone,
        )
        result = await self._run_extraction(user_msg)
        logger.info(
            "reasoning.text latency=%dms category=%s actions=%d",
            int((time.monotonic() - start) * 1000),
            result.category,
            len(result.actions),
        )
        return result

    async def analyse_vision_result(
        self,
        vision_result: VisionResult,
        source_app: Optional[str] = None,
        device_datetime: Optional[str] = None,
        timezone: Optional[str] = None,
    ) -> RecallMemoryAnalysis:
        """Stage 2: receive VisionResult from Qwen2.5-VL, produce RecallMemoryAnalysis."""
        start = time.monotonic()
        vision_json = vision_result.model_dump_json(indent=2)
        user_msg = build_vision_extraction_message(
            vision_result_json=vision_json,
            source_app=source_app,
            device_datetime=device_datetime,
            timezone=timezone,
        )
        result = await self._run_extraction(user_msg)
        logger.info(
            "reasoning.vision_followup latency=%dms category=%s actions=%d",
            int((time.monotonic() - start) * 1000),
            result.category,
            len(result.actions),
        )
        return result

    async def analyse_link(
        self,
        url: str,
        page_title: Optional[str] = None,
        page_description: Optional[str] = None,
        source_app: Optional[str] = None,
        device_datetime: Optional[str] = None,
        timezone: Optional[str] = None,
    ) -> RecallMemoryAnalysis:
        """Analyse a URL and any available page metadata."""
        start = time.monotonic()
        user_msg = build_link_extraction_message(
            url=url,
            page_title=page_title,
            page_description=page_description,
            source_app=source_app,
            device_datetime=device_datetime,
            timezone=timezone,
        )
        result = await self._run_extraction(user_msg)
        logger.info(
            "reasoning.link latency=%dms category=%s",
            int((time.monotonic() - start) * 1000),
            result.category,
        )
        return result

    async def analyse_call(
        self,
        transcript: str,
        participants: Optional[List[str]] = None,
        call_title: Optional[str] = None,
        device_datetime: Optional[str] = None,
        timezone: Optional[str] = None,
    ) -> CallAnalysisModel:
        """Call Intelligence: analyse a conversation transcript for tasks, decisions, evidence, summary."""
        start = time.monotonic()
        user_msg = build_call_extraction_message(
            transcript=transcript,
            participants=participants,
            call_title=call_title,
            device_datetime=device_datetime,
            timezone=timezone,
        )
        result = await self._run_call_extraction(user_msg)
        logger.info(
            "reasoning.call latency=%dms tasks=%d decisions=%d",
            int((time.monotonic() - start) * 1000),
            len(result.tasks),
            len(result.decisions),
        )
        return result

    # ── Internal helpers ──────────────────────────────────────────────────────

    async def _run_extraction(self, user_message: str) -> RecallMemoryAnalysis:
        """Run Qwen3 and parse JSON into RecallMemoryAnalysis."""
        messages = [
            {"role": "system", "content": EXTRACTION_SYSTEM_PROMPT},
            {"role": "user", "content": user_message},
        ]

        try:
            raw = await self._client.chat(
                model=settings.qwen_text_model,
                messages=messages,
                temperature=settings.reasoning_temperature,
            )
        except OllamaError as exc:
            raise ReasoningServiceError(f"Reasoning model error: {exc}") from exc

        parsed = self._try_parse_memory(raw)
        if parsed is not None:
            return parsed

        logger.warning("ReasoningService: first attempt invalid JSON. Retrying with correction.")

        correction_messages = [
            {"role": "system", "content": CORRECTION_SYSTEM_PROMPT},
            {"role": "user", "content": build_correction_message(raw)},
        ]
        try:
            raw2 = await self._client.chat(
                model=settings.qwen_text_model,
                messages=correction_messages,
                temperature=0.0,
            )
        except OllamaError as exc:
            raise ReasoningServiceError(f"Correction error: {exc}") from exc

        parsed2 = self._try_parse_memory(raw2)
        if parsed2 is not None:
            return parsed2

        raise ReasoningServiceError(
            f"Reasoning model produced invalid JSON after two attempts. Snippet: {raw2[:400]}"
        )

    async def _run_call_extraction(self, user_message: str) -> CallAnalysisModel:
        """Run Qwen3 and parse JSON into CallAnalysisModel."""
        messages = [
            {"role": "system", "content": CALL_EXTRACTION_SYSTEM_PROMPT},
            {"role": "user", "content": user_message},
        ]

        try:
            raw = await self._client.chat(
                model=settings.qwen_text_model,
                messages=messages,
                temperature=0.1,
            )
        except OllamaError as exc:
            raise ReasoningServiceError(f"Call reasoning model error: {exc}") from exc

        parsed = self._try_parse_call(raw)
        if parsed is not None:
            return parsed

        # Retry once with correction
        correction_messages = [
            {"role": "system", "content": CORRECTION_SYSTEM_PROMPT},
            {"role": "user", "content": build_correction_message(raw)},
        ]
        try:
            raw2 = await self._client.chat(
                model=settings.qwen_text_model,
                messages=correction_messages,
                temperature=0.0,
            )
        except OllamaError as exc:
            raise ReasoningServiceError(f"Correction error: {exc}") from exc

        parsed2 = self._try_parse_call(raw2)
        if parsed2 is not None:
            return parsed2

        raise ReasoningServiceError(
            f"Call reasoning produced invalid JSON after two attempts: {raw2[:400]}"
        )

    @staticmethod
    def _try_parse_memory(raw: str) -> Optional[RecallMemoryAnalysis]:
        cleaned = ReasoningService._extract_json(raw)
        try:
            data = json.loads(cleaned)
            return RecallMemoryAnalysis(**data)
        except (json.JSONDecodeError, ValueError) as exc:
            logger.debug("_try_parse_memory failed: %s", exc)
            return None

    @staticmethod
    def _try_parse_call(raw: str) -> Optional[CallAnalysisModel]:
        cleaned = ReasoningService._extract_json(raw)
        try:
            data = json.loads(cleaned)
            return CallAnalysisModel(**data)
        except (json.JSONDecodeError, ValueError) as exc:
            logger.debug("_try_parse_call failed: %s", exc)
            return None

    @staticmethod
    def _extract_json(text: str) -> str:
        text = re.sub(r"```(?:json)?\s*", "", text).strip().rstrip("`").strip()
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return match.group(0)
        return text


# Singleton (client injected at startup)
reasoning_service = ReasoningService(client=None)  # type: ignore[arg-type]
