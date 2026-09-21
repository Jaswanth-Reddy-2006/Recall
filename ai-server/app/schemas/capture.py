"""Pydantic schemas for capture (request bodies to /analyze/* routes)."""

from typing import List, Literal, Optional
from pydantic import BaseModel


class TextAnalysisRequest(BaseModel):
    """Request body for POST /analyze/text."""

    text: str
    source_type: Literal["note", "text", "mixed"] = "note"
    source_app: Optional[str] = None
    # ISO-8601 datetime string from device — used for relative date resolution
    device_datetime: Optional[str] = None
    # IANA timezone name e.g. "Asia/Kolkata"
    timezone: Optional[str] = None


class LinkAnalysisRequest(BaseModel):
    """Request body for POST /analyze/link."""

    url: str
    # Optional page metadata the client may have retrieved before calling us
    page_title: Optional[str] = None
    page_description: Optional[str] = None
    source_app: Optional[str] = None
    device_datetime: Optional[str] = None
    timezone: Optional[str] = None


class CallAnalysisRequest(BaseModel):
    """Request body for POST /analyze/call."""

    transcript: str
    participants: Optional[List[str]] = None
    call_title: Optional[str] = None
    duration_sec: Optional[int] = None
    device_datetime: Optional[str] = None
    timezone: Optional[str] = None
