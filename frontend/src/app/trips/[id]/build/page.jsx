'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { getTrip, createSection, updateSection, deleteSection } from '@/lib/api';
import { useToast } from '@/components/Toast';
import { Plane, Hotel, Target, Utensils, Camera, ShoppingBag, MapPin, Plus, Trash2, Calendar, DollarSign, AlignLeft, ArrowRight, Wallet, CheckCircle2 } from 'lucide-react';

const SECTION_TYPES = [
  { value: 'travel', icon: <Plane className="w-4 h-4" />, label: 'Travel', color: 'text-[#7C5CFC]' },
  { value: 'hotel', icon: <Hotel className="w-4 h-4" />, label: 'Hotel', color: 'text-[#22D3A7]' },
  { value: 'activity', icon: <Target className="w-4 h-4" />, label: 'Activity', color: 'text-[#FFB86B]' },
  { value: 'food', icon: <Utensils className="w-4 h-4" />, label: 'Food', color: 'text-[#FF4A4A]' },
  { value: 'sightseeing', icon: <Camera className="w-4 h-4" />, label: 'Sightseeing', color: 'text-[#22D3A7]' },
  { value: 'shopping', icon: <ShoppingBag className="w-4 h-4" />, label: 'Shopping', color: 'text-[#FFB86B]' },
  { value: 'other', icon: <MapPin className="w-4 h-4" />, label: 'Other', color: 'text-[#94A3B8]' },
];

