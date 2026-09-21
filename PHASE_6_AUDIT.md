# RECALL — PHASE 6.1 AUDIT REPORT
**Audit Date:** 2026-09-21  
**Project:** Recall Mobile Application (React Native + Expo SDK 57 + FastAPI + Ollama)  
**Objective:** Identify why the app behaves like a frontend/mock prototype, audit mobile connectivity to local AI, inspect all capture pipelines, state machines, and classify Expo Go vs Native capabilities.

---

## 1. Executive Summary & Root Causes

Recall currently presents a refined visual interface, but several core production workflows behave like a frontend demo or fail when tested on a physical mobile device.

### The 4 Major Root Causes Identified:
1. **The Mobile `localhost` Networking Trap**:
   - `LocalOllamaProvider.ts` defaults `serverUrl` to `http://localhost:8000`.
   - On a physical smartphone (or emulator without port redirection), `localhost` refers to the **phone itself**, NOT the host computer running FastAPI. Every network call to `/health` or `/analyze/*` immediately fails with `Network request failed`.
2. **The Silent Mock Fallback**:
   - In `AIService.ts` (`resolveProvider`), if `checkHealth()` fails (which always happens on a phone defaulting to `localhost`), the service **silently falls back to `MockAIProvider`** even when `isDeveloperMode = false`.
   - `MockAIProvider` contains hardcoded strings ("DBMS Assignment", "API Connection Pool", "Waiting for Ravi") and fake `setTimeout` delays. As a result, the user believes AI ran, but it was just fake canned data.
3. **Disconnected Semantic Search**:
   - While the FastAPI server has `/embed` (Nomic Embed v1.5) and `/search` (hybrid cosine similarity) endpoints, `SearchService.ts` in the mobile app never calls them. It only performs synchronous in-memory string matching.
4. **Action / Inbox State Machine Ambiguity & Dead-End Navigation**:
   - Tapping an action in the Inbox has no dedicated Action Detail view; tapping checkboxes triggers immediate completion without an Undo toast.
   - `app/calls/[id].tsx` crashes to a "Call not found" screen if accessed without existing analysis or on invalid navigation, offering only `router.back()` which breaks if there is no previous screen in the stack.

---

## 2. Detailed Feature-by-Feature Audit Matrix

| Feature | Current Status | Actual Problem | Required Fix | Platform Limitation (Expo Go vs Native) |
| :--- | :--- | :--- | :--- | :--- |
| **Mobile ↔ AI Gateway Connectivity** | ❌ Broken by default on physical phones | Defaults to `http://localhost:8000`. Phone cannot connect to PC `localhost`. | Default / allow configuration of PC LAN IP (`http://192.168.1.2:8000`), add USB ADB reverse documentation, and provide one-tap Connection Diagnostics. | None. Standard HTTP fetch works on Expo Go and Native once IP is correct. |
| **Silent Mock Fallbacks** | ❌ Violates Rule 74 ("No fake data") | `AIService.resolveProvider()` silently routes to `MockAIProvider` when offline in Normal Mode. | Normal Mode must **never** use `MockAIProvider`. If AI is offline, report truthful failure, allow Retry, or offer "Save without AI" with `aiStatus = 'pending'`. MockAIProvider strictly restricted to Developer Mode. | None (App logic). |
| **Ollama Model Provisioning** | ⚠️ Degraded | Ollama daemon is running (`127.0.0.1:11434`), but only `gemma3:1b` is installed. `qwen2.5-vl:3b`, `qwen2.5:7b`/`qwen3`, and `nomic-embed-text` are not yet pulled. | Update `ai-server/app/config.py` with exact tags, pull required models via Ollama CLI, and report exact per-model health in Settings. | Host environment dependent (runs on PC host). |
| **Real Screenshot Vision Pipeline** | ⚠️ Partial | Image picker works via `expo-image-picker`, but falls back to fake presets if AI is unreachable. | Remove demo presets from normal mode. Send real multipart upload (`FormData`) to FastAPI `/analyze/image`. Truthfully display extraction status. | Works in Expo Go via `expo-image-picker`. |
| **Media Persistence** | ⚠️ Fragile | `MediaRepository` passes raw cache URIs from picker (`cache/ImagePicker/...`), which Android OS can purge on restart. | Safely manage media URIs, validate accessibility before rendering, and fall back cleanly if cache was cleared. | Expo Go has limited document directory access without `expo-file-system`. |
| **Real Link Capture** | ⚠️ Partial | UI functional, but falls back to MockAI when server offline. Sample links visible in normal mode. | Remove sample links from normal mode. Route URL to FastAPI `/analyze/link` (server fetches HTML metadata & passes to Qwen). If offline, extract domain/title locally with zero fake actions. | Works in Expo Go. |
| **Real Note Capture** | ⚠️ Partial | Functional UI, but triggers canned actions on keyword match if offline. | Send real text to `/analyze/text`. If offline, save note with user input and mark `embeddingStatus = 'pending'` for later indexing. | Works in Expo Go. |
| **Inbox State Machine** | ❌ Buggy | 1. No card tap handler (no Action Detail view).<br>2. Checkbox tap immediately moves item to completed without Undo.<br>3. Accidental taps cannot be reversed. | 1. Implement Action Detail modal/screen.<br>2. Add bottom Undo Toast with 4s timer.<br>3. Separate card tap (open detail) from checkbox tap (toggle completion). | Pure React Native; works identically in Expo Go and Native. |
| **Semantic & Hybrid Search** | ❌ In-memory keyword only | `SearchService.ts` ignores FastAPI `/embed` and `/search` completely. | Connect `SearchService` to FastAPI `/search` endpoint to rank memories by vector cosine similarity + keyword score. Fall back to keyword score if offline with clear badge. | Works in Expo Go (standard HTTP POST). |
| **Call Intelligence & Transcription** | ❌ Mocked | `LocalWhisperProvider` returns hardcoded fake conversation between Manager & You. `app/calls/import.tsx` hardcodes audio URI. | 1. Real Transcript import must accept actual pasted/typed text and send to `/analyze/call`.<br>2. Audio import in Expo Go must not fake Whisper with hardcoded text; provide clear disclaimer or backend audio processing. | Live cellular call interception (`READ_PHONE_STATE` / `CALL_SCREENING_SERVICE`) is strictly impossible in Expo Go and restricted on Android. Transcript / audio file import is the true cross-platform path. |
| **Call Inspector Navigation** | ❌ Dead End | If call is not found or lacks `callAnalysis`, screen displays "Call not found" with `router.back()` which can trap user. | Display "Call unavailable" with a reliable "Return Home" button (`router.replace('/(tabs)')`). Gracefully render calls with partial or pending analysis. | Works in Expo Go. |
| **Android System Share Target** | ⚠️ Configured in `app.json`, inactive in Expo Go | Intent filters (`SEND`, `SEND_MULTIPLE`) are in `app.json`, but Expo Go uses its own binary manifest; Android OS does not show Recall in system share sheet. | 1. Document requirement for `npx expo prebuild` / development build for system share sheet.<br>2. Provide in-app "Simulate Shared Intent" under Developer Mode.<br>3. Ensure deep link handler (`recall://capture/shared`) works. | **Requires Native Development Build (`npx expo prebuild`)**. Not supported in standard Expo Go. |
| **Android Launcher Quick Actions** | ⚠️ Configured via `expo-quick-actions` | Home screen app icon long-press shortcuts do not register in standard Expo Go client. | Keep `ShareIntentService` registration, but document platform requirement. | **Requires Native Development Build**. |
| **Android Floating Bubble (`SYSTEM_ALERT_WINDOW`)** | ❌ Not implemented | Floating overlay widget over other apps requires Android native Foreground Service and special overlay permissions. | Document architectural requirement: requires custom native Android module (`SYSTEM_ALERT_WINDOW` permission + Foreground Service). Cannot be faked in Expo Go. | **Strictly Requires Native Android Build**. Impossible in Expo Go. |

