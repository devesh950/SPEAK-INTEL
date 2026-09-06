"""
Application configuration using Pydantic Settings.
"""

from pydantic_settings import BaseSettings
from typing import List
import os

# Dynamic environment variable fallback mapping for naming mismatches in Render
for k in ["GROQ_API_KEY", "groq_api_key", "Groq_api_key", "GROQ_KEY", "groq_key", "Groq_key", "GROQ", "groq"]:
    if k in os.environ and os.environ[k]:
        os.environ["GROQ_API_KEY"] = os.environ[k].strip()
        break

for k in ["GEMINI_API_KEY", "gemini_api_key", "Gemini_api_key", "GEMINI_KEY", "gemini_key", "Gemini_key", "GEMINI", "gemini"]:
    if k in os.environ and os.environ[k]:
        os.environ["GEMINI_API_KEY"] = os.environ[k].strip()
        break

if "Database_url" in os.environ:
    os.environ["DATABASE_URL"] = os.environ["Database_url"]
if "nextauth" in os.environ:
    os.environ["NEXTAUTH_SECRET"] = os.environ["nextauth"]


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # App
    app_name: str = "SpeakIntel AI"
    debug: bool = False
    
    # Groq AI (Primary - Free tier)
    groq_api_key: str = ""
    
    # Google Gemini AI (Backup)
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.0-flash"
    
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
