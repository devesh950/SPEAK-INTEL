from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.db import db

router = APIRouter()

class ProfileSyncRequest(BaseModel):
    email: str
    name: Optional[str] = None
    image: Optional[str] = None
    github: Optional[str] = None
    instagram: Optional[str] = None
    linkedin: Optional[str] = None

@router.post("/sync")
async def sync_profile(profile: ProfileSyncRequest):
    """Upsert user profile details in the database."""
    try:
        user = await db.user.find_unique(where={"email": profile.email})
        if user:
            # Update user profile
            updated_user = await db.user.update(
                where={"email": profile.email},
                data={
                    "name": profile.name,
                    "image": profile.image,
                    "github": profile.github,
                    "instagram": profile.instagram,
                    "linkedin": profile.linkedin
                }
            )
            return {"status": "success", "message": "Profile updated", "user_id": updated_user.id}
        else:
            # Create user profile
            new_user = await db.user.create(
                data={
                    "email": profile.email,
                    "name": profile.name,
                    "image": profile.image,
                    "github": profile.github,
                    "instagram": profile.instagram,
                    "linkedin": profile.linkedin
                }
            )
            return {"status": "success", "message": "Profile created", "user_id": new_user.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
