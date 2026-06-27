"""
AI Mock Engine — Simulates Gemini AI responses for demo/capstone.
No API key required. Returns realistic, varied responses.
"""
import random
from typing import Optional

# Varied scene descriptions
SCENE_RESPONSES = [
    "I can see a well-lit indoor environment. There's a desk in the center with a laptop and a coffee mug. Natural light is coming from a window on the right. The floor appears to be tiled. There are no immediate obstacles in the walking path.",
    "This appears to be a living room. A sofa is positioned against the left wall, and a television is mounted ahead. There's a coffee table in the center — be careful of its edges. The path to the right appears clear.",
    "I can see an outdoor scene with a paved walkway going straight ahead. There are trees on both sides. The path is clear for approximately 5 meters. There appears to be a bench on the right side about 3 meters ahead.",
    "This looks like a kitchen area. The counter is to the left, and there appears to be a refrigerator straight ahead. There's a chair near the center — please go around it. Good lighting throughout the space.",
]

OBJECT_RESPONSES = [
    "Detected objects:\n• Laptop — directly ahead on desk\n• Coffee mug — right side, 30cm\n• Chair — behind and left\n• Notebook — on desk surface\n• Pen — beside notebook\n• Lamp — top right corner",
    "Detected objects:\n• Door — straight ahead, 4 meters\n• Table — center of room\n• 2 Chairs — around the table\n• Window — left wall\n• Bookshelf — right wall\n• Bag — near the door",
    "Detected objects:\n• Sofa — left side\n• Television — straight ahead\n• Remote control — on sofa\n• Plant — far right corner\n• Rug — center floor",
]

OCR_RESPONSES = [
    "Extracted Text:\n\nVisionGuide AI\nAccessibility Dashboard\nVersion 1.0.0\n\nPress any button to begin your AI-assisted experience.",
    "Extracted Text:\n\nWelcome!\nToday's Date: Thursday\nMeeting at 3:00 PM\nRoom 204, Building B\n\n— Please sign in at reception",
    "Extracted Text:\n\nProduct: Whole Grain Bread\nNet Weight: 400g\nBest Before: See top of pack\nIngredients: Whole wheat flour, water, yeast, salt\nAllergens: Contains Gluten",
    "Extracted Text:\n\nExit →\nEmergency Exit\nDo Not Block\nFire Extinguisher inside",
]

CURRENCY_RESPONSES = [
    "Currency Detected:\n• Country: India\n• Currency: Indian Rupee (₹)\n• Denomination: ₹500 note\n• Color: Stone grey / lavender\n• Condition: Good\n• Gandhi portrait visible on front",
    "Currency Detected:\n• Country: India\n• Currency: Indian Rupee (₹)\n• Denomination: ₹100 note\n• Color: Lavender / purple\n• Condition: Good\n• Reserve Bank of India seal visible",
    "Currency Detected:\n• Country: United States\n• Currency: US Dollar ($)\n• Denomination: $20 bill\n• Color: Green\n• Portrait: Andrew Jackson\n• Condition: Good",
    "No currency detected in the image. Please ensure the bill or coin is clearly visible and well-lit.",
]

CLOTHING_RESPONSES = [
    "Clothing Analysis:\n• Top: Solid blue casual t-shirt\n• Bottom: Dark navy denim jeans\n• Footwear: White sneakers\n• Style: Casual\n• Primary colors: Blue, navy, white\n• Accessories: None detected\n• Occasion: Everyday casual wear",
    "Clothing Analysis:\n• Top: White formal dress shirt\n• Bottom: Black formal trousers\n• Footwear: Black leather shoes\n• Style: Business Formal\n• Primary colors: White, black\n• Accessories: Belt detected\n• Occasion: Office / formal event",
    "Clothing Analysis:\n• Top: Red and white striped polo shirt\n• Bottom: Beige chinos\n• Footwear: Brown loafers\n• Style: Smart Casual\n• Primary colors: Red, white, beige, brown\n• Accessories: Watch on left wrist\n• Occasion: Casual office or social event",
    "Clothing Analysis:\n• Outfit: Traditional salwar kameez\n• Color: Teal green with golden embroidery\n• Style: Traditional / Ethnic\n• Dupatta: Present, cream colored\n• Footwear: Sandals\n• Occasion: Festival or cultural event",
]

