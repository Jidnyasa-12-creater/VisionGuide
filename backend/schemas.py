"""
Pydantic schemas for all API request/response models.
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ── Chat / Conversation ──────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"


class ChatResponse(BaseModel):
    response: str
    session_id: str


class ConversationMessageOut(BaseModel):
    id: int
    role: str
    content: str
    analysis_type: Optional[str]
    timestamp: datetime

    class Config:
        from_attributes = True


# ── Memory ────────────────────────────────────────────────────────────
class MemoryCreate(BaseModel):
    key: str
    value: str
    category: str = "general"


class MemoryOut(BaseModel):
    id: int
    key: str
    value: str
    category: str
    timestamp: datetime

    class Config:
        from_attributes = True


# ── Settings ──────────────────────────────────────────────────────────
class SettingsUpdate(BaseModel):
    high_contrast: Optional[int] = None
    large_text: Optional[int] = None
    speech_rate: Optional[float] = None
    language: Optional[str] = None
    theme: Optional[str] = None


class SettingsOut(BaseModel):
    high_contrast: int
    large_text: int
    speech_rate: float
    language: str
    theme: str

    class Config:
        from_attributes = True


# ── Analysis ──────────────────────────────────────────────────────────
class AnalysisOut(BaseModel):
    result: str
    analysis_type: str
    session_id: str


class VoiceCommandRequest(BaseModel):
    command: str
    session_id: str = "default"
