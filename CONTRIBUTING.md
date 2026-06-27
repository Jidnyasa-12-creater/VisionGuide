# Contributing to VisionGuide AI

Thank you for your interest in contributing! 🦯✨

## Getting Started

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/yourusername/visionguide-ai.git`
3. **Create a branch**: `git checkout -b feature/your-feature-name`
4. **Setup** the development environment (see README.md)
5. **Make changes**, write tests, and ensure all tests pass
6. **Submit a Pull Request** with a clear description

## Development Setup

```bash
# Backend
cd backend && pip install -r requirements.txt
pytest -v  # must pass

# Frontend
cd frontend && npm install
npm run build  # must succeed
```

## Code Standards

### Python (Backend)
- Follow PEP 8 style guidelines
- Add docstrings to all functions and classes
- All endpoints must have Pydantic type annotations
- Every new endpoint needs a corresponding test in `test_main.py`

### TypeScript (Frontend)
- Use TypeScript strict mode — no `any` types unless unavoidable
- All components must have proper prop types
- Use Tailwind CSS utility classes; no inline styles

### Testing Requirements
- Backend: New agents → add tests in `test_agents.py`
- Backend: New endpoints → add tests in `test_main.py`
- All tests must pass before submitting a PR

## Adding a New Agent

1. Create a class in `backend/agents.py` inheriting the pattern of existing agents
2. Add routing keywords in `VoiceCommandAgent.process()`
3. Add mock responses in `backend/gemini_client.py`
4. Add API endpoint in `backend/main.py`
5. Add frontend page in `frontend/src/pages/`
6. Add route in `frontend/src/App.tsx`
7. Add sidebar link in `frontend/src/components/Layout/Sidebar.tsx`
8. Write tests

## Commit Message Format

```
feat: add gesture detection agent
fix: correct OCR response formatting
docs: update API reference
test: add currency agent tests
refactor: simplify planner routing
```

## Pull Request Checklist

- [ ] Tests pass: `pytest -v` in backend/
- [ ] Frontend builds: `npm run build` in frontend/
- [ ] No `.env` files committed
- [ ] `*.db` files not committed
- [ ] README updated if adding features
- [ ] Accessibility: new UI elements have aria-labels

## Reporting Issues

Use GitHub Issues with:
- Clear title describing the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment (OS, Python version, Node version)
