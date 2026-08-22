'use client';
import { useState, useEffect } from 'react';
import { getDestinations } from '@/lib/api';
import Link from 'next/link';
import { Search, Map, Compass, Star, Heart, DollarSign, Clock, MapPin, Filter, Plane, Tent, Camera, Smile } from 'lucide-react';
import AddToTripModal from '@/components/destinations/AddToTripModal';

const REGIONS = [
  { value: '', label: 'All Regions' },
  { value: 'india', label: 'India' },
  { value: 'asia', label: 'Asia' },
  { value: 'europe', label: 'Europe' },
  { value: 'americas', label: 'Americas' },
  { value: 'middle_east', label: 'Middle East' },
];

const TRAVEL_TYPES = [
  { value: '', label: 'All', icon: <Map className="w-4 h-4" /> },
  { value: 'Spiritual', label: 'Spiritual', icon: <Star className="w-4 h-4" /> },
  { value: 'Adventure', label: 'Adventure', icon: <Compass className="w-4 h-4" /> },
  { value: 'Nature', label: 'Nature', icon: <Tent className="w-4 h-4" /> },
  { value: 'Beach', label: 'Beach', icon: <Smile className="w-4 h-4" /> },
  { value: 'Heritage', label: 'Heritage', icon: <Camera className="w-4 h-4" /> },
  { value: 'City', label: 'City', icon: <MapPin className="w-4 h-4" /> },
];

const BUDGETS = [
  { value: '', label: 'Any Budget' },
  { value: 'Budget', label: 'Budget' },
  { value: 'Moderate', label: 'Moderate' },
  { value: 'Premium', label: 'Premium' },
  { value: 'Luxury', label: 'Luxury' },
];

const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'budget_low', label: 'Budget: Low to High' },
  { value: 'budget_high', label: 'Budget: High to Low' },
  { value: 'name_asc', label: 'Name: A - Z' },
  { value: 'name_desc', label: 'Name: Z - A' },
];

