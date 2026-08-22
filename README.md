# GlobeTrotter 🌍
**AI-Powered Travel Planner — Odoo x LDCE Ahmedabad Hackathon 26**

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Python + FastAPI |
| Database | Supabase PostgreSQL |
| ORM | SQLAlchemy (async) |
| Auth | Supabase Auth |
| AI | Gemini API |
| Charts | Recharts |
| API Docs | FastAPI Swagger |

## Quick Start

### 1. Backend
```bash
cd backend
pip install -r requirements.txt

# Edit .env with your Supabase/Gemini credentials
# Then run:
uvicorn main:app --reload --port 8000

# Seed demo data (optional):
python seed_data.py
```
API docs available at: http://localhost:8000/docs

### 2. Frontend
```bash
cd frontend
npm install

# Edit .env.local with your Supabase credentials
# Then run:
npm run dev
```
Open http://localhost:3000

## Screens (12)
1. Login
2. Register
3. Landing Page (Hero + Destinations + Previous Trips)
4. Create Trip (Form + AI Suggestions)
5. Build Itinerary (Dynamic Sections)
6. Trip Listing (Ongoing/Upcoming/Completed)
7. User Profile
8. Activity Search
9. Itinerary View (Day-wise + Budget)
10. Community Tab (Social Feed)
11. Calendar View (Monthly Grid)
12. Admin Dashboard (Recharts Analytics)

## Features
- 🤖 Gemini AI-powered trip suggestions with budget breakdown
- 📅 Interactive calendar with color-coded trip events
- 🌍 Community social feed with tags and likes
- 📊 Admin dashboard with Recharts pie/bar charts
- 🔐 Supabase Auth with JWT
- 🎨 Dark glassmorphism design with Tailwind CSS
