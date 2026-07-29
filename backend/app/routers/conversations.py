"""Conversations API Router"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.ai_coach import ai_coach
from app.config import settings
import httpx

from fastapi.responses import StreamingResponse
import edge_tts
import io

router = APIRouter()


@router.get("/tts")
async def tts(text: str, voice: str = "en-US-EmmaNeural"):
    """
    Generate and stream Text-to-Speech audio using Microsoft Edge's Neural TTS.
    Bypasses all client-side blocks and CORS limitations.
    """
    if not text.strip():
        raise HTTPException(status_code=400, detail="Text parameter cannot be empty")
    
    try:
        communicate = edge_tts.Communicate(text, voice)
        
        async def audio_generator():
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    yield chunk["data"]
                    
        return StreamingResponse(audio_generator(), media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS generation failed: {str(e)}")


@router.get("/debug-api")
async def debug_api():
    """Debug endpoint to test Groq API connectivity."""
    groq_key = settings.groq_api_key
    groq_preview = ("***" + groq_key[-6:]) if len(groq_key) > 6 else "(empty)"
    
    result = {"provider": "groq", "key_preview": groq_preview, "key_length": len(groq_key)}
    
    if not groq_key:
        result["status"] = "NO_KEY"
        result["message"] = "GROQ_API_KEY is not set in environment variables"
        return result
    
    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            resp = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                json={
                    "model": "llama-3.1-8b-instant",
                    "messages": [{"role": "user", "content": "Say hello in one sentence"}],
                    "max_tokens": 50,
                },
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {groq_key}",
                },
            )
            result["http_status"] = resp.status_code
            result["body"] = resp.text[:500]
        except Exception as e:
            result["error"] = str(e)
    
    return result


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
