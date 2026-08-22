'use client';
import { useState, useEffect } from 'react';
import { getAdminAnalytics } from '@/lib/api';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Users, Building2, Target, TrendingUp, Search, MapPin, Activity, PieChart as PieChartIcon } from 'lucide-react';

const PIE_COLORS = { 
  draft: '#94A3B8', 
  planned: '#FFB86B', 
  ongoing: '#22D3A7', 
  completed: '#7C5CFC', 
  cancelled: '#FF4A4A' 
};

const FALLBACK = {
  total_users: 156, total_trips: 423,
  popular_cities: [
    { name: 'Paris', country: 'France', trips: 67, popularity: 95 },
    { name: 'Tokyo', country: 'Japan', trips: 52, popularity: 92 },
    { name: 'Bali', country: 'Indonesia', trips: 48, popularity: 88 },
    { name: 'NYC', country: 'USA', trips: 45, popularity: 90 },
    { name: 'Dubai', country: 'UAE', trips: 38, popularity: 85 },
  ],
  trip_status: { draft: 45, planned: 78, ongoing: 23, completed: 245, cancelled: 32 },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border border-white/10 shadow-2xl">
        <p className="font-bold text-[#F8FAFC] text-sm mb-1">{label || payload[0].name}</p>
        <p className="text-[#22D3A7] text-xs font-bold">
          {payload[0].value} <span className="text-[#94A3B8] font-normal">trips</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function AdminPage() {
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try { setAnalytics(await getAdminAnalytics()); }
      catch { setAnalytics(FALLBACK); }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="flex justify-center py-32"><div className="w-12 h-12 border-4 border-[#22D3A7]/20 border-t-[#22D3A7] rounded-full animate-spin" /></div>;

  const data = analytics || FALLBACK;
  const pieData = Object.entries(data.trip_status).map(([name, value]) => ({ name, value, fill: PIE_COLORS[name] || '#94A3B8' }));
  const barData = data.popular_cities.map((c) => ({ name: c.name, trips: c.trips, popularity: c.popularity }));

  const TABS = [
    { key: 'overview', icon: <Users className="w-6 h-6 text-[#22D3A7]" />, value: data.total_users, label: 'Total Users' },
    { key: 'cities', icon: <Building2 className="w-6 h-6 text-[#7C5CFC]" />, value: data.popular_cities.length, label: 'Active Cities' },
    { key: 'activities', icon: <Target className="w-6 h-6 text-[#FFB86B]" />, value: data.total_trips, label: 'Total Trips' },
    { key: 'trends', icon: <TrendingUp className="w-6 h-6 text-[#FF4A4A]" />, value: `+24%`, label: 'Growth M/M' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 animate-fade-in pb-24">
      <div className="mb-10">
        <h1 className="text-4xl font-heading font-bold text-[#F8FAFC]">System <span className="gradient-text">Intelligence</span></h1>
        <p className="text-[#94A3B8] text-sm mt-2">Platform analytics and administrative oversight.</p>
      </div>

      {/* Filter bar */}
      <div className="glass-card p-3 mb-10 flex items-center sticky top-20 z-30 shadow-2xl backdrop-blur-xl bg-[#0D1B2A]/80 border border-white/10">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
          <input type="text" placeholder="Search analytics, users, or destinations..." className="w-full py-3 pl-12 pr-4 bg-transparent border-none text-[#F8FAFC] text-sm outline-none focus:ring-0" />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {TABS.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`glass-card p-6 text-left transition-all cursor-pointer hover:glass-card-hover group relative overflow-hidden
              ${activeTab === tab.key ? 'border-[#22D3A7]/40 bg-[#22D3A7]/5' : ''}`}>
            
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-opacity duration-500
              ${activeTab === tab.key ? 'opacity-100 bg-[#22D3A7]/20' : 'opacity-0 group-hover:opacity-100 bg-white/10'}`} />
            
            <div className="w-12 h-12 rounded-xl bg-[#07111F]/50 flex items-center justify-center border border-white/5 mb-4 shadow-inner">
              {tab.icon}
            </div>
            
            <div className="text-3xl font-heading font-bold text-[#F8FAFC] mb-1 group-hover:text-[#22D3A7] transition-colors">{tab.value}</div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">{tab.label}</div>
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        <div className="lg:col-span-5 glass-card p-8">
          <h3 className="font-heading font-bold text-[#F8FAFC] text-xl mb-8 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-[#7C5CFC]" /> Pipeline Distribution
          </h3>
          <div className="flex flex-col items-center">
            <div className="relative w-full h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} dataKey="value" stroke="none" paddingAngle={5}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                <span className="text-3xl font-bold text-[#F8FAFC]">{data.total_trips}</span>
                <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">Total</span>
              </div>
            </div>
            
            <div className="w-full grid grid-cols-2 gap-4 mt-8">
              {pieData.map((s) => (
                <div key={s.name} className="flex items-center gap-3 p-2 rounded-lg bg-[#07111F]/30 border border-white/5">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ background: s.fill, boxShadow: `0 0 10px ${s.fill}` }} />
                  <div className="flex-1">
                    <div className="text-[10px] uppercase font-bold text-[#94A3B8] leading-none mb-1">{s.name}</div>
                    <div className="text-sm font-bold text-[#F8FAFC] leading-none">{s.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 glass-card p-8">
          <h3 className="font-heading font-bold text-[#F8FAFC] text-xl mb-8 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#22D3A7]" /> Destination Popularity Index
          </h3>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#132238" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#132238', opacity: 0.4 }} />
                <Bar dataKey="trips" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#colorGradient-${index})`} />
                  ))}
                </Bar>
                
                <defs>
                  {barData.map((entry, index) => (
                    <linearGradient key={`gradient-${index}`} id={`colorGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={index === 0 ? '#22D3A7' : '#7C5CFC'} stopOpacity={1} />
                      <stop offset="100%" stopColor={index === 0 ? '#22D3A7' : '#7C5CFC'} stopOpacity={0.2} />
                    </linearGradient>
                  ))}
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="glass-card p-8">
        {activeTab === 'cities' && (
          <div className="animate-fade-in">
            <h3 className="font-heading font-bold text-xl text-[#F8FAFC] mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#7C5CFC]" /> Global Destinations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.popular_cities.map((city, i) => (
                <div key={city.name} className="flex items-center gap-4 p-4 bg-[#07111F]/50 border border-white/5 rounded-xl hover:bg-[#132238] transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-lg font-bold text-[#F8FAFC] group-hover:bg-[#7C5CFC]/20 group-hover:text-[#7C5CFC] transition-colors">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-[#F8FAFC] text-lg">{city.name}</div>
                    <div className="text-sm text-[#94A3B8]">{city.country}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#22D3A7]">{city.trips}</div>
                    <div className="text-[10px] uppercase font-bold text-[#94A3B8]">Trips</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="animate-fade-in">
            <h3 className="font-heading font-bold text-xl text-[#F8FAFC] mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-[#FFB86B]" /> System Documentation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-[#07111F]/50 border border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-[#22D3A7]" />
                  <strong className="text-[#F8FAFC]">User Management</strong>
                </div>
                <p className="text-sm text-[#94A3B8] leading-relaxed">Responsible for overseeing user profiles, managing account lifecycles, and ensuring platform security and compliance.</p>
              </div>
              
              <div className="p-5 rounded-xl bg-[#07111F]/50 border border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4 text-[#7C5CFC]" />
                  <strong className="text-[#F8FAFC]">Destination Analysis</strong>
                </div>
                <p className="text-sm text-[#94A3B8] leading-relaxed">Aggregated insights on global travel patterns, highlighting emerging markets and popular tourist hubs.</p>
              </div>
              
              <div className="p-5 rounded-xl bg-[#07111F]/50 border border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-[#FFB86B]" />
                  <strong className="text-[#F8FAFC]">Activity Monitoring</strong>
                </div>
                <p className="text-sm text-[#94A3B8] leading-relaxed">Real-time tracking of trip creation, itinerary building, and engagement metrics across the application.</p>
              </div>
              
              <div className="p-5 rounded-xl bg-[#07111F]/50 border border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-[#FF4A4A]" />
                  <strong className="text-[#F8FAFC]">Growth Metrics</strong>
                </div>
                <p className="text-sm text-[#94A3B8] leading-relaxed">Performance indicators evaluating platform adoption rates, user retention, and seasonal travel fluctuations.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
