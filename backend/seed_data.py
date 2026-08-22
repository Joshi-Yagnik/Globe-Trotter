"""Seed demo data into the database."""
import asyncio
from database import AsyncSessionLocal, create_tables
from models.destination import Destination
from models.activity import Activity
from sqlalchemy import select


DESTINATIONS = [
    {
        "name": "Dwarka",
        "country": "India",
        "state": "Gujarat",
        "region": "asia",
        "description": "Dwarka is an ancient city in the northwestern Indian state of Gujarat. It’s known as a Hindu pilgrimage site. The ancient Dwarkadhish Temple has an elaborately tiered main shrine, a carved entrance and a black-marble idol of Lord Krishna.",
        "short_description": "Coastal pilgrimage destination known for its temples.",
        "highlights": "Dwarkadhish Temple, Bet Dwarka, Rukmini Temple, Gomti Ghat",
        "image_url": "https://images.unsplash.com/photo-1622301540960-9d04b6b19d45?q=80&w=1200",
        "avg_budget": 50,
        "cost_index": "₹₹",
        "best_season": "October to March",
        "recommended_days": "2–3 days",
        "popularity": 85,
        "latitude": 22.2442,
        "longitude": 68.9685,
        "currency": "INR",
        "language": "Gujarati, Hindi",
        "timezone": "IST (UTC+5:30)",
        "travel_type": "Spiritual",
        "tags": [
            "spiritual",
            "history",
            "coastal",
            "pilgrimage"
        ],
        "why_visit": "Experience profound spirituality and witness stunning coastal views.",
        "budget_breakdown": {
            "Accommodation": 25,
            "Food": 10,
            "Transport": 5,
            "Activities": 10
        },
        "attractions": [
            {
                "name": "Dwarkadhish Temple",
                "image": "https://images.unsplash.com/photo-1622301540960-9d04b6b19d45?q=80&w=500",
                "description": "The main temple dedicated to Lord Krishna.",
                "category": "Spiritual",
                "location": "Center of Dwarka"
            },
            {
                "name": "Bet Dwarka",
                "image": "https://images.unsplash.com/photo-1598048145816-328699b827e8?q=80&w=500",
                "description": "An island believed to be the original residence of Lord Krishna.",
                "category": "Heritage",
                "location": "Off the coast"
            },
            {
                "name": "Gomti Ghat",
                "image": "https://images.unsplash.com/photo-1582200424578-83eb9e5e70c5?q=80&w=500",
                "description": "Sacred bathing ghats.",
                "category": "Spiritual",
                "location": "Near Dwarkadhish Temple"
            }
        ]
    },
    {
        "name": "Ahmedabad",
        "country": "India",
        "state": "Gujarat",
        "region": "asia",
        "description": "Ahmedabad, in western India, is the largest city in the state of Gujarat. The Sabarmati River runs through its center. On the western bank is the Gandhi Ashram at Sabarmati, which displays the spiritual leader’s living quarters and artifacts.",
        "short_description": "India's first UNESCO World Heritage City.",
        "highlights": "Sabarmati Ashram, Adalaj Stepwell, Kankaria Lake",
        "image_url": "https://images.unsplash.com/photo-1598977123118-4e30ba3c4f5b?q=80&w=1200",
        "avg_budget": 60,
        "cost_index": "₹₹",
        "best_season": "November to February",
        "recommended_days": "2–4 days",
        "popularity": 88,
        "latitude": 23.0225,
        "longitude": 72.5714,
        "currency": "INR",
        "language": "Gujarati, Hindi, English",
        "timezone": "IST (UTC+5:30)",
        "travel_type": "Heritage, Culture",
        "tags": [
            "heritage",
            "city",
            "food",
            "history"
        ],
        "why_visit": "Explore rich textile heritage, vibrant street food, and stunning Indo-Islamic architecture.",
        "budget_breakdown": {
            "Accommodation": 30,
            "Food": 15,
            "Transport": 10,
            "Activities": 5
        },
        "attractions": [
            {
                "name": "Sabarmati Ashram",
                "image": "https://images.unsplash.com/photo-1598977123118-4e30ba3c4f5b?q=80&w=500",
                "description": "Former residence of Mahatma Gandhi.",
                "category": "History",
                "location": "Sabarmati Riverfront"
            },
            {
                "name": "Adalaj Stepwell",
                "image": "https://images.unsplash.com/photo-1623910271576-9d3381aeb9ee?q=80&w=500",
                "description": "Intricately carved 15th-century stepwell.",
                "category": "Architecture",
                "location": "Adalaj"
            }
        ]
    },
    {
        "name": "Jaipur",
        "country": "India",
        "state": "Rajasthan",
        "region": "asia",
        "description": "Jaipur is the capital of India’s Rajasthan state. It evokes the royal family that once ruled the region and that, in 1727, founded what is now called the Old City, or “Pink City” for its trademark building color.",
        "short_description": "The Pink City, known for magnificent forts and palaces.",
        "highlights": "Amber Fort, Hawa Mahal, City Palace, Jantar Mantar",
        "image_url": "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1200",
        "avg_budget": 70,
        "cost_index": "₹₹",
        "best_season": "October to March",
        "recommended_days": "3–4 days",
        "popularity": 95,
        "latitude": 26.9124,
        "longitude": 75.7873,
        "currency": "INR",
        "language": "Hindi, Rajasthani, English",
        "timezone": "IST (UTC+5:30)",
        "travel_type": "Heritage, Luxury",
        "tags": [
            "heritage",
            "architecture",
            "shopping",
            "culture"
        ],
        "why_visit": "Experience royal grandeur, vibrant bazaars, and majestic forts.",
        "budget_breakdown": {
            "Accommodation": 35,
            "Food": 15,
            "Transport": 10,
            "Activities": 10
        },
        "attractions": [
            {
                "name": "Amber Fort",
                "image": "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=500",
                "description": "A sprawling hilltop fort with stunning Hindu-style elements.",
                "category": "Heritage",
                "location": "Amer"
            },
            {
                "name": "Hawa Mahal",
                "image": "https://images.unsplash.com/photo-1600100397608-f010f41cb8ea?q=80&w=500",
                "description": "Palace of Winds, famous for its honeycomb facade.",
                "category": "Architecture",
                "location": "Old City"
            },
            {
                "name": "City Palace",
                "image": "https://images.unsplash.com/photo-1599388832049-93e1509a2503?q=80&w=500",
                "description": "A complex of courtyards, gardens and buildings.",
                "category": "Heritage",
                "location": "Center"
            }
        ]
    },
    {
        "name": "Udaipur",
        "country": "India",
        "state": "Rajasthan",
        "region": "asia",
        "description": "Udaipur, formerly the capital of the Mewar Kingdom, is a city in the western Indian state of Rajasthan. Founded by Maharana Udai Singh II in 1559, it’s set around a series of artificial lakes and is known for its lavish royal residences.",
        "short_description": "The City of Lakes, Venice of the East.",
        "highlights": "City Palace, Lake Pichola, Jag Mandir, Sajjangarh",
        "image_url": "https://images.unsplash.com/photo-1615836245337-f839d95ABCde?q=80&w=1200",
        "avg_budget": 80,
        "cost_index": "₹₹₹",
        "best_season": "September to March",
        "recommended_days": "2–3 days",
        "popularity": 94,
        "latitude": 24.5854,
        "longitude": 73.7125,
        "currency": "INR",
        "language": "Hindi, Mewari, English",
        "timezone": "IST (UTC+5:30)",
        "travel_type": "Romantic, Heritage",
        "tags": [
            "romantic",
            "lakes",
            "palaces",
            "luxury"
        ],
        "why_visit": "Perfect for romantic getaways, offering serene lake views and luxurious palaces.",
        "budget_breakdown": {
            "Accommodation": 45,
            "Food": 20,
            "Transport": 5,
            "Activities": 10
        },
        "attractions": [
            {
                "name": "City Palace",
                "image": "https://images.unsplash.com/photo-1582650570081-3c3b01850116?q=80&w=500",
                "description": "Overlooks Lake Pichola, a monumental complex.",
                "category": "Heritage",
                "location": "Lake Pichola"
            },
            {
                "name": "Lake Pichola",
                "image": "https://images.unsplash.com/photo-1615836245337-f839d95ABCde?q=80&w=500",
                "description": "An artificial fresh water lake.",
                "category": "Nature",
                "location": "Udaipur Center"
            }
        ]
    },
    {
        "name": "Varanasi",
        "country": "India",
        "state": "Uttar Pradesh",
        "region": "asia",
        "description": "Varanasi is a city in the northern Indian state of Uttar Pradesh dating to the 11th century B.C. Regarded as the spiritual capital of India, the city draws Hindu pilgrims who bathe in the Ganges River’s sacred waters and perform funeral rites.",
        "short_description": "The spiritual capital of India.",
        "highlights": "Kashi Vishwanath, Dashashwamedh Ghat, Ganga Aarti, Sarnath",
        "image_url": "https://images.unsplash.com/photo-1561359313-0639aad3a644?q=80&w=1200",
        "avg_budget": 40,
        "cost_index": "₹",
        "best_season": "October to March",
        "recommended_days": "2–3 days",
        "popularity": 96,
        "latitude": 25.3176,
        "longitude": 82.9739,
        "currency": "INR",
        "language": "Hindi, Bhojpuri",
        "timezone": "IST (UTC+5:30)",
        "travel_type": "Spiritual, Cultural",
        "tags": [
            "spiritual",
            "culture",
            "river",
            "history"
        ],
        "why_visit": "Experience the soul of India through mesmerizing Ganga Aarti and ancient alleyways.",
        "budget_breakdown": {
            "Accommodation": 20,
            "Food": 10,
            "Transport": 5,
            "Activities": 5
        },
        "attractions": [
            {
                "name": "Dashashwamedh Ghat",
                "image": "https://images.unsplash.com/photo-1561359313-0639aad3a644?q=80&w=500",
                "description": "The main ghat in Varanasi on the Ganga River.",
                "category": "Spiritual",
                "location": "Ganges Riverfront"
            },
            {
                "name": "Kashi Vishwanath Temple",
                "image": "https://images.unsplash.com/photo-1582200424578-83eb9e5e70c5?q=80&w=500",
                "description": "One of the most famous Hindu temples dedicated to Lord Shiva.",
                "category": "Spiritual",
                "location": "Old City"
            }
        ]
    },
    {
        "name": "Ayodhya",
        "country": "India",
        "state": "Uttar Pradesh",
        "region": "asia",
        "description": "Ayodhya is a city situated on the banks of holy river Saryu. In the Indian state of Uttar Pradesh, It is the headquarters of Ayodhya District and Ayodhya division. Ayodhya, also known as Saketa, is an ancient city of India, is the birthplace of Bhagwan Shri Ram and setting of the great epic Ramayana.",
        "short_description": "The birthplace of Lord Rama.",
        "highlights": "Ram Mandir, Hanuman Garhi, Saryu Ghat",
        "image_url": "https://images.unsplash.com/photo-1705651586749-0648df4e0cf5?q=80&w=1200",
        "avg_budget": 45,
        "cost_index": "₹₹",
        "best_season": "October to March",
        "recommended_days": "1–2 days",
        "popularity": 98,
        "latitude": 26.7922,
        "longitude": 82.1998,
        "currency": "INR",
        "language": "Hindi, Awadhi",
        "timezone": "IST (UTC+5:30)",
        "travel_type": "Spiritual, Pilgrimage",
        "tags": [
            "spiritual",
            "pilgrimage",
            "history"
        ],
        "why_visit": "Visit the majestic Ram Janmabhoomi temple and experience the devotion at Saryu ghats.",
        "budget_breakdown": {
            "Accommodation": 25,
            "Food": 10,
            "Transport": 5,
            "Activities": 5
        },
        "attractions": [
            {
                "name": "Ram Mandir",
                "image": "https://images.unsplash.com/photo-1705651586749-0648df4e0cf5?q=80&w=500",
                "description": "A Hindu temple being built at the sacred pilgrimage site of Ram Janmabhoomi.",
                "category": "Spiritual",
                "location": "Ram Kot"
            },
            {
                "name": "Hanuman Garhi",
                "image": "https://images.unsplash.com/photo-1598048145816-328699b827e8?q=80&w=500",
                "description": "A 10th-century temple dedicated to Hanuman.",
                "category": "Spiritual",
                "location": "Ayodhya"
            }
        ]
    },
    {
        "name": "Mumbai",
        "country": "India",
        "state": "Maharashtra",
        "region": "asia",
        "description": "Mumbai (formerly called Bombay) is a densely populated city on India’s west coast. A financial center, it's India's largest city. On the Mumbai Harbour waterfront stands the iconic Gateway of India stone arch, built by the British Raj in 1924.",
        "short_description": "The city of dreams, Bollywood, and financial heartbeat of India.",
        "highlights": "Gateway of India, Marine Drive, Elephanta Caves, Bandra-Worli Sea Link",
        "image_url": "https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=1200",
        "avg_budget": 90,
        "cost_index": "₹₹₹",
        "best_season": "November to February",
        "recommended_days": "3–5 days",
        "popularity": 97,
        "latitude": 19.076,
        "longitude": 72.8777,
        "currency": "INR",
        "language": "Marathi, Hindi, English",
        "timezone": "IST (UTC+5:30)",
        "travel_type": "City, Culture, Nightlife",
        "tags": [
            "city",
            "nightlife",
            "history",
            "food",
            "shopping"
        ],
        "why_visit": "Experience the fast-paced life, stunning colonial architecture, and seaside promenades.",
        "budget_breakdown": {
            "Accommodation": 50,
            "Food": 20,
            "Transport": 10,
            "Activities": 10
        },
        "attractions": [
            {
                "name": "Gateway of India",
                "image": "https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=500",
                "description": "Iconic arch monument built during the 20th century.",
                "category": "Heritage",
                "location": "Colaba"
            },
            {
                "name": "Marine Drive",
                "image": "https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=500",
                "description": "A 3.6-kilometre-long boulevard along the coast.",
                "category": "Nature/City",
                "location": "South Mumbai"
            }
        ]
    },
    {
        "name": "Goa",
        "country": "India",
        "state": "Goa",
        "region": "asia",
        "description": "Goa is a state in western India with coastlines stretching along the Arabian Sea. Its long history as a Portuguese colony prior to 1961 is evident in its preserved 17th-century churches and the area’s tropical spice plantations.",
        "short_description": "Sandy beaches, vibrant nightlife, and Portuguese heritage.",
        "highlights": "Baga Beach, Dudhsagar Falls, Basilica of Bom Jesus, Aguada Fort",
        "image_url": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200",
        "avg_budget": 75,
        "cost_index": "₹₹",
        "best_season": "November to February",
        "recommended_days": "4–6 days",
        "popularity": 98,
        "latitude": 15.2993,
        "longitude": 74.124,
        "currency": "INR",
        "language": "Konkani, English, Hindi",
        "timezone": "IST (UTC+5:30)",
        "travel_type": "Beach, Party, Relax",
        "tags": [
            "beach",
            "party",
            "relax",
            "heritage"
        ],
        "why_visit": "Perfect for beach lovers and party-goers, with a laid-back vibe and great seafood.",
        "budget_breakdown": {
            "Accommodation": 30,
            "Food": 20,
            "Transport": 10,
            "Activities": 15
        },
        "attractions": [
            {
                "name": "Baga Beach",
                "image": "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=500",
                "description": "Popular beach known for its water sports and nightlife.",
                "category": "Beach",
                "location": "North Goa"
            },
            {
                "name": "Basilica of Bom Jesus",
                "image": "https://images.unsplash.com/photo-1616489375493-27a98ebdb474?q=80&w=500",
                "description": "A UNESCO World Heritage Site holding the mortal remains of St. Francis Xavier.",
                "category": "Heritage",
                "location": "Old Goa"
            }
        ]
    },
    {
        "name": "Alleppey",
        "country": "India",
        "state": "Kerala",
        "region": "asia",
        "description": "Alappuzha (or Alleppey) is a city on the Laccadive Sea in the southern Indian state of Kerala. It's best known for houseboat cruises along the rustic Kerala backwaters, a network of tranquil canals and lagoons.",
        "short_description": "Venice of the East, famous for tranquil backwaters and houseboats.",
        "highlights": "Backwater Houseboats, Alappuzha Beach, Marari Beach",
        "image_url": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200",
        "avg_budget": 65,
        "cost_index": "₹₹",
        "best_season": "September to March",
        "recommended_days": "2–3 days",
        "popularity": 92,
        "latitude": 9.4981,
        "longitude": 76.3388,
        "currency": "INR",
        "language": "Malayalam, English",
        "timezone": "IST (UTC+5:30)",
        "travel_type": "Nature, Relax, Romantic",
        "tags": [
            "nature",
            "backwaters",
            "relax",
            "romantic"
        ],
        "why_visit": "Float along serene backwaters in a traditional houseboat, surrounded by lush greenery.",
        "budget_breakdown": {
            "Accommodation": 40,
            "Food": 15,
            "Transport": 5,
            "Activities": 5
        },
        "attractions": [
            {
                "name": "Backwaters",
                "image": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=500",
                "description": "A network of interconnected canals, rivers, lakes and inlets.",
                "category": "Nature",
                "location": "Alleppey"
            },
            {
                "name": "Alappuzha Beach",
                "image": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=500",
                "description": "A popular beach with an old pier extending into the sea.",
                "category": "Beach",
                "location": "Coast"
            }
        ]
    },
    {
        "name": "Hampi",
        "country": "India",
        "state": "Karnataka",
        "region": "asia",
        "description": "Hampi is an ancient village in the south Indian state of Karnataka. It’s dotted with numerous ruined temple complexes from the Vijayanagara Empire.",
        "short_description": "A UNESCO World Heritage site with magnificent ruins of a bygone empire.",
        "highlights": "Virupaksha Temple, Vittala Temple, Matanga Hill, Lotus Mahal",
        "image_url": "https://images.unsplash.com/photo-1600011689032-8b628b8a8747?q=80&w=1200",
        "avg_budget": 45,
        "cost_index": "₹",
        "best_season": "October to February",
        "recommended_days": "2–3 days",
        "popularity": 90,
        "latitude": 15.335,
        "longitude": 76.46,
        "currency": "INR",
        "language": "Kannada, English",
        "timezone": "IST (UTC+5:30)",
        "travel_type": "Heritage, History, Adventure",
        "tags": [
            "heritage",
            "history",
            "ruins",
            "adventure"
        ],
        "why_visit": "Explore the surreal boulder-strewn landscape and monumental ruins of the Vijayanagara Empire.",
        "budget_breakdown": {
            "Accommodation": 20,
            "Food": 10,
            "Transport": 10,
            "Activities": 5
        },
        "attractions": [
            {
                "name": "Virupaksha Temple",
                "image": "https://images.unsplash.com/photo-1600011689032-8b628b8a8747?q=80&w=500",
                "description": "An important ancient Hindu temple dedicated to Lord Shiva.",
                "category": "Spiritual",
                "location": "Hampi Bazaar"
            },
            {
                "name": "Vittala Temple",
                "image": "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?q=80&w=500",
                "description": "Famous for its iconic stone chariot and musical pillars.",
                "category": "Heritage",
                "location": "Hampi"
            }
        ]
    },
    {
        "name": "Manali",
        "country": "India",
        "state": "Himachal Pradesh",
        "region": "asia",
        "description": "Manali is a high-altitude Himalayan resort town in India’s northern Himachal Pradesh state. It has a reputation as a backpacking center and honeymoon destination.",
        "short_description": "A beautiful hill station offering adventure sports and snowy landscapes.",
        "highlights": "Rohtang Pass, Solang Valley, Hidimba Devi Temple, Old Manali",
        "image_url": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=1200",
        "avg_budget": 60,
        "cost_index": "₹₹",
        "best_season": "October to June",
        "recommended_days": "3–5 days",
        "popularity": 95,
        "latitude": 32.2396,
        "longitude": 77.1887,
        "currency": "INR",
        "language": "Hindi, English",
        "timezone": "IST (UTC+5:30)",
        "travel_type": "Adventure, Nature",
        "tags": [
            "mountains",
            "adventure",
            "snow",
            "nature"
        ],
        "why_visit": "Enjoy breathtaking views, thrilling adventure sports, and serene mountain vibes.",
        "budget_breakdown": {
            "Accommodation": 25,
            "Food": 15,
            "Transport": 10,
            "Activities": 10
        },
        "attractions": [
            {
                "name": "Solang Valley",
                "image": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=500",
                "description": "Famous for adventure sports like paragliding and skiing.",
                "category": "Adventure",
                "location": "Near Manali"
            },
            {
                "name": "Hidimba Devi Temple",
                "image": "https://images.unsplash.com/photo-1615836245337-f839d95ABCde?q=80&w=500",
                "description": "An ancient cave temple surrounded by a cedar forest.",
                "category": "Heritage",
                "location": "Old Manali"
            }
        ]
    },
    {
        "name": "Paris",
        "country": "France",
        "state": "Île-de-France",
        "region": "europe",
        "description": "Paris, France's capital, is a major European city and a global center for art, fashion, gastronomy and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine.",
        "short_description": "The City of Light, romance, art, and exquisite cuisine.",
        "highlights": "Eiffel Tower, Louvre Museum, Notre-Dame, Montmartre",
        "image_url": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1200",
        "avg_budget": 200,
        "cost_index": "$$$",
        "best_season": "April to June, October",
        "recommended_days": "4–5 days",
        "popularity": 99,
        "latitude": 48.8566,
        "longitude": 2.3522,
        "currency": "EUR",
        "language": "French, English",
        "timezone": "CET (UTC+1)",
        "travel_type": "City, Culture, Romance",
        "tags": [
            "romantic",
            "art",
            "culture",
            "city",
            "food"
        ],
        "why_visit": "Wander through iconic boulevards, visit world-class museums, and enjoy incredible culinary delights.",
        "budget_breakdown": {
            "Accommodation": 100,
            "Food": 50,
            "Transport": 20,
            "Activities": 30
        },
        "attractions": [
            {
                "name": "Eiffel Tower",
                "image": "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=500",
                "description": "The iconic wrought-iron lattice tower.",
                "category": "Landmark",
                "location": "Champ de Mars"
            },
            {
                "name": "Louvre Museum",
                "image": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=500",
                "description": "The world's largest art museum and a historic monument.",
                "category": "Art",
                "location": "Louvre"
            }
        ]
    },
    {
        "name": "Bali",
        "country": "Indonesia",
        "state": "Bali",
        "region": "asia",
        "description": "Bali is an Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs. The island is home to religious sites such as cliffside Uluwatu Temple.",
        "short_description": "Island of the Gods, featuring temples, beaches, and lush terraces.",
        "highlights": "Ubud, Seminyak, Uluwatu, Mount Batur",
        "image_url": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200",
        "avg_budget": 80,
        "cost_index": "$$",
        "best_season": "April to October",
        "recommended_days": "7–10 days",
        "popularity": 97,
        "latitude": -8.3405,
        "longitude": 115.092,
        "currency": "IDR",
        "language": "Indonesian, Balinese, English",
        "timezone": "WITA (UTC+8)",
        "travel_type": "Beach, Nature, Culture",
        "tags": [
            "beach",
            "nature",
            "culture",
            "relax"
        ],
        "why_visit": "Discover spiritual tranquility, surf world-class waves, and immerse in vibrant culture.",
        "budget_breakdown": {
            "Accommodation": 40,
            "Food": 20,
            "Transport": 10,
            "Activities": 10
        },
        "attractions": [
            {
                "name": "Uluwatu Temple",
                "image": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=500",
                "description": "A Balinese Hindu sea temple located in Uluwatu.",
                "category": "Spiritual",
                "location": "South Kuta"
            },
            {
                "name": "Tegalalang Rice Terrace",
                "image": "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=500",
                "description": "Scenic, terraced hillside offering rice paddies and lush greenery.",
                "category": "Nature",
                "location": "Ubud"
            }
        ]
    }
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
        print(f"Inserted {len(DESTINATIONS)} destinations")

        # Insert activities
        for a in ACTIVITIES:
            session.add(Activity(**a))
        print(f"Inserted {len(ACTIVITIES)} activities")

        await session.commit()
        print("Seed complete!")


if __name__ == "__main__":
    asyncio.run(seed())
