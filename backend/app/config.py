"""
Application configuration using Pydantic Settings.
"""

from pydantic_settings import BaseSettings
from typing import List
import os

# Dynamic environment variable fallback mapping for naming mismatches in Render
if "Gemini_key" in os.environ:
    os.environ["GEMINI_API_KEY"] = os.environ["Gemini_key"]
if "Database_url" in os.environ:
    os.environ["DATABASE_URL"] = os.environ["Database_url"]
if "nextauth" in os.environ:
    os.environ["NEXTAUTH_SECRET"] = os.environ["nextauth"]


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # App
    app_name: str = "SpeakIntel AI"
    debug: bool = False
    
    # Google Gemini AI
    gemini_api_key: str = ""
    gemini_model: str = "gemini-1.5-pro"
    
    # Database
    database_url: str = ""
    
    # Supabase
    supabase_url: str = ""
    supabase_anon_key: str = ""
    
    
    # CORS
    cors_origins: List[str] = [
        "http://localhost:3000",
        "https://speak-intel.vercel.app",
        "https://speakintel.vercel.app"
    ]
    
    # Auth
    nextauth_secret: str = ""
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