export default function ExplorePage() {
  const [destinations, setDestinations] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [travelType, setTravelType] = useState('');
  const [budget, setBudget] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [loading, setLoading] = useState(true);
  
  const [selectedDestId, setSelectedDestId] = useState(null);

  useEffect(() => { 
    const delayDebounceFn = setTimeout(() => {
      loadDestinations();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, region, travelType, budget, sortBy]);

  async function loadDestinations() {
    setLoading(true);
    try {
      const data = await getDestinations({ 
        search: search || undefined,
        region: region === 'india' ? undefined : (region || undefined),
        travel_type: travelType || undefined,
        budget: budget || undefined,
        sort_by: sortBy
      });
      
      let results = data || [];
      // Hack for "india" region since it's stored as country="India"
      if (region === 'india') {
        results = results.filter(d => d.country?.toLowerCase() === 'india');
      }
      
      setDestinations(results);
      setTotal(results.length);
    } catch { 
      setDestinations([]); 
      setTotal(0); 
    }
    setLoading(false);
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 animate-fade-in pb-24">
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Discover <span className="gradient-text">Destinations</span></h1>
        <p className="text-[#94A3B8] text-lg">Explore the world's most incredible places, from hidden gems to popular hotspots.</p>
      </div>

      {/* Search & Filters Area */}
      <div className="glass-card p-5 mb-10 sticky top-20 z-30 shadow-2xl backdrop-blur-2xl bg-[#0D1B2A]/90 border border-white/10 rounded-2xl">
        <div className="flex flex-col xl:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="flex-1 w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
            <input type="text" placeholder="Search destinations, cities, tags..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-3.5 pl-12 pr-4 bg-[#07111F]/50 border border-white/10 rounded-xl text-[#F8FAFC] placeholder:text-[#94A3B8] outline-none focus:border-[#22D3A7]/50 focus:bg-[#07111F] transition-all shadow-inner" />
          </div>

          {/* Quick Filters */}
          <div className="flex gap-3 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 hide-scrollbar">
            <div className="flex items-center gap-2 bg-[#07111F]/50 px-3 py-1.5 rounded-xl border border-white/5">
              <Filter className="w-4 h-4 text-[#94A3B8]" />
              <select value={region} onChange={e => setRegion(e.target.value)} className="bg-transparent text-sm font-semibold text-[#F8FAFC] outline-none cursor-pointer">
                {REGIONS.map(r => <option key={r.value} value={r.value} className="bg-[#0D1B2A]">{r.label}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 bg-[#07111F]/50 px-3 py-1.5 rounded-xl border border-white/5">
              <DollarSign className="w-4 h-4 text-[#94A3B8]" />
              <select value={budget} onChange={e => setBudget(e.target.value)} className="bg-transparent text-sm font-semibold text-[#F8FAFC] outline-none cursor-pointer">
                {BUDGETS.map(b => <option key={b.value} value={b.value} className="bg-[#0D1B2A]">{b.label}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 bg-[#07111F]/50 px-3 py-1.5 rounded-xl border border-white/5">
              <span className="text-[#94A3B8] text-xs font-bold uppercase tracking-wider ml-1">Sort</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-transparent text-sm font-semibold text-[#22D3A7] outline-none cursor-pointer pr-4">
                {SORT_OPTIONS.map(s => <option key={s.value} value={s.value} className="bg-[#0D1B2A]">{s.label}</option>)}
              </select>
            </div>
          </div>
        </div>
        
        {/* Travel Types Filter (Pills) */}
        <div className="flex gap-2 overflow-x-auto pt-4 mt-4 border-t border-white/5 hide-scrollbar">
          {TRAVEL_TYPES.map((c) => (
            <button key={c.value} onClick={() => setTravelType(c.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border
                ${travelType === c.value 
                  ? 'text-[#07111F] border-[#22D3A7] bg-[#22D3A7] shadow-[0_0_15px_rgba(34,211,167,0.3)] transform scale-105' 
                  : 'text-[#94A3B8] border-white/10 bg-[#07111F]/50 hover:bg-white/10 hover:text-[#F8FAFC]'}`}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-end mb-6 px-2">
        <h2 className="text-2xl font-heading font-bold text-[#F8FAFC]">Curated Destinations</h2>
        <div className="text-sm text-[#94A3B8] bg-white/5 px-3 py-1 rounded-full">
          Found <span className="text-[#22D3A7] font-bold">{total}</span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(n => (
            <div key={n} className="glass-card rounded-2xl h-[450px] animate-pulse overflow-hidden">
              <div className="h-48 bg-[#132238]/50 w-full" />
              <div className="p-5 space-y-4">
                <div className="h-6 bg-[#132238]/50 rounded w-3/4" />
                <div className="h-4 bg-[#132238]/50 rounded w-1/2" />
                <div className="h-16 bg-[#132238]/50 rounded w-full" />
                <div className="h-10 bg-[#132238]/50 rounded w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : destinations.length === 0 ? (
        <div className="py-20 text-center glass-card rounded-2xl border-dashed border-2 border-white/10">
          <Plane className="w-16 h-16 text-[#94A3B8] mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">No destinations found</h3>
          <p className="text-[#94A3B8]">Try adjusting your search or filters to discover more places.</p>
          <button onClick={() => {setSearch(''); setRegion(''); setTravelType(''); setBudget('');}} className="mt-6 text-[#22D3A7] font-semibold hover:underline">Clear all filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {destinations.map((d) => (
            <div key={d.id} className="glass-card rounded-2xl overflow-hidden flex flex-col group hover:glass-card-hover transition-all duration-300 transform hover:-translate-y-1">
              {/* Image Section */}
              <div className="h-52 bg-[#132238] relative overflow-hidden">
                {d.image_url ? (
                  <img src={d.image_url} alt={d.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#132238] to-[#0D1B2A]">
                    <MapPin className="w-12 h-12 text-[#94A3B8]/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07111F] via-transparent to-transparent opacity-90" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#07111F]/80 backdrop-blur-md text-[#22D3A7] border border-[#22D3A7]/30 shadow-lg">
                    {d.popularity > 90 ? '🔥 Popular' : '✨ Trending'}
                  </span>
                </div>
                <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#07111F]/50 backdrop-blur-md flex items-center justify-center border border-white/10 text-[#94A3B8] hover:text-[#FF4A4A] hover:bg-white/10 transition-all z-10">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
              
              {/* Content Section */}
              <div className="p-5 flex flex-col flex-1 relative z-10 bg-[#07111F]/40 backdrop-blur-sm -mt-2">
                <div className="flex justify-between items-start mb-1 gap-4">
                  <h3 className="font-heading font-bold text-xl text-[#F8FAFC] leading-tight group-hover:text-[#22D3A7] transition-colors">{d.name}</h3>
                </div>
                
                <div className="flex items-center gap-1.5 text-sm text-[#94A3B8] mb-3 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#7C5CFC]" /> 
                  {d.state ? `${d.state}, ${d.country}` : d.country}
                </div>
                
                <p className="text-sm text-[#94A3B8] mb-5 line-clamp-2 flex-1 leading-relaxed">
                  {d.short_description || d.description}
                </p>
                
                {/* Meta stats */}
                <div className="flex flex-wrap items-center gap-3 mb-5 border-t border-white/5 pt-4">
                  {d.cost_index && (
                    <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#FFB86B] bg-[#FFB86B]/10 px-2 py-1 rounded-md">
                      {d.cost_index} Cost
                    </span>
                  )}
                  {d.recommended_days && (
                    <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] bg-white/5 px-2 py-1 rounded-md">
                      <Clock className="w-3 h-3" /> {d.recommended_days}
                    </span>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <Link href={`/destinations/${d.id}`} className="flex-1 px-4 py-2.5 rounded-lg font-bold text-sm bg-white/5 text-[#F8FAFC] border border-white/10 hover:bg-white/10 transition-all text-center">
                    View Details
                  </Link>
                  <button onClick={() => setSelectedDestId(d.id)} className="flex-1 px-4 py-2.5 rounded-lg font-bold text-sm gradient-btn flex items-center justify-center gap-2 border border-transparent hover:shadow-[0_0_20px_rgba(34,211,167,0.4)]">
                    <span className="hidden sm:inline">Add to Trip</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedDestId && (
        <AddToTripModal destinationId={selectedDestId} onClose={() => setSelectedDestId(null)} />
      )}
    </div>
  );
}
