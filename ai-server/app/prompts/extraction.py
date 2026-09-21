"""Prompts for the reasoning model (Qwen3) — memory extraction and call intelligence."""

from typing import List, Optional

# ── Memory System prompt ──────────────────────────────────────────────────────
EXTRACTION_SYSTEM_PROMPT = """You are Recall's local memory extraction engine.

Your job is to analyse captured content (text, note, link, or vision output from an image) and produce a structured memory object.

Rules:
- Return ONLY valid JSON — absolutely no prose, markdown fences, or text outside the JSON.
- Do NOT hallucinate. Only include information explicitly present in the input.
- Keep the title short (≤ 60 characters).
- Summary should be 1–3 sentences.
- Use 2–6 meaningful tags and topics. Avoid generic tags like "important", "thing", "stuff".
- Category MUST be exactly one of: College, Development, Learning, Work, Personal, Travel, Finance, Health, Other.
- For due_date: use the exact date string from the content, or null if unknown.
- For actions: only create an action if the content clearly implies a commitment, task, or deadline.
- action.type must be one of: task, deadline, follow_up, waiting.
- action.priority must be one of: high, medium, low.
- If no action is present, return an empty actions array [].

Return this exact JSON structure:
{
  "title": "<short descriptive title>",
  "summary": "<1–3 sentence summary>",
  "category": "<category>",
  "topics": ["<topic>"],
  "tags": ["<tag>"],
  "actions": [
    {
      "title": "<action title>",
      "type": "<task|deadline|follow_up|waiting>",
      "due_date": "<date string or null>",
      "person": "<person name or null>",
      "priority": "<high|medium|low>"
    }
  ],
  "people": ["<person>"],
  "organizations": ["<org>"],
  "dates": ["<date>"],
  "confidence": {
    "title": 0.0,
    "category": 0.0,
    "action": 0.0
  }
}"""

# ── Call Intelligence System prompt ───────────────────────────────────────────
CALL_EXTRACTION_SYSTEM_PROMPT = """You are Recall's local Call Intelligence engine.

Your job is to analyse a call recording transcript and extract:
1. Executive summary of the conversation
2. Identified participants (roles like Manager, Lead, Client, Teammate only if explicitly supported by text)
3. Actionable tasks and commitments (EACH task MUST include verbatim evidence from the transcript)
4. Deadlines mentioned
5. Key decisions made during the call
6. Follow-up items
7. Important contextual points

Rules:
- Return ONLY valid JSON — absolutely no prose or markdown outside the JSON.
- Do NOT invent or assume responsibilities not stated in the transcript.
- For tasks: 'evidence' MUST be an exact quote or direct snippet from the transcript proving the commitment.
- 'assigned_to': 'You' if the caller tasks the listener/user, or specific name/role if mentioned.
- 'mentioned_by': who assigned or raised the task.

Return this exact JSON structure:
{
  "title": "<short descriptive title of the call>",
  "participants": ["<participant 1>", "<participant 2>"],
  "summary": "<concise 2-4 sentence executive summary>",
  "tasks": [
    {
      "id": "<task_1>",
      "task": "<actionable commitment description>",
      "assigned_to": "<You or name or null>",
      "mentioned_by": "<name or role or null>",
      "deadline": "<deadline date/time or null>",
      "confidence": 0.9,
      "evidence": "<exact quote from transcript>"
    }
  ],
  "deadlines": ["<extracted deadline strings>"],
  "decisions": [
    {
      "id": "<dec_1>",
      "decision": "<decision text>",
      "context": "<optional context>"
    }
  ],
  "follow_ups": ["<follow up items>"],
  "important_points": ["<key information>"]
}"""

# ── User message templates ────────────────────────────────────────────────────

def build_text_extraction_message(
    text: str,
    source_type: str = "note",
    source_app: Optional[str] = None,
    device_datetime: Optional[str] = None,
    timezone: Optional[str] = None,
) -> str:
    """User turn for plain text / note analysis."""
    parts = [f"Source type: {source_type}"]
    if source_app:
        parts.append(f"Source app: {source_app}")
    if device_datetime:
        parts.append(f"Current device datetime: {device_datetime}")
    if timezone:
        parts.append(f"Timezone: {timezone}")
    parts.append("")
    parts.append("Content to analyse:")
    parts.append(text)
    parts.append("")
    parts.append("Return the JSON memory object now.")
    return "\n".join(parts)


def build_vision_extraction_message(
    vision_result_json: str,
    source_app: Optional[str] = None,
    device_datetime: Optional[str] = None,
    timezone: Optional[str] = None,
) -> str:
    """User turn when Qwen3 receives the output of Qwen2.5-VL."""
    parts = ["Source type: screenshot (image)"]
    if source_app:
        parts.append(f"Source app: {source_app}")
    if device_datetime:
        parts.append(f"Current device datetime: {device_datetime}")
    if timezone:
        parts.append(f"Timezone: {timezone}")
    parts.append("")
    parts.append(
        "The following is the visual understanding output from the vision model "
        "(Qwen2.5-VL). Use it to produce the final structured memory:"
    )
    parts.append(vision_result_json)
    parts.append("")
    parts.append("Return the JSON memory object now.")
    return "\n".join(parts)


def build_link_extraction_message(
    url: str,
    page_title: Optional[str] = None,
    page_description: Optional[str] = None,
    source_app: Optional[str] = None,
    device_datetime: Optional[str] = None,
    timezone: Optional[str] = None,
) -> str:
    """User turn for URL / link analysis."""
    parts = ["Source type: link"]
    if source_app:
        parts.append(f"Source app: {source_app}")
    if device_datetime:
        parts.append(f"Current device datetime: {device_datetime}")
    if timezone:
        parts.append(f"Timezone: {timezone}")
    parts.append("")
    parts.append(f"URL: {url}")
    if page_title:
        parts.append(f"Page title: {page_title}")
    if page_description:
        parts.append(f"Page description: {page_description}")
    parts.append("")
    parts.append(
        "Analyse this URL and any available metadata. "
        "Mark uncertain fields explicitly. Do NOT hallucinate webpage content."
    )
    parts.append("Return the JSON memory object now.")
    return "\n".join(parts)


def build_call_extraction_message(
    transcript: str,
    participants: Optional[List[str]] = None,
    call_title: Optional[str] = None,
    device_datetime: Optional[str] = None,
    timezone: Optional[str] = None,
) -> str:
    """User turn for call transcript analysis."""
    parts = ["Source type: call transcript"]
    if call_title:
        parts.append(f"Call title: {call_title}")
    if participants:
        parts.append(f"Known participants: {', '.join(participants)}")
    if device_datetime:
        parts.append(f"Call timestamp: {device_datetime}")
    if timezone:
        parts.append(f"Timezone: {timezone}")
    parts.append("")
    parts.append("Transcript to analyse:")
    parts.append(transcript)
    parts.append("")
    parts.append("Extract all tasks, evidence, decisions, and summaries as instructed in valid JSON.")
    return "\n".join(parts)


# ── Correction prompt (used on JSON parse failure) ────────────────────────────
CORRECTION_SYSTEM_PROMPT = """You previously returned a response that could not be parsed as valid JSON.
Return ONLY the corrected JSON object — no prose, no markdown, no explanation.
The JSON must exactly match the required schema."""

def build_correction_message(bad_response: str) -> str:
    return (
        f"Your previous response was:\n\n{bad_response}\n\n"
        "This is not valid JSON. Please return only the corrected JSON object."
    )
