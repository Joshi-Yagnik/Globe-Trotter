'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDestinations, getTrips } from '@/lib/api';
import { Search, MapPin, Compass, Star, TrendingUp, Sparkles, Navigation, Calendar } from 'lucide-react';

const REGIONS = [
  { value: '', label: 'All Regions' },
  { value: 'asia', label: 'Asia' },
  { value: 'europe', label: 'Europe' },
  { value: 'americas', label: 'Americas' },
  { value: 'middle_east', label: 'Middle East' },
  { value: 'africa', label: 'Africa' },
];

const DEST_IMAGES = [
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop', // Paris
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1994&auto=format&fit=crop', // Tokyo
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2038&auto=format&fit=crop', // Bali
  'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop', // NYC
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop', // Dubai
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop', // Santorini
];

const FALLBACK_DESTINATIONS = [
  { id: 1, name: 'Paris', country: 'France', region: 'europe', avg_budget: 2500, popularity: 95 },
  { id: 2, name: 'Tokyo', country: 'Japan', region: 'asia', avg_budget: 3000, popularity: 92 },
  { id: 3, name: 'Bali', country: 'Indonesia', region: 'asia', avg_budget: 1500, popularity: 88 },
  { id: 4, name: 'New York', country: 'USA', region: 'americas', avg_budget: 3500, popularity: 90 },
];

