"""Admin API Router"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/users")
async def list_users():
    """List all users (admin only)."""
    return {"users": [], "total": 0}


@router.get("/analytics")
async def get_analytics():
    """Get platform analytics."""
    return {
        "total_users": 0,
        "active_users": 0,
        "total_sessions": 0,
        "revenue": 0,
    }


@router.get("/subscriptions")
async def list_subscriptions():
    """List all subscriptions."""
    return {"subscriptions": [], "total": 0}
