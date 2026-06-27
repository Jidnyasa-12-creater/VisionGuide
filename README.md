# VisionGuide AI 🦯✨

> **An intelligent AI accessibility assistant for visually impaired users**  
> *Google × Kaggle Capstone Project*

[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## 📖 Overview

VisionGuide AI is a full-stack accessibility application that helps visually impaired users understand their surroundings through AI-powered computer vision and voice interaction.

**Key capabilities:**
- 🏞️ **Scene Description** — Full AI description of surroundings
- 🔍 **Object Detection** — Identify and locate objects with positions
- 📄 **OCR** — Extract and read text from signs, documents, labels
- 💵 **Currency Recognition** — Identify denomination and country
- 👕 **Clothing Analysis** — Color, style, type classification
- 🧭 **Navigation** — Obstacle detection and path guidance
- 🎙️ **Voice Control** — Speak commands, hear responses
- 🧠 **Memory** — Store and recall important facts
- ♿ **Accessibility First** — High contrast, large text, TTS

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   VisionGuide AI                        │
│                                                         │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────┐  │
│  │   Frontend  │───▶│   Backend    │───▶│MCP Server │  │
│  │  React/Vite │    │   FastAPI    │    │  Pillow   │  │
│  │  Port 3000  │    │   Port 8000  │    │ Port 8001 │  │
│  └─────────────┘    └──────────────┘    └───────────┘  │
│                            │                            │
│                     ┌──────┴──────┐                     │
│                     │  Multi-Agent│                     │
│                     │   System    │                     │
│                     │  9 Agents   │                     │
│                     └─────────────┘                     │
│                            │                            │
│                     ┌──────┴──────┐                     │
│                     │   SQLite    │                     │
│                     │  Database   │                     │
│                     └─────────────┘                     │
└─────────────────────────────────────────────────────────┘
```

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS v3 |
| State | Zustand with persistence |
| Routing | React Router v6 |
| Backend | Python 3.11, FastAPI, Uvicorn |
| Database | SQLAlchemy + SQLite |
| AI Engine | Mock AI (demo) / Gemini 1.5 Flash (production) |
| Image Tools | MCP Server with Pillow |
| Container | Docker + Docker Compose |
| Testing | Pytest + FastAPI TestClient |

---

## 🚀 Quick Start

### Option 1: Manual (Recommended for Development)

**Prerequisites:** Python 3.11+, Node.js 20+

```bash
# 1. Clone
git clone https://github.com/yourusername/visionguide-ai.git
cd visionguide-ai

# 2. Setup environment
cp .env.example .env
# (optional) Add your GEMINI_API_KEY to .env

# 3. Start Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# 4. Start MCP Server (new terminal)
cd mcp-server
pip install -r requirements.txt
uvicorn server:app --reload --port 8001

# 5. Start Frontend (new terminal)
cd frontend
npm install
npm run dev
```

**URLs:**
| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| MCP Server | http://localhost:8001 |
| MCP Docs | http://localhost:8001/docs |

### Option 2: Docker

```bash
cp .env.example .env
docker-compose up --build
```

Frontend → http://localhost:3000 | Backend → http://localhost:8000

### Option 3: Windows Script

```cmd
startup.bat
```

---

## 🤖 AI Agents

The backend uses a **multi-agent architecture** with a Planner orchestrating 9 specialized agents:

| Agent | Responsibility |
|---|---|
| `PlannerAgent` | Routes commands to the right specialist |
| `SceneDescriptionAgent` | Full scene overview |
| `ObjectDetectionAgent` | Object positions and types |
| `OCRAgent` | Text extraction |
| `CurrencyAgent` | Currency denomination |
| `ClothingAgent` | Clothing type, color, style |
| `NavigationAgent` | Path guidance and obstacles |
| `GestureExpressionAgent` | People, gestures, expressions |
| `VoiceCommandAgent` | Natural language command parsing |
| `MemoryAgent` | Store and recall user information |

---

## 📡 API Reference

### Analysis Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | `/analyze/scene` | Scene description |
| POST | `/analyze/objects` | Object detection |
| POST | `/analyze/ocr` | Text extraction |
| POST | `/analyze/currency` | Currency ID |
| POST | `/analyze/clothing` | Clothing analysis |
| POST | `/analyze/navigation` | Navigation guidance |
| POST | `/analyze/gestures` | Gesture/expression detection |

### Voice & Chat
| Method | Endpoint | Description |
|---|---|---|
| POST | `/voice/command` | Process voice command |
| POST | `/chat` | AI conversation |
| GET | `/chat/history/{session_id}` | Chat history |
| DELETE | `/chat/history/{session_id}` | Clear history |

### Memory & Settings
| Method | Endpoint | Description |
|---|---|---|
| GET | `/memory/{user_id}` | Get memories |
| POST | `/memory/{user_id}` | Save memory |
| DELETE | `/memory/{user_id}/{key}` | Delete memory |
| GET | `/settings/{user_id}` | Get settings |
| PUT | `/settings/{user_id}` | Update settings |

Full interactive docs: http://localhost:8000/docs

---

## 🧪 Testing

```bash
# Backend tests (30+ tests)
cd backend
pip install -r requirements.txt
pytest -v --cov=. --cov-report=term-missing

# MCP Server tests
cd mcp-server
pip install pytest httpx
pytest -v

# Frontend build check
cd frontend
npm run build
```

---

## 📁 Project Structure

```
visionguide-ai/
├── backend/
│   ├── main.py           # FastAPI app + all API endpoints
│   ├── agents.py         # Multi-agent system (9 agents)
│   ├── gemini_client.py  # AI mock engine
│   ├── database.py       # SQLAlchemy models (4 tables)
│   ├── schemas.py        # Pydantic request/response models
│   ├── config.py         # Settings from .env
│   ├── middleware.py      # Request logging
│   ├── test_main.py      # API tests
│   ├── test_agents.py    # Agent unit tests
│   ├── conftest.py       # pytest fixtures
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.tsx             # Router + routes
│   │   ├── pages/              # 14 pages
│   │   ├── components/
│   │   │   ├── Layout/         # Sidebar, Header, Layout
│   │   │   ├── Camera/         # WebRTC camera component
│   │   │   ├── Voice/          # Voice button (STT)
│   │   │   └── UI/             # ResultBox, AnalysisPage
│   │   ├── hooks/              # useCamera, useSpeech
│   │   ├── store/              # Zustand global state
│   │   ├── api/                # API client
│   │   └── types/              # TypeScript types
│   ├── package.json
│   ├── tailwind.config.js
│   └── Dockerfile
├── mcp-server/
│   ├── server.py         # MCP tools with Pillow
│   ├── test_server.py    # MCP tests
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
├── startup.bat           # Windows startup
├── startup.sh            # Linux/Mac startup
├── .env.example
├── .gitignore
├── README.md
├── ARCHITECTURE.md
├── CONTRIBUTING.md
└── LICENSE
```

---

## ♿ Accessibility Features

- ✅ High contrast mode (toggle button)
- ✅ Large text mode (+18% font size)
- ✅ Text-to-speech (all AI responses)
- ✅ Speech-to-text voice input
- ✅ ARIA labels on all interactive elements
- ✅ Keyboard navigable
- ✅ Screen reader compatible (semantic HTML)
- ✅ Adjustable TTS speech rate
- 📱 Android Accessibility Service scaffold (see `ARCHITECTURE.md`)

---

## 🔧 Demo Mode

VisionGuide AI runs in **Demo Mode** by default — no API key required. The AI returns realistic, varied mock responses for all analysis types, making it perfect for demonstrations and capstone presentations.

To enable real Gemini AI:
1. Get a free API key at https://aistudio.google.com/app/apikey
2. Add `GEMINI_API_KEY=your_key` to `.env`
3. Restart the backend

---

## 📜 License

MIT License — see [LICENSE](LICENSE)

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

---

*Built with ❤️ for the Google × Kaggle Capstone Project*
#   V i s i o n G u i d e  
 #   V i s i o n G u i d e  
 