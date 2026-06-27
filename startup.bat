@echo off
echo.
echo ========================================
echo   VisionGuide AI - Startup
echo ========================================
echo.

REM Check if .env exists
if not exist ".env" (
  echo [WARNING] .env not found. Copying .env.example to .env...
  copy .env.example .env
  echo [OK] .env created. Edit it to add your GEMINI_API_KEY if needed.
)

REM Check if Docker is available
docker --version >nul 2>&1
if %errorlevel% equ 0 (
  echo [OK] Docker found. Starting with Docker Compose...
  docker-compose up --build
) else (
  echo [INFO] Docker not found. Starting services manually...
  echo.
  echo Starting Backend on port 8000...
  start "VisionGuide Backend" cmd /k "cd backend && pip install -r requirements.txt -q && uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
  timeout /t 3 /nobreak >nul
  echo Starting MCP Server on port 8001...
  start "VisionGuide MCP" cmd /k "cd mcp-server && pip install -r requirements.txt -q && uvicorn server:app --host 0.0.0.0 --port 8001 --reload"
  timeout /t 3 /nobreak >nul
  echo Starting Frontend on port 5173...
  start "VisionGuide Frontend" cmd /k "cd frontend && npm install && npm run dev"
  echo.
  echo ========================================
  echo  Backend:  http://localhost:8000
  echo  API Docs: http://localhost:8000/docs
  echo  MCP:      http://localhost:8001
  echo  Frontend: http://localhost:5173
  echo ========================================
)
