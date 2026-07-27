"""Progress API Router"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/dashboard")
async def get_progress_dashboard():
    """Get user's progress dashboard data."""
    # TODO: Fetch from database
    return {
        "daily_practice_time": 0,
        "current_streak": 0,
        "weekly_progress": 0,
        "communication_score": 0,
        "completed_sessions": 0,
        "vocabulary_learned": 0,
        "interview_score": 0,
        "charts": {
            "daily": [],
            "weekly": [],
            "monthly": [],
        },
    }


@router.get("/leaderboard")
async def get_leaderboard():
    """Get the leaderboard rankings."""
    # TODO: Fetch from database
    return {
        "weekly": [],
        "monthly": [],
        "all_time": [],
    }


@router.get("/achievements")
async def get_achievements():
    """Get user's achievements and badges."""
    # TODO: Fetch from database
    return {"achievements": [], "badges": [], "xp": 0, "level": 1}
