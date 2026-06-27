from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import datetime

from database import (
    SessionLocal, engine, Base,
    ConversationMessage, UserMemory, UserSettings, AnalysisHistory,
    get_db
)
from agents import (
    SceneDescriptionAgent, ObjectDetectionAgent, OCRAgent,
    CurrencyAgent, ClothingAgent, NavigationAgent,
    GestureExpressionAgent, PlannerAgent, MemoryAgent
)
from schemas import (
    ChatRequest, ChatResponse, ConversationMessageOut,
    MemoryCreate, MemoryOut, SettingsUpdate, SettingsOut,
    AnalysisOut, VoiceCommandRequest
)
from middleware import RequestLoggingMiddleware
from gemini_client import chat_mock

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="VisionGuide AI Backend",
    description="AI-powered accessibility assistant API for visually impaired users.",
    version="1.0.0",
)

app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Global Exception Handler ──────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)},
    )


# ── Health ────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
def read_root():
    return {"message": "Welcome to VisionGuide AI API", "version": "1.0.0", "status": "running"}


@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "VisionGuide AI Backend",
        "version": "1.0.0",
        "mode": "demo",
        "timestamp": datetime.datetime.utcnow().isoformat(),
    }


# ── Image Analysis Endpoints ──────────────────────────────────────────
async def _save_analysis(db: Session, analysis_type: str, result: str, session_id: str = "default"):
    record = AnalysisHistory(session_id=session_id, analysis_type=analysis_type, result=result)
    db.add(record)
    db.commit()


@app.post("/analyze/scene", response_model=AnalysisOut, tags=["Analysis"])
async def analyze_scene(
    file: UploadFile = File(...),
    session_id: str = "default",
    db: Session = Depends(get_db)
):
    image_bytes = await file.read()
    result = SceneDescriptionAgent().analyze(image_bytes)
    await _save_analysis(db, "scene", result, session_id)
    return AnalysisOut(result=result, analysis_type="scene", session_id=session_id)


@app.post("/analyze/objects", response_model=AnalysisOut, tags=["Analysis"])
async def detect_objects(
    file: UploadFile = File(...),
    session_id: str = "default",
    db: Session = Depends(get_db)
):
    image_bytes = await file.read()
    result = ObjectDetectionAgent().analyze(image_bytes)
    await _save_analysis(db, "objects", result, session_id)
    return AnalysisOut(result=result, analysis_type="objects", session_id=session_id)


@app.post("/analyze/ocr", response_model=AnalysisOut, tags=["Analysis"])
async def read_text(
    file: UploadFile = File(...),
    session_id: str = "default",
    db: Session = Depends(get_db)
):
    image_bytes = await file.read()
    result = OCRAgent().analyze(image_bytes)
    await _save_analysis(db, "ocr", result, session_id)
    return AnalysisOut(result=result, analysis_type="ocr", session_id=session_id)


@app.post("/analyze/currency", response_model=AnalysisOut, tags=["Analysis"])
async def recognize_currency(
    file: UploadFile = File(...),
    session_id: str = "default",
    db: Session = Depends(get_db)
):
    image_bytes = await file.read()
    result = CurrencyAgent().analyze(image_bytes)
    await _save_analysis(db, "currency", result, session_id)
    return AnalysisOut(result=result, analysis_type="currency", session_id=session_id)


@app.post("/analyze/clothing", response_model=AnalysisOut, tags=["Analysis"])
async def analyze_clothing(
    file: UploadFile = File(...),
    session_id: str = "default",
    db: Session = Depends(get_db)
):
    image_bytes = await file.read()
    result = ClothingAgent().analyze(image_bytes)
    await _save_analysis(db, "clothing", result, session_id)
    return AnalysisOut(result=result, analysis_type="clothing", session_id=session_id)


@app.post("/analyze/navigation", response_model=AnalysisOut, tags=["Analysis"])
async def navigation_guidance(
    file: UploadFile = File(...),
    session_id: str = "default",
    db: Session = Depends(get_db)
):
    image_bytes = await file.read()
    result = NavigationAgent().analyze(image_bytes)
    await _save_analysis(db, "navigation", result, session_id)
    return AnalysisOut(result=result, analysis_type="navigation", session_id=session_id)


@app.post("/analyze/gestures", response_model=AnalysisOut, tags=["Analysis"])
async def detect_gestures(
    file: UploadFile = File(...),
    session_id: str = "default",
    db: Session = Depends(get_db)
):
    image_bytes = await file.read()
    result = GestureExpressionAgent().analyze(image_bytes)
    await _save_analysis(db, "gestures", result, session_id)
    return AnalysisOut(result=result, analysis_type="gestures", session_id=session_id)


# ── Legacy endpoints (backward compatibility) ─────────────────────────
@app.post("/analyze-scene", tags=["Legacy"])
async def analyze_scene_legacy(file: UploadFile = File(...)):
    result = SceneDescriptionAgent().analyze(await file.read())
    return {"scene": result}


@app.post("/detect-objects", tags=["Legacy"])
async def detect_objects_legacy(file: UploadFile = File(...)):
    result = ObjectDetectionAgent().analyze(await file.read())
    return {"objects": result}


@app.post("/read-text", tags=["Legacy"])
async def read_text_legacy(file: UploadFile = File(...)):
    result = OCRAgent().analyze(await file.read())
    return {"text": result}


