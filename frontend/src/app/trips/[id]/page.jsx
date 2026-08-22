'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { getTrip } from '@/lib/api';

const TYPE_ICON = { travel: '✈️', hotel: '🏨', activity: '🎯', food: '🍜', sightseeing: '🏛️', shopping: '🛍️', other: '📌' };

export default function ItineraryViewPage({ params }) {
  const { id } = use(params);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try { setTrip(await getTrip(id)); } catch {}
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-3 border-white/[0.08] border-t-teal-400 rounded-full animate-spin" /></div>;
  if (!trip) return <div className="text-center py-20 text-white/40">Trip not found</div>;

  const days = {};
  (trip.sections || []).forEach((s) => {
    const day = s.day_number || 1;
    if (!days[day]) days[day] = [];
    days[day].push(s);
  });

  const totalBudget = (trip.sections || []).reduce((sum, s) => sum + (s.budget || 0), 0);
  const totalExpense = (trip.sections || []).reduce((sum, s) => sum + (s.actual_expense || 0), 0);

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-heading font-bold">Itinerary for <span className="gradient-text">{trip.destination_name || trip.name}</span></h1>
        <Link href={`/trips/${id}/build`} className="px-4 py-2 rounded-xl text-sm gradient-btn font-semibold">✏️ Edit</Link>
      </div>
      <div className="flex gap-6 mb-8 text-sm text-white/50">
        <span>📅 {trip.start_date} → {trip.end_date}</span>
        <span>💰 Budget: <span className="text-teal-400 font-bold">${totalBudget}</span></span>
        <span>💸 Spent: <span className="text-red-400 font-bold">${totalExpense}</span></span>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 glass-card mb-8">
        <div className="flex-1 min-w-[200px] relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
          <input type="text" placeholder="Search sections..." className="w-full py-2 pl-10 pr-4 bg-white/[0.06] border border-transparent rounded-xl text-white text-sm outline-none" />
        </div>
      </div>

      {/* Day-wise sections */}
      {Object.entries(days).sort(([a], [b]) => a - b).map(([dayNum, daySections]) => (
        <div key={dayNum} className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/[0.06] border border-white/[0.08] rounded-xl mb-4">
            <span className="font-heading font-bold">Day {dayNum}</span>
          </div>

          <div className="space-y-3">
            {daySections.map((section) => (
              <div key={section.id} className="glass-card p-5 flex items-stretch gap-6">
                {/* Physical Activity */}
                <div className="flex-1">
                  <div className="text-xs text-white/30 uppercase tracking-wider mb-2">Physical Activity</div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.08] flex items-center justify-center text-lg">{TYPE_ICON[section.section_type] || '📌'}</div>
                    <div>
                      <div className="font-semibold">{section.name}</div>
                      <div className="text-xs text-white/40">{section.description || section.location || '—'}</div>
                    </div>
                  </div>
                  {section.date_from && (
                    <div className="text-xs text-white/30 mt-1">📅 {section.date_from}{section.date_to ? ` — ${section.date_to}` : ''}</div>
                  )}
                </div>
                {/* Expense */}
                <div className="w-[160px] border-l border-white/[0.06] pl-6 flex flex-col justify-center">
                  <div className="text-xs text-white/30 uppercase tracking-wider mb-2">Expense</div>
                  <div className="text-lg font-bold text-teal-400">${section.budget || 0}</div>
                  {section.actual_expense > 0 && (
                    <div className="text-xs text-red-400">Spent: ${section.actual_expense}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {Object.keys(days).length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-3 opacity-40">📋</div>
          <p className="text-white/40 mb-4">No sections yet.</p>
          <Link href={`/trips/${id}/build`} className="gradient-btn px-6 py-2 rounded-xl font-bold inline-block">+ Build Itinerary</Link>
        </div>
      )}
    </div>
  );
}
