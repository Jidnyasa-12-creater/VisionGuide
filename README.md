# VisionGuide AI - Multi-Agent Assistive System

VisionGuide AI is a production-ready full-stack AI agent system designed to assist visually impaired individuals. It utilizes the Google ADK Multi-Agent system and MCP Server architecture for advanced environmental understanding and accessible interaction.

## Architecture
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Python, FastAPI, SQLite
- **Agents**: Google ADK Planner, Scene Description, Object Detection, Currency Recognition, OCR, Voice Interaction, Memory.
- **MCP Server**: Provides secure, specialized tools (e.g., image preprocessing, secure querying) to the agents.

## Setup Instructions

### Local Development (Docker)
Ensure Docker and Docker Compose are installed.

1. Clone the repository and navigate to the root directory.
2. Run the application:
   ```bash
   docker-compose up --build
   ```
3. Access the dashboard: `http://localhost:3000`
4. Backend API docs: `http://localhost:8000/docs`
5. MCP Server docs: `http://localhost:8001/docs`

### Key Concepts Applied
- **ADK Multi-Agent System**: Specialized agents handle unique tasks (OCR, Scene, Voice) orchestrated by a Planner Agent.
- **MCP Server**: Sandboxed execution environment providing specialized tools.
- **Security**: Pydantic validation on all endpoints.
- **Agent Skills**: Defined tools like `preprocess_image` and `query_memory_secure`.

## Antigravity Demo Explanation
This project was built using Antigravity, which generated the implementation plan, scaffolded the multi-service architecture, implemented the backend APIs with mocked agent interactions, built the accessible React dashboard, and wrapped everything in Docker for immediate production readiness.
