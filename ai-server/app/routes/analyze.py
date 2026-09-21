"""POST /analyze/image, POST /analyze/text, POST /analyze/link, POST /analyze/call

Image pipeline:   image bytes → VisionService (Qwen2.5-VL) → VisionResult
                               → ReasoningService (Qwen3)  → RecallMemoryAnalysis
Text pipeline:    text        → ReasoningService (Qwen3)   → RecallMemoryAnalysis
Link pipeline:    url + meta  → ReasoningService (Qwen3)   → RecallMemoryAnalysis
Call pipeline:    transcript  → ReasoningService (Qwen3)   → CallAnalysisResponse
"""

import logging
import time
from typing import Optional

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status

from app.config import settings
from app.schemas.capture import CallAnalysisRequest, LinkAnalysisRequest, TextAnalysisRequest
from app.schemas.memory import AnalysisResponse, CallAnalysisResponse, ModelInfo
from app.services.reasoning_service import ReasoningServiceError, reasoning_service
from app.services.vision_service import VisionServiceError, vision_service

router = APIRouter(prefix="/analyze", tags=["analyze"])
logger = logging.getLogger(__name__)

# Maximum image size accepted (bytes) — 20 MB
MAX_IMAGE_BYTES = 20 * 1024 * 1024


# ── Image analysis ────────────────────────────────────────────────────────────

@router.post("/image", response_model=AnalysisResponse, summary="Analyse a screenshot or image")
async def analyze_image(
    image: UploadFile = File(..., description="Image file (JPEG, PNG, WEBP, etc.)"),
    source_app: Optional[str] = Form(None, description="Originating app e.g. WhatsApp"),
    device_datetime: Optional[str] = Form(None, description="ISO-8601 datetime from device"),
    timezone: Optional[str] = Form(None, description="IANA timezone e.g. Asia/Kolkata"),
) -> AnalysisResponse:
    """Two-stage image analysis pipeline.

    Stage 1 — Qwen2.5-VL: visual understanding (text extraction, content type, entities).
    Stage 2 — Qwen3:      structured memory construction (title, summary, category, actions).

    Stages are kept separate so failures can be diagnosed independently.
    """
    if image.content_type and not image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported content type: {image.content_type}. Send an image file.",
        )

    image_bytes = await image.read()
    if len(image_bytes) > MAX_IMAGE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Image too large ({len(image_bytes)} bytes). Maximum is {MAX_IMAGE_BYTES} bytes.",
        )
    if len(image_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Empty image file received.",
        )

    latency: dict[str, int] = {}

    # ── Stage 1: Vision ───────────────────────────────────────────────────────
    t0 = time.monotonic()
    try:
        vision_result = await vision_service.analyse(
            image_bytes=image_bytes,
            source_app=source_app,
        )
    except VisionServiceError as exc:
        logger.error("Vision stage failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Vision model error: {exc}",
        )
    latency["vision_ms"] = int((time.monotonic() - t0) * 1000)

    # ── Stage 2: Reasoning ────────────────────────────────────────────────────
    t1 = time.monotonic()
    try:
        analysis = await reasoning_service.analyse_vision_result(
            vision_result=vision_result,
            source_app=source_app,
            device_datetime=device_datetime,
            timezone=timezone,
        )
    except ReasoningServiceError as exc:
        logger.error("Reasoning stage failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Reasoning model error: {exc}",
        )
    latency["reasoning_ms"] = int((time.monotonic() - t1) * 1000)

    return AnalysisResponse(
        analysis=analysis,
        vision=ModelInfo(model=settings.qwen_vision_model),
        reasoning=ModelInfo(model=settings.qwen_text_model),
        latency_ms=latency,
    )


# ── Text / Note analysis ──────────────────────────────────────────────────────

@router.post("/text", response_model=AnalysisResponse, summary="Analyse plain text or a note")
async def analyze_text(request: TextAnalysisRequest) -> AnalysisResponse:
    """Single-stage text pipeline (Qwen3 only — no vision model needed)."""
    if not request.text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Text content is empty.",
        )

    t0 = time.monotonic()
    try:
        analysis = await reasoning_service.analyse_text(
            text=request.text,
            source_type=request.source_type,
            source_app=request.source_app,
            device_datetime=request.device_datetime,
            timezone=request.timezone,
        )
    except ReasoningServiceError as exc:
        logger.error("Text analysis failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Reasoning model error: {exc}",
        )

    return AnalysisResponse(
        analysis=analysis,
        reasoning=ModelInfo(model=settings.qwen_text_model),
        latency_ms={"reasoning_ms": int((time.monotonic() - t0) * 1000)},
    )


# ── Link analysis ─────────────────────────────────────────────────────────────

@router.post("/link", response_model=AnalysisResponse, summary="Analyse a URL")
async def analyze_link(request: LinkAnalysisRequest) -> AnalysisResponse:
    """Single-stage link pipeline (Qwen3 only)."""
    if not request.url.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="URL is empty.",
        )

    t0 = time.monotonic()
    try:
        analysis = await reasoning_service.analyse_link(
            url=request.url,
            page_title=request.page_title,
            page_description=request.page_description,
            source_app=request.source_app,
            device_datetime=request.device_datetime,
            timezone=request.timezone,
        )
    except ReasoningServiceError as exc:
        logger.error("Link analysis failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Reasoning model error: {exc}",
        )

    return AnalysisResponse(
        analysis=analysis,
        reasoning=ModelInfo(model=settings.qwen_text_model),
        latency_ms={"reasoning_ms": int((time.monotonic() - t0) * 1000)},
    )


# ── Call Intelligence analysis ────────────────────────────────────────────────

@router.post("/call", response_model=CallAnalysisResponse, summary="Analyse a call transcript")
async def analyze_call(request: CallAnalysisRequest) -> CallAnalysisResponse:
    """Call Intelligence: Extracts summary, participants, tasks with evidence, decisions, and deadlines."""
    if not request.transcript.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Transcript is empty.",
        )

    t0 = time.monotonic()
    try:
        call_analysis = await reasoning_service.analyse_call(
            transcript=request.transcript,
            participants=request.participants,
            call_title=request.call_title,
            device_datetime=request.device_datetime,
            timezone=request.timezone,
        )
    except ReasoningServiceError as exc:
        logger.error("Call analysis failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Reasoning model error: {exc}",
        )

    return CallAnalysisResponse(
        call_analysis=call_analysis,
        reasoning=ModelInfo(model=settings.qwen_text_model),
        latency_ms={"reasoning_ms": int((time.monotonic() - t0) * 1000)},
    )
