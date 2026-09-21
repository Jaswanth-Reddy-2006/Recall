# Recall — Your Memory, Finally Organized

> **A local-first, privacy-preserving AI context engine that captures what you see, understands why it matters, and turns everyday chaos into actionable clarity.**

[![React Native](https://img.shields.io/badge/React_Native-Expo_SDK_52-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-14_App_Router-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python_3.11-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Ollama](https://img.shields.io/badge/Ollama-Local_Inference-white?style=for-the-badge&logo=ollama&logoColor=black)](https://ollama.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Local_Storage-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25_Local_AI-22C55E?style=for-the-badge)](https://github.com)

---

## 📽️ Demo Video & Walkthrough

Watch the full product walkthrough demonstrating screenshot ingestion, vision OCR, AI extraction, semantic search, and the action inbox:

- **Interactive Landing Page**: Navigate to the [Recall Web Showcase](http://localhost:3000/#demo)
- **Local Demo File**: `recall-web/public/demo-video.mp4` (Included directly with inline player & full-screen controls)

---

## 🧠 What is Recall?

Every day, you capture dozens of things across your phone: event flyers, system design articles, scratchpad memos, and recorded meeting calls. But when you need them days or weeks later:

- **Screenshots** get buried in thousands of camera roll photos.
- **Bookmarks & Links** are saved but never resurface when relevant.
- **Meeting decisions** are lost in lengthy recordings.
- **Tasks & Deadlines** slip through the cracks.

**Recall fixes this.** It acts as your second brain on mobile—processing captures locally with state-of-the-art vision and reasoning models, extracting key attributes, grouping them into an actionable inbox, and making everything searchable by natural concepts.

```
                    ┌─────────────────────────────────────────────────────────┐
                    │                         RECALL                          │
                    │              Your Personal Context Layer                │
                    └────────────────────────────┬────────────────────────────┘
                                                 │
                   ┌─────────────────────────────┼─────────────────────────────┐
                   ▼                             ▼                             ▼
       ┌───────────────────────┐   ┌───────────────────────────┐   ┌───────────────────────┐
       │   CAPTURE EVERYTHING  │   │     UNDERSTAND WITH AI    │   │      TAKE ACTION      │
       │  • Mobile Screenshots │   │ • Multimodal Vision OCR   │   │ • 4-Bucket Inbox      │
       │  • Web Links & Docs   │ → │ • Entity Extraction       │ → │ • Tracked Deadlines   │
       │  • Scratchpad Memos   │   │ • Key Decisions & Owners  │   │ • Hybrid Search       │
       │  • Meeting Audio/Calls│   │ • Nomic Vector Embeddings │   │ • 1-Click Follow-ups  │
       └───────────────────────┘   └───────────────────────────┘   └───────────────────────┘
```

---

## 🏗️ System Architecture

Recall is split into three decoupled components designed for maximum performance, privacy, and modularity:

```
                                  +---------------------------------------+
                                  |              RECALL ECOSYSTEM         |
                                  +-------------------+-------------------+
                                                      |
                 +------------------------------------+-----------------------------------+
                 |                                                                        |
                 v                                                                        v
+------------------------------------+                                   +------------------------------------+
|         RECALL MOBILE APP          |                                   |          RECALL WEB SITE           |
|      (React Native + Expo SDK)     |                                   |     (Next.js 14 + Tailwind CSS)    |
|                                    |                                   |                                    |
| • Real mobile permissions (Photos) |                                   | • Live interactive product demo    |
| • Android quick share intent       |                                   | • Embedded video player & chapters |
| • Local SQLite database            |                                   | • TakeUForward / RU_Ready style FAQ|
| • Offline fallback intelligence    |                                   | • SparkleNavbar with scrollspy     |
+-----------------+------------------+                                   +------------------------------------+
                  |
                  | HTTP (LAN / Localhost :8000)
                  v
+-------------------------------------------------------------------------------------------------------------+
|                                           RECALL LOCAL AI SERVER                                            |
|                                       (FastAPI + Python 3.11 Gateway)                                       |
|                                                                                                             |
|  POST /analyze/image            POST /analyze/text          POST /embed             POST /search            |
|  Vision & Multimodal OCR       Extraction & Decisions      Vector Embeddings       Hybrid Semantic Search   |
+-----------------------------------------------------+-------------------------------------------------------+
                                                      |
                                                      v
                                    +-----------------------------------+
                                    |        LOCAL OLLAMA ENGINE        |
                                    |         (Port 11434, Local)       |
                                    +-----------------+-----------------+
                                                      |
                           +--------------------------+-------------------------+
                           |                          |                         |
                           v                          v                         v
                +---------------------+    +---------------------+    +---------------------+
                |     Qwen2.5-VL      |    |        Qwen3        |    |  Nomic Embed v1.5   |
                |   Vision / Layout   |    |    Reasoning / NLP  |    |  Vector Search      |
                |        (3B)         |    |        (8B)         |    |      (270 MB)       |
                +---------------------+    +---------------------+    +---------------------+
```

---

## ✨ Key Capabilities

### 1. 📸 Screenshot Intelligence
- Seamlessly import screenshots directly from your mobile camera roll or via Android Share Sheet.
- Two-stage multimodal processing: Qwen2.5-VL extracts visual hierarchy, dates, times, venues, QR links, and eligibility criteria into structured entities.

### 2. 🔗 Web Link & Document Capture
- Ingest articles, blog posts, and technical documentation.
- Automatically captures architectural diagrams, summaries, read times, and tags without clutter.

### 3. 📝 Quick Scratchpad Memos
- Capture spontaneous thoughts, voice-to-text memos, and instructions.
- Detects mentioned contacts (e.g., *"Ask Ravi about deployment keys"*) and schedules follow-up alarms.

### 4. 🎙️ Call & Meeting Intelligence
- Process recorded calls and voice audio tracks with Whisper AI.
- Automatically organizes output into **Decisions**, **Follow-ups**, **Owners**, and **Deadlines**.

### 5. 📥 Action Inbox
- Automatically triages items into four clean buckets:
  - **Needs Action**: Items with concrete deadlines and pending tasks.
  - **Decisions**: Architectural and team agreements.
  - **Knowledge**: Articles, guides, and reference documents.
  - **Ideas**: Raw thoughts and scratchpad memos.

### 6. 🔍 Hybrid Semantic Search
- Search across your personal memory using natural concepts (e.g., *"internship flyer next week"* or *"sliding window rate limiter"*), even without remembering exact keywords.
- Combines keyword matching with high-dimensional cosine similarity embeddings via `nomic-embed-text:v1.5`.

### 7. 🛡️ 100% Local-First Privacy
- Zero cloud API keys required (no OpenAI, Gemini, or Claude cloud dependencies).
- Captures and embeddings stay exclusively on your device and private local network.

---

## 📁 Repository Structure

```
Recall/
├── app/                           # Expo Router mobile screens & navigation
│   ├── _layout.tsx                # Root mobile provider layout
│   ├── index.tsx                  # Main mobile dashboard
│   ├── capture.tsx                # Screenshot & media capture view
│   ├── inbox.tsx                  # Priority action inbox
│   ├── search.tsx                 # Semantic search interface
│   └── settings.tsx               # AI engine & endpoint configurations
│
├── src/                           # Mobile core application logic
│   ├── components/                # Reusable React Native UI widgets
│   ├── services/
│   │   ├── ai/                    # AI server client & local fallback engine
│   │   ├── capture/               # Photo library & share sheet handlers
│   │   ├── permissions/           # Android/iOS permission management
│   │   ├── search/                # Local semantic & keyword search engine
│   │   ├── speech/                # Audio recording & Whisper integration
│   │   └── storage/               # SQLite database tables & migrations
│   └── store/                     # Global state & memory store
│
├── ai-server/                     # FastAPI Local AI Gateway
│   ├── app/
│   │   ├── main.py                # FastAPI entry point
│   │   ├── config.py              # Pydantic environment configurations
│   │   ├── routes/                # Endpoints (/analyze, /embed, /search, /health)
│   │   ├── services/              # Ollama clients, vision, reasoning, embeddings
│   │   └── schemas/               # Request & response data models
│   ├── tests/                     # 10 automated AI evaluation test cases
│   └── requirements.txt           # Python dependencies
│
├── recall-web/                    # Next.js 14 Marketing & Interactive Demo
│   ├── app/                       # Next.js App Router (page.tsx, layout.tsx)
│   ├── components/
│   │   ├── Navbar.tsx             # Floating glassmorphic navbar with Sparkle animation
│   │   ├── SparkleNavbar.tsx      # GSAP SVG beam & lightning strike navigation
│   │   ├── Hero.tsx               # Hero headline, CTAs, and mobile mockup
│   │   ├── Problem.tsx            # The 4 core information pain points
│   │   ├── HowItWorks.tsx         # 3-step workflow (Capture → Understand → Act)
│   │   ├── DemoVideoSection.tsx   # Video player with fullscreen toggle & chapters
│   │   ├── SeeItInAction.tsx      # Interactive 4-scenario split simulator
│   │   ├── PrivacyFirst.tsx       # Local AI security guarantees & quote
│   │   ├── Faq.tsx                # 2-column TakeUForward style accordion
│   │   ├── CtaBanner.tsx          # GitHub repo & demo action banner
│   │   └── Footer.tsx             # Streamlined footer with repo & social links
│   ├── public/
│   │   └── demo-video.mp4         # 90-second product demo video
│   └── package.json               # Web dependencies (Next.js, Tailwind, GSAP)
│
├── scripts/                       # Developer automation scripts
│   ├── setup-ai.ps1               # Automated Ollama model pull & server start
│   └── test-ai.ps1                # Automated AI server test suite runner
│
└── package.json                   # Root React Native / Expo workspace configuration
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0 or newer (v20+ recommended)
- **Python**: v3.10 or v3.11
- **Ollama**: Download and install from [ollama.com](https://ollama.com/download)

---

### Step 1: Start the Local AI Server

1. **Verify Ollama is running**:
   Ensure Ollama is started from your application menu or command line:
   ```bash
   ollama serve
   ```

2. **Automated Setup (Windows PowerShell)**:
   ```powershell
   .\scripts\setup-ai.ps1
   ```
   *This automatically pulls `qwen2.5vl:3b`, `qwen3:8b`, and `nomic-embed-text:v1.5`, installs Python packages, and starts FastAPI on port 8000.*

3. **Manual Setup**:
   ```bash
   # Pull models
   ollama pull qwen2.5vl:3b
   ollama pull qwen3:8b
   ollama pull nomic-embed-text:v1.5

   # Install dependencies and start server
   cd ai-server
   pip install -r requirements.txt
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

4. **Verify Health**:
   Visit [http://localhost:8000/health](http://localhost:8000/health) or [http://localhost:8000/docs](http://localhost:8000/docs) in your browser.

---

### Step 2: Start the Mobile Prototype (Expo)

```bash
# From the root directory:
npm install

# Start the Expo development server:
npx expo start
```
- Press `w` to open in your web browser.
- Press `a` to run on an Android emulator or connected device.
- Scan the QR code using the **Expo Go** app on your physical phone.

> **Physical Android Device Note**:
> When running on a physical phone, set the Server URL in **Settings → AI Engine** to your machine's LAN IP (e.g., `http://192.168.1.50:8000`), not `localhost`.

---

### Step 3: Start the Web Showcase & Demo

```bash
cd recall-web
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the landing page, watch the embedded demo video with full-screen playback, and explore the interactive simulator.

---

## 🧪 Testing & Verification

Run the AI server verification suite to test vision OCR, reasoning, and semantic search:

```powershell
# From the root directory:
.\scripts\test-ai.ps1
```

Verify Next.js web application compilation:
```bash
cd recall-web
npm run build
```

---

## 🔒 Security & Privacy Commitments

- **No Remote Cloud Calls**: All vision OCR, transcription, and reasoning run locally via Ollama.
- **Local SQLite Persistence**: Captures, metadata, and embeddings reside strictly on-device.
- **Zero Tracking**: No telemetry, analytics trackers, or user behavioral profiling.
- **Export & Delete Anytime**: Complete data ownership with 1-click JSON/Markdown export.

---

## 📜 License

This project is licensed under the **MIT License**. Free for open-source development, academic research, and personal use.
