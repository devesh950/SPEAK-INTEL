"""
SpeakIntel AI - FastAPI Backend
Your Personal AI Communication Coach
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import json

from app.config import settings
from app.routers import conversations, interviews, vocabulary, progress, admin
from app.websocket.voice_handler import VoiceHandler


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    print("🚀 SpeakIntel AI Backend starting...")
    yield
    print("👋 SpeakIntel AI Backend shutting down...")


app = FastAPI(
    title="SpeakIntel AI",
    description="AI Communication Coach API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REST Routers
app.include_router(conversations.router, prefix="/api/conversations", tags=["Conversations"])
app.include_router(interviews.router, prefix="/api/interviews", tags=["Interviews"])
app.include_router(vocabulary.router, prefix="/api/vocabulary", tags=["Vocabulary"])
app.include_router(progress.router, prefix="/api/progress", tags=["Progress"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])


@app.get("/")
async def root():
    return {"message": "SpeakIntel AI API", "version": "1.0.0", "status": "running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# WebSocket endpoint for real-time voice conversations
@app.websocket("/ws/conversation/{session_id}")
async def websocket_conversation(websocket: WebSocket, session_id: str):
    """
    WebSocket endpoint for real-time voice conversation.
    
    Protocol:
    - Client sends: { "type": "audio", "data": "<base64_audio>" }
    - Client sends: { "type": "text", "data": "user message" }
    - Client sends: { "type": "control", "action": "pause|resume|end" }
    - Server sends: { "type": "transcript", "data": "..." }
    - Server sends: { "type": "ai_response", "data": "...", "audio": "<base64>" }
    - Server sends: { "type": "feedback", "data": { ... } }
    - Server sends: { "type": "scores", "data": { ... } }
    """
    handler = VoiceHandler(session_id)
    await handler.connect(websocket)
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            await handler.handle_message(message, websocket)
    except WebSocketDisconnect:
        await handler.disconnect()
    except Exception as e:
        print(f"WebSocket error: {e}")
        await handler.disconnect()
