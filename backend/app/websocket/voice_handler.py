"""
WebSocket Voice Handler
Manages real-time voice conversation sessions.
"""

import json
import asyncio
from fastapi import WebSocket
from typing import Optional
from app.services.ai_coach import ai_coach


class VoiceHandler:
    """Handles a single WebSocket voice conversation session."""
    
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.conversation_history: list[dict] = []
        self.is_active = False
        self.mode = "general"
        self.role: Optional[str] = None
        self.level = "intermediate"
    
    async def connect(self, websocket: WebSocket):
        """Accept WebSocket connection and initialize session."""
        await websocket.accept()
        self.is_active = True
        
        # Send welcome message
        await websocket.send_json({
            "type": "system",
            "data": {
                "message": "Connected to SpeakIntel AI. Ready to practice!",
                "session_id": self.session_id,
            }
        })
    
    async def disconnect(self):
        """Clean up session on disconnect."""
        self.is_active = False
        # TODO: Save conversation to database
        print(f"Session {self.session_id} ended. Messages: {len(self.conversation_history)}")
    
    async def handle_message(self, message: dict, websocket: WebSocket):
        """Route incoming messages to appropriate handlers."""
        msg_type = message.get("type", "")
        
        if msg_type == "text":
            await self._handle_text_message(message.get("data", ""), websocket)
        elif msg_type == "audio":
            await self._handle_audio_message(message.get("data", ""), websocket)
        elif msg_type == "control":
            await self._handle_control_message(message.get("action", ""), websocket)
        elif msg_type == "config":
            await self._handle_config_message(message.get("data", {}), websocket)
    
    async def _handle_text_message(self, text: str, websocket: WebSocket):
        """Process a text message from the user."""
        if not text.strip():
            return
        
        # Add to history
        self.conversation_history.append({
            "role": "user",
            "content": text,
        })
        
        # Send typing indicator
        await websocket.send_json({
            "type": "status",
            "data": "thinking",
        })
        
        try:
            # Get AI response
            result = await ai_coach.chat(
                user_message=text,
                conversation_history=self.conversation_history[:-1],  # Exclude current message
                mode=self.mode,
                role=self.role,
                level=self.level,
            )
            
            # Add AI response to history
            self.conversation_history.append({
                "role": "model",
                "content": result["response"],
            })
            
            # Send response
            await websocket.send_json({
                "type": "ai_response",
                "data": {
                    "text": result["response"],
                    "scores": result["scores"],
                }
            })
            
        except Exception as e:
            await websocket.send_json({
                "type": "error",
                "data": f"AI processing error: {str(e)}",
            })
    
    async def _handle_audio_message(self, audio_data: str, websocket: WebSocket):
        """
        Process audio data from the user.
        In production, this would:
        1. Decode base64 audio
        2. Send to Whisper/Gemini for transcription
        3. Process the transcribed text
        4. Generate TTS audio response
        """
        # For now, send back a message indicating audio was received
        await websocket.send_json({
            "type": "status",
            "data": "processing_audio",
        })
        
        # TODO: Implement audio pipeline
        # 1. Decode base64 audio
        # 2. Transcribe with Gemini multimodal or Whisper
        # 3. Process text through AI coach
        # 4. Generate TTS response
        
        await websocket.send_json({
            "type": "transcript",
            "data": {
                "text": "[Audio transcription will appear here]",
                "is_final": True,
            }
        })
    
    async def _handle_control_message(self, action: str, websocket: WebSocket):
        """Handle session control messages."""
        if action == "pause":
            self.is_active = False
            await websocket.send_json({
                "type": "status",
                "data": "paused",
            })
        elif action == "resume":
            self.is_active = True
            await websocket.send_json({
                "type": "status",
                "data": "active",
            })
        elif action == "end":
            # Generate session summary
            summary = {
                "total_messages": len(self.conversation_history),
                "duration": "N/A",  # TODO: Track actual duration
                "mode": self.mode,
            }
            await websocket.send_json({
                "type": "session_end",
                "data": summary,
            })
            self.is_active = False
    
    async def _handle_config_message(self, config: dict, websocket: WebSocket):
        """Handle session configuration updates."""
        if "mode" in config:
            self.mode = config["mode"]
        if "role" in config:
            self.role = config["role"]
        if "level" in config:
            self.level = config["level"]
        
        await websocket.send_json({
            "type": "config_updated",
            "data": {
                "mode": self.mode,
                "role": self.role,
                "level": self.level,
            }
        })
