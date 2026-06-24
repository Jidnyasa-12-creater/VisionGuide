from fastapi.testclient import TestClient
from main import app
import os

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to VisionGuide AI API"}

def test_analyze_scene():
    with open("test_image.jpg", "wb") as f:
        f.write(b"dummy image data")
    with open("test_image.jpg", "rb") as f:
        response = client.post("/analyze-scene", files={"file": ("test_image.jpg", f, "image/jpeg")})
    assert response.status_code == 200
    assert "scene" in response.json()
    os.remove("test_image.jpg")

def test_voice_command():
    response = client.post("/voice-command?command=what is this")
    assert response.status_code == 200
    assert "response" in response.json()
