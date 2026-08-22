"""Profile API router."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func as sa_func

from database import get_db
from models.trip import Trip
from services.auth import get_current_user

router = APIRouter(prefix="/api/profile", tags=["Profile"])


@router.get("")
async def get_profile(
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Get user profile with trip statistics."""
    user_id = user["sub"]

    # Count trips by status
    stats = {}
    for status in ["draft", "planned", "ongoing", "completed"]:
        result = await db.execute(
            select(sa_func.count(Trip.id)).where(Trip.user_id == user_id, Trip.status == status)
        )
        stats[status] = result.scalar() or 0

    total_result = await db.execute(
        select(sa_func.count(Trip.id)).where(Trip.user_id == user_id)
    )
    stats["total"] = total_result.scalar() or 0

    return {
        "name": user.get("name", "Traveler"),
        "email": user.get("email", ""),
        "stats": stats,
    }


@router.put("")
async def update_profile(
    user: dict = Depends(get_current_user),
):
    """Update user profile (handled via Supabase Auth metadata)."""
    # In production, this would update Supabase user metadata
    return {"message": "Profile updated", "user": user}
