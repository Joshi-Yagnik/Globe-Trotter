from sqlalchemy import Column, Integer, String, Float, Text, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Destination(Base):
    __tablename__ = "destinations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    country = Column(String(100))
    state = Column(String(100))
    region = Column(String(50))  # asia, europe, americas, africa, oceania, middle_east
    description = Column(Text)
    short_description = Column(String(255))
    highlights = Column(Text)
    image_url = Column(Text)
    avg_budget = Column(Float, default=0)
    cost_index = Column(String(10)) # e.g., '₹₹' or '$$'
    best_season = Column(String(255))
    recommended_days = Column(String(50))
    popularity = Column(Integer, default=50)
    latitude = Column(Float)
    longitude = Column(Float)
    currency = Column(String(50))
    language = Column(String(100))
    timezone = Column(String(100))
    travel_type = Column(String(255))
    tags = Column(JSON)
    why_visit = Column(Text)
    budget_breakdown = Column(JSON)
    attractions = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    trips = relationship("Trip", back_populates="destination")
    activities = relationship("Activity", back_populates="destination")
