'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createTrip, getAISuggestions } from '@/lib/api';
import { useToast } from '@/components/Toast';

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
  const [saving, setSaving] = useState(false);

  const update = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  async function fetchSuggestions() {
    if (!form.destination_name) { showToast('Enter a destination first', 'error'); return; }
    setAiLoading(true);
    try {
      const res = await getAISuggestions({
        destination: form.destination_name,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      });
      setSuggestions(res.suggestions);
      showToast('AI suggestions loaded! ✨', 'success');
    } catch { showToast('Could not fetch suggestions', 'error'); }
    setAiLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name) { showToast('Trip name is required', 'error'); return; }
    setSaving(true);
    try {
      const trip = await createTrip(form);
      showToast('Trip created! 🎉', 'success');
      router.push(`/trips/${trip.id}/build`);
    } catch (err) { showToast(err.message, 'error'); }
    setSaving(false);
  }

  const TYPE_ICONS = { sightseeing: '🏛️', food: '🍜', nature: '🌿', adventure: '🧗', activity: '🎯', shopping: '🛍️' };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 animate-fade-in">
      <h1 className="text-3xl font-heading font-bold mb-2">Create a <span className="gradient-text">New Trip</span></h1>
      <p className="text-white/50 text-sm mb-8">Plan your next adventure. Fill in the details below and let AI help you discover amazing experiences.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="glass-card p-8">
          <h2 className="text-xl font-heading font-bold mb-6">📋 Plan a new trip</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">Trip Name *</label>
              <input type="text" placeholder="e.g., European Summer 2026" value={form.name} onChange={(e) => update('name', e.target.value)} className="gt-input py-3" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">Select a Place</label>
              <input type="text" placeholder="e.g., Paris, Tokyo, Bali..." value={form.destination_name} onChange={(e) => update('destination_name', e.target.value)} className="gt-input py-3" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">Start Date</label>
                <input type="date" value={form.start_date} onChange={(e) => update('start_date', e.target.value)} className="gt-input py-3" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">End Date</label>
                <input type="date" value={form.end_date} onChange={(e) => update('end_date', e.target.value)} className="gt-input py-3" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">Travelers</label>
                <input type="number" min="1" value={form.travelers_count} onChange={(e) => update('travelers_count', parseInt(e.target.value) || 1)} className="gt-input py-3" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">Budget ($)</label>
                <input type="number" min="0" value={form.total_budget} onChange={(e) => update('total_budget', parseFloat(e.target.value) || 0)} className="gt-input py-3" />
              </div>
            </div>
            <button type="button" onClick={fetchSuggestions} disabled={aiLoading}
              className="w-full py-3 rounded-xl font-semibold border border-teal-400/40 text-teal-400 bg-teal-400/10 hover:bg-teal-400/20 transition-all disabled:opacity-50">
              {aiLoading ? '🤖 AI is thinking...' : '✨ Get AI Suggestions'}
            </button>
            <button type="submit" disabled={saving}
              className="w-full py-3 rounded-xl font-bold gradient-btn hover:-translate-y-0.5 transition-all disabled:opacity-50">
              {saving ? 'Creating...' : '🚀 Create Trip & Build Itinerary'}
            </button>
          </form>
        </div>

        {/* AI Suggestions */}
        <div>
          <h2 className="text-xl font-heading font-bold mb-6">✨ Suggestion for Places to Visit/Activities</h2>
          {!suggestions ? (
            <div className="glass-card p-12 text-center">
              <div className="text-5xl mb-4 opacity-30">🤖</div>
              <p className="text-white/40 text-sm">Enter a destination and click &quot;Get AI Suggestions&quot; to get personalized recommendations.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {suggestions.suggested_places?.map((place, i) => (
                  <div key={i} className="glass-card p-4 hover:glass-card-hover cursor-pointer">
                    <div className="text-2xl mb-2">{TYPE_ICONS[place.type] || '🎯'}</div>
                    <div className="text-sm font-semibold mb-1">{place.name}</div>
                    <div className="text-xs text-white/40 line-clamp-2 mb-2">{place.description}</div>
                    <div className="flex justify-between text-xs">
                      <span className="text-teal-400">${place.estimated_cost}</span>
                      <span className="text-white/30">{place.duration_hours}h</span>
                    </div>
                  </div>
                ))}
              </div>
              {suggestions.budget_breakdown && (
                <div className="glass-card p-5">
                  <div className="font-heading font-bold mb-3 text-sm">💰 Daily Budget Breakdown</div>
                  {Object.entries(suggestions.budget_breakdown).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center py-1.5 border-b border-white/[0.04] last:border-0">
                      <span className="text-white/60 text-sm capitalize">{key}</span>
                      <span className="text-teal-400 font-semibold text-sm">${val}</span>
                    </div>
                  ))}
                </div>
              )}
              {suggestions.travel_tips && (
                <div className="glass-card p-5">
                  <div className="font-heading font-bold mb-3 text-sm">💡 Travel Tips</div>
                  {suggestions.travel_tips.map((tip, i) => (
                    <div key={i} className="text-xs text-white/50 py-1.5 border-b border-white/[0.04] last:border-0">• {tip}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CreateTripPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="w-10 h-10 border-3 border-white/[0.08] border-t-teal-400 rounded-full animate-spin" /></div>}>
      <CreateTripForm />
    </Suspense>
  );
}
