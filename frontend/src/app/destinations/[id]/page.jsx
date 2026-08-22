'use client';
import { useState, useEffect } from 'react';
import { getDestination } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, ArrowLeft, Star, Heart, Clock, DollarSign, Share2, Compass, CheckCircle2, ChevronRight } from 'lucide-react';
import AddToTripModal from '@/components/destinations/AddToTripModal';

export default function DestinationDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadDestination(id);
    }
  }, [id]);

  async function loadDestination(destId) {
    try {
      const data = await getDestination(destId);
      setDestination(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#22D3A7]/20 border-t-[#22D3A7] rounded-full animate-spin" />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Compass className="w-16 h-16 text-[#94A3B8] mb-4" />
        <h1 className="text-2xl font-bold text-[#F8FAFC] mb-2">Destination Not Found</h1>
        <button onClick={() => router.push('/explore')} className="text-[#22D3A7] hover:underline">Return to Explore</button>
      </div>
    );
  }

  return (
    <div className="pb-24 animate-fade-in">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full bg-[#132238]">
        {destination.image_url && (
          <img src={destination.image_url} alt={destination.name} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07111F] via-[#07111F]/50 to-transparent" />
        
        {/* Top Bar Navigation */}
        <div className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center border border-white/10 text-white hover:bg-white/20 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center border border-white/10 text-white hover:bg-white/20 transition-all">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center border border-white/10 text-white hover:text-[#FF4A4A] hover:bg-white/20 transition-all">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 w-full p-8 max-w-[1200px] left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#22D3A7] text-[#07111F] shadow-[0_0_15px_rgba(34,211,167,0.4)]">
              {destination.travel_type || 'Destination'}
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold text-white/90 bg-black/30 px-3 py-1 rounded-full backdrop-blur-md">
              <MapPin className="w-3.5 h-3.5 text-[#22D3A7]" /> {destination.state ? `${destination.state}, ${destination.country}` : destination.country}
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-white mb-4 leading-tight shadow-sm">
            {destination.name}
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 max-w-3xl leading-relaxed mb-6 font-medium drop-shadow-md">
            {destination.short_description || destination.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-white">
            {destination.recommended_days && (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#22D3A7]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-white/60">Recommended</p>
                  <p className="font-semibold">{destination.recommended_days}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#FFB86B]" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-white/60">Avg Budget</p>
                <p className="font-semibold">${destination.avg_budget} / day</p>
              </div>
            </div>
            
            {destination.best_season && (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <Star className="w-5 h-5 text-[#7C5CFC]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-white/60">Best Season</p>
                  <p className="font-semibold">{destination.best_season}</p>
                </div>
              </div>
            )}
            
            <button onClick={() => setShowAddModal(true)} className="ml-auto px-8 py-3.5 rounded-xl font-bold text-base gradient-btn shadow-xl hover:shadow-[0_0_25px_rgba(34,211,167,0.5)] transition-all flex items-center gap-2">
              Start Planning
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1200px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column (Details) */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* About Section */}
          <section>
            <h2 className="text-2xl font-heading font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
              Why visit {destination.name}?
            </h2>
            <div className="prose prose-invert prose-p:text-[#94A3B8] prose-p:leading-relaxed max-w-none">
              <p>{destination.why_visit || destination.description}</p>
            </div>
          </section>

          {/* Highlights */}
          {destination.highlights && (
            <section>
              <h2 className="text-2xl font-heading font-bold text-[#F8FAFC] mb-4">Top Highlights</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {destination.highlights.split(',').map((h, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 glass-card rounded-xl hover:bg-white/5 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-[#22D3A7] shrink-0" />
                    <span className="text-[#F8FAFC] font-medium">{h.trim()}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Attractions */}
          {destination.attractions && destination.attractions.length > 0 && (
            <section>
              <h2 className="text-2xl font-heading font-bold text-[#F8FAFC] mb-6">Must-See Attractions</h2>
              <div className="space-y-6">
                {destination.attractions.map((attr, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-6 glass-card p-4 rounded-2xl group hover:border-[#22D3A7]/30 transition-colors">
                    {attr.image && (
                      <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden shrink-0">
                        <img src={attr.image} alt={attr.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C5CFC] bg-[#7C5CFC]/10 px-2 py-0.5 rounded-md">
                          {attr.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#F8FAFC] mb-2">{attr.name}</h3>
                      <p className="text-[#94A3B8] text-sm mb-3">{attr.description}</p>
                      <div className="text-xs text-[#94A3B8] flex items-center gap-1 font-medium mt-auto">
                        <MapPin className="w-3.5 h-3.5" /> {attr.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-8">
          
          {/* Quick Facts */}
          <div className="glass-card p-6 rounded-2xl border border-[#22D3A7]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#22D3A7]/10 blur-3xl rounded-full -mr-10 -mt-10" />
            <h3 className="text-lg font-bold text-[#F8FAFC] mb-5 border-b border-white/10 pb-4">Essential Info</h3>
            
            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <span className="text-[#94A3B8] text-sm">Currency</span>
                <span className="text-[#F8FAFC] font-semibold">{destination.currency || 'USD'}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-[#94A3B8] text-sm">Language</span>
                <span className="text-[#F8FAFC] font-semibold">{destination.language || 'English'}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-[#94A3B8] text-sm">Timezone</span>
                <span className="text-[#F8FAFC] font-semibold">{destination.timezone || 'UTC'}</span>
              </li>
              {destination.cost_index && (
                <li className="flex justify-between items-center">
                  <span className="text-[#94A3B8] text-sm">Cost Index</span>
                  <span className="text-[#FFB86B] font-bold bg-[#FFB86B]/10 px-2 py-0.5 rounded">{destination.cost_index}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Budget Breakdown */}
          {destination.budget_breakdown && (
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-5 border-b border-white/10 pb-4">Estimated Budget / Day</h3>
              <div className="space-y-4">
                {Object.entries(destination.budget_breakdown).map(([category, amount]) => (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[#F8FAFC] text-sm font-medium">{category}</span>
                      <span className="text-[#22D3A7] font-bold text-sm">${amount}</span>
                    </div>
                    {/* Visual bar */}
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#22D3A7] to-[#12A581] h-full rounded-full" 
                        style={{ width: `${Math.min((amount / destination.avg_budget) * 100, 100)}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-white/5 rounded-xl flex justify-between items-center">
                <span className="text-[#94A3B8] font-semibold text-sm uppercase tracking-wider">Total Est.</span>
                <span className="text-2xl font-bold text-[#F8FAFC]">${destination.avg_budget}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddToTripModal destinationId={destination.id} onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
