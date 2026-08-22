"""Activities API router."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func as sa_func
from typing import Optional

from database import get_db
from models.activity import Activity
from models.destination import Destination

router = APIRouter(prefix="/api/activities", tags=["Activities"])


@router.get("")
async def list_activities(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    sort_by: str = Query("popularity"),
    limit: int = Query(30, le=50),
    db: AsyncSession = Depends(get_db),
):
    """Search and filter activities."""
    query = select(Activity)

    if search:
        query = query.where(
            or_(Activity.name.ilike(f"%{search}%"), Activity.description.ilike(f"%{search}%"))
        )
    if category:
        query = query.where(Activity.category == category)

    if sort_by == "rating":
        query = query.order_by(Activity.rating.desc())
    elif sort_by == "cost_low":
        query = query.order_by(Activity.avg_cost.asc())
    else:
        query = query.order_by(Activity.popularity.desc())

    query = query.limit(limit)
    result = await db.execute(query)
    activities = result.scalars().all()

    # Count total
    count_query = select(sa_func.count(Activity.id))
    if search:
        count_query = count_query.where(
            or_(Activity.name.ilike(f"%{search}%"), Activity.description.ilike(f"%{search}%"))
        )
    if category:
        count_query = count_query.where(Activity.category == category)
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    return {"activities": [
        {
            "id": a.id, "name": a.name, "description": a.description,
            "category": a.category, "avg_cost": a.avg_cost,
            "duration_hours": a.duration_hours, "difficulty": a.difficulty,
            "popularity": a.popularity, "rating": a.rating,
        }
        for a in activities
    ], "total": total}
