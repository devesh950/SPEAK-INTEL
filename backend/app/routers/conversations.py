"""Conversations API Router"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.ai_coach import ai_coach

router = APIRouter()


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
