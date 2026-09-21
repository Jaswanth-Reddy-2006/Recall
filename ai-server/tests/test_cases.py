"""AI evaluation test cases for the Recall AI Server.

Each case defines input and expected output fields so the test script can
verify that models are producing sensible, grounded results.

Run with:  .\\..\\scripts\\test-ai.ps1
Or directly: py -m pytest tests/ -v   (from ai-server/)
"""

from typing import Any, Dict, List

# ── Test case structure ───────────────────────────────────────────────────────
# Each case is a dict with:
#   id:           unique identifier
#   name:         human-readable description
#   type:         "text" | "link" | "image" (image cases are skipped without a file)
#   input:        dict passed to the API
#   expect:       dict of fields to verify in the response (partial match)

TEST_CASES: List[Dict[str, Any]] = [
    # ── 1. DBMS Assignment ────────────────────────────────────────────────────
    {
        "id": "tc_01_dbms_assignment",
        "name": "DBMS Assignment Notice (text)",
        "type": "text",
        "input": {
            "text": (
                "ATTENTION STUDENTS\n"
                "Assignment 4 — Transactions & B+ Trees\n"
                "Submit before Friday 11:59 PM via the college portal.\n"
                "Late submissions will not be accepted.\n"
                "— Prof. Sharma, Dept. of Computer Science"
            ),
            "source_type": "note",
        },
        "expect": {
            "category": "College",
            "actions_present": True,
            "action_type": "deadline",
            "topics_contain_any": ["DBMS", "Assignment", "Transactions", "Database"],
        },
    },
    # ── 2. WhatsApp API Credentials Follow-up ─────────────────────────────────
    {
        "id": "tc_02_whatsapp_credentials",
        "name": "WhatsApp API credentials follow-up (text)",
        "type": "text",
        "input": {
            "text": "Bro can you send me the production API credentials tomorrow?",
            "source_type": "note",
            "source_app": "WhatsApp",
        },
        "expect": {
            "category_in": ["Work", "Personal", "Development"],
            "actions_present": True,
            "action_type_in": ["follow_up", "task"],
            "topics_contain_any": ["API", "credentials", "production"],
        },
    },
    # ── 3. API Error Screenshot (text fallback — no image) ────────────────────
    {
        "id": "tc_03_api_error",
        "name": "API connection pool error (text)",
        "type": "text",
        "input": {
            "text": (
                "Error: Connection pool exhausted\n"
                "TimeoutError: connect ECONNREFUSED 127.0.0.1:5432\n"
                "at /app/src/db/connection.js:42\n"
                "Active connections: 20/20\n"
                "PostgreSQL max_connections exceeded"
            ),
            "source_type": "text",
        },
        "expect": {
            "category": "Development",
            "topics_contain_any": ["PostgreSQL", "API", "error", "connection"],
        },
    },
    # ── 4. GitHub Redis URL ───────────────────────────────────────────────────
    {
        "id": "tc_04_redis_github",
        "name": "GitHub Redis repository URL (link)",
        "type": "link",
        "input": {
            "url": "https://github.com/redis/redis",
            "page_title": "redis/redis: Redis is an in-memory data structure store",
            "page_description": (
                "Redis is an in-memory data structure store used as a database, "
                "cache, message broker, and streaming engine."
            ),
        },
        "expect": {
            "category": "Development",
            "topics_contain_any": ["Redis", "Database", "caching", "Backend"],
        },
    },
    # ── 5. System Design Article URL ─────────────────────────────────────────
    {
        "id": "tc_05_system_design",
        "name": "System design article URL (link)",
        "type": "link",
        "input": {
            "url": "https://bytebytego.com/p/designing-a-distributed-rate-limiter",
            "page_title": "Designing a Distributed Rate Limiter",
            "page_description": (
                "Token Bucket, Sliding Window, and Redis-based rate limiting strategies."
            ),
        },
        "expect": {
            "category_in": ["Learning", "Development"],
            "topics_contain_any": ["system design", "rate limiter", "Redis", "architecture"],
        },
    },
    # ── 6. College Exam Notice ────────────────────────────────────────────────
    {
        "id": "tc_06_exam_notice",
        "name": "College exam timetable notice (text)",
        "type": "text",
        "input": {
            "text": (
                "End Semester Examination Schedule — December 2024\n"
                "Database Management Systems: Dec 10, 9:00 AM, Hall A\n"
                "Operating Systems: Dec 12, 9:00 AM, Hall B\n"
                "Roll numbers 21-40 report 30 minutes early."
            ),
            "source_type": "note",
        },
        "expect": {
            "category": "College",
            "topics_contain_any": ["exam", "DBMS", "Database", "Operating Systems"],
        },
    },
    # ── 7. Internship Deadline ────────────────────────────────────────────────
    {
        "id": "tc_07_internship_deadline",
        "name": "Internship application deadline (text)",
        "type": "text",
        "input": {
            "text": (
                "Goldman Sachs SWE Internship — Apply by October 15\n"
                "Apply at: goldmansachs.com/careers\n"
                "Requirements: DSA, LeetCode, prior projects\n"
                "Shortlisting starts October 18."
            ),
            "source_type": "note",
        },
        "expect": {
            "category_in": ["Work", "College", "Personal"],
            "actions_present": True,
            "topics_contain_any": ["internship", "Goldman Sachs", "application"],
        },
    },
    # ── 8. Ride Receipt ──────────────────────────────────────────────────────
    {
        "id": "tc_08_ride_receipt",
        "name": "Rapido ride receipt (text)",
        "type": "text",
        "input": {
            "text": (
                "Rapido Ride Receipt\n"
                "Date: Sep 21, 2026\n"
                "Pickup: MG Road Metro Station\n"
                "Drop: Koramangala 4th Block\n"
                "Distance: 5.2 km\n"
                "Fare: ₹89\n"
                "Driver: Suresh Kumar | Bike: KA-05-HX-2341"
            ),
            "source_type": "note",
            "source_app": "Rapido",
        },
        "expect": {
            "category": "Travel",
            "actions_present": False,  # receipt — no action needed
            "topics_contain_any": ["Rapido", "ride", "travel", "receipt"],
        },
    },
    # ── 9. React Native Metro Error ───────────────────────────────────────────
    {
        "id": "tc_09_metro_error",
        "name": "React Native Metro bundler error (text)",
        "type": "text",
        "input": {
            "text": (
                "Metro bundler error\n"
                "Unable to resolve module react-native-svg from src/components/ui/RecallLogo.tsx\n"
                "None of these files exist:\n"
                "  * node_modules/react-native-svg/index.js\n"
                "Run: npm install react-native-svg"
            ),
            "source_type": "text",
        },
        "expect": {
            "category": "Development",
            "topics_contain_any": ["React Native", "Metro", "error", "SVG"],
        },
    },
    # ── 10. Meeting Notes ─────────────────────────────────────────────────────
    {
        "id": "tc_10_meeting_notes",
        "name": "Team sprint planning meeting screenshot (text fallback)",
        "type": "text",
        "input": {
            "text": (
                "Sprint 23 Planning — 2026-09-21\n"
                "Attendees: Jaswanth, Ravi, Priya\n"
                "Goal: Ship Recall Phase 4 (Local AI) by Oct 1\n"
                "Action: Jaswanth to integrate Nomic embeddings by Wednesday\n"
                "Action: Ravi to review Qwen3 prompts by Thursday\n"
                "Blocker: Ollama not running on CI server"
            ),
            "source_type": "text",
            "source_app": "Google Meet",
        },
        "expect": {
            "category_in": ["Work", "Development"],
            "actions_present": True,
            "topics_contain_any": ["sprint", "Recall", "meeting", "AI"],
        },
    },
]
