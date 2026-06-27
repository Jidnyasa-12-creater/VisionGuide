"""Tests for the MCP server tools."""
import io
import base64
import pytest
from fastapi.testclient import TestClient

# create a tiny valid PNG in memory (1x1 white pixel)
import struct, zlib

def make_png_b64():
    def png_chunk(chunk_type, data):
        c = chunk_type + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)

    sig = b'\x89PNG\r\n\x1a\n'
    ihdr = png_chunk(b'IHDR', struct.pack('>IIBBBBB', 1, 1, 8, 2, 0, 0, 0))
    raw = b'\x00\xff\xff\xff'
    compressed = zlib.compress(raw)
    idat = png_chunk(b'IDAT', compressed)
    iend = png_chunk(b'IEND', b'')
    png_bytes = sig + ihdr + idat + iend
    return base64.b64encode(png_bytes).decode()


@pytest.fixture(scope="module")
def client():
    import sys, os
    sys.path.insert(0, os.path.dirname(__file__))
    from server import app
    return TestClient(app)


@pytest.fixture(scope="module")
def png_b64():
    return make_png_b64()


# ── Health ────────────────────────────────────────────────────────────
def test_root(client):
    r = client.get("/")
    assert r.status_code == 200
    assert "VisionGuide MCP Server" in r.json()["message"]


def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "healthy"


def test_list_tools(client):
    r = client.get("/mcp/tools")
    assert r.status_code == 200
    tools = r.json()["tools"]
    assert len(tools) == 6
    names = [t["name"] for t in tools]
    assert "preprocess_image" in names
    assert "enhance_for_ocr" in names
    assert "extract_dominant_colors" in names
    assert "detect_edges" in names
    assert "get_image_metadata" in names
    assert "query_memory_secure" in names


# ── Tool Execution ────────────────────────────────────────────────────
def test_preprocess_image(client, png_b64):
    r = client.post("/mcp/tools/preprocess_image/execute",
                    json={"image_b64": png_b64})
    assert r.status_code == 200
    assert r.json()["status"] == "success"
    assert "result" in r.json()


def test_enhance_for_ocr(client, png_b64):
    r = client.post("/mcp/tools/enhance_for_ocr/execute",
                    json={"image_b64": png_b64})
    assert r.status_code == 200
    assert r.json()["status"] == "success"


def test_extract_dominant_colors(client, png_b64):
    r = client.post("/mcp/tools/extract_dominant_colors/execute",
                    json={"image_b64": png_b64})
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "success"
    assert isinstance(data["result"], list)


def test_detect_edges(client, png_b64):
    r = client.post("/mcp/tools/detect_edges/execute",
                    json={"image_b64": png_b64})
    assert r.status_code == 200
    assert r.json()["status"] == "success"


def test_get_image_metadata(client, png_b64):
    r = client.post("/mcp/tools/get_image_metadata/execute",
                    json={"image_b64": png_b64})
    assert r.status_code == 200
    meta = r.json()["result"]
    assert "width" in meta
    assert "height" in meta
    assert "mode" in meta


def test_query_memory_secure(client):
    r = client.post("/mcp/tools/query_memory_secure/execute",
                    json={"args": {"user_id": "test_user"}})
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "success"
    assert data["result"]["user_id"] == "test_user"


def test_unknown_tool(client):
    r = client.post("/mcp/tools/nonexistent_tool/execute", json={})
    assert r.status_code == 404
