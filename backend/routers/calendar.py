"""Calendar API router."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, extract

from database import get_db
from models.trip import Trip
from services.auth import get_current_user

router = APIRouter(prefix="/api/calendar", tags=["Calendar"])

TRIP_COLORS = ["#00d4aa", "#ff6b6b", "#ffd93d", "#6c5ce7", "#fd79a8", "#4facfe", "#00b894"]


@router.get("")
async def get_calendar(
    year: int = Query(...),
    month: int = Query(...),
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Get trips for a specific month for calendar view."""
    user_id = user["sub"]

    # Get trips that overlap with the given month
    result = await db.execute(
        select(Trip).where(
            Trip.user_id == user_id,
            Trip.start_date.isnot(None),
            Trip.end_date.isnot(None),
        ).order_by(Trip.start_date)
    )
    all_trips = result.scalars().all()

    # Filter trips that overlap with the month
    from datetime import date
    month_start = date(year, month, 1)
    if month == 12:
        month_end = date(year + 1, 1, 1)
    else:
        month_end = date(year, month + 1, 1)

    trips = []
    for i, trip in enumerate(all_trips):
        if trip.end_date >= month_start and trip.start_date < month_end:
            trips.append({
                "id": trip.id,
                "name": trip.name,
                "start_date": trip.start_date.isoformat(),
                "end_date": trip.end_date.isoformat(),
                "status": trip.status,
                "color": TRIP_COLORS[i % len(TRIP_COLORS)],
            })

    return {"trips": trips, "year": year, "month": month}
