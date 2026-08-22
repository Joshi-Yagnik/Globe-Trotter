from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CommunityPostCreate(BaseModel):
    title: str
    content: Optional[str] = None
    destination: Optional[str] = None
    tags: Optional[str] = None


class CommunityPostResponse(BaseModel):
    id: int
    user_id: Optional[str] = None
    author_name: Optional[str] = None
    title: str
    content: Optional[str] = None
    destination: Optional[str] = None
    tags: Optional[str] = None
    likes: int = 0
    image_url: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
