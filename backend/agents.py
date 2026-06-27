"""
Multi-Agent System for VisionGuide AI.
Each agent handles a specialized task and routes to the mock AI engine.
"""
from gemini_client import analyze_image_mock, chat_mock


class SceneDescriptionAgent:
    """Describes the overall scene in an image."""
    name = "SceneDescriptionAgent"

    def analyze(self, image_bytes: bytes = None) -> str:
        return analyze_image_mock("scene")


class ObjectDetectionAgent:
    """Detects and locates objects in an image."""
    name = "ObjectDetectionAgent"

    def analyze(self, image_bytes: bytes = None) -> str:
        return analyze_image_mock("objects")


class OCRAgent:
    """Extracts text from images."""
    name = "OCRAgent"

    def analyze(self, image_bytes: bytes = None) -> str:
        return analyze_image_mock("ocr")


class CurrencyAgent:
    """Identifies currency denomination and country."""
    name = "CurrencyAgent"

    def analyze(self, image_bytes: bytes = None) -> str:
        return analyze_image_mock("currency")


class ClothingAgent:
    """Analyzes clothing type, color, and style."""
    name = "ClothingAgent"

    def analyze(self, image_bytes: bytes = None) -> str:
        return analyze_image_mock("clothing")


class NavigationAgent:
    """Provides obstacle detection and path guidance."""
    name = "NavigationAgent"

    def analyze(self, image_bytes: bytes = None) -> str:
        return analyze_image_mock("navigation")


class GestureExpressionAgent:
    """Detects visible gestures and facial expressions."""
    name = "GestureExpressionAgent"

    def analyze(self, image_bytes: bytes = None) -> str:
        return analyze_image_mock("gestures")


class VoiceCommandAgent:
    """Processes voice/text commands and routes to correct agent."""
    name = "VoiceCommandAgent"

    def __init__(self):
        self.agents = {
            "scene": SceneDescriptionAgent(),
            "objects": ObjectDetectionAgent(),
            "ocr": OCRAgent(),
            "currency": CurrencyAgent(),
            "clothing": ClothingAgent(),
            "navigation": NavigationAgent(),
            "gestures": GestureExpressionAgent(),
        }

    def process(self, command: str) -> dict:
        cmd = command.lower()

        # Check more specific routes first to avoid false matches
        if any(w in cmd for w in ["person", "people", "face", "facial", "expression", "gesture", "wave", "smile"]):
            agent = self.agents["gestures"]
        elif any(w in cmd for w in ["money", "currency", "rupee", "dollar", "note", "coin", "cash"]):
            agent = self.agents["currency"]
        elif any(w in cmd for w in ["cloth", "wear", "shirt", "dress", "outfit", "fashion"]):
            agent = self.agents["clothing"]
        elif any(w in cmd for w in ["navigate", "walk", "path", "obstacle", "safe", "direction"]):
            agent = self.agents["navigation"]
        elif any(w in cmd for w in ["read", "text", "ocr", "sign", "label", "print"]):
            agent = self.agents["ocr"]
        elif any(w in cmd for w in ["object", "detect objects", "find", "locate", "where is"]):
            agent = self.agents["objects"]
        elif any(w in cmd for w in ["describe", "scene", "around", "environment", "what is"]):
            agent = self.agents["scene"]
        else:
            return {
                "agent": "VoiceCommandAgent",
                "response": chat_mock(command)
            }

        return {
            "agent": agent.name,
            "response": agent.analyze()
        }


class MemoryAgent:
    """Handles user memory recall and storage confirmation."""
    name = "MemoryAgent"

    def remember(self, key: str, value: str) -> str:
        return f"I've remembered that {key} is {value}. I'll recall this when you need it."

    def recall(self, key: str, value: str) -> str:
        return f"You told me that {key} is: {value}"


class PlannerAgent:
    """Orchestrates all agents — entry point for complex requests."""
    name = "PlannerAgent"

    def __init__(self):
        self.voice_agent = VoiceCommandAgent()

    def plan(self, command: str) -> dict:
        result = self.voice_agent.process(command)
        return {
            "planner": self.name,
            "delegated_to": result["agent"],
            "response": result["response"]
        }


# Module-level convenience function (preserves backward compat)
def process_command(command: str) -> str:
    planner = PlannerAgent()
    result = planner.plan(command)
    return result["response"]
