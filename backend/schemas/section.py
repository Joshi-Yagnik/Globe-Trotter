from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class SectionCreate(BaseModel):
    trip_id: int
    name: str
    description: Optional[str] = None
    section_type: str = "activity"
    date_from: Optional[date] = None
    date_to: Optional[date] = None
    day_number: int = 1
    sequence: int = 10
    budget: float = 0
    location: Optional[str] = None


class SectionUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    section_type: Optional[str] = None
    date_from: Optional[date] = None
    date_to: Optional[date] = None
    day_number: Optional[int] = None
    sequence: Optional[int] = None
    budget: Optional[float] = None
    actual_expense: Optional[float] = None
    location: Optional[str] = None
    is_booked: Optional[bool] = None


class SectionResponse(BaseModel):
    id: int
    trip_id: int
    name: str
    description: Optional[str] = None
    section_type: str = "activity"
    date_from: Optional[date] = None
    date_to: Optional[date] = None
    day_number: int = 1
    sequence: int = 10
    budget: float = 0
    actual_expense: float = 0
    location: Optional[str] = None
    is_booked: bool = False
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
