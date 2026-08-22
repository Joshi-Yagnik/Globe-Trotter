"""Seed demo data into the database."""
import asyncio
from database import AsyncSessionLocal, create_tables
from models.destination import Destination
from models.activity import Activity
from sqlalchemy import select


DESTINATIONS = [
    {"name": "Paris", "country": "France", "region": "europe", "description": "The City of Light, home to the Eiffel Tower, Louvre Museum, and world-class cuisine.", "highlights": "Eiffel Tower, Louvre Museum, Notre-Dame, Champs-Élysées, Montmartre", "avg_budget": 2500, "best_season": "spring", "popularity": 95, "latitude": 48.8566, "longitude": 2.3522},
    {"name": "Tokyo", "country": "Japan", "region": "asia", "description": "A dazzling blend of ultramodern and traditional. From neon-lit skyscrapers to historic temples.", "highlights": "Shibuya Crossing, Senso-ji Temple, Harajuku, Tsukiji Market, Akihabara", "avg_budget": 3000, "best_season": "spring", "popularity": 92, "latitude": 35.6762, "longitude": 139.6503},
    {"name": "Bali", "country": "Indonesia", "region": "asia", "description": "Island of the Gods — tropical paradise with rice terraces, temples, and pristine beaches.", "highlights": "Ubud Rice Terraces, Tanah Lot Temple, Seminyak Beach, Mount Batur", "avg_budget": 1500, "best_season": "summer", "popularity": 88, "latitude": -8.3405, "longitude": 115.092},
    {"name": "New York City", "country": "United States", "region": "americas", "description": "The city that never sleeps. Iconic skyline, Broadway shows, Central Park, and endless dining.", "highlights": "Statue of Liberty, Central Park, Times Square, Brooklyn Bridge, Broadway", "avg_budget": 3500, "best_season": "autumn", "popularity": 90, "latitude": 40.7128, "longitude": -74.006},
    {"name": "Dubai", "country": "UAE", "region": "middle_east", "description": "A city of superlatives — tallest buildings, luxury shopping, desert safaris.", "highlights": "Burj Khalifa, Dubai Mall, Desert Safari, Palm Jumeirah, Gold Souk", "avg_budget": 2800, "best_season": "winter", "popularity": 85, "latitude": 25.2048, "longitude": 55.2708},
    {"name": "Santorini", "country": "Greece", "region": "europe", "description": "Whitewashed buildings with blue domes overlooking the Aegean Sea. Stunning sunsets.", "highlights": "Oia Sunset, Caldera Views, Red Beach, Wine Tasting, Fira", "avg_budget": 2200, "best_season": "summer", "popularity": 82, "latitude": 36.3932, "longitude": 25.4615},
    {"name": "Jaipur", "country": "India", "region": "asia", "description": "The Pink City — magnificent forts, ornate palaces, colorful bazaars, and rich heritage.", "highlights": "Amber Fort, Hawa Mahal, City Palace, Jantar Mantar, Nahargarh Fort", "avg_budget": 800, "best_season": "winter", "popularity": 78, "latitude": 26.9124, "longitude": 75.7873},
    {"name": "Maldives", "country": "Maldives", "region": "asia", "description": "Crystal-clear turquoise waters, overwater villas, and world-class diving.", "highlights": "Overwater Bungalows, Snorkeling, Bioluminescent Beach, Sunset Cruise", "avg_budget": 4000, "best_season": "winter", "popularity": 87, "latitude": 3.2028, "longitude": 73.2207},
]

ACTIVITIES = [
    {"name": "Paragliding", "category": "adventure", "description": "Soar above stunning landscapes with a tandem paragliding flight.", "avg_cost": 120, "duration_hours": 1.5, "difficulty": "moderate", "popularity": 85, "rating": 4.7},
    {"name": "Temple Tour", "category": "culture", "description": "Explore ancient temples and heritage sites with a local guide.", "avg_cost": 30, "duration_hours": 3, "difficulty": "easy", "popularity": 82, "rating": 4.5},
    {"name": "Scuba Diving", "category": "water", "description": "Discover underwater coral reefs and marine life.", "avg_cost": 150, "duration_hours": 4, "difficulty": "moderate", "popularity": 90, "rating": 4.8},
    {"name": "Street Food Walk", "category": "food", "description": "Taste authentic local street food with a culinary expert.", "avg_cost": 25, "duration_hours": 2.5, "difficulty": "easy", "popularity": 88, "rating": 4.6},
    {"name": "Jungle Safari", "category": "wildlife", "description": "Spot exotic wildlife in their natural habitat.", "avg_cost": 200, "duration_hours": 5, "difficulty": "easy", "popularity": 80, "rating": 4.4},
    {"name": "Spa & Wellness Retreat", "category": "relaxation", "description": "Traditional spa treatments, yoga sessions, and meditation.", "avg_cost": 80, "duration_hours": 3, "difficulty": "easy", "popularity": 75, "rating": 4.9},
    {"name": "Mountain Trekking", "category": "adventure", "description": "Trek through breathtaking mountain trails with stunning views.", "avg_cost": 60, "duration_hours": 6, "difficulty": "hard", "popularity": 78, "rating": 4.5},
    {"name": "Cooking Class", "category": "food", "description": "Learn to cook traditional dishes from local chefs.", "avg_cost": 45, "duration_hours": 3, "difficulty": "easy", "popularity": 72, "rating": 4.7},
    {"name": "Sunset Sailing", "category": "water", "description": "Sail along the coast and watch a breathtaking sunset.", "avg_cost": 90, "duration_hours": 2, "difficulty": "easy", "popularity": 84, "rating": 4.6},
    {"name": "Night Market Tour", "category": "nightlife", "description": "Explore vibrant night markets with local street food and crafts.", "avg_cost": 20, "duration_hours": 2, "difficulty": "easy", "popularity": 86, "rating": 4.5},
]


async def seed():
    await create_tables()
    async with AsyncSessionLocal() as session:
        # Check if data already exists
        result = await session.execute(select(Destination).limit(1))
        if result.scalar_one_or_none():
            print("Data already exists. Skipping seed.")
            return

        # Insert destinations
        for d in DESTINATIONS:
            session.add(Destination(**d))
        print(f"✓ Inserted {len(DESTINATIONS)} destinations")

        # Insert activities
        for a in ACTIVITIES:
            session.add(Activity(**a))
        print(f"✓ Inserted {len(ACTIVITIES)} activities")

        await session.commit()
        print("✅ Seed complete!")


if __name__ == "__main__":
    asyncio.run(seed())
