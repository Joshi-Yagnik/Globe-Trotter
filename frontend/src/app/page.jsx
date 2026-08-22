'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDestinations, getTrips } from '@/lib/api';

const REGIONS = [
  { value: '', label: 'All', emoji: '🌐' },
  { value: 'asia', label: 'Asia', emoji: '🏯' },
  { value: 'europe', label: 'Europe', emoji: '🏰' },
  { value: 'americas', label: 'Americas', emoji: '🗽' },
  { value: 'middle_east', label: 'Middle East', emoji: '🕌' },
  { value: 'africa', label: 'Africa', emoji: '🌍' },
];

const DEST_GRADIENTS = [
  'from-[#0c1019] to-[#1a3a4a]', 'from-[#0c1019] to-[#2a1a3e]',
  'from-[#0c1019] to-[#3a2a1a]', 'from-[#0c1019] to-[#1a2a3a]',
  'from-[#0c1019] to-[#2a3a1a]', 'from-[#0c1019] to-[#3a1a2a]',
  'from-[#0c1019] to-[#1a3a2a]', 'from-[#0c1019] to-[#2a1a2a]',
];

const DEST_EMOJIS = { asia: '🏯', europe: '🏰', americas: '🗽', africa: '🌍', oceania: '🏝️', middle_east: '🕌' };
const STATUS_EMOJIS = { draft: '📝', planned: '📋', ongoing: '✈️', completed: '✅', cancelled: '❌' };

const FALLBACK_DESTINATIONS = [
  { id: 1, name: 'Paris', country: 'France', region: 'europe', avg_budget: 2500, popularity: 95 },
  { id: 2, name: 'Tokyo', country: 'Japan', region: 'asia', avg_budget: 3000, popularity: 92 },
  { id: 3, name: 'Bali', country: 'Indonesia', region: 'asia', avg_budget: 1500, popularity: 88 },
  { id: 4, name: 'New York City', country: 'United States', region: 'americas', avg_budget: 3500, popularity: 90 },
  { id: 5, name: 'Dubai', country: 'UAE', region: 'middle_east', avg_budget: 2800, popularity: 85 },
  { id: 6, name: 'Santorini', country: 'Greece', region: 'europe', avg_budget: 2200, popularity: 82 },
  { id: 7, name: 'Jaipur', country: 'India', region: 'asia', avg_budget: 800, popularity: 78 },
  { id: 8, name: 'Maldives', country: 'Maldives', region: 'asia', avg_budget: 4000, popularity: 87 },
];