NAVIGATION_RESPONSES = [
    "Navigation Guidance:\n✅ Path straight ahead: CLEAR for 4 meters\n⚠️ Right side: Chair obstacle at 1.5 meters\n✅ Left side: Clear\n📍 Recommendation: Walk straight ahead, slightly left to avoid the chair on your right.",
    "Navigation Guidance:\n✅ Path ahead: CLEAR\n⚠️ Low table approximately 2 meters ahead — knee height\n✅ Left corridor: Open and clear\n📍 Recommendation: Take the left corridor to avoid the table.",
    "Navigation Guidance:\n⚠️ Step/stair detected 1 meter ahead — descending\n✅ Handrail present on the right side\n📍 Recommendation: Slow down, reach for the handrail on your right, then descend carefully.",
    "Navigation Guidance:\n✅ Wide open space detected\n✅ No obstacles within 5 meters\n⚠️ Wall on the left at 2 meters\n📍 Recommendation: Path is clear. Move forward with confidence.",
]

GESTURE_EXPRESSIONS = [
    "Person Analysis:\n• 1 person detected\n• Expression: Appears to be smiling / happy\n• Gesture: Waving hand (greeting)\n• Position: Directly ahead, approximately 2 meters",
    "Person Analysis:\n• 2 people detected\n• Person 1 (left): Neutral expression, standing\n• Person 2 (right): Appears to be pointing toward the right\n• Distance: Approximately 3 meters",
    "Person Analysis:\n• 1 person detected\n• Expression: Neutral / calm\n• Gesture: No significant gesture detected\n• Position: To the right, approximately 1.5 meters",
]

CHAT_RESPONSES = [
    "Hello! I'm VisionGuide AI, your accessibility assistant. I'm here to help you navigate your surroundings, read text, identify objects, and assist with daily tasks. What would you like help with?",
    "I can help you with that! Use the camera buttons to capture an image and I'll analyze it for you. You can also ask me to describe scenes, read text, identify currency, or guide your navigation.",
    "Great question! I'm designed to assist visually impaired users. I can describe what's around you, identify objects and their positions, read printed text, recognize currency, analyze clothing, and help you navigate safely.",
    "I'm running in demo mode — all responses are pre-configured examples. In production with a Gemini API key, I would provide real-time AI analysis of your actual surroundings.",
]


def analyze_image_mock(analysis_type: str) -> str:
    """Return a realistic mock response based on analysis type."""
    responses = {
        "scene": SCENE_RESPONSES,
        "objects": OBJECT_RESPONSES,
        "ocr": OCR_RESPONSES,
        "currency": CURRENCY_RESPONSES,
        "clothing": CLOTHING_RESPONSES,
        "navigation": NAVIGATION_RESPONSES,
        "gestures": GESTURE_EXPRESSIONS,
    }
    pool = responses.get(analysis_type, SCENE_RESPONSES)
    return random.choice(pool)


def chat_mock(message: str) -> str:
    """Return a context-aware mock chat response."""
    msg = message.lower()
    if any(w in msg for w in ["describe", "scene", "around", "what do you see"]):
        return random.choice(SCENE_RESPONSES)
    elif any(w in msg for w in ["object", "detect", "find", "where is"]):
        return random.choice(OBJECT_RESPONSES)
    elif any(w in msg for w in ["read", "text", "ocr", "sign", "label"]):
        return random.choice(OCR_RESPONSES)
    elif any(w in msg for w in ["money", "currency", "rupee", "dollar", "note", "coin"]):
        return random.choice(CURRENCY_RESPONSES)
    elif any(w in msg for w in ["cloth", "wear", "shirt", "dress", "color", "outfit"]):
        return random.choice(CLOTHING_RESPONSES)
    elif any(w in msg for w in ["navigate", "walk", "path", "obstacle", "safe", "direction"]):
        return random.choice(NAVIGATION_RESPONSES)
    elif any(w in msg for w in ["person", "people", "face", "expression", "gesture", "wave"]):
        return random.choice(GESTURE_EXPRESSIONS)
    elif any(w in msg for w in ["hello", "hi", "hey", "help", "what can"]):
        return random.choice(CHAT_RESPONSES)
    else:
        return (
            "I understand your request. In demo mode, I can respond to commands like "
            "'describe the scene', 'detect objects', 'read text', 'recognize currency', "
            "'analyze clothing', or 'help me navigate'. What would you like to do?"
        )
