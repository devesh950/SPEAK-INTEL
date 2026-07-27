"""Vocabulary API Router"""

from fastapi import APIRouter
from app.services.ai_coach import ai_coach

router = APIRouter()


@router.get("/analyze/{word}")
async def analyze_word(word: str):
    """Get detailed vocabulary analysis for a word."""
    try:
        result = await ai_coach.analyze_vocabulary(word)
        return result
    except Exception as e:
        return {"error": str(e)}


@router.get("/notebook")
async def get_vocabulary_notebook():
    """Get user's saved vocabulary words."""
    # TODO: Fetch from database
    return {"words": []}


@router.post("/save/{word}")
async def save_word(word: str):
    """Save a word to user's vocabulary notebook."""
    # TODO: Save to database
    return {"status": "saved", "word": word}
