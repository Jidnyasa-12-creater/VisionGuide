from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./visionguide.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class ConversationMessage(Base):
    __tablename__ = "conversation_messages"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True, default="default")
    role = Column(String)           # "user" or "assistant"
    content = Column(Text)
    analysis_type = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)


class UserMemory(Base):
    __tablename__ = "user_memory"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, default="default")
    key = Column(String)
    value = Column(Text)
    category = Column(String, default="general")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)


class UserSettings(Base):
    __tablename__ = "user_settings"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, default="default")
    high_contrast = Column(Integer, default=0)
    large_text = Column(Integer, default=0)
    speech_rate = Column(Float, default=1.0)
    language = Column(String, default="en")
    theme = Column(String, default="dark")


class AnalysisHistory(Base):
    __tablename__ = "analysis_history"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True, default="default")
    analysis_type = Column(String)
    result = Column(Text)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
