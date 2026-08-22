from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ActivityBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    destination_id: Optional[int] = None
    avg_cost: float = 0
    duration_hours: Optional[float] = None
    difficulty: str = "easy"
    popularity: int = 50
    rating: float = 0.0
    image_url: Optional[str] = None


class ActivityResponse(ActivityBase):
    id: int
    destination_name: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
