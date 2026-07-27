"""Interviews API Router"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

INTERVIEW_ROLES = [
    "Data Analyst", "Software Engineer", "Data Scientist", "Product Manager",
    "HR", "Marketing", "Sales", "MBA", "Frontend Developer", "Backend Developer",
]


class StartInterviewRequest(BaseModel):
    role: str
    level: str = "intermediate"
    resume_text: Optional[str] = None


@router.get("/roles")
async def get_interview_roles():
    """Get available interview roles."""
    return {"roles": INTERVIEW_ROLES}


@router.post("/start")
async def start_interview(request: StartInterviewRequest):
    """Start a new mock interview session."""
    # TODO: Create interview session in database
    return {
        "session_id": "interview_" + request.role.lower().replace(" ", "_"),
        "role": request.role,
        "level": request.level,
        "status": "started",
    }


@router.get("/report/{session_id}")
async def get_interview_report(session_id: str):
    """Get the interview report for a completed session."""
    # TODO: Generate from database
    return {
        "session_id": session_id,
        "scores": {
            "confidence": 0,
            "technical_accuracy": 0,
            "communication": 0,
            "grammar": 0,
            "vocabulary": 0,
            "overall": 0,
        },
        "strengths": [],
        "weaknesses": [],
        "improvement_plan": [],
    }
