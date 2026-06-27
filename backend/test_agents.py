"""Tests for the multi-agent system."""
import pytest
from agents import (
    SceneDescriptionAgent, ObjectDetectionAgent, OCRAgent,
    CurrencyAgent, ClothingAgent, NavigationAgent,
    GestureExpressionAgent, VoiceCommandAgent, PlannerAgent,
    MemoryAgent, process_command
)


def test_scene_agent():
    result = SceneDescriptionAgent().analyze()
    assert isinstance(result, str)
    assert len(result) > 20


def test_object_agent():
    result = ObjectDetectionAgent().analyze()
    assert isinstance(result, str)
    assert "Detected" in result or "object" in result.lower()


def test_ocr_agent():
    result = OCRAgent().analyze()
    assert isinstance(result, str)
    assert len(result) > 5


def test_currency_agent():
    result = CurrencyAgent().analyze()
    assert isinstance(result, str)
    assert "Currency" in result or "Detected" in result or "No currency" in result


def test_clothing_agent():
    result = ClothingAgent().analyze()
    assert isinstance(result, str)
    assert "Clothing" in result or "Style" in result


def test_navigation_agent():
    result = NavigationAgent().analyze()
    assert isinstance(result, str)
    assert "Navigation" in result or "Path" in result or "CLEAR" in result


def test_gesture_agent():
    result = GestureExpressionAgent().analyze()
    assert isinstance(result, str)
    assert "Person" in result or "person" in result


# ── Voice Command Routing ─────────────────────────────────────────────
def test_voice_routes_scene():
    agent = VoiceCommandAgent()
    r = agent.process("describe the scene")
    assert r["agent"] == "SceneDescriptionAgent"
    assert len(r["response"]) > 10


def test_voice_routes_objects():
    agent = VoiceCommandAgent()
    r = agent.process("locate objects in the room")
    assert r["agent"] == "ObjectDetectionAgent"


def test_voice_routes_ocr():
    agent = VoiceCommandAgent()
    r = agent.process("read the text on the sign")
    assert r["agent"] == "OCRAgent"


def test_voice_routes_currency():
    agent = VoiceCommandAgent()
    r = agent.process("how much money is this")
    assert r["agent"] == "CurrencyAgent"


def test_voice_routes_clothing():
    agent = VoiceCommandAgent()
    r = agent.process("what clothing am I wearing")
    assert r["agent"] == "ClothingAgent"


def test_voice_routes_navigation():
    agent = VoiceCommandAgent()
    r = agent.process("navigate me safely")
    assert r["agent"] == "NavigationAgent"


def test_voice_routes_gestures():
    agent = VoiceCommandAgent()
    r = agent.process("detect facial expressions")
    assert r["agent"] == "GestureExpressionAgent"


def test_voice_unknown_command():
    agent = VoiceCommandAgent()
    r = agent.process("something completely unrelated xyz123")
    assert "response" in r
    assert isinstance(r["response"], str)


# ── Planner Agent ─────────────────────────────────────────────────────
def test_planner_delegates():
    planner = PlannerAgent()
    result = planner.plan("describe what you see")
    assert "response" in result
    assert "delegated_to" in result
    assert result["planner"] == "PlannerAgent"


def test_planner_currency():
    planner = PlannerAgent()
    result = planner.plan("recognize the currency note")
    assert result["delegated_to"] == "CurrencyAgent"


# ── Memory Agent ──────────────────────────────────────────────────────
def test_memory_remember():
    memory = MemoryAgent()
    r = memory.remember("keys", "on the table")
    assert "remember" in r.lower() or "key" in r.lower()


def test_memory_recall():
    memory = MemoryAgent()
    r = memory.recall("keys", "on the table")
    assert "table" in r.lower() or "key" in r.lower()


# ── Backward compat ───────────────────────────────────────────────────
def test_process_command_compat():
    result = process_command("describe the scene")
    assert isinstance(result, str)
    assert len(result) > 10
