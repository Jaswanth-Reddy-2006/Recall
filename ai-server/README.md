# Recall AI Server

Local AI gateway for the **Recall** personal context app. Routes inference requests from the React Native app to Ollama running locally.

```
React Native
    ↓
AI Server (FastAPI — port 8000)
    ↓
Ollama (port 11434)
 ┌───┼──────────────┐
 ↓   ↓              ↓
Qwen2.5-VL  Qwen3  Nomic Embed
3B          8B     v1.5
```

---

## Models

| Model | Ollama name | Purpose | Size |
|---|---|---|---|
| Qwen2.5-VL 3B | `qwen2.5vl:3b` | Screenshot understanding, OCR, visual layout | ~2.3 GB |
| Qwen3 8B | `qwen3:8b` | Text extraction, classification, action detection | ~5 GB |
| Nomic Embed v1.5 | `nomic-embed-text:v1.5` | Semantic memory embeddings, similarity search | ~270 MB |

---

## Quick Start

### 1. Install Ollama
Download and install from [ollama.com/download](https://ollama.com/download).

### 2. Start Ollama
Open the Ollama app from the Windows Start Menu. Wait for the system tray icon to appear.

### 3. Run the setup script
```powershell
# From the project root:
.\scripts\setup-ai.ps1
```

This will:
- Verify Ollama is running
- Pull missing models (first run only — ~7.5 GB total)
- Install Python dependencies
- Start the AI server on `http://0.0.0.0:8000`

### 4. Verify
```powershell
Invoke-RestMethod http://localhost:8000/health
```

Expected (all models installed):
```json
{
  "status": "ok",
  "ollama": true,
  "models": { "text": true, "vision": true, "embedding": true }
}
```

---

## Manual Start

```powershell
cd ai-server
py -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## API Reference

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Ollama status + model presence |
| `GET` | `/models` | Configured model names + installation status |
| `POST` | `/analyze/image` | Screenshot → VisionResult → RecallMemoryAnalysis |
| `POST` | `/analyze/text` | Text/note → RecallMemoryAnalysis |
| `POST` | `/analyze/link` | URL + metadata → RecallMemoryAnalysis |
| `POST` | `/embed` | Generate Nomic embeddings |
| `POST` | `/search` | Hybrid semantic + keyword search |
| `POST` | `/related` | Find related memories |
| `POST` | `/warmup` | Pre-load models into Ollama |

---

## Physical Android Device Setup

When running Recall on a physical Android device, `localhost` refers to the **phone itself** — not your laptop. You must use your laptop's LAN IP address.

1. Connect your phone and laptop to the **same Wi-Fi network**
2. Find your laptop's LAN IP (printed by `setup-ai.ps1`, or run `ipconfig`)
3. In Recall: **Settings → AI Engine → Server URL**
4. Set to: `http://192.168.x.x:8000` (your actual IP)

### Windows Firewall

The AI server binds on `0.0.0.0:8000`. Windows Firewall may block inbound connections from other devices. To allow it **for the local network only**:

```powershell
# Run as Administrator:
New-NetFirewallRule `
  -DisplayName "Recall AI Server (port 8000)" `
  -Direction Inbound `
  -Protocol TCP `
  -LocalPort 8000 `
  -Profile Private `
  -Action Allow
```

> **Security**: This allows inbound TCP on port 8000 from private networks only (your home/office Wi-Fi). Do NOT use `Profile Domain,Public` unless you intend to expose the server on public networks.

---

## Configuration

Copy `.env.example` to `.env` and edit as needed:

```bash
cp .env.example .env
```

Key settings:

```env
OLLAMA_BASE_URL=http://localhost:11434
QWEN_TEXT_MODEL=qwen3:8b
QWEN_VISION_MODEL=qwen2.5vl:3b
EMBEDDING_MODEL=nomic-embed-text:v1.5
AI_SERVER_PORT=8000
AI_SERVER_HOST=0.0.0.0
AI_REQUEST_TIMEOUT=120
AI_VISION_TIMEOUT=180
CORS_ALLOWED_ORIGINS=http://localhost:8081,http://localhost:19006
LOG_LEVEL=INFO
```

---

## Privacy

All processing is **100% local**:
- Captured content never leaves your machine
- No OpenAI, Gemini, or Claude API calls
- No cloud upload
- Models run entirely through your local Ollama instance

---

## Running Tests

```powershell
# From the project root:
.\scripts\test-ai.ps1
```

---

## Directory Structure

```
ai-server/
├── app/
│   ├── main.py              FastAPI app factory
│   ├── config.py            Pydantic-settings configuration
│   ├── routes/
│   │   ├── health.py        GET /health, GET /models
│   │   ├── analyze.py       POST /analyze/image|text|link
│   │   ├── embeddings.py    POST /embed
│   │   ├── search.py        POST /search, POST /related
│   │   └── warmup.py        POST /warmup
│   ├── services/
│   │   ├── ollama_client.py Isolated Ollama HTTP client
│   │   ├── vision_service.py  Stage 1: Qwen2.5-VL
│   │   ├── reasoning_service.py  Stage 2: Qwen3
│   │   ├── embedding_service.py  Nomic Embed
│   │   └── memory_service.py  Cosine similarity + hybrid ranking
│   ├── schemas/
│   │   ├── capture.py       Request schemas
│   │   ├── memory.py        VisionResult, RecallMemoryAnalysis
│   │   └── search.py        Embedding + search schemas
│   └── prompts/
│       ├── vision.py        Qwen2.5-VL system prompts
│       ├── extraction.py    Qwen3 extraction prompts
│       ├── search.py        Search explanation prompts
│       └── relation.py      Related memory prompts
├── tests/
│   └── test_cases.py        10 evaluation test cases
├── requirements.txt
├── .env.example
└── README.md
```
