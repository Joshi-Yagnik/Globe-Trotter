'use client';
import { useState, useEffect } from 'react';
import { getTrips, updateTrip, createTrip } from '@/lib/api';
import { X, Plus, MapPin, Calendar, Users, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AddToTripModal({ destinationId, onClose }) {
  const router = useRouter();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [view, setView] = useState('select'); // 'select' or 'create'
  
  // Create state
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState('');

  useEffect(() => {
    loadTrips();
  }, []);

  async function loadTrips() {
    try {
      const data = await getTrips();
      // Show trips that don't already have this destination (or all of them)
      setTrips(data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function handleSelectTrip(trip) {
    setSubmitting(true);
    try {
      await updateTrip(trip.id, { destination_id: destinationId, destination_name: null }); // BE will use ID
      onClose();
      router.push(`/trips/${trip.id}`);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  }

  async function handleCreateTrip(e) {
    e.preventDefault();
    if (!tripName) return;
    setSubmitting(true);
    try {
      const newTrip = await createTrip({
        name: tripName,
        destination_id: destinationId,
        start_date: startDate || null
      });
      onClose();
      router.push(`/trips/${newTrip.id}`);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="glass-card relative w-full max-w-md bg-[#0D1B2A]/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#07111F]/50">
          <h2 className="text-xl font-heading font-bold text-[#F8FAFC]">Add to Trip</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {view === 'select' ? (
            <div>
              <button 
                onClick={() => setView('create')}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-[#22D3A7]/50 text-[#22D3A7] hover:bg-[#22D3A7]/10 transition-all font-semibold mb-6"
              >
                <Plus className="w-5 h-5" /> Create New Trip
              </button>

              <h3 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Or add to existing</h3>
              
              {loading ? (
                <div className="flex justify-center py-8"><div className="w-8 h-8 border-2 border-[#22D3A7]/20 border-t-[#22D3A7] rounded-full animate-spin" /></div>
              ) : trips.length === 0 ? (
                <div className="text-center py-8 text-[#94A3B8]">
                  <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>You don't have any upcoming trips.</p>
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                  {trips.map(trip => (
                    <button 
                      key={trip.id}
                      onClick={() => handleSelectTrip(trip)}
                      disabled={submitting}
                      className="w-full text-left glass-card p-4 rounded-xl hover:bg-white/10 hover:border-[#22D3A7]/50 transition-all group disabled:opacity-50"
                    >
                      <h4 className="font-bold text-[#F8FAFC] mb-1 group-hover:text-[#22D3A7] transition-colors">{trip.name}</h4>
                      <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {trip.destination_name || 'No destination'}</span>
                        {trip.start_date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(trip.start_date).toLocaleDateString()}</span>}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleCreateTrip} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Trip Name</label>
                <input 
                  type="text" 
                  value={tripName}
                  onChange={e => setTripName(e.target.value)}
                  placeholder="e.g., Summer in Europe"
                  required
                  className="w-full bg-[#07111F]/50 border border-white/10 rounded-xl px-4 py-3 text-[#F8FAFC] placeholder:text-[#94A3B8] focus:border-[#22D3A7] focus:ring-1 focus:ring-[#22D3A7] outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Start Date (Optional)</label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full bg-[#07111F]/50 border border-white/10 rounded-xl px-4 py-3 text-[#F8FAFC] outline-none focus:border-[#22D3A7] transition-all [color-scheme:dark]"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setView('select')}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-[#F8FAFC] font-semibold hover:bg-white/5 transition-colors"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  disabled={!tripName || submitting}
                  className="flex-1 py-3 rounded-xl gradient-btn font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Creating...' : 'Create Trip'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
