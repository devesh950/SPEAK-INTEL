"""
Application configuration using Pydantic Settings.
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # App
    app_name: str = "SpeakIntel AI"
    debug: bool = False
    
    # Google Gemini AI
    gemini_api_key: str = ""
    
    # Database
    database_url: str = ""
    
    # Supabase
    supabase_url: str = ""
    supabase_anon_key: str = ""
    
    
    # CORS
    cors_origins: List[str] = ["http://localhost:3000"]
    
    # Auth
    nextauth_secret: str = ""
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
