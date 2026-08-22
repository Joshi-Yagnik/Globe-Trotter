'use client';
import { useState, useEffect } from 'react';
import { getActivities } from '@/lib/api';
import { Search, Map, Tent, Camera, Coffee, Droplets, Smile, Compass, Moon, Star, Clock, Heart, DollarSign } from 'lucide-react';

const CATEGORIES = [
  { value: '', label: 'All', icon: <Map className="w-4 h-4" /> },
  { value: 'adventure', label: 'Adventure', icon: <Compass className="w-4 h-4" /> },
  { value: 'culture', label: 'Culture', icon: <Camera className="w-4 h-4" /> },
  { value: 'nature', label: 'Nature', icon: <Tent className="w-4 h-4" /> },
  { value: 'food', label: 'Food', icon: <Coffee className="w-4 h-4" /> },
  { value: 'water', label: 'Water', icon: <Droplets className="w-4 h-4" /> },
  { value: 'relaxation', label: 'Relax', icon: <Smile className="w-4 h-4" /> },
  { value: 'wildlife', label: 'Wildlife', icon: <Camera className="w-4 h-4" /> },
  { value: 'nightlife', label: 'Nightlife', icon: <Moon className="w-4 h-4" /> },
];

const DIFFICULTY_COLORS = { 
  easy: 'text-[#22D3A7] bg-[#22D3A7]/10', 
  moderate: 'text-[#FFB86B] bg-[#FFB86B]/10', 
  hard: 'text-[#FF4A4A] bg-[#FF4A4A]/10', 
  extreme: 'text-[#7C5CFC] bg-[#7C5CFC]/10' 
};

