from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text)
    category = Column(String(50))  # adventure, culture, nature, food, water, relaxation, nightlife, wildlife
    destination_id = Column(Integer, ForeignKey("destinations.id"))
    avg_cost = Column(Float, default=0)
    duration_hours = Column(Float)
    difficulty = Column(String(20), default="easy")  # easy, moderate, hard, extreme
    popularity = Column(Integer, default=50)
    rating = Column(Float, default=0.0)
    image_url = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    destination = relationship("Destination", back_populates="activities")
