'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { getTrip } from '@/lib/api';
import { Plane, Hotel, Target, Utensils, Camera, ShoppingBag, MapPin, Edit3, Calendar, DollarSign, Wallet, Search, Clock, Plus, ArrowLeft } from 'lucide-react';

const TYPE_ICON = { 
  travel: <Plane className="w-5 h-5 text-[#7C5CFC]" />, 
  hotel: <Hotel className="w-5 h-5 text-[#22D3A7]" />, 
  activity: <Target className="w-5 h-5 text-[#FFB86B]" />, 
  food: <Utensils className="w-5 h-5 text-[#FF4A4A]" />, 
  sightseeing: <Camera className="w-5 h-5 text-[#22D3A7]" />, 
  shopping: <ShoppingBag className="w-5 h-5 text-[#FFB86B]" />, 
  other: <MapPin className="w-5 h-5 text-[#94A3B8]" /> 
};

export default function ItineraryViewPage({ params }) {
  const { id } = use(params);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function load() {
      try { setTrip(await getTrip(id)); } catch {}
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <div className="flex justify-center py-32"><div className="w-12 h-12 border-4 border-[#22D3A7]/20 border-t-[#22D3A7] rounded-full animate-spin" /></div>;
  if (!trip) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-6">
      <div className="w-24 h-24 rounded-full bg-[#132238] flex items-center justify-center mb-6 shadow-inner">
        <MapPin className="w-10 h-10 text-[#94A3B8]/50" />
      </div>
      <h2 className="text-2xl font-bold text-[#F8FAFC] mb-2">Trip Not Found</h2>
      <p className="text-[#94A3B8] max-w-md mb-8">We couldn't locate the itinerary you're looking for. It may have been deleted or the link is invalid.</p>
      <Link href="/trips" className="gradient-btn px-8 py-3 rounded-xl font-bold">Back to My Trips</Link>
    </div>
  );

  const days = {};
  const allSections = trip.sections || [];
  
  const filteredSections = allSections.filter(s => 
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  filteredSections.forEach((s) => {
    const day = s.day_number || 1;
    if (!days[day]) days[day] = [];
    days[day].push(s);
  });

  const totalBudget = allSections.reduce((sum, s) => sum + (s.budget || 0), 0);
  const totalExpense = allSections.reduce((sum, s) => sum + (s.actual_expense || 0), 0);
  const tripBudget = trip.total_budget || 0;
  
  const budgetUtilization = tripBudget > 0 ? (totalBudget / tripBudget) * 100 : 0;
  const isOverBudget = totalBudget > tripBudget;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 animate-fade-in pb-24">
      <Link href={`/trips/${id}/build`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#94A3B8] hover:text-[#22D3A7] mb-8 transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Builder
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-heading font-bold mb-3 text-[#F8FAFC]">Itinerary for <span className="gradient-text">{trip.destination_name || trip.name}</span></h1>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#07111F]/50 border border-white/5 rounded-lg text-[#94A3B8]">
              <Calendar className="w-4 h-4 text-[#7C5CFC]" />
              <span className="font-semibold text-[#F8FAFC]">{trip.start_date || 'TBD'}</span> → <span className="font-semibold text-[#F8FAFC]">{trip.end_date || 'TBD'}</span>
            </div>
          </div>
        </div>
        
        <Link href={`/trips/${id}/build`} className="px-6 py-3 rounded-xl text-sm gradient-btn font-bold flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all w-full md:w-auto shadow-[0_4px_20px_rgba(34,211,167,0.3)]">
          <Edit3 className="w-4 h-4" /> Edit Itinerary
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-card p-6 flex items-center gap-4 border-l-2 border-l-[#22D3A7]">
          <div className="w-12 h-12 rounded-xl bg-[#22D3A7]/10 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-[#22D3A7]" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-1">Total Budget</div>
            <div className="text-2xl font-bold text-[#F8FAFC]">${tripBudget.toFixed(0)}</div>
          </div>
        </div>
        
        <div className="glass-card p-6 flex items-center gap-4 border-l-2 border-l-[#7C5CFC]">
          <div className="w-12 h-12 rounded-xl bg-[#7C5CFC]/10 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-[#7C5CFC]" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-1">Planned Cost</div>
            <div className="text-2xl font-bold text-[#F8FAFC]">${totalBudget.toFixed(0)}</div>
          </div>
        </div>
        
        <div className={`glass-card p-6 flex items-center gap-4 border-l-2 ${totalExpense > tripBudget ? 'border-l-[#FF4A4A]' : 'border-l-[#FFB86B]'}`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${totalExpense > tripBudget ? 'bg-[#FF4A4A]/10' : 'bg-[#FFB86B]/10'}`}>
            <DollarSign className={`w-6 h-6 ${totalExpense > tripBudget ? 'text-[#FF4A4A]' : 'text-[#FFB86B]'}`} />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-1">Actual Spent</div>
            <div className={`text-2xl font-bold ${totalExpense > tripBudget ? 'text-[#FF4A4A]' : 'text-[#F8FAFC]'}`}>${totalExpense.toFixed(0)}</div>
          </div>
        </div>
      </div>

      {tripBudget > 0 && (
        <div className="mb-10 px-2">
          <div className="flex justify-between text-xs font-bold mb-2">
            <span className="text-[#94A3B8] uppercase tracking-wider">Budget Allocation</span>
            <span className={isOverBudget ? 'text-[#FF4A4A]' : 'text-[#22D3A7]'}>{budgetUtilization.toFixed(0)}% Used</span>
          </div>
          <div className="w-full h-2 bg-[#132238] rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${isOverBudget ? 'bg-[#FF4A4A]' : budgetUtilization > 75 ? 'bg-[#FFB86B]' : 'bg-[#22D3A7]'}`}
              style={{ width: `${Math.min(budgetUtilization, 100)}%` }} 
            />
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="glass-card p-2 mb-10 sticky top-20 z-30 shadow-2xl backdrop-blur-xl bg-[#0D1B2A]/80 border border-white/10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
          <input type="text" placeholder="Search itinerary blocks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3.5 pl-12 pr-4 bg-transparent border-none text-[#F8FAFC] text-sm outline-none focus:ring-0" />
        </div>
      </div>

      {/* Day-wise sections */}
      {Object.entries(days).sort(([a], [b]) => a - b).map(([dayNum, daySections]) => (
        <div key={dayNum} className="mb-12 relative before:absolute before:inset-0 before:ml-[1.125rem] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#22D3A7]/50 before:via-white/10 before:to-transparent">
          <div className="sticky top-[140px] z-20 flex items-center gap-4 mb-6 pt-2 bg-[#07111F]/90 backdrop-blur-md pb-2 -mx-2 px-2">
            <div className="w-9 h-9 rounded-full bg-[#22D3A7] text-[#07111F] flex items-center justify-center font-bold shadow-[0_0_15px_rgba(34,211,167,0.4)] z-10 shrink-0">
              {dayNum}
            </div>
            <h2 className="text-2xl font-heading font-bold text-[#F8FAFC]">Day {dayNum}</h2>
          </div>

          <div className="space-y-4 pl-[3.25rem]">
            {daySections.map((section) => (
              <div key={section.id} className="glass-card p-6 flex flex-col md:flex-row md:items-stretch gap-6 hover:glass-card-hover transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#22D3A7]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Physical Activity */}
                <div className="flex-1 relative z-10">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-widest bg-white/5 px-2 py-1 rounded-md">Event Block</span>
                    {section.date_from && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#22D3A7] bg-[#22D3A7]/10 px-2.5 py-1 rounded-md">
                        <Calendar className="w-3.5 h-3.5" />
                        {section.date_from}{section.date_to ? ` - ${section.date_to}` : ''}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-[#07111F]/50 flex items-center justify-center border border-white/5 shadow-inner shrink-0 group-hover:scale-110 transition-transform">
                      {TYPE_ICON[section.section_type] || <MapPin className="w-5 h-5 text-[#94A3B8]" />}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-xl text-[#F8FAFC] mb-1 group-hover:text-[#22D3A7] transition-colors">{section.name}</h3>
                      <p className="text-sm text-[#94A3B8] leading-relaxed">{section.description || section.location || 'No additional details provided.'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Expense */}
                <div className="md:w-[200px] md:border-l border-t md:border-t-0 border-white/10 md:pl-6 pt-4 md:pt-0 flex flex-col justify-center relative z-10">
                  <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Cost Analysis</div>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-[#22D3A7] font-bold text-2xl leading-none">${section.budget || 0}</span>
                    <span className="text-xs text-[#94A3B8] pb-0.5">Est.</span>
                  </div>
                  {section.actual_expense > 0 && (
                    <div className="flex items-center gap-1.5 mt-2 px-2.5 py-1.5 bg-[#FF4A4A]/10 rounded-md border border-[#FF4A4A]/20">
                      <Wallet className="w-3.5 h-3.5 text-[#FF4A4A]" />
                      <span className="text-xs font-bold text-[#FF4A4A]">Spent: ${section.actual_expense}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {Object.keys(days).length === 0 && (
        <div className="glass-card p-16 text-center flex flex-col items-center justify-center min-h-[400px] border-dashed border-2 border-white/5 mt-8">
          <div className="w-20 h-20 rounded-full bg-[#132238] flex items-center justify-center mb-6 shadow-inner">
            <Calendar className="w-10 h-10 text-[#94A3B8]" />
          </div>
          <h3 className="text-[#F8FAFC] font-heading font-bold text-2xl mb-2">Empty Itinerary</h3>
          <p className="text-[#94A3B8] text-sm max-w-md mx-auto mb-8">This trip doesn't have any planned blocks yet. Start building your itinerary by adding your first event.</p>
          <Link href={`/trips/${id}/build`} className="gradient-btn px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:-translate-y-0.5 transition-all shadow-lg">
            <Plus className="w-5 h-5" /> Start Building
          </Link>
        </div>
      )}
    </div>
  );
}
