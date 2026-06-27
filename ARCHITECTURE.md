# VisionGuide AI — Architecture

## System Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                        USER (Visually Impaired)                      │
│                    Voice Input / Camera / Touch                       │
└───────────────────────────┬──────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         Frontend (React PWA)                         │
│                                                                      │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │
│  │Dashboard│  │LiveCamera│  │AI Chat   │  │14 Feature Pages      │ │
│  └─────────┘  └──────────┘  └──────────┘  └──────────────────────┘ │
│                                                                      │
│  ┌──────────────────┐  ┌─────────────┐  ┌────────────────────────┐ │
│  │ WebRTC Camera    │  │Web Speech   │  │ Zustand State Store    │ │
│  │ (capture frames) │  │API (STT+TTS)│  │ (persisted settings)   │ │
│  └──────────────────┘  └─────────────┘  └────────────────────────┘ │
└───────────────────────────┬──────────────────────────────────────────┘
                            │ HTTP/REST
                            ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      Backend (FastAPI)                               │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                   Planner Agent                              │    │
│  │   Routes commands to specialized agents based on intent      │    │
│  └────────────────────────┬────────────────────────────────────┘    │
│                           │                                          │
│   ┌───────┬───────┬───────┼───────┬────────┬─────────┬──────────┐  │
│   ▼       ▼       ▼       ▼       ▼        ▼         ▼          ▼  │
│  Scene  Object  OCR    Currency Clothing  Navig.  Gesture  Memory  │
│  Agent  Agent  Agent   Agent    Agent     Agent   Agent    Agent   │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │              AI Engine (Mock / Gemini 1.5 Flash)              │  │
│  │         Realistic responses for all 7 analysis types          │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                     SQLite Database                          │    │
│  │  Tables: conversation_messages, user_memory,                 │    │
│  │          user_settings, analysis_history                     │    │
│  └─────────────────────────────────────────────────────────────┘    │
└───────────────────────────┬──────────────────────────────────────────┘
                            │ HTTP
                            ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      MCP Server (FastAPI)                            │
│                                                                      │
│  ┌──────────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │ preprocess_image │  │enhance_for_  │  │extract_dominant_colors │ │
│  │ (resize+contrast)│  │ocr           │  │(pixel sampling)        │ │
│  └──────────────────┘  └──────────────┘  └────────────────────────┘ │
│  ┌──────────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │  detect_edges    │  │get_image_    │  │ query_memory_secure    │ │
│  │  (Pillow filter) │  │metadata      │  │ (user preferences)     │ │
│  └──────────────────┘  └──────────────┘  └────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Image Analysis Flow
1. User taps analysis button on frontend
2. Frontend captures frame via WebRTC camera
3. Image blob sent as multipart/form-data to backend
4. Backend routes to appropriate agent via Planner
5. Agent calls AI engine (mock or real Gemini)
6. Result saved to `analysis_history` table
7. Response returned to frontend
8. Frontend reads result aloud via TTS

### Voice Command Flow
1. User taps mic button → Web Speech API captures voice
2. Transcript sent to `/voice/command` endpoint
3. PlannerAgent parses intent from transcript
4. Delegates to appropriate specialist agent
5. Response saved to conversation history
6. Frontend reads result aloud via TTS

### Chat Flow
1. User types or speaks message
2. Sent to `/chat` endpoint
3. Chat mock engine returns context-aware response
4. Both user and assistant messages saved to DB
5. Frontend displays as chat bubbles + reads aloud

## Database Schema

```sql
-- Conversation messages
CREATE TABLE conversation_messages (
    id INTEGER PRIMARY KEY,
    session_id VARCHAR,
    role VARCHAR,          -- 'user' or 'assistant'
    content TEXT,
    analysis_type VARCHAR, -- nullable
    timestamp DATETIME
);

-- User memory store
CREATE TABLE user_memory (
    id INTEGER PRIMARY KEY,
    user_id VARCHAR,
    key VARCHAR,
    value TEXT,
    category VARCHAR,
    timestamp DATETIME
);

-- User settings
CREATE TABLE user_settings (
    id INTEGER PRIMARY KEY,
    user_id VARCHAR,
    high_contrast INTEGER DEFAULT 0,
    large_text INTEGER DEFAULT 0,
    speech_rate FLOAT DEFAULT 1.0,
    language VARCHAR DEFAULT 'en',
    theme VARCHAR DEFAULT 'dark'
);

-- Analysis history
CREATE TABLE analysis_history (
    id INTEGER PRIMARY KEY,
    session_id VARCHAR,
    analysis_type VARCHAR,
    result TEXT,
    timestamp DATETIME
);
```

## MCP Tools Reference

| Tool | Input | Output | Library |
|---|---|---|---|
| `preprocess_image` | base64 image | preprocessed base64 | Pillow resize + enhance |
| `enhance_for_ocr` | base64 image | grayscale+sharp base64 | Pillow L + autocontrast |
| `extract_dominant_colors` | base64 image | list of hex colors | Pillow pixel sampling |
| `detect_edges` | base64 image | edge-detected base64 | Pillow FIND_EDGES |
| `get_image_metadata` | base64 image | {width, height, mode} | Pillow Image.open |
| `query_memory_secure` | {user_id} | preferences dict | Internal lookup |

## Frontend Pages

| Path | Component | Description |
|---|---|---|
| `/` | Dashboard | Feature grid + quick start |
| `/camera` | LiveCamera | WebRTC + 6-mode analysis |
| `/assistant` | AIAssistant | Full chat interface |
| `/scene` | SceneDescription | Scene analysis |
| `/objects` | ObjectDetection | Object location |
| `/ocr` | OCR | Text extraction |
| `/currency` | CurrencyRecognition | Bill/coin ID |
| `/clothing` | ClothingRecognition | Style analysis |
| `/navigation` | NavigationAssistant | Path guidance |
| `/history` | ConversationHistory | Past analyses |
| `/memory` | MemoryPage | Key-value store |
| `/accessibility` | AccessibilityPage | A11y toggles |
| `/settings` | SettingsPage | App config |
| `/help` | Help | FAQ + docs |

## Android Accessibility Service (Future)

To read other apps' screens, a native Android Accessibility Service is required.
This cannot be implemented in a web/PWA context.

**Implementation path for native Android (React Native):**

1. Create `VisionGuideAccessibilityService.kt` extending `AccessibilityService`
2. Implement `onAccessibilityEvent()` to capture screen events
3. Declare service in `AndroidManifest.xml` with `BIND_ACCESSIBILITY_SERVICE` permission
4. Users enable in: Settings → Accessibility → VisionGuide AI → Enable

**Limitations:**
- Cannot be demonstrated in browser/PWA environment
- Requires physical Android device or emulator
- Google Play policies restrict automated screen reading in some contexts
