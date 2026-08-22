"""AI suggestions API router."""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional

from services.auth import get_current_user
from services.gemini_service import get_ai_suggestions

router = APIRouter(prefix="/api/ai", tags=["AI"])


class SuggestionRequest(BaseModel):
    destination: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None


@router.post("/suggestions")
async def ai_suggestions(
    request: SuggestionRequest,
    user: dict = Depends(get_current_user),
):
    """Get AI-powered travel suggestions for a destination."""
    suggestions = await get_ai_suggestions(
        destination=request.destination,
        start_date=request.start_date,
        end_date=request.end_date,
    )
    return {"status": "success", "suggestions": suggestions}
