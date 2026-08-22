from sqlalchemy import Column, Integer, String, Float, Text, Date, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)  # Supabase auth UUID as string
    name = Column(String(255), nullable=False)
    destination_id = Column(Integer, ForeignKey("destinations.id"))
    destination_name = Column(String(255))
    start_date = Column(Date)
    end_date = Column(Date)
    duration_days = Column(Integer)
    travelers_count = Column(Integer, default=1)
    total_budget = Column(Float, default=0)
    total_expense = Column(Float, default=0)
    status = Column(String(20), default="draft")  # draft, planned, ongoing, completed, cancelled
    notes = Column(Text)
    rating = Column(Float)
    review = Column(Text)
    is_public = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    destination = relationship("Destination", back_populates="trips")
    sections = relationship("Section", back_populates="trip", cascade="all, delete-orphan", order_by="Section.sequence")
