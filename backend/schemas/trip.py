from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime


class SectionBase(BaseModel):
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


class SectionCreate(SectionBase):
    trip_id: int


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


class SectionResponse(SectionBase):
    id: int
    trip_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TripBase(BaseModel):
    name: str
    destination_id: Optional[int] = None
    destination_name: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    travelers_count: int = 1
    total_budget: float = 0
    notes: Optional[str] = None
    is_public: bool = False


class TripCreate(TripBase):
    pass


class TripUpdate(BaseModel):
    name: Optional[str] = None
    destination_id: Optional[int] = None
    destination_name: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    travelers_count: Optional[int] = None
    total_budget: Optional[float] = None
    notes: Optional[str] = None
    rating: Optional[float] = None
    review: Optional[str] = None
    is_public: Optional[bool] = None


class TripStatusUpdate(BaseModel):
    status: str


class TripResponse(TripBase):
    id: int
    user_id: Optional[str] = None
    duration_days: Optional[int] = None
    total_expense: float = 0
    status: str = "draft"
    rating: Optional[float] = None
    review: Optional[str] = None
    sections: List[SectionResponse] = []
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TripListResponse(BaseModel):
    id: int
    name: str
    destination_name: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    duration_days: Optional[int] = None
    total_budget: float = 0
    total_expense: float = 0
    status: str = "draft"
    sections_count: int = 0
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