---

## 3. Expo Go vs. Development Build Capability Matrix

| Capability | In Expo Go? | In Development Build (`npx expo prebuild`)? | Current Recall Implementation Status |
| :--- | :---: | :---: | :--- |
| Photo Library Picker (`expo-image-picker`) | ✅ YES | ✅ YES | Fully functional |
| Camera Capture (`expo-image-picker`) | ✅ YES | ✅ YES | Fully functional |
| Local HTTP fetch to LAN IP (`http://192.168.1.x:8000`) | ✅ YES | ✅ YES | Functional once configured |
| AsyncStorage Persistence | ✅ YES | ✅ YES | Fully functional |
| Deep Linking (`recall://...`) | ✅ YES | ✅ YES | Fully functional via `expo-linking` |
| Local Push Notifications | ❌ NO (Removed SDK 53+) | ✅ YES | Safely lazy-loaded; skips in Expo Go |
| System Share Sheet Target (`SEND` intent) | ❌ NO | ✅ YES | Declared in `app.json`; requires prebuild |
| Home Screen Quick Actions (Long-press icon) | ❌ NO | ✅ YES | Handled via `expo-quick-actions` |
| Android Floating Bubble (`SYSTEM_ALERT_WINDOW`) | ❌ NO | ✅ YES | Requires custom native Android module |
| Cellular Call Recording / Interception | ❌ NO | ⚠️ Restricted by OS | Prohibited by modern Android policy; use manual import |

---

## 4. Priority Implementation Order for Phase 6

To systematically resolve every issue without breaking working code:

1. **Step 1 (Immediate - Phase 6.2)**:
   - **Enforce Truthful AI Provider**: Modify `AIService.ts` so Normal Mode never falls back to `MockAIProvider`. If local AI is offline, return real status with user options: Retry or "Save to Memory without AI".
   - **Fix Mobile Networking**: Expose and auto-detect PC LAN IP (`192.168.1.2:8000`) in settings/defaults so mobile devices connect seamlessly.
2. **Step 2 (Phase 6.3 & 6.4)**:
   - **Real Screenshot Pipeline**: Wire `app/capture/screenshot.tsx` to real FastAPI `/analyze/image` without demo presets in normal mode.
3. **Step 3 (Phase 6.6 & 6.7)**:
   - **Real Link & Note Capture**: Clean out normal-mode presets; connect to `/analyze/link` and `/analyze/text`.
4. **Step 4 (Phase 6.8)**:
   - **Fix Inbox State Machine**: Add Action Detail Modal, separate card tap from checkbox tap, add 4s completion Undo toast.
5. **Step 5 (Phase 6.9)**:
   - **Semantic Search**: Wire `SearchService.ts` to FastAPI `/search` for vector similarity.
6. **Step 6 (Phase 6.10 & 6.11)**:
   - **Call Intelligence & Dead-End Fix**: Remove fake whisper audio simulation; ensure transcript import sends real text to `/analyze/call`; fix `app/calls/[id].tsx` navigation safely.
7. **Step 7 (Phase 6.12 & 6.13)**:
   - **Native Capabilities & Share Target**: Document prebuild steps and ensure in-app shared intent simulation works for testing.
