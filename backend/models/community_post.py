from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from database import Base


class CommunityPost(Base):
    __tablename__ = "community_posts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)  # Supabase auth UUID
    author_name = Column(String(255))
    title = Column(String(255), nullable=False)
    content = Column(Text)
    destination = Column(String(255))
    tags = Column(Text)  # Comma-separated tags
    likes = Column(Integer, default=0)
    image_url = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
