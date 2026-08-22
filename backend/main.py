"""
GlobeTrotter — FastAPI Backend
Odoo x LDCE Ahmedabad Hackathon 26
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from database import create_tables

# Import all routers
from routers import destinations, trips, sections, activities, community, profile, calendar, admin, ai

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create database tables on startup."""
    await create_tables()
    yield


app = FastAPI(
    title="GlobeTrotter API",
    description="AI-powered travel planning API — Odoo x LDCE Ahmedabad Hackathon 26",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(destinations.router)
app.include_router(trips.router)
app.include_router(sections.router)
app.include_router(activities.router)
app.include_router(community.router)
app.include_router(profile.router)
app.include_router(calendar.router)
app.include_router(admin.router)
app.include_router(ai.router)


@app.get("/")
async def root():
    return {
        "app": "GlobeTrotter API",
        "version": "1.0.0",
        "docs": "/docs",
        "hackathon": "Odoo x LDCE Ahmedabad Hackathon 26",
    }


@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
