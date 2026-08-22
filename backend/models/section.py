from sqlalchemy import Column, Integer, String, Float, Text, Date, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Section(Base):
    __tablename__ = "sections"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    section_type = Column(String(20), default="activity")  # travel, hotel, activity, food, sightseeing, shopping, other
    date_from = Column(Date)
    date_to = Column(Date)
    day_number = Column(Integer, default=1)
    sequence = Column(Integer, default=10)
    budget = Column(Float, default=0)
    actual_expense = Column(Float, default=0)
    location = Column(String(255))
    is_booked = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    trip = relationship("Trip", back_populates="sections")
