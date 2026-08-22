from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DestinationBase(BaseModel):
    name: str
    country: Optional[str] = None
    region: Optional[str] = None
    description: Optional[str] = None
    highlights: Optional[str] = None
    image_url: Optional[str] = None
    avg_budget: float = 0
    best_season: Optional[str] = None
    popularity: int = 50
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class DestinationCreate(DestinationBase):
    pass


class DestinationResponse(DestinationBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
