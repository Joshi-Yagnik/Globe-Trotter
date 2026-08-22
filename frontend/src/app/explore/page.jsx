'use client';
import { useState, useEffect } from 'react';
import { getActivities } from '@/lib/api';

const CATEGORIES = [
  { value: '', label: 'All', icon: '🌐' },
  { value: 'adventure', label: 'Adventure', icon: '🧗' },
  { value: 'culture', label: 'Culture', icon: '🏛️' },
  { value: 'nature', label: 'Nature', icon: '🌿' },
  { value: 'food', label: 'Food', icon: '🍜' },
  { value: 'water', label: 'Water', icon: '🏄' },
  { value: 'relaxation', label: 'Relaxation', icon: '🧘' },
  { value: 'wildlife', label: 'Wildlife', icon: '🦁' },
  { value: 'nightlife', label: 'Nightlife', icon: '🌃' },
];

const DIFFICULTY_COLORS = { easy: 'text-green-400', moderate: 'text-yellow-400', hard: 'text-orange-400', extreme: 'text-red-400' };

const FALLBACK = [
  { id: 1, name: 'Paragliding', category: 'adventure', description: 'Soar above stunning landscapes.', avg_cost: 120, duration_hours: 1.5, difficulty: 'moderate', popularity: 85, rating: 4.7 },
  { id: 2, name: 'Temple Tour', category: 'culture', description: 'Explore ancient temples and heritage sites.', avg_cost: 30, duration_hours: 3, difficulty: 'easy', popularity: 82, rating: 4.5 },
  { id: 3, name: 'Scuba Diving', category: 'water', description: 'Discover underwater coral reefs.', avg_cost: 150, duration_hours: 4, difficulty: 'moderate', popularity: 90, rating: 4.8 },
  { id: 4, name: 'Street Food Walk', category: 'food', description: 'Taste authentic local street food.', avg_cost: 25, duration_hours: 2.5, difficulty: 'easy', popularity: 88, rating: 4.6 },
  { id: 5, name: 'Jungle Safari', category: 'wildlife', description: 'Spot exotic wildlife in natural habitat.', avg_cost: 200, duration_hours: 5, difficulty: 'easy', popularity: 80, rating: 4.4 },
  { id: 6, name: 'Spa & Wellness', category: 'relaxation', description: 'Traditional spa treatments and yoga.', avg_cost: 80, duration_hours: 3, difficulty: 'easy', popularity: 75, rating: 4.9 },
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
      setActivities(data.activities || FALLBACK);
      setTotal(data.total || FALLBACK.length);
    } catch { setActivities(FALLBACK); setTotal(FALLBACK.length); }
    setLoading(false);
  }

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-8 animate-fade-in">
      <h1 className="text-3xl font-heading font-bold mb-2">Activity <span className="gradient-text">Search</span></h1>
      <p className="text-white/50 text-sm mb-8">Find exciting activities and experiences for your next adventure.</p>

      <div className="flex flex-wrap items-center gap-3 p-3 glass-card mb-6">
        <div className="flex-1 min-w-[200px] relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
          <input type="text" placeholder="Paragliding..." value={search}
            onChange={(e) => { setSearch(e.target.value); loadActivities(null, null, e.target.value); }}
            className="w-full py-2 pl-10 pr-4 bg-white/[0.06] border border-transparent rounded-xl text-white text-sm outline-none focus:border-teal-400 transition-all" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {CATEGORIES.map((c) => (
            <button key={c.value} onClick={() => { setCategory(c.value); loadActivities(c.value); }}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all
                ${category === c.value ? 'text-teal-400 border-teal-400 bg-teal-400/15' : 'text-white/50 border-white/[0.08] bg-white/[0.06]'}`}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {[{ v: 'popularity', l: '🔥 Popular' }, { v: 'rating', l: '⭐ Rating' }, { v: 'cost_low', l: '💰 Cost ↓' }].map((s) => (
            <button key={s.v} onClick={() => { setSortBy(s.v); loadActivities(null, s.v); }}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all
                ${sortBy === s.v ? 'text-teal-400 border-teal-400 bg-teal-400/15' : 'text-white/50 border-white/[0.08] bg-white/[0.06]'}`}>
              {s.l}
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm text-white/30 mb-4">Results <span className="text-white/60">{total}</span></div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-10 h-10 border-3 border-white/[0.08] border-t-teal-400 rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {activities.map((a) => (
            <div key={a.id} className="glass-card p-5 hover:glass-card-hover transition-all flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center text-xl flex-shrink-0">
                {CATEGORIES.find((c) => c.value === a.category)?.icon || '🎯'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-heading font-bold">{a.name}</div>
                <div className="text-xs text-white/40 line-clamp-1">{a.description}</div>
              </div>
              <div className="text-right flex-shrink-0 space-y-1">
                <div className="text-teal-400 font-bold">${a.avg_cost}</div>
                <div className="text-xs text-white/30">{a.duration_hours}h</div>
                <div className={`text-xs font-semibold capitalize ${DIFFICULTY_COLORS[a.difficulty] || 'text-white/40'}`}>{a.difficulty}</div>
              </div>
              <div className="flex flex-col items-center gap-1 flex-shrink-0 ml-2">
                <div className="text-sm font-bold">⭐ {a.rating}</div>
                <div className="text-[10px] text-white/30">🔥 {a.popularity}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
