'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTrips, deleteTrip, updateTripStatus } from '@/lib/api';
import { useToast } from '@/components/Toast';
import { Plane, Calendar, Edit3, Trash2, ChevronRight, Plus, Search, Filter, MapPin, Wallet, Map, Clock, CheckCircle2, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  ongoing: { label: 'Active', icon: <Plane className="w-3.5 h-3.5" />, color: 'text-[#22D3A7] bg-[#22D3A7]/10 border-[#22D3A7]/20' },
  planned: { label: 'Upcoming', icon: <Calendar className="w-3.5 h-3.5" />, color: 'text-[#FFB86B] bg-[#FFB86B]/10 border-[#FFB86B]/20' },
  draft: { label: 'Planning', icon: <Edit3 className="w-3.5 h-3.5" />, color: 'text-[#94A3B8] bg-white/5 border-white/10' },
  completed: { label: 'Completed', icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: 'text-[#7C5CFC] bg-[#7C5CFC]/10 border-[#7C5CFC]/20' },
  cancelled: { label: 'Cancelled', icon: <XCircle className="w-3.5 h-3.5" />, color: 'text-[#FF4A4A] bg-[#FF4A4A]/10 border-[#FF4A4A]/20' },
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
    <div className="max-w-[1200px] mx-auto px-6 py-8 animate-fade-in pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-heading font-bold text-[#F8FAFC]">My <span className="gradient-text">Expeditions</span></h1>
          <p className="text-[#94A3B8] text-sm mt-2">Manage and view all your past, present, and future journeys.</p>
        </div>
        <Link href="/trips/new" className="px-6 py-3.5 rounded-xl font-bold gradient-btn flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all shadow-[0_4px_20px_rgba(34,211,167,0.3)]">
          <Plus className="w-5 h-5" /> Start New Journey
        </Link>
      </div>

      <div className="glass-card p-3 mb-12 flex flex-col md:flex-row items-center gap-4 sticky top-20 z-30 shadow-2xl backdrop-blur-xl bg-[#0D1B2A]/80 border border-white/10">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
          <input type="text" placeholder="Search by destination, name, or keywords..." value={search}
            onChange={(e) => { setSearch(e.target.value); }}
            onKeyDown={(e) => e.key === 'Enter' && loadTrips()}
            className="w-full py-3 pl-12 pr-4 bg-transparent border-none text-[#F8FAFC] text-sm outline-none focus:ring-0" />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto px-2 pb-2 md:pb-0 overflow-x-auto">
          <div className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5 mr-2 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Sort
          </div>
          {[{ v: 'start_date', l: 'Date' }, { v: 'name', l: 'Name' }, { v: 'budget', l: 'Budget' }].map((s) => (
            <button key={s.v} onClick={() => { setSortBy(s.v); loadTrips(); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap border
                ${sortBy === s.v 
                  ? 'text-[#22D3A7] border-[#22D3A7]/30 bg-[#22D3A7]/10' 
                  : 'text-[#94A3B8] border-transparent bg-white/5 hover:bg-white/10'}`}>
              {s.l}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-32"><div className="w-12 h-12 border-4 border-[#22D3A7]/20 border-t-[#22D3A7] rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-12">
          {Object.entries(grouped).map(([status, statusTrips]) => (
            statusTrips.length > 0 && (
              <section key={status}>
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-white/5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${STATUS_CONFIG[status].color}`}>
                    {STATUS_CONFIG[status].icon}
                  </div>
                  <h2 className="text-xl font-heading font-bold text-[#F8FAFC]">{STATUS_CONFIG[status].label}</h2>
                  <span className="text-xs font-bold text-[#94A3B8] bg-white/5 px-2 py-0.5 rounded-md ml-2">{statusTrips.length}</span>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {statusTrips.map((trip) => (
                    <div key={trip.id} className="glass-card p-0 hover:glass-card-hover transition-all duration-300 group overflow-hidden relative">
                      {/* Status Accent Bar */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${STATUS_CONFIG[status].color.split(' ')[0].replace('text', 'bg')}`} />
                      
                      <div className="p-6 pl-8">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${STATUS_CONFIG[trip.status]?.color}`}>
                                {trip.status}
                              </span>
                            </div>
                            <h3 className="font-heading font-bold text-xl text-[#F8FAFC] group-hover:text-[#22D3A7] transition-colors line-clamp-1">{trip.name}</h3>
                          </div>
                          
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/trips/${trip.id}/build`} className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center text-[#94A3B8] hover:text-[#7C5CFC] hover:bg-[#7C5CFC]/10 transition-colors" title="Edit Builder">
                              <Edit3 className="w-4 h-4" />
                            </Link>
                            <button onClick={() => handleDelete(trip.id)} className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center text-[#94A3B8] hover:text-[#FF4A4A] hover:bg-[#FF4A4A]/10 transition-colors" title="Delete Trip">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-y-3 mb-5">
                          <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
                            <MapPin className="w-4 h-4 text-[#7C5CFC]" />
                            <span className="truncate">{trip.destination_name || 'Unknown'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
                            <Wallet className="w-4 h-4 text-[#22D3A7]" />
                            <span className="font-bold">${trip.total_budget || 0}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
                            <Calendar className="w-4 h-4 text-[#FFB86B]" />
                            <span>{trip.start_date || 'TBD'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
                            <Clock className="w-4 h-4 text-[#94A3B8]" />
                            <span>{trip.duration_days || '—'} Days</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
                            <Map className="w-3.5 h-3.5" />
                            <span className="font-bold text-[#F8FAFC]">{trip.sections_count || 0}</span> Blocks
                          </div>
                          <Link href={`/trips/${trip.id}`} className="flex items-center gap-1 text-sm font-bold text-[#22D3A7] group/link">
                            View Details <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          ))}
          {trips.length === 0 && (
            <div className="glass-card p-16 text-center flex flex-col items-center justify-center border-dashed border-2 border-white/5">
              <div className="w-20 h-20 rounded-full bg-[#132238] flex items-center justify-center mb-6 shadow-inner">
                <Map className="w-10 h-10 text-[#94A3B8]/50" />
              </div>
              <h3 className="text-[#F8FAFC] font-heading font-bold text-2xl mb-2">No Expeditions Found</h3>
              <p className="text-[#94A3B8] text-sm max-w-md mx-auto mb-8">You haven't planned any trips yet. Start exploring the world and build your first itinerary.</p>
              <Link href="/trips/new" className="gradient-btn px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:-translate-y-0.5 transition-all shadow-lg">
                <Plus className="w-5 h-5" /> Plan a Trip
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
