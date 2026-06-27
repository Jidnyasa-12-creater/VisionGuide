"""
Backend API tests — all endpoints covered.
Uses StaticPool so all connections share the same in-memory SQLite database.
"""
import io
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient


def make_image_file():
    return ("test.jpg", io.BytesIO(b"fake-image-data"), "image/jpeg")


@pytest.fixture(scope="module")
def client():
    # ── MUST swap engine BEFORE importing main ─────────────────────────
    import database

    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,          # ← all connections share ONE db
    )
    database.engine = engine
    database.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    database.Base.metadata.create_all(bind=engine)   # create all 4 tables

    from main import app
    from database import get_db

    def override_get_db():
        db = database.SessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


# ── Health ────────────────────────────────────────────────────────────
def test_root(client):
    r = client.get("/")
    assert r.status_code == 200
    assert r.json()["status"] == "running"


def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "healthy"


# ── Analysis ──────────────────────────────────────────────────────────
def test_analyze_scene(client):
    r = client.post("/analyze/scene", files={"file": make_image_file()})
    assert r.status_code == 200
    d = r.json()
    assert "result" in d
    assert d["analysis_type"] == "scene"
    assert len(d["result"]) > 10


def test_detect_objects(client):
    r = client.post("/analyze/objects", files={"file": make_image_file()})
    assert r.status_code == 200
    assert "result" in r.json()


def test_ocr(client):
    r = client.post("/analyze/ocr", files={"file": make_image_file()})
    assert r.status_code == 200
    assert "result" in r.json()


def test_currency(client):
    r = client.post("/analyze/currency", files={"file": make_image_file()})
    assert r.status_code == 200
    assert "result" in r.json()


def test_clothing(client):
    r = client.post("/analyze/clothing", files={"file": make_image_file()})
    assert r.status_code == 200
    assert "result" in r.json()


def test_navigation(client):
    r = client.post("/analyze/navigation", files={"file": make_image_file()})
    assert r.status_code == 200
    assert "result" in r.json()


def test_gestures(client):
    r = client.post("/analyze/gestures", files={"file": make_image_file()})
    assert r.status_code == 200
    assert "result" in r.json()


# ── Legacy Endpoints ──────────────────────────────────────────────────
def test_legacy_analyze_scene(client):
    r = client.post("/analyze-scene", files={"file": make_image_file()})
    assert r.status_code == 200
    assert "scene" in r.json()


def test_legacy_detect_objects(client):
    r = client.post("/detect-objects", files={"file": make_image_file()})
    assert r.status_code == 200
    assert "objects" in r.json()


def test_legacy_read_text(client):
    r = client.post("/read-text", files={"file": make_image_file()})
    assert r.status_code == 200
    assert "text" in r.json()


def test_legacy_currency(client):
    r = client.post("/recognize-currency", files={"file": make_image_file()})
    assert r.status_code == 200
    assert "currency" in r.json()


def test_legacy_voice_command(client):
    r = client.post("/voice-command?command=describe the scene")
    assert r.status_code == 200
    assert "response" in r.json()


# ── Voice Command ─────────────────────────────────────────────────────
def test_voice_command(client):
    r = client.post("/voice/command", json={"command": "describe the scene", "session_id": "test"})
    assert r.status_code == 200
    d = r.json()
    assert "response" in d
    assert len(d["response"]) > 5


def test_voice_command_objects(client):
    r = client.post("/voice/command", json={"command": "locate objects", "session_id": "test"})
    assert r.status_code == 200


def test_voice_command_currency(client):
    r = client.post("/voice/command", json={"command": "recognize currency", "session_id": "test"})
    assert r.status_code == 200


# ── Chat ──────────────────────────────────────────────────────────────
def test_chat(client):
    r = client.post("/chat", json={"message": "hello", "session_id": "test-chat"})
    assert r.status_code == 200
    d = r.json()
    assert "response" in d
    assert d["session_id"] == "test-chat"


def test_chat_history(client):
    client.post("/chat", json={"message": "test message", "session_id": "hist-test"})
    r = client.get("/chat/history/hist-test")
    assert r.status_code == 200
    d = r.json()
    assert "messages" in d
    assert len(d["messages"]) >= 2


def test_clear_history(client):
    client.post("/chat", json={"message": "to clear", "session_id": "clear-sess"})
    r = client.delete("/chat/history/clear-sess")
    assert r.status_code == 200
    r2 = client.get("/chat/history/clear-sess")
    assert r2.json()["messages"] == []


# ── Memory ────────────────────────────────────────────────────────────
def test_save_memory(client):
    r = client.post("/memory/user1", json={"key": "name", "value": "Alice", "category": "personal"})
    assert r.status_code == 200


def test_get_memory(client):
    client.post("/memory/user1", json={"key": "location", "value": "Home"})
    r = client.get("/memory/user1")
    assert r.status_code == 200
    d = r.json()
    assert "memories" in d
    assert len(d["memories"]) > 0


def test_delete_memory(client):
    client.post("/memory/user1", json={"key": "temp_key", "value": "temp_val"})
    r = client.delete("/memory/user1/temp_key")
    assert r.status_code == 200


# ── Settings ──────────────────────────────────────────────────────────
def test_get_settings(client):
    r = client.get("/settings/user1")
    assert r.status_code == 200
    d = r.json()
    assert "high_contrast" in d
    assert "theme" in d


def test_update_settings(client):
    r = client.put("/settings/user1", json={"high_contrast": 1, "theme": "dark", "large_text": 1})
    assert r.status_code == 200
    r2 = client.get("/settings/user1")
    assert r2.json()["high_contrast"] == 1
