from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DestinationBase(BaseModel):
    name: str
    country: Optional[str] = None
    state: Optional[str] = None
    region: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    highlights: Optional[str] = None
    image_url: Optional[str] = None
    avg_budget: float = 0
    cost_index: Optional[str] = None
    best_season: Optional[str] = None
    recommended_days: Optional[str] = None
    popularity: int = 50
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    currency: Optional[str] = None
    language: Optional[str] = None
    timezone: Optional[str] = None
    travel_type: Optional[str] = None
    tags: Optional[list[str]] = None
    why_visit: Optional[str] = None
    budget_breakdown: Optional[dict] = None
    attractions: Optional[list[dict]] = None


class DestinationCreate(DestinationBase):
    pass


class DestinationResponse(DestinationBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
