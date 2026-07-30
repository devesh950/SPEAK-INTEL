"""Admin API Router"""

from fastapi import APIRouter, Header, HTTPException
from app.db import db

router = APIRouter()


@router.get("/users")
async def list_users(x_admin_email: str = Header(None)):
    """List all users (admin only)."""
    if x_admin_email != "devshyadav8023@gmail.com":
        raise HTTPException(status_code=403, detail="Unauthorized access. Admin only.")
        
    try:
        users = await db.user.find_many(order={"createdAt": "desc"})
        return {
            "users": [
                {
                    "id": u.id,
                    "email": u.email,
                    "name": u.name,
                    "image": u.image,
                    "level": u.level,
                    "xp": u.xp,
                    "coins": u.coins,
                    "streak": u.streak,
                    "github": u.github,
                    "instagram": u.instagram,
                    "linkedin": u.linkedin,
                    "createdAt": u.createdAt.isoformat() if u.createdAt else None
                }
                for u in users
            ],
            "total": len(users)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/analytics")
async def get_analytics(x_admin_email: str = Header(None)):
    """Get platform analytics (admin only)."""
    if x_admin_email != "devshyadav8023@gmail.com":
        raise HTTPException(status_code=403, detail="Unauthorized access. Admin only.")
        
    try:
        total_users = await db.user.count()
        return {
            "total_users": total_users,
            "active_users": total_users,  # Simplification
            "total_sessions": 0,
            "revenue": 0,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/subscriptions")
async def list_subscriptions(x_admin_email: str = Header(None)):
    """List all subscriptions (admin only)."""
    if x_admin_email != "devshyadav8023@gmail.com":
        raise HTTPException(status_code=403, detail="Unauthorized access. Admin only.")
    return {"subscriptions": [], "total": 0}
