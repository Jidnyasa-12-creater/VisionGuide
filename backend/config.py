from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    gemini_api_key: str = ""
    database_url: str = "sqlite:///./visionguide.db"
    mcp_server_url: str = "http://localhost:8001"
    log_level: str = "INFO"
    cors_origins: str = "*"
    app_name: str = "VisionGuide AI"
    version: str = "1.0.0"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

@lru_cache()
def get_settings() -> Settings:
    return Settings()
