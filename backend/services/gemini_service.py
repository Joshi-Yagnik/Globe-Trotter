"""Gemini AI service for travel suggestions."""
import json
import httpx
from config import get_settings


async def get_ai_suggestions(destination: str, start_date: str = None, end_date: str = None) -> dict:
    """
    Get AI-powered travel suggestions from Gemini.
    Falls back to mock data if API key is missing or request fails.
    """
    settings = get_settings()

    if not settings.GEMINI_API_KEY:
        return _get_mock_suggestions(destination)

    prompt = f"""You are a travel expert. Generate travel suggestions for "{destination}" in JSON format.

Include:
1. "destination_info": {{ "description": "...", "best_time": "...", "currency": "...", "language": "..." }}
2. "suggested_places": array of {{ "name": "...", "type": "activity|sightseeing|food|shopping|nature|adventure", "description": "...", "estimated_cost": number, "duration_hours": number, "tips": "..." }} (6-8 items)
3. "budget_breakdown": {{ "accommodation": number, "food": number, "transport": number, "activities": number, "shopping": number }} (daily USD estimates)
4. "travel_tips": array of 5 practical tips as strings

{"Dates: " + start_date + " to " + end_date if start_date and end_date else ""}

Return ONLY valid JSON, no markdown."""

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={settings.GEMINI_API_KEY}",
                json={
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {"temperature": 0.7, "maxOutputTokens": 2048},
                },
            )

            if response.status_code == 200:
                data = response.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                # Clean markdown code fences if present
                text = text.strip()
                if text.startswith("```"):
                    text = text.split("\n", 1)[1]
                if text.endswith("```"):
                    text = text.rsplit("```", 1)[0]
                text = text.strip()
                return json.loads(text)

    except Exception as e:
        print(f"Gemini API error: {e}")

    return _get_mock_suggestions(destination)


def _get_mock_suggestions(destination: str) -> dict:
    """Fallback mock suggestions when Gemini is unavailable."""
    return {
        "destination_info": {
            "description": f"{destination} is an incredible travel destination with rich culture, stunning landscapes, and unforgettable experiences waiting for you.",
            "best_time": "October to March",
            "currency": "Local Currency",
            "language": "Local Language",
        },
        "suggested_places": [
            {"name": f"{destination} Heritage Walk", "type": "sightseeing", "description": "Explore the historic landmarks and architectural marvels.", "estimated_cost": 25, "duration_hours": 3, "tips": "Start early morning to avoid crowds."},
            {"name": f"Local Food Tour", "type": "food", "description": "Taste authentic local cuisine at the best street food spots.", "estimated_cost": 35, "duration_hours": 2.5, "tips": "Try the local specialties first."},
            {"name": f"Sunset Viewpoint", "type": "nature", "description": "Watch a breathtaking sunset from the most scenic spot.", "estimated_cost": 10, "duration_hours": 2, "tips": "Arrive 30 minutes before sunset."},
            {"name": f"Adventure Trek", "type": "adventure", "description": "An exhilarating trekking experience through natural trails.", "estimated_cost": 60, "duration_hours": 5, "tips": "Wear comfortable hiking shoes."},
            {"name": f"Cultural Museum", "type": "sightseeing", "description": "Immerse yourself in local history and art.", "estimated_cost": 15, "duration_hours": 2, "tips": "Audio guides are available."},
            {"name": f"Shopping District", "type": "shopping", "description": "Browse local markets for unique souvenirs and handcrafted items.", "estimated_cost": 50, "duration_hours": 3, "tips": "Bargaining is expected at local markets."},
        ],
        "budget_breakdown": {
            "accommodation": 80,
            "food": 40,
            "transport": 25,
            "activities": 50,
            "shopping": 30,
        },
        "travel_tips": [
            "Always carry a copy of your travel documents.",
            "Learn a few basic phrases in the local language.",
            "Use local transport for authentic experiences and savings.",
            "Book popular attractions in advance during peak season.",
            "Stay hydrated and carry snacks for day trips.",
        ],
    }
