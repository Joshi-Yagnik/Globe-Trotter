from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Destination(Base):
    __tablename__ = "destinations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    country = Column(String(100))
    region = Column(String(50))  # asia, europe, americas, africa, oceania, middle_east
    description = Column(Text)
    highlights = Column(Text)
    image_url = Column(Text)
    avg_budget = Column(Float, default=0)
    best_season = Column(String(20))  # spring, summer, autumn, winter, year_round
    popularity = Column(Integer, default=50)
    latitude = Column(Float)
    longitude = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    trips = relationship("Trip", back_populates="destination")
    activities = relationship("Activity", back_populates="destination")
