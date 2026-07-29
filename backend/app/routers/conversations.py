"""Conversations API Router"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.ai_coach import ai_coach
from app.config import settings
import httpx

router = APIRouter()


@router.get("/debug-api")
async def debug_api():
    """Temporary debug endpoint to test Gemini API connectivity."""
    results = []
    api_key = settings.gemini_api_key
    key_preview = ("***" + api_key[-6:]) if len(api_key) > 6 else "(empty)"
    
    models_to_test = [
        ("v1beta", "gemini-2.0-flash"),
        ("v1", "gemini-2.0-flash"),
        ("v1beta", "gemini-1.5-flash-latest"),
        ("v1beta", "gemini-pro"),
    ]
    
    async with httpx.AsyncClient(timeout=15.0) as client:
        for api_ver, model in models_to_test:
            url = f"https://generativelanguage.googleapis.com/{api_ver}/models/{model}:generateContent"
            payload = {
                "contents": [{"role": "user", "parts": [{"text": "Say hello"}]}],
                "generationConfig": {"maxOutputTokens": 50}
            }
            headers = {
                "Content-Type": "application/json",
                "x-goog-api-key": api_key,
            }
            try:
                resp = await client.post(url, json=payload, headers=headers)
                body = resp.text[:500]
                results.append({
                    "model": f"{api_ver}/{model}",
                    "status": resp.status_code,
                    "body": body
                })
                if resp.status_code == 200:
                    break  # Found a working model
            except Exception as e:
                results.append({
                    "model": f"{api_ver}/{model}",
                    "status": "error",
                    "body": str(e)
                })
    
    return {
        "api_key_preview": key_preview,
        "key_length": len(api_key),
        "results": results
    }


class ChatRequest(BaseModel):
    message: str
    mode: str = "general"
    role: Optional[str] = None
    level: str = "intermediate"
    history: list[dict] = []


class ChatResponse(BaseModel):
    response: str
    scores: dict


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Send a text message to the AI coach."""
    try:
        result = await ai_coach.chat(
            user_message=request.message,
            conversation_history=request.history,
            mode=request.mode,
            role=request.role,
            level=request.level,
        )
        return ChatResponse(
            response=result["response"],
            scores=result["scores"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history/{session_id}")
async def get_conversation_history(session_id: str):
    """Get conversation history for a session."""
    # TODO: Fetch from database
    return {"session_id": session_id, "messages": []}


@router.get("/sessions")
async def list_sessions():
    """List all conversation sessions for the current user."""
    # TODO: Fetch from database
    return {"sessions": []}
