'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { getTrip, createSection, updateSection, deleteSection } from '@/lib/api';
import { useToast } from '@/components/Toast';

const SECTION_TYPES = [
  { value: 'travel', icon: '✈️', label: 'Travel' },
  { value: 'hotel', icon: '🏨', label: 'Hotel' },
  { value: 'activity', icon: '🎯', label: 'Activity' },
  { value: 'food', icon: '🍜', label: 'Food' },
  { value: 'sightseeing', icon: '🏛️', label: 'Sightseeing' },
  { value: 'shopping', icon: '🛍️', label: 'Shopping' },
  { value: 'other', icon: '📌', label: 'Other' },
];

const TYPE_ICON_MAP = Object.fromEntries(SECTION_TYPES.map((t) => [t.value, t.icon]));

export default function BuildItineraryPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const showToast = useToast();
  const [trip, setTrip] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newSection, setNewSection] = useState({ name: '', description: '', section_type: 'activity', budget: 0, day_number: 1, date_from: '', date_to: '', location: '' });

  useEffect(() => { loadTrip(); }, []);

  async function loadTrip() {
    try {
      const data = await getTrip(id);
      setTrip(data);
      setSections(data.sections || []);
    } catch { showToast('Failed to load trip', 'error'); }
    setLoading(false);
  }

  async function handleAddSection() {
    if (!newSection.name) { showToast('Section name required', 'error'); return; }
    setAdding(true);
    try {
      const section = await createSection({ trip_id: parseInt(id), ...newSection, sequence: (sections.length + 1) * 10 });
      setSections((prev) => [...prev, section]);
      setNewSection({ name: '', description: '', section_type: 'activity', budget: 0, day_number: 1, date_from: '', date_to: '', location: '' });
      showToast('Section added! ✅', 'success');
    } catch (err) { showToast(err.message, 'error'); }
    setAdding(false);
  }

  async function handleDeleteSection(sectionId) {
    try {
      await deleteSection(sectionId);
      setSections((prev) => prev.filter((s) => s.id !== sectionId));
      showToast('Section removed', 'success');
    } catch { showToast('Failed to delete', 'error'); }
  }

  const totalBudget = sections.reduce((sum, s) => sum + (s.budget || 0), 0);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-3 border-white/[0.08] border-t-teal-400 rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold">Build <span className="gradient-text">Itinerary</span></h1>
          {trip && <p className="text-white/50 text-sm mt-1">{trip.name} · {trip.destination_name}</p>}
        </div>
        <div className="text-right">
          <div className="text-xs text-white/40">Total Budget</div>
          <div className="text-xl font-bold text-teal-400">${totalBudget.toFixed(0)}</div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4 mb-8">
        {sections.map((section, i) => (
          <div key={section.id} className="glass-card p-6 animate-slide-up group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center text-lg">{TYPE_ICON_MAP[section.section_type] || '📌'}</div>
                <div>
                  <div className="font-heading font-bold text-lg">Section {i + 1}: <span className="text-teal-400">{section.name}</span></div>
                  <p className="text-xs text-white/40 mt-0.5">{section.description || 'All the necessary information about this section. This can be anything like travel section, hotel or any other activity'}</p>
                </div>
              </div>
              <button onClick={() => handleDeleteSection(section.id)} className="text-red-400/50 hover:text-red-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl">
                <span className="text-xs text-white/40">Date Range:</span>
                <span className="text-xs font-semibold">{section.date_from || 'xxx'} to {section.date_to || 'yyy'}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl">
                <span className="text-xs text-white/40">Budget of this section</span>
                <span className="text-xs font-bold text-teal-400">${section.budget || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Section Form */}
      <div className="glass-card p-6 border-dashed border-white/20">
        <h3 className="font-heading font-bold mb-4">+ Add another Section</h3>
        <div className="space-y-4">
          <input type="text" placeholder="Section name (e.g., Hotel Stay, Sightseeing)" value={newSection.name}
            onChange={(e) => setNewSection({ ...newSection, name: e.target.value })} className="gt-input py-3" />
          <textarea placeholder="Description..." value={newSection.description}
            onChange={(e) => setNewSection({ ...newSection, description: e.target.value })} className="gt-input py-3 min-h-[60px] resize-y" />
          <div className="flex gap-2 flex-wrap">
            {SECTION_TYPES.map((t) => (
              <button key={t.value} onClick={() => setNewSection({ ...newSection, section_type: t.value })}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all
                  ${newSection.section_type === t.value ? 'text-teal-400 border-teal-400 bg-teal-400/15' : 'text-white/50 border-white/[0.08] bg-white/[0.06]'}`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-white/40 mb-1">Date From</label>
              <input type="date" value={newSection.date_from} onChange={(e) => setNewSection({ ...newSection, date_from: e.target.value })} className="gt-input py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Date To</label>
              <input type="date" value={newSection.date_to} onChange={(e) => setNewSection({ ...newSection, date_to: e.target.value })} className="gt-input py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Budget ($)</label>
              <input type="number" min="0" value={newSection.budget} onChange={(e) => setNewSection({ ...newSection, budget: parseFloat(e.target.value) || 0 })} className="gt-input py-2 text-sm" />
            </div>
          </div>
          <button onClick={handleAddSection} disabled={adding}
            className="w-full py-3 rounded-xl font-bold gradient-btn hover:-translate-y-0.5 transition-all disabled:opacity-50">
            {adding ? 'Adding...' : '+ Add another Section'}
          </button>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button onClick={() => router.push(`/trips/${id}`)} className="px-6 py-2 rounded-xl font-semibold gradient-btn">View Itinerary →</button>
      </div>
    </div>
  );
}
