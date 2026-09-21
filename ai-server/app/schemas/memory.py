"""Pydantic schemas for memory analysis responses."""

from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel, Field


# ── Vision result (Qwen2.5-VL output) ───────────────────────────────────────

class VisionResult(BaseModel):
    """Structured output from the vision model.

    The vision model is only asked to extract what is *visually present*.
    It does NOT produce the final RecallMemoryAnalysis — that is Qwen3's job.
    """

    raw_text: str = Field(default="", description="All visible text in the image.")
    content_type: str = Field(
        default="unknown",
        description=(
            "Type of content detected. Examples: whatsapp_screenshot, "
            "college_notice, error_log, receipt, code_screenshot, document, unknown."
        ),
    )
    entities: List[str] = Field(
        default_factory=list,
        description="Named entities explicitly visible (people, orgs, products).",
    )
    dates: List[str] = Field(
        default_factory=list,
        description="Dates/times explicitly visible in the image.",
    )
    urls: List[str] = Field(
        default_factory=list,
        description="URLs visible in the image.",
    )
    locations: List[str] = Field(
        default_factory=list,
        description="Locations explicitly visible.",
    )
    possible_actions: List[str] = Field(
        default_factory=list,
        description="Possible actions visible in the content.",
    )
    visual_summary: str = Field(
        default="",
        description="One-sentence summary of what the image shows.",
    )


# ── Action extracted from content ────────────────────────────────────────────

class ActionAnalysis(BaseModel):
    """A single action/commitment detected in captured content."""

    title: str
    type: Literal["task", "deadline", "follow_up", "waiting"] = "task"
    due_date: Optional[str] = None
    person: Optional[str] = None
    priority: Literal["high", "medium", "low"] = "medium"


# ── Confidence scores (internal — not shown in UI) ───────────────────────────

class ConfidenceScores(BaseModel):
    title: Optional[float] = None
    category: Optional[float] = None
    action: Optional[float] = None


# ── Main memory analysis result ──────────────────────────────────────────────

VALID_CATEGORIES = {
    "College", "Development", "Learning", "Work",
    "Personal", "Travel", "Finance", "Health", "Other",
}


class RecallMemoryAnalysis(BaseModel):
    """Structured memory object produced by Qwen3 reasoning.

    This is the canonical output that reaches the React Native client.
    """

    title: str = Field(description="Short, descriptive title (≤ 60 chars).")
    summary: str = Field(description="1–3 sentence summary of the captured content.")
    category: str = Field(
        default="Other",
        description=f"One of: {', '.join(sorted(VALID_CATEGORIES))}",
    )
    topics: List[str] = Field(
        default_factory=list,
        description="2–6 meaningful topic keywords.",
    )
    tags: List[str] = Field(
        default_factory=list,
        description="2–6 meaningful tags for indexing.",
    )
    actions: List[ActionAnalysis] = Field(
        default_factory=list,
        description="Actions/commitments detected in the content.",
    )
    people: List[str] = Field(
        default_factory=list,
        description="People explicitly mentioned.",
    )
    organizations: List[str] = Field(
        default_factory=list,
        description="Organizations explicitly mentioned.",
    )
    dates: List[str] = Field(
        default_factory=list,
        description="Dates/deadlines mentioned.",
    )
    # Internal debugging — not rendered in UI
    confidence: Optional[ConfidenceScores] = None


# ── Call Intelligence schemas ────────────────────────────────────────────────

class CallTaskAnalysis(BaseModel):
    """A detected commitment/task extracted from a call transcript."""

    id: str
    task: str
    assigned_to: Optional[str] = None
    mentioned_by: Optional[str] = None
    deadline: Optional[str] = None
    confidence: Optional[float] = None
    evidence: str


class CallDecisionAnalysis(BaseModel):
    """A key decision identified during the conversation."""

    id: str
    decision: str
    context: Optional[str] = None


class CallAnalysisModel(BaseModel):
    """Full structured extraction from a call recording or transcript."""

    title: str
    participants: List[str] = Field(default_factory=list)
    summary: str
    tasks: List[CallTaskAnalysis] = Field(default_factory=list)
    deadlines: List[str] = Field(default_factory=list)
    decisions: List[CallDecisionAnalysis] = Field(default_factory=list)
    follow_ups: List[str] = Field(default_factory=list)
    important_points: List[str] = Field(default_factory=list)


# ── Full analysis envelopes (server → client) ────────────────────────────────

class ModelInfo(BaseModel):
    model: str


class AnalysisResponse(BaseModel):
    """Top-level response envelope returned by /analyze/* routes."""

    analysis: RecallMemoryAnalysis
    vision: Optional[ModelInfo] = None   # Only present for image analysis
    reasoning: ModelInfo
    # Pipeline stage durations in milliseconds (for diagnostics panel)
    latency_ms: Optional[Dict[str, int]] = None


class CallAnalysisResponse(BaseModel):
    """Top-level response envelope returned by POST /analyze/call."""

    call_analysis: CallAnalysisModel
    reasoning: ModelInfo
    latency_ms: Optional[Dict[str, int]] = None