@app.post("/recognize-currency", tags=["Legacy"])
async def recognize_currency_legacy(file: UploadFile = File(...)):
    result = CurrencyAgent().analyze(await file.read())
    return {"currency": result}


# ── Voice Command ─────────────────────────────────────────────────────
@app.post("/voice/command", tags=["Voice"])
async def process_voice_command(
    body: VoiceCommandRequest,
    db: Session = Depends(get_db)
):
    planner = PlannerAgent()
    result = planner.plan(body.command)
    # Save to conversation history
    db.add(ConversationMessage(
        session_id=body.session_id, role="user", content=body.command
    ))
    db.add(ConversationMessage(
        session_id=body.session_id, role="assistant", content=result["response"]
    ))
    db.commit()
    return {
        "response": result["response"],
        "agent": result["delegated_to"],
        "session_id": body.session_id
    }


# Legacy voice endpoint
@app.post("/voice-command", tags=["Legacy"])
async def voice_command_legacy(command: str):
    from agents import process_command
    return {"response": process_command(command)}


# ── Chat ──────────────────────────────────────────────────────────────
@app.post("/chat", response_model=ChatResponse, tags=["Chat"])
async def chat(body: ChatRequest, db: Session = Depends(get_db)):
    response = chat_mock(body.message)
    db.add(ConversationMessage(
        session_id=body.session_id, role="user", content=body.message
    ))
    db.add(ConversationMessage(
        session_id=body.session_id, role="assistant", content=response
    ))
    db.commit()
    return ChatResponse(response=response, session_id=body.session_id)


# ── Conversation History ──────────────────────────────────────────────
@app.get("/chat/history/{session_id}", tags=["Chat"])
def get_history(session_id: str, db: Session = Depends(get_db)):
    messages = (
        db.query(ConversationMessage)
        .filter(ConversationMessage.session_id == session_id)
        .order_by(ConversationMessage.timestamp)
        .all()
    )
    return {"session_id": session_id, "messages": [
        {
            "id": m.id,
            "role": m.role,
            "content": m.content,
            "timestamp": m.timestamp.isoformat()
        } for m in messages
    ]}


@app.delete("/chat/history/{session_id}", tags=["Chat"])
def clear_history(session_id: str, db: Session = Depends(get_db)):
    db.query(ConversationMessage).filter(
        ConversationMessage.session_id == session_id
    ).delete()
    db.commit()
    return {"message": f"History cleared for session {session_id}"}


# ── Analysis History ──────────────────────────────────────────────────
@app.get("/history/{session_id}", tags=["History"])
def get_analysis_history(session_id: str, db: Session = Depends(get_db)):
    records = (
        db.query(AnalysisHistory)
        .filter(AnalysisHistory.session_id == session_id)
        .order_by(AnalysisHistory.timestamp.desc())
        .limit(50)
        .all()
    )
    return {"records": [
        {
            "id": r.id,
            "type": r.analysis_type,
            "result": r.result,
            "timestamp": r.timestamp.isoformat()
        } for r in records
    ]}


# ── Memory ────────────────────────────────────────────────────────────
@app.get("/memory/{user_id}", tags=["Memory"])
def get_memory(user_id: str, db: Session = Depends(get_db)):
    memories = db.query(UserMemory).filter(UserMemory.user_id == user_id).all()
    return {"memories": [
        {"id": m.id, "key": m.key, "value": m.value, "category": m.category}
        for m in memories
    ]}


@app.post("/memory/{user_id}", tags=["Memory"])
def save_memory(user_id: str, body: MemoryCreate, db: Session = Depends(get_db)):
    # Update if key exists
    existing = db.query(UserMemory).filter(
        UserMemory.user_id == user_id, UserMemory.key == body.key
    ).first()
    if existing:
        existing.value = body.value
        existing.category = body.category
    else:
        db.add(UserMemory(user_id=user_id, key=body.key, value=body.value, category=body.category))
    db.commit()
    return {"message": f"Memory saved: {body.key}"}


@app.delete("/memory/{user_id}/{key}", tags=["Memory"])
def delete_memory(user_id: str, key: str, db: Session = Depends(get_db)):
    db.query(UserMemory).filter(
        UserMemory.user_id == user_id, UserMemory.key == key
    ).delete()
    db.commit()
    return {"message": f"Memory deleted: {key}"}


# ── Settings ──────────────────────────────────────────────────────────
@app.get("/settings/{user_id}", tags=["Settings"])
def get_settings_endpoint(user_id: str, db: Session = Depends(get_db)):
    settings = db.query(UserSettings).filter(UserSettings.user_id == user_id).first()
    if not settings:
        settings = UserSettings(user_id=user_id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return {
        "high_contrast": settings.high_contrast,
        "large_text": settings.large_text,
        "speech_rate": settings.speech_rate,
        "language": settings.language,
        "theme": settings.theme,
    }


@app.put("/settings/{user_id}", tags=["Settings"])
def update_settings(user_id: str, body: SettingsUpdate, db: Session = Depends(get_db)):
    settings = db.query(UserSettings).filter(UserSettings.user_id == user_id).first()
    if not settings:
        settings = UserSettings(user_id=user_id)
        db.add(settings)
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(settings, field, value)
    db.commit()
    return {"message": "Settings updated"}