const TYPE_ICON_MAP = Object.fromEntries(SECTION_TYPES.map((t) => [t.value, t.icon]));
const TYPE_COLOR_MAP = Object.fromEntries(SECTION_TYPES.map((t) => [t.value, t.color]));

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
  const tripBudget = trip?.total_budget || 0;
  const budgetPercentage = tripBudget > 0 ? (totalBudget / tripBudget) * 100 : 0;

  if (loading) return <div className="flex justify-center py-32"><div className="w-12 h-12 border-4 border-[#22D3A7]/20 border-t-[#22D3A7] rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-8 animate-fade-in pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#94A3B8] mb-4 uppercase tracking-wider">
            <MapPin className="w-3 h-3 text-[#22D3A7]" /> Itinerary Builder
          </div>
          <h1 className="text-4xl font-heading font-bold text-[#F8FAFC]">Construct <span className="gradient-text">Journey</span></h1>
          {trip && (
            <div className="flex items-center gap-2 text-[#94A3B8] text-sm mt-3">
              <span className="font-bold text-[#F8FAFC]">{trip.name}</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>{trip.destination_name}</span>
            </div>
          )}
        </div>
        
        <div className="glass-card p-4 min-w-[240px]">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] uppercase font-bold tracking-wider">
              <Wallet className="w-3.5 h-3.5" /> Budget Usage
            </div>
            <div className="text-xl font-bold text-[#22D3A7]">${totalBudget.toFixed(0)}</div>
          </div>
          <div className="w-full h-2 bg-[#132238] rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${budgetPercentage > 90 ? 'bg-[#FF4A4A]' : budgetPercentage > 75 ? 'bg-[#FFB86B]' : 'bg-[#22D3A7]'}`}
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }} 
            />
          </div>
          <div className="text-right mt-1 text-[10px] text-[#94A3B8]">
            of ${tripBudget.toFixed(0)} allocated
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sections Timeline */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-bold text-[#F8FAFC] flex items-center gap-2">
              <AlignLeft className="w-5 h-5 text-[#22D3A7]" />
              Timeline Events
            </h2>
            <span className="text-sm font-bold text-[#94A3B8] bg-white/5 px-3 py-1 rounded-full">{sections.length} blocks</span>
          </div>

          {sections.length === 0 ? (
            <div className="glass-card p-12 text-center border-dashed border-2 border-white/5 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#132238] flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-[#94A3B8]/50" />
              </div>
              <h3 className="text-[#F8FAFC] font-bold text-lg mb-2">Empty Itinerary</h3>
              <p className="text-[#94A3B8] text-sm">Add your first section below to start building your journey.</p>
            </div>
          ) : (
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#22D3A7]/50 before:via-white/10 before:to-transparent">
              {sections.map((section, i) => (
                <div key={section.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#07111F] bg-[#132238] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-4 md:left-1/2 z-10">
                    <div className="w-2 h-2 bg-[#22D3A7] rounded-full" />
                  </div>
                  
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2rem)] ml-auto md:ml-0 glass-card p-5 hover:glass-card-hover transition-all duration-300 relative">
                    <button onClick={() => handleDeleteSection(section.id)} className="absolute top-4 right-4 w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-[#94A3B8] hover:text-[#FF4A4A] hover:bg-[#FF4A4A]/10 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-[#07111F]/50 flex items-center justify-center border border-white/5 shadow-inner ${TYPE_COLOR_MAP[section.section_type] || 'text-[#94A3B8]'}`}>
                        {TYPE_ICON_MAP[section.section_type] || <MapPin className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] mb-0.5">Block {i + 1} • {SECTION_TYPES.find(t => t.value === section.section_type)?.label || 'Activity'}</div>
                        <h3 className="font-heading font-bold text-lg text-[#F8FAFC] truncate group-hover:text-[#22D3A7] transition-colors">{section.name}</h3>
                      </div>
                    </div>
                    
                    <p className="text-sm text-[#94A3B8] mb-4 line-clamp-2">{section.description || 'No description provided.'}</p>
                    
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-white/5">
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#07111F]/50 border border-white/5 rounded-md">
                        <Calendar className="w-3.5 h-3.5 text-[#7C5CFC]" />
                        <span className="text-[10px] font-semibold text-[#F8FAFC]">{section.date_from || 'TBD'} <span className="text-[#94A3B8] font-normal mx-0.5">→</span> {section.date_to || 'TBD'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#07111F]/50 border border-white/5 rounded-md ml-auto">
                        <DollarSign className="w-3.5 h-3.5 text-[#22D3A7]" />
                        <span className="text-[11px] font-bold text-[#F8FAFC]">{section.budget || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Section Form */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-24 glass-card p-6 border-t-2 border-t-[#7C5CFC]">
            <h3 className="font-heading font-bold mb-6 text-[#F8FAFC] flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#7C5CFC]" />
              New Block
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">Block Name</label>
                <input type="text" placeholder="e.g., Check-in at Resort" value={newSection.name}
                  onChange={(e) => setNewSection({ ...newSection, name: e.target.value })} className="gt-input py-3 pl-4" />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">Category</label>
                <div className="flex gap-2 flex-wrap">
                  {SECTION_TYPES.map((t) => (
                    <button key={t.value} onClick={() => setNewSection({ ...newSection, section_type: t.value })}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border
                        ${newSection.section_type === t.value 
                          ? `border-white/20 bg-white/10 ${t.color}` 
                          : 'text-[#94A3B8] border-transparent bg-white/5 hover:bg-white/10'}`}>
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">Details</label>
                <textarea placeholder="Add confirmation numbers, specific locations, or personal notes..." value={newSection.description}
                  onChange={(e) => setNewSection({ ...newSection, description: e.target.value })} className="gt-input py-3 pl-4 min-h-[80px] resize-y" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-[#94A3B8] mb-1.5 uppercase tracking-wider">Date From</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
                    <input type="date" value={newSection.date_from} onChange={(e) => setNewSection({ ...newSection, date_from: e.target.value })} className="gt-input py-2 pl-9 text-xs" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#94A3B8] mb-1.5 uppercase tracking-wider">Date To</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
                    <input type="date" value={newSection.date_to} onChange={(e) => setNewSection({ ...newSection, date_to: e.target.value })} className="gt-input py-2 pl-9 text-xs" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">Estimated Cost ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input type="number" min="0" value={newSection.budget} onChange={(e) => setNewSection({ ...newSection, budget: parseFloat(e.target.value) || 0 })} className="gt-input py-3 pl-11" />
                </div>
              </div>
              
              <button onClick={handleAddSection} disabled={adding}
                className="w-full mt-4 py-3.5 rounded-xl font-bold border border-[#7C5CFC]/30 text-[#F8FAFC] bg-[#7C5CFC]/20 hover:bg-[#7C5CFC]/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {adding ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus className="w-5 h-5" /> Append Block
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="mt-6">
            <button onClick={() => router.push(`/trips/${id}`)} className="w-full py-4 rounded-xl font-bold gradient-btn flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all group">
              Complete Itinerary <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
