"""Destinations API router."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from typing import Optional

from database import get_db
from models.destination import Destination
from schemas.destination import DestinationResponse

router = APIRouter(prefix="/api/destinations", tags=["Destinations"])


@router.get("", response_model=list[DestinationResponse])
async def list_destinations(
    search: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    sort_by: str = Query("popularity"),
    limit: int = Query(20, le=50),
    db: AsyncSession = Depends(get_db),
):
    """Get all destinations with search, filter, and sort."""
    query = select(Destination)

    if search:
        query = query.where(
            or_(
                Destination.name.ilike(f"%{search}%"),
                Destination.country.ilike(f"%{search}%"),
            )
        )
    if region:
        query = query.where(Destination.region == region)

    if sort_by == "popularity":
        query = query.order_by(Destination.popularity.desc())
    elif sort_by == "budget_low":
        query = query.order_by(Destination.avg_budget.asc())
    elif sort_by == "name":
        query = query.order_by(Destination.name.asc())
    else:
        query = query.order_by(Destination.popularity.desc())

    query = query.limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{destination_id}", response_model=DestinationResponse)
async def get_destination(destination_id: int, db: AsyncSession = Depends(get_db)):
    """Get a single destination by ID."""
    result = await db.execute(select(Destination).where(Destination.id == destination_id))
    dest = result.scalar_one_or_none()
    if not dest:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Destination not found")
    return dest