export default function LandingPage() {
  const [destinations, setDestinations] = useState([]);
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [dests, tripsData] = await Promise.all([
        getDestinations({ sort_by: sortBy, ...(region && { region }), ...(search && { search }) }).catch(() => FALLBACK_DESTINATIONS),
        getTrips({}).catch(() => []),
      ]);
      setDestinations(Array.isArray(dests) ? dests : FALLBACK_DESTINATIONS);
      setTrips(Array.isArray(tripsData) ? tripsData : []);
    } catch { setDestinations(FALLBACK_DESTINATIONS); }
    setLoading(false);
  }

  async function filterDestinations(newRegion, newSort, newSearch) {
    const r = newRegion ?? region;
    const s = newSort ?? sortBy;
    const q = newSearch ?? search;
    try {
      const dests = await getDestinations({ sort_by: s, ...(r && { region: r }), ...(q && { search: q }) });
      setDestinations(Array.isArray(dests) ? dests : FALLBACK_DESTINATIONS);
    } catch { setDestinations(FALLBACK_DESTINATIONS); }
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 animate-fade-in">
      {/* Hero */}
      <div className="relative h-[400px] rounded-3xl overflow-hidden mb-12 bg-gradient-to-br from-[#0c1019] via-[#1a1a3e] to-[#0c1019]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080f] via-transparent to-[#06080f]/30" />
        <div className="absolute bottom-12 left-12 z-10">
          <h1 className="text-5xl font-heading font-extrabold mb-2 gradient-text">Explore the World</h1>
          <p className="text-white/60 text-lg max-w-[500px] mb-6">
            Plan your perfect trip with AI-powered suggestions, build detailed itineraries, and share adventures.
          </p>
          <Link href="/trips/new" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold gradient-btn hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(0,212,170,0.3)] transition-all">
            ✨ Start Planning
          </Link>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap items-center gap-3 p-3 glass-card mb-8">
        <div className="flex-1 min-w-[200px] relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
          <input type="text" placeholder="Search destinations..." value={search}
            onChange={(e) => { setSearch(e.target.value); filterDestinations(null, null, e.target.value); }}
            className="w-full py-2 pl-10 pr-4 bg-white/[0.06] border border-transparent rounded-xl text-white text-sm outline-none focus:border-teal-400 transition-all" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {REGIONS.map((r) => (
            <button key={r.value}
              onClick={() => { setRegion(r.value); filterDestinations(r.value); }}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all whitespace-nowrap
                ${region === r.value ? 'text-teal-400 border-teal-400 bg-teal-400/15' : 'text-white/50 border-white/[0.08] bg-white/[0.06] hover:text-teal-400'}`}>
              {r.emoji} {r.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {[{ v: 'popularity', l: '🔥 Popular' }, { v: 'budget_low', l: '💰 Budget' }, { v: 'name', l: '🔤 A-Z' }].map((s) => (
            <button key={s.v} onClick={() => { setSortBy(s.v); filterDestinations(null, s.v); }}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all
                ${sortBy === s.v ? 'text-teal-400 border-teal-400 bg-teal-400/15' : 'text-white/50 border-white/[0.08] bg-white/[0.06]'}`}>
              {s.l}
            </button>
          ))}
        </div>
      </div>

      {/* Top Regional Selections */}
      <section className="mb-12">
        <h2 className="text-2xl font-heading font-bold mb-6">Top <span className="gradient-text">Regional Selections</span></h2>
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-10 h-10 border-3 border-white/[0.08] border-t-teal-400 rounded-full animate-spin" /></div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin">
            {destinations.map((dest, i) => (
              <Link href={`/trips/new?dest=${dest.id}&name=${encodeURIComponent(dest.name)}`} key={dest.id}
                className="min-w-[250px] relative rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl group">
                <div className={`w-full h-[220px] bg-gradient-to-br ${DEST_GRADIENTS[i % DEST_GRADIENTS.length]} flex items-center justify-center text-4xl transition-transform group-hover:scale-110`}>
                  {DEST_EMOJIS[dest.region] || '🌍'}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#06080f]/90 via-transparent flex flex-col justify-end p-4">
                  <div className="text-lg font-heading font-bold">{dest.name}</div>
                  <div className="text-xs text-white/60">{dest.country}</div>
                  <div className="text-xs text-teal-400 mt-1">From ${dest.avg_budget}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Previous Trips */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-bold">Previous <span className="gradient-text">Trips</span></h2>
          <Link href="/trips" className="text-sm text-white/50 hover:text-white border border-white/[0.08] px-4 py-1.5 rounded-xl transition-all">View All →</Link>
        </div>
        {trips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trips.slice(0, 8).map((trip, i) => (
              <Link href={`/trips/${trip.id}`} key={trip.id}
                className="glass-card hover:glass-card-hover cursor-pointer overflow-hidden">
                <div className={`h-[140px] bg-gradient-to-br ${DEST_GRADIENTS[i % DEST_GRADIENTS.length]} flex items-center justify-center text-3xl`}>
                  {STATUS_EMOJIS[trip.status] || '📝'}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-heading font-semibold text-sm">{trip.name}</span>
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full
                      ${trip.status === 'ongoing' ? 'bg-teal-400/20 text-teal-400' : trip.status === 'completed' ? 'bg-green-400/20 text-green-400' : 'bg-white/10 text-white/60'}`}>
                      {trip.status}
                    </span>
                  </div>
                  <div className="text-xs text-white/40 mb-2">📍 {trip.destination_name} · {trip.duration_days} days</div>
                  <div className="flex justify-between items-center pt-2 border-t border-white/[0.08]">
                    <span className="text-teal-400 font-semibold text-sm">${trip.total_budget}</span>
                    <span className="text-xs text-white/30">{trip.sections_count} sections</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-4xl mb-3 opacity-40">🧳</div>
            <div className="text-white/50 mb-4">No trips yet! Start your first adventure.</div>
            <Link href="/trips/new" className="inline-flex items-center gap-2 px-6 py-2 rounded-xl font-semibold gradient-btn">+ Plan Your First Trip</Link>
          </div>
        )}
      </section>

      {/* FAB */}
      <Link href="/trips/new"
        className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-6 py-3 rounded-full gradient-btn font-bold shadow-xl hover:-translate-y-1 hover:shadow-[0_0_50px_rgba(0,212,170,0.35)] transition-all">
        ✈️ Plan a Trip
      </Link>
    </div>
  );
}