export default function LandingPage() {
  const [destinations, setDestinations] = useState([]);
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [dests, tripsData] = await Promise.all([
        getDestinations({ sort_by: 'popularity' }).catch(() => FALLBACK_DESTINATIONS),
        getTrips({}).catch(() => []),
      ]);
      setDestinations(Array.isArray(dests) && dests.length ? dests : FALLBACK_DESTINATIONS);
      setTrips(Array.isArray(tripsData) ? tripsData : []);
    } catch { 
      setDestinations(FALLBACK_DESTINATIONS); 
    }
    setLoading(false);
  }

  return (
    <div className="animate-fade-in pb-20">
      {/* Cinematic Hero */}
      <section className="relative h-[85vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop" 
            alt="Travel Landscape" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#07111F]/30 via-[#07111F]/60 to-[#07111F] pointer-events-none" />
        </div>

        {/* Floating Metadata (Travel Orbit Concept) */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden hidden md:block">
          <div className="absolute top-[20%] left-[15%] glass-card px-4 py-2 flex items-center gap-2 animate-float">
            <MapPin className="w-4 h-4 text-[#22D3A7]" />
            <span className="text-xs font-semibold text-[#F8FAFC]">48.8566° N, 2.3522° E</span>
          </div>
          <div className="absolute bottom-[30%] right-[15%] glass-card px-4 py-2 flex items-center gap-2 animate-float-reverse">
            <Compass className="w-4 h-4 text-[#7C5CFC]" />
            <span className="text-xs font-semibold text-[#F8FAFC]">Optimizing route...</span>
          </div>
          
          {/* Subtle curved paths */}
          <svg className="absolute w-full h-full opacity-20" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <path d="M 0,500 C 300,200 700,800 1000,500" stroke="url(#gradient)" strokeWidth="1" fill="none" className="animate-[pulse_4s_infinite]" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22D3A7" stopOpacity="0" />
                <stop offset="50%" stopColor="#22D3A7" stopOpacity="1" />
                <stop offset="100%" stopColor="#7C5CFC" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-slide-up" style={{animationDelay: '0.1s'}}>
            <Sparkles className="w-4 h-4 text-[#FFB86B]" />
            <span className="text-xs font-semibold text-[#F8FAFC] tracking-wider uppercase">AI-Powered Travel Intelligence</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold mb-6 leading-tight animate-slide-up" style={{animationDelay: '0.2s'}}>
            Your next journey,<br />
            <span className="gradient-text">intelligently planned.</span>
          </h1>
          <p className="text-lg md:text-xl text-[#94A3B8] max-w-2xl mx-auto mb-10 animate-slide-up" style={{animationDelay: '0.3s'}}>
            Build unforgettable multi-city trips with AI-powered itineraries, smart budgets, and interactive planning tailored just for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{animationDelay: '0.4s'}}>
            <Link href="/trips/new" className="w-full sm:w-auto px-8 py-4 rounded-xl gradient-btn flex items-center justify-center gap-2 text-lg group">
              <Navigation className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Plan My Trip
            </Link>
            <Link href="/explore" className="w-full sm:w-auto px-8 py-4 rounded-xl glass-card hover:glass-card-hover flex items-center justify-center gap-2 text-[#F8FAFC] font-semibold text-lg transition-all">
              <Compass className="w-5 h-5" />
              Explore Destinations
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 relative z-30 -mt-16">
        {/* Search Bar */}
        <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4 mb-16 shadow-2xl animate-slide-up" style={{animationDelay: '0.5s'}}>
          <div className="flex-1 w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
            <input 
              type="text" 
              placeholder="Search for cities, countries, or regions..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-4 pl-12 pr-4 bg-[#0D1B2A]/50 border border-white/5 rounded-xl text-[#F8FAFC] placeholder:text-[#94A3B8] outline-none focus:border-[#22D3A7] transition-all"
            />
          </div>
          <div className="flex w-full md:w-auto gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {REGIONS.slice(0, 4).map(r => (
              <button key={r.value} onClick={() => setRegion(r.value)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${region === r.value ? 'bg-[#22D3A7]/20 text-[#22D3A7] border border-[#22D3A7]/30' : 'bg-[#132238] text-[#94A3B8] hover:text-[#F8FAFC] border border-white/5'}`}>
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Destinations */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-heading font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-[#22D3A7]" />
              Trending <span className="gradient-text">Destinations</span>
            </h2>
          </div>
          
          {loading ? (
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
              {[1,2,3,4].map(n => <div key={n} className="min-w-[300px] h-[400px] rounded-2xl bg-[#0D1B2A] animate-pulse shrink-0" />)}
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-thin">
              {destinations.map((dest, i) => (
                <Link href={`/trips/new?dest=${dest.id}`} key={dest.id} className="min-w-[300px] h-[400px] rounded-2xl relative overflow-hidden group snap-start cursor-pointer shrink-0">
                  <img src={DEST_IMAGES[i % DEST_IMAGES.length]} alt={dest.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07111F] via-[#07111F]/40 to-transparent" />
                  
                  {/* Floating badge */}
                  <div className="absolute top-4 right-4 glass-card px-3 py-1.5 rounded-full flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-[#FFB86B] fill-[#FFB86B]" />
                    <span className="text-xs font-bold">{dest.popularity}</span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300 group-hover:translate-y-[-8px]">
                    <h3 className="text-2xl font-heading font-bold text-[#F8FAFC] mb-1">{dest.name}</h3>
                    <div className="flex items-center gap-2 text-[#94A3B8] text-sm mb-3">
                      <MapPin className="w-4 h-4" /> {dest.country}
                    </div>
                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[#22D3A7] font-semibold">Est. ${dest.avg_budget}</span>
                      <span className="text-xs px-2 py-1 bg-white/10 rounded-md backdrop-blur-md text-white/90">Plan Route →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* My Library / Recent Trips */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-heading font-bold flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[#7C5CFC]" />
              Your <span className="gradient-text">Travel Library</span>
            </h2>
            <Link href="/trips" className="text-sm font-medium text-[#94A3B8] hover:text-[#22D3A7] transition-colors">View All →</Link>
          </div>

          {trips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trips.slice(0, 4).map((trip) => (
                <Link href={`/trips/${trip.id}`} key={trip.id} className="glass-card hover:glass-card-hover p-5 flex flex-col group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#132238] flex items-center justify-center border border-white/5 group-hover:border-[#22D3A7]/30 transition-colors">
                      <Compass className="w-6 h-6 text-[#22D3A7]" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${trip.status === 'ongoing' ? 'bg-[#22D3A7]/10 text-[#22D3A7]' : 'bg-[#132238] text-[#94A3B8]'}`}>
                      {trip.status}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[#F8FAFC] mb-1 line-clamp-1">{trip.name}</h3>
                  <div className="text-sm text-[#94A3B8] flex items-center gap-1.5 mb-4">
                    <MapPin className="w-3.5 h-3.5" /> {trip.destination_name}
                  </div>
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[#F8FAFC] font-semibold">${trip.total_budget}</span>
                    <span className="text-xs text-[#94A3B8]">{trip.duration_days} days</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center flex flex-col items-center border-dashed border-2 border-white/10">
              <div className="w-16 h-16 rounded-full bg-[#132238] flex items-center justify-center mb-4">
                <Navigation className="w-8 h-8 text-[#94A3B8]" />
              </div>
              <h3 className="text-xl font-heading font-bold text-[#F8FAFC] mb-2">Your next adventure starts here.</h3>
              <p className="text-[#94A3B8] mb-6 max-w-md">You haven't planned any trips yet. Discover amazing destinations and let AI build your perfect itinerary.</p>
              <Link href="/trips/new" className="px-6 py-3 rounded-xl gradient-btn inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Create First Trip
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