const FALLBACK = [
  { id: 1, name: 'Paragliding over the Alps', category: 'adventure', description: 'Experience the thrill of soaring high above the stunning snow-capped peaks.', avg_cost: 120, duration_hours: 1.5, difficulty: 'moderate', popularity: 85, rating: 4.7, image: 'https://images.unsplash.com/photo-1520662663989-138374d6c4da?w=500&q=80' },
  { id: 2, name: 'Ancient Temple Tour', category: 'culture', description: 'Explore hidden temples, rich heritage sites, and uncover centuries of history.', avg_cost: 30, duration_hours: 3, difficulty: 'easy', popularity: 82, rating: 4.5, image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=500&q=80' },
  { id: 3, name: 'Deep Sea Scuba Diving', category: 'water', description: 'Dive into crystal clear waters and discover vibrant underwater coral reefs.', avg_cost: 150, duration_hours: 4, difficulty: 'moderate', popularity: 90, rating: 4.8, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&q=80' },
  { id: 4, name: 'Authentic Street Food Walk', category: 'food', description: 'Taste authentic local street food with a knowledgeable local guide.', avg_cost: 25, duration_hours: 2.5, difficulty: 'easy', popularity: 88, rating: 4.6, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80' },
  { id: 5, name: 'Open Jeep Jungle Safari', category: 'wildlife', description: 'Spot exotic wildlife in their natural habitat in a thrilling open jeep ride.', avg_cost: 200, duration_hours: 5, difficulty: 'easy', popularity: 80, rating: 4.4, image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=500&q=80' },
  { id: 6, name: 'Luxury Spa & Wellness', category: 'relaxation', description: 'Rejuvenate your body and mind with traditional spa treatments and guided yoga.', avg_cost: 80, duration_hours: 3, difficulty: 'easy', popularity: 75, rating: 4.9, image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=80' },
];

export default function ExplorePage() {
  const [activities, setActivities] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadActivities(); }, []);

  async function loadActivities(cat, sort, q) {
    const c = cat ?? category;
    const s = sort ?? sortBy;
    const query = q ?? search;
    try {
      const data = await getActivities({ ...(c && { category: c }), sort_by: s, ...(query && { search: query }) });
      // API may not return images, use fallback if so
      const results = data.activities?.length ? data.activities : FALLBACK;
      setActivities(results);
      setTotal(data.total || results.length);
    } catch { setActivities(FALLBACK); setTotal(FALLBACK.length); }
    setLoading(false);
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 animate-fade-in pb-24">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-heading font-bold mb-3">Discover <span className="gradient-text">Experiences</span></h1>
        <p className="text-[#94A3B8] text-base">Find exciting activities, hidden gems, and unforgettable experiences for your next adventure.</p>
      </div>

      <div className="glass-card p-4 mb-8 sticky top-20 z-30 shadow-2xl backdrop-blur-xl bg-[#0D1B2A]/80 border border-white/10">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
            <input type="text" placeholder="Search experiences (e.g., Paragliding, Temple Tour)..." value={search}
              onChange={(e) => { setSearch(e.target.value); loadActivities(null, null, e.target.value); }}
              className="w-full py-3.5 pl-12 pr-4 bg-[#07111F]/50 border border-white/5 rounded-xl text-[#F8FAFC] text-sm outline-none focus:border-[#22D3A7]/50 focus:bg-[#07111F]/80 transition-all shadow-inner" />
          </div>
          <div className="flex gap-2 bg-[#07111F]/50 p-1.5 rounded-xl border border-white/5">
            {[{ v: 'popularity', l: 'Popular' }, { v: 'rating', l: 'Top Rated' }, { v: 'cost_low', l: 'Budget' }].map((s) => (
              <button key={s.v} onClick={() => { setSortBy(s.v); loadActivities(null, s.v); }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all
                  ${sortBy === s.v ? 'bg-[#22D3A7] text-[#07111F] shadow-lg shadow-[#22D3A7]/20' : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5'}`}>
                {s.l}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 mt-4 hide-scrollbar">
          {CATEGORIES.map((c) => (
            <button key={c.value} onClick={() => { setCategory(c.value); loadActivities(c.value); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border
                ${category === c.value 
                  ? 'text-[#07111F] border-[#22D3A7] bg-[#22D3A7] shadow-[0_0_15px_rgba(34,211,167,0.3)]' 
                  : 'text-[#94A3B8] border-white/10 bg-[#07111F]/50 hover:bg-white/10 hover:text-[#F8FAFC]'}`}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-end mb-6">
        <h2 className="text-xl font-heading font-bold text-[#F8FAFC]">Curated Results</h2>
        <div className="text-sm text-[#94A3B8]">Found <span className="text-[#22D3A7] font-bold">{total}</span> experiences</div>
      </div>

      {loading ? (
        <div className="flex justify-center py-32"><div className="w-12 h-12 border-4 border-[#22D3A7]/20 border-t-[#22D3A7] rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((a) => (
            <div key={a.id} className="glass-card group overflow-hidden flex flex-col hover:glass-card-hover transition-all duration-300 transform hover:-translate-y-1">
              <div className="h-48 bg-[#132238] relative overflow-hidden">
                {a.image ? (
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${a.image})` }} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#132238] to-[#0D1B2A]">
                    <Compass className="w-12 h-12 text-[#94A3B8]/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07111F] via-[#07111F]/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#07111F]/80 backdrop-blur-md text-[#22D3A7] border border-[#22D3A7]/30">
                    {CATEGORIES.find(c => c.value === a.category)?.label || 'Activity'}
                  </span>
                </div>
                <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#07111F]/50 backdrop-blur-md flex items-center justify-center border border-white/10 text-[#94A3B8] hover:text-[#FF4A4A] hover:bg-white/10 transition-all">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2 gap-4">
                  <h3 className="font-heading font-bold text-lg text-[#F8FAFC] leading-tight group-hover:text-[#22D3A7] transition-colors">{a.name}</h3>
                  <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md">
                    <Star className="w-3.5 h-3.5 text-[#FFB86B] fill-[#FFB86B]" />
                    <span className="text-xs font-bold text-[#F8FAFC]">{a.rating}</span>
                  </div>
                </div>
                
                <p className="text-sm text-[#94A3B8] mb-6 line-clamp-2 flex-1">{a.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${DIFFICULTY_COLORS[a.difficulty] || 'text-[#94A3B8] bg-white/5'}`}>
                    {a.difficulty}
                  </span>
                  <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] bg-white/5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {a.duration_hours}h
                  </span>
                </div>
                
                <div className="pt-4 border-t border-white/5 flex justify-between items-center mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#94A3B8] uppercase font-semibold">From</span>
                    <div className="flex items-center gap-1 text-[#22D3A7] font-bold text-lg">
                      <DollarSign className="w-4 h-4" />
                      <span>{a.avg_cost}</span>
                    </div>
                  </div>
                  <button className="px-5 py-2 rounded-lg font-bold text-sm bg-white/5 text-[#F8FAFC] border border-white/10 hover:bg-[#22D3A7] hover:text-[#07111F] hover:border-[#22D3A7] transition-all">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
