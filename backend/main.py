from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import agents
import os

Base.metadata.create_all(bind=engine)

app = FastAPI(title="VisionGuide AI Backend", version="1.0.0")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to VisionGuide AI API"}

@app.post("/analyze-scene")
async def analyze_scene(file: UploadFile = File(...)):
    # Mocking ADK call for Scene Description
    # In a real setup, we would pass the image to the Scene Description Agent
    return {"scene": "A well-lit room with a desk, a laptop, and a chair. Accessibility mode ready."}

@app.post("/detect-objects")
async def detect_objects(file: UploadFile = File(...)):
    return {"objects": ["laptop", "desk", "chair"]}

@app.post("/recognize-currency")
async def recognize_currency(file: UploadFile = File(...)):
    return {"currency": "One hundred US Dollars bill detected."}

@app.post("/read-text")
async def read_text(file: UploadFile = File(...)):
    return {"text": "VisionGuide AI Dashboard. Welcome!"}

@app.post("/voice-command")
async def process_voice_command(command: str):
    # Delegate to Planner Agent -> specific agent
    response = agents.process_command(command)
    return {"response": response}
