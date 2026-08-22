'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTrips, deleteTrip, updateTripStatus } from '@/lib/api';
import { useToast } from '@/components/Toast';

const STATUS_CONFIG = {
  ongoing: { label: 'Ongoing', icon: '✈️', color: 'text-teal-400 bg-teal-400/15' },
  planned: { label: 'Upcoming', icon: '📋', color: 'text-yellow-400 bg-yellow-400/15' },
  draft: { label: 'Drafts', icon: '📝', color: 'text-white/60 bg-white/10' },
  completed: { label: 'Completed', icon: '✅', color: 'text-green-400 bg-green-400/15' },
  cancelled: { label: 'Cancelled', icon: '❌', color: 'text-red-400 bg-red-400/15' },
};

export default function TripListingPage() {
  const showToast = useToast();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('start_date');

  useEffect(() => { loadTrips(); }, []);

  async function loadTrips() {
    try {
      const data = await getTrips({ sort_by: sortBy, ...(search && { search }) });
      setTrips(Array.isArray(data) ? data : []);
    } catch { setTrips([]); }
    setLoading(false);
  }

  async function handleDelete(tripId) {
    try { await deleteTrip(tripId); setTrips((prev) => prev.filter((t) => t.id !== tripId)); showToast('Trip deleted', 'success'); }
    catch { showToast('Failed to delete', 'error'); }
  }

  const grouped = {};
  for (const status of Object.keys(STATUS_CONFIG)) {
    grouped[status] = trips.filter((t) => t.status === status);
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-heading font-bold">My <span className="gradient-text">Trips</span></h1>
        <Link href="/trips/new" className="px-5 py-2 rounded-xl font-semibold gradient-btn hover:-translate-y-0.5 transition-all text-sm">+ New Trip</Link>
      </div>

      <div className="flex flex-wrap items-center gap-3 p-3 glass-card mb-8">
        <div className="flex-1 min-w-[200px] relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
          <input type="text" placeholder="Search trips..." value={search}
            onChange={(e) => { setSearch(e.target.value); }}
            onKeyDown={(e) => e.key === 'Enter' && loadTrips()}
            className="w-full py-2 pl-10 pr-4 bg-white/[0.06] border border-transparent rounded-xl text-white text-sm outline-none focus:border-teal-400 transition-all" />
        </div>
        <div className="flex gap-1">
          {[{ v: 'start_date', l: '📅 Date' }, { v: 'name', l: '🔤 Name' }, { v: 'budget', l: '💰 Budget' }].map((s) => (
            <button key={s.v} onClick={() => { setSortBy(s.v); loadTrips(); }}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all
                ${sortBy === s.v ? 'text-teal-400 border-teal-400 bg-teal-400/15' : 'text-white/50 border-white/[0.08] bg-white/[0.06]'}`}>
              {s.l}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-10 h-10 border-3 border-white/[0.08] border-t-teal-400 rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([status, statusTrips]) => (
            statusTrips.length > 0 && (
              <section key={status}>
                <h2 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
                  <span>{STATUS_CONFIG[status].icon}</span> {STATUS_CONFIG[status].label}
                  <span className="text-xs text-white/30 font-normal ml-2">({statusTrips.length})</span>
                </h2>
                <div className="space-y-3">
                  {statusTrips.map((trip) => (
                    <div key={trip.id} className="glass-card p-5 hover:glass-card-hover transition-all group">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-heading font-bold text-lg">{trip.name}</span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${STATUS_CONFIG[trip.status]?.color}`}>
                              {trip.status}
                            </span>
                          </div>
                          <div className="text-sm text-white/40">
                            📍 {trip.destination_name || 'Unknown'} · {trip.duration_days || '—'} days
                            {trip.start_date && ` · ${trip.start_date}`}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-teal-400 font-bold">${trip.total_budget}</div>
                          <div className="text-xs text-white/30">{trip.sections_count} sections</div>
                        </div>
                        <div className="flex items-center gap-2 ml-6 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/trips/${trip.id}`} className="px-3 py-1 rounded-lg text-xs bg-white/10 hover:bg-white/20 transition-all">View</Link>
                          <Link href={`/trips/${trip.id}/build`} className="px-3 py-1 rounded-lg text-xs bg-teal-400/15 text-teal-400 hover:bg-teal-400/25 transition-all">Edit</Link>
                          <button onClick={() => handleDelete(trip.id)} className="px-3 py-1 rounded-lg text-xs bg-red-400/15 text-red-400 hover:bg-red-400/25 transition-all">✕</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          ))}
          {trips.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4 opacity-30">🧳</div>
              <p className="text-white/40 mb-4">No trips yet. Start planning your first adventure!</p>
              <Link href="/trips/new" className="gradient-btn px-6 py-2 rounded-xl font-bold inline-block">+ Plan a Trip</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
