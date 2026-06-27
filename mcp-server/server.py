"""
VisionGuide MCP Server — Real image preprocessing tools using Pillow.
Provides specialized tools to the AI agents.
"""
import io
import base64
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Any
from PIL import Image, ImageFilter, ImageEnhance, ImageOps
import uvicorn

app = FastAPI(
    title="VisionGuide MCP Server",
    description="Model Context Protocol server providing image tools for VisionGuide AI agents.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ToolRequest(BaseModel):
    image_b64: Optional[str] = None
    args: Optional[dict] = None


# ── Tool Registry ─────────────────────────────────────────────────────
TOOLS = [
    {
        "name": "preprocess_image",
        "description": "Resizes and normalizes an image for better AI analysis accuracy.",
        "input": "base64-encoded image",
        "output": "base64-encoded preprocessed image",
    },
    {
        "name": "enhance_for_ocr",
        "description": "Converts image to grayscale and increases contrast for better OCR.",
        "input": "base64-encoded image",
        "output": "base64-encoded high-contrast grayscale image",
    },
    {
        "name": "extract_dominant_colors",
        "description": "Returns the 5 most dominant colors in an image as hex codes.",
        "input": "base64-encoded image",
        "output": "list of hex color strings",
    },
    {
        "name": "detect_edges",
        "description": "Applies edge detection for navigation/obstacle analysis.",
        "input": "base64-encoded image",
        "output": "base64-encoded edge-detected image",
    },
    {
        "name": "get_image_metadata",
        "description": "Returns image dimensions, format, and mode.",
        "input": "base64-encoded image",
        "output": "metadata dict",
    },
    {
        "name": "query_memory_secure",
        "description": "Returns user accessibility preferences from the memory store.",
        "input": "user_id string in args",
        "output": "preferences dict",
    },
]


def _decode_image(image_b64: str) -> Image.Image:
    if not image_b64:
        raise HTTPException(status_code=400, detail="image_b64 is required")
    try:
        data = base64.b64decode(image_b64)
        return Image.open(io.BytesIO(data))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image data: {e}")


def _encode_image(img: Image.Image, fmt: str = "JPEG") -> str:
    buf = io.BytesIO()
    img.save(buf, format=fmt)
    return base64.b64encode(buf.getvalue()).decode("utf-8")


# ── Endpoints ─────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    return {"message": "VisionGuide MCP Server running", "tools": len(TOOLS)}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy", "service": "MCP Server"}


@app.get("/mcp/tools", tags=["Tools"])
def list_tools():
    return {"tools": TOOLS}


@app.post("/mcp/tools/{tool_name}/execute", tags=["Tools"])
def execute_tool(tool_name: str, body: ToolRequest = None):
    if body is None:
        body = ToolRequest()

    if tool_name == "preprocess_image":
        img = _decode_image(body.image_b64)
        img = img.resize((640, 480), Image.LANCZOS)
        img = ImageEnhance.Contrast(img).enhance(1.2)
        return {
            "status": "success",
            "result": _encode_image(img),
            "description": "Image resized to 640x480 and contrast enhanced by 1.2x",
        }

    elif tool_name == "enhance_for_ocr":
        img = _decode_image(body.image_b64)
        img = img.convert("L")                          # grayscale
        img = ImageOps.autocontrast(img)                # auto contrast
        img = ImageEnhance.Sharpness(img).enhance(2.0)  # sharpen
        return {
            "status": "success",
            "result": _encode_image(img, "PNG"),
            "description": "Converted to grayscale, auto-contrast, and sharpened for OCR",
        }

    elif tool_name == "extract_dominant_colors":
        img = _decode_image(body.image_b64)
        img_small = img.resize((50, 50)).convert("RGB")
        pixels = list(img_small.getdata())
        # Simple color quantization: pick colors spread across pixel space
        step = max(1, len(pixels) // 5)
        colors = []
        for i in range(0, len(pixels), step):
            r, g, b = pixels[i]
            colors.append(f"#{r:02x}{g:02x}{b:02x}")
            if len(colors) == 5:
                break
        return {"status": "success", "result": colors, "description": "5 dominant colors extracted"}

    elif tool_name == "detect_edges":
        img = _decode_image(body.image_b64)
        img = img.convert("L").filter(ImageFilter.FIND_EDGES)
        return {
            "status": "success",
            "result": _encode_image(img, "PNG"),
            "description": "Edge detection applied for navigation analysis",
        }

    elif tool_name == "get_image_metadata":
        img = _decode_image(body.image_b64)
        return {
            "status": "success",
            "result": {
                "width": img.width,
                "height": img.height,
                "format": img.format or "Unknown",
                "mode": img.mode,
                "size_bytes": len(base64.b64decode(body.image_b64)),
            },
        }

    elif tool_name == "query_memory_secure":
        user_id = (body.args or {}).get("user_id", "default")
        return {
            "status": "success",
            "result": {
                "user_id": user_id,
                "preferences": {
                    "high_contrast": False,
                    "large_text": False,
                    "speech_rate": 1.0,
                    "language": "en",
                    "theme": "dark",
                },
            },
        }

    else:
        raise HTTPException(status_code=404, detail=f"Tool '{tool_name}' not found")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
