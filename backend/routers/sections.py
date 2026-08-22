"""Sections API router."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database import get_db
from models.section import Section
from schemas.section import SectionCreate, SectionUpdate, SectionResponse
from services.auth import get_current_user

router = APIRouter(prefix="/api/sections", tags=["Sections"])


@router.post("", response_model=SectionResponse, status_code=201)
async def create_section(
    section_data: SectionCreate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Add a section to a trip itinerary."""
    section = Section(**section_data.model_dump())
    db.add(section)
    await db.commit()
    await db.refresh(section)
    return section


@router.put("/{section_id}", response_model=SectionResponse)
async def update_section(
    section_id: int,
    section_data: SectionUpdate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Update a section."""
    result = await db.execute(select(Section).where(Section.id == section_id))
    section = result.scalar_one_or_none()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")

    update_data = section_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(section, key, value)

    await db.commit()
    await db.refresh(section)
    return section


@router.delete("/{section_id}", status_code=204)
async def delete_section(
    section_id: int,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Delete a section."""
    result = await db.execute(select(Section).where(Section.id == section_id))
    section = result.scalar_one_or_none()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    await db.delete(section)
    await db.commit()
