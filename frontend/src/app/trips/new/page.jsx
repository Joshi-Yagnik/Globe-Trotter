'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createTrip, getAISuggestions } from '@/lib/api';
import { useToast } from '@/components/Toast';
import { Sparkles, MapPin, Calendar, Users, DollarSign, List, Briefcase, Camera, Wine, Sunrise, Plus, Route, FileText, CheckCircle2 } from 'lucide-react';

function CreateTripForm() {
  const router = useRouter();
  const params = useSearchParams();
  const showToast = useToast();
  const [form, setForm] = useState({
    name: '', destination_name: params.get('name') || '', destination_id: params.get('dest') || '',
    start_date: '', end_date: '', travelers_count: 1, total_budget: 0, notes: '',
  });
  const [suggestions, setSuggestions] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const update = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  useEffect(() => {
    let interval;
    if (aiLoading) {
      interval = setInterval(() => {
        setLoadingStep(s => (s + 1) % 4);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [aiLoading]);

  const LOADING_MESSAGES = [
    "Analyzing destination...",
    "Optimizing your route...",
    "Balancing your budget...",
    "Creating your itinerary..."
  ];

  async function fetchSuggestions() {
    if (!form.destination_name) { showToast('Enter a destination first', 'error'); return; }
    setAiLoading(true); setLoadingStep(0);
    try {
      const res = await getAISuggestions({
        destination: form.destination_name,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      });
      setSuggestions(res.suggestions);
      showToast('AI suggestions loaded! ✨', 'success');
    } catch { showToast('Could not fetch suggestions. Trying fallback...', 'error'); }
    setAiLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.destination_name) { showToast('Trip name and destination are required', 'error'); return; }
    setSaving(true);
    try {
      const trip = await createTrip(form);
      showToast('Trip created! 🎉', 'success');
      router.push(`/trips/${trip.id}/build`);
    } catch (err) { showToast(err.message, 'error'); }
    setSaving(false);
  }

  const TYPE_ICONS = { sightseeing: <Camera className="w-5 h-5 text-[#22D3A7]" />, food: <Wine className="w-5 h-5 text-[#FFB86B]" />, nature: <Sunrise className="w-5 h-5 text-[#22D3A7]" />, adventure: <Briefcase className="w-5 h-5 text-[#7C5CFC]" /> };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 animate-fade-in pb-20">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-heading font-bold mb-3">Plan your <span className="gradient-text">Journey</span></h1>
        <p className="text-[#94A3B8] text-base">Design your next adventure. Define your parameters and let our AI intelligence craft the perfect travel experience.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#22D3A7]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            
            <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2 text-[#F8FAFC]">
              <FileText className="w-5 h-5 text-[#22D3A7]" />
              Trip Details
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">Trip Name *</label>
                <div className="relative">
                  <input type="text" placeholder="e.g., Summer in Kyoto" value={form.name} onChange={(e) => update('name', e.target.value)} className="gt-input py-3.5 pl-4" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input type="text" placeholder="e.g., Paris, Tokyo, Bali..." value={form.destination_name} onChange={(e) => update('destination_name', e.target.value)} className="gt-input py-3.5 pl-11" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">Start Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <input type="date" value={form.start_date} onChange={(e) => update('start_date', e.target.value)} className="gt-input py-3.5 pl-11 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">End Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <input type="date" value={form.end_date} onChange={(e) => update('end_date', e.target.value)} className="gt-input py-3.5 pl-11 text-sm" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">Travelers</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <input type="number" min="1" value={form.travelers_count} onChange={(e) => update('travelers_count', parseInt(e.target.value) || 1)} className="gt-input py-3.5 pl-11" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">Total Budget ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <input type="number" min="0" value={form.total_budget} onChange={(e) => update('total_budget', parseFloat(e.target.value) || 0)} className="gt-input py-3.5 pl-11" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-4">
                <button type="button" onClick={fetchSuggestions} disabled={aiLoading || !form.destination_name}
                  className="w-full py-4 rounded-xl font-semibold border border-[#22D3A7]/30 text-[#22D3A7] bg-[#22D3A7]/5 hover:bg-[#22D3A7]/15 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group">
                  <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Generate AI Intelligence
                </button>
                
                <button type="submit" disabled={saving}
                  className="w-full py-4 rounded-xl font-bold gradient-btn hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? (
                    <span className="w-5 h-5 border-2 border-[#07111F]/30 border-t-[#07111F] rounded-full animate-spin" />
                  ) : (
                    <>
                      <Route className="w-5 h-5" />
                      Create Itinerary
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* AI Suggestions Section */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-bold flex items-center gap-2 text-[#F8FAFC]">
              <Sparkles className="w-5 h-5 text-[#7C5CFC]" />
              AI Intelligence Panel
            </h2>
          </div>

          {aiLoading ? (
            <div className="glass-card p-16 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 border-t-2 border-[#22D3A7] rounded-full animate-spin" />
                <div className="absolute inset-2 border-r-2 border-[#7C5CFC] rounded-full animate-[spin_1.5s_linear_infinite_reverse]" />
                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-[#FFB86B] animate-pulse" />
              </div>
              <h3 className="text-[#F8FAFC] font-heading font-bold text-xl mb-2 animate-fade-in">{LOADING_MESSAGES[loadingStep]}</h3>
              <p className="text-[#94A3B8] text-sm max-w-xs mx-auto">Our AI is analyzing millions of data points to craft your personalized travel experience.</p>
            </div>
          ) : !suggestions ? (
            <div className="glass-card p-16 text-center flex flex-col items-center justify-center min-h-[400px] border-dashed border-2 border-white/5">
              <div className="w-20 h-20 rounded-full bg-[#132238] flex items-center justify-center mb-6 shadow-inner">
                <Sparkles className="w-10 h-10 text-[#94A3B8]" />
              </div>
              <h3 className="text-[#F8FAFC] font-heading font-bold text-xl mb-2">Awaiting Parameters</h3>
              <p className="text-[#94A3B8] text-sm max-w-md mx-auto">Enter a destination and click &quot;Generate AI Intelligence&quot; to receive curated activities, budget breakdowns, and travel insights.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.suggested_places?.map((place, i) => (
                  <div key={i} className="glass-card p-5 hover:glass-card-hover group flex flex-col h-full border border-white/5 relative overflow-hidden transition-all duration-300">
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-10 h-10 rounded-lg bg-[#0D1B2A] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                        {TYPE_ICONS[place.type] || <MapPin className="w-5 h-5 text-[#22D3A7]" />}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] bg-[#132238] px-2 py-1 rounded-md">{place.type || 'Activity'}</span>
                    </div>
                    <h4 className="text-[#F8FAFC] font-bold text-lg mb-2 group-hover:text-[#22D3A7] transition-colors">{place.name}</h4>
                    <p className="text-[#94A3B8] text-sm mb-4 line-clamp-3 flex-1">{place.description}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#94A3B8] uppercase font-semibold">Est. Cost</span>
                        <span className="text-[#22D3A7] font-bold">${place.estimated_cost}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[10px] text-[#94A3B8] uppercase font-semibold">Duration</span>
                        <span className="text-[#F8FAFC] font-bold">{place.duration_hours}h</span>
                      </div>
                    </div>
                    <button className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-[#22D3A7] text-[#07111F] hover:scale-110 shadow-lg">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {suggestions.budget_breakdown && (
                  <div className="glass-card p-6 border-l-2 border-l-[#FFB86B]">
                    <h4 className="font-heading font-bold mb-4 text-[#F8FAFC] flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-[#FFB86B]" />
                      Daily Budget Analysis
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(suggestions.budget_breakdown).map(([key, val]) => (
                        <div key={key} className="flex justify-between items-center group">
                          <span className="text-[#94A3B8] text-sm capitalize flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB86B]/50 group-hover:bg-[#FFB86B] transition-colors" />
                            {key}
                          </span>
                          <span className="text-[#F8FAFC] font-semibold text-sm">${val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {suggestions.travel_tips && (
                  <div className="glass-card p-6 border-l-2 border-l-[#7C5CFC]">
                    <h4 className="font-heading font-bold mb-4 text-[#F8FAFC] flex items-center gap-2">
                      <List className="w-5 h-5 text-[#7C5CFC]" />
                      Local Insights
                    </h4>
                    <div className="space-y-3">
                      {suggestions.travel_tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#7C5CFC] shrink-0 mt-0.5" />
                          <span className="text-xs text-[#94A3B8] leading-relaxed">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CreateTripPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-32"><div className="w-12 h-12 border-4 border-white/[0.08] border-t-[#22D3A7] rounded-full animate-spin" /></div>}>
      <CreateTripForm />
    </Suspense>
  );
}
