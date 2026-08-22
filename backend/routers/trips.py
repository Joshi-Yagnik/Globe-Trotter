"""Trips API router."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func as sa_func
from sqlalchemy.orm import selectinload
from typing import Optional
from datetime import date

from database import get_db
from models.trip import Trip
from models.section import Section
from models.destination import Destination
from schemas.trip import TripCreate, TripUpdate, TripResponse, TripListResponse, TripStatusUpdate
from services.auth import get_current_user

router = APIRouter(prefix="/api/trips", tags=["Trips"])


@router.get("", response_model=list[TripListResponse])
async def list_trips(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    sort_by: str = Query("start_date"),
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Get all trips for the current user."""
    query = select(Trip).where(Trip.user_id == user["sub"])

    if search:
        query = query.where(Trip.name.ilike(f"%{search}%"))
    if status:
        query = query.where(Trip.status == status)

    if sort_by == "name":
        query = query.order_by(Trip.name.asc())
    elif sort_by == "budget":
        query = query.order_by(Trip.total_budget.desc())
    else:
        query = query.order_by(Trip.start_date.desc().nullslast())

    result = await db.execute(query)
    trips = result.scalars().all()

    # Get section counts
    response = []
    for trip in trips:
        count_result = await db.execute(
            select(sa_func.count(Section.id)).where(Section.trip_id == trip.id)
        )
        sections_count = count_result.scalar() or 0
        response.append(TripListResponse(
            id=trip.id, name=trip.name, destination_name=trip.destination_name,
            start_date=trip.start_date, end_date=trip.end_date,
            duration_days=trip.duration_days, total_budget=trip.total_budget,
            total_expense=trip.total_expense, status=trip.status,
            sections_count=sections_count, created_at=trip.created_at,
        ))
    return response


@router.post("", response_model=TripResponse, status_code=201)
async def create_trip(
    trip_data: TripCreate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Create a new trip."""
    # Calculate duration
    duration = None
    if trip_data.start_date and trip_data.end_date:
        duration = (trip_data.end_date - trip_data.start_date).days + 1

    # Get destination name if destination_id provided
    dest_name = trip_data.destination_name
    if trip_data.destination_id and not dest_name:
        result = await db.execute(select(Destination).where(Destination.id == trip_data.destination_id))
        dest = result.scalar_one_or_none()
        if dest:
            dest_name = dest.name

    trip = Trip(
        user_id=user["sub"],
        name=trip_data.name,
        destination_id=trip_data.destination_id,
        destination_name=dest_name,
        start_date=trip_data.start_date,
        end_date=trip_data.end_date,
        duration_days=duration,
        travelers_count=trip_data.travelers_count,
        total_budget=trip_data.total_budget,
        notes=trip_data.notes,
        is_public=trip_data.is_public,
    )
    db.add(trip)
    await db.commit()
    await db.refresh(trip)
    return trip


@router.get("/{trip_id}", response_model=TripResponse)
async def get_trip(
    trip_id: int,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Get a single trip with all sections."""
    result = await db.execute(
        select(Trip).options(selectinload(Trip.sections)).where(Trip.id == trip_id)
    )
    trip = result.scalar_one_or_none()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip


@router.put("/{trip_id}", response_model=TripResponse)
async def update_trip(
    trip_id: int,
    trip_data: TripUpdate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Update a trip."""
    result = await db.execute(select(Trip).where(Trip.id == trip_id, Trip.user_id == user["sub"]))
    trip = result.scalar_one_or_none()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    update_data = trip_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(trip, key, value)

    if trip.start_date and trip.end_date:
        trip.duration_days = (trip.end_date - trip.start_date).days + 1

    await db.commit()
    await db.refresh(trip)
    return trip


@router.delete("/{trip_id}", status_code=204)
async def delete_trip(
    trip_id: int,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Delete a trip."""
    result = await db.execute(select(Trip).where(Trip.id == trip_id, Trip.user_id == user["sub"]))
    trip = result.scalar_one_or_none()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    await db.delete(trip)
    await db.commit()


@router.patch("/{trip_id}/status", response_model=TripResponse)
async def update_trip_status(
    trip_id: int,
    status_data: TripStatusUpdate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Update trip status (draft → planned → ongoing → completed)."""
    valid_statuses = {"draft", "planned", "ongoing", "completed", "cancelled"}
    if status_data.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")

    result = await db.execute(select(Trip).where(Trip.id == trip_id, Trip.user_id == user["sub"]))
    trip = result.scalar_one_or_none()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    trip.status = status_data.status
    await db.commit()
    await db.refresh(trip)
    return trip
