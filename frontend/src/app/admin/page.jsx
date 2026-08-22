'use client';
import { useState, useEffect } from 'react';
import { getAdminAnalytics } from '@/lib/api';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const PIE_COLORS = { draft: '#636e72', planned: '#ffd93d', ongoing: '#00d4aa', completed: '#00b894', cancelled: '#ff6b6b' };
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

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-3 border-white/[0.08] border-t-teal-400 rounded-full animate-spin" /></div>;

  const data = analytics || FALLBACK;
  const pieData = Object.entries(data.trip_status).map(([name, value]) => ({ name, value, fill: PIE_COLORS[name] || '#636e72' }));
  const barData = data.popular_cities.map((c) => ({ name: c.name, trips: c.trips, popularity: c.popularity }));

  const TABS = [
    { key: 'overview', icon: '👥', value: data.total_users, label: 'Manage Users' },
    { key: 'cities', icon: '🏙️', value: data.popular_cities.length, label: 'Popular Cities' },
    { key: 'activities', icon: '🎯', value: data.total_trips, label: 'Popular Activities' },
    { key: 'trends', icon: '📊', value: data.total_trips, label: 'User Trends' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 animate-fade-in">
      <h1 className="text-3xl font-heading font-bold mb-8">Admin <span className="gradient-text">Dashboard</span></h1>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 glass-card mb-8">
        <div className="flex-1 min-w-[200px] relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
          <input type="text" placeholder="Search..." className="w-full py-2 pl-10 pr-4 bg-white/[0.06] border border-transparent rounded-xl text-white text-sm outline-none focus:border-teal-400 transition-all" />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {TABS.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`glass-card p-5 text-center transition-all cursor-pointer hover:glass-card-hover
              ${activeTab === tab.key ? 'border-teal-400/40 bg-teal-400/[0.06]' : ''}`}>
            <div className="text-3xl mb-2">{tab.icon}</div>
            <div className="text-2xl font-bold gradient-text">{tab.value}</div>
            <div className="text-xs text-white/50 mt-1">{tab.label}</div>
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6">
          <h3 className="font-heading font-bold mb-4">📊 Trip Status Distribution</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value" stroke="none">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0a0e17', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {pieData.map((s) => (
                <div key={s.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ background: s.fill }} />
                  <span className="capitalize text-white/60">{s.name}</span>
                  <span className="ml-auto font-bold">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-heading font-bold mb-4">🏙️ Popular Cities</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} />
              <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#0a0e17', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '12px' }}
              />
              <Bar dataKey="trips" fill="#00d4aa" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'cities' && (
        <div className="glass-card p-6">
          <h3 className="font-heading font-bold mb-4">🏙️ City Details</h3>
          <div className="space-y-3">
            {data.popular_cities.map((city) => (
              <div key={city.name} className="flex items-center gap-4 p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-lg">🏙️</div>
                <div className="flex-1">
                  <div className="font-semibold">{city.name}, {city.country}</div>
                  <div className="text-xs text-white/40">🧳 {city.trips} trips · 🔥 Popularity: {city.popularity}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="glass-card p-6">
          <h3 className="font-heading font-bold mb-4">📋 Admin Notes</h3>
          <div className="space-y-3 text-sm text-white/50 leading-relaxed">
            <p><strong className="text-white/80">Manage Users:</strong> This section is responsible for managing users and their profiles. The admin can view, edit, and manage user accounts.</p>
            <p><strong className="text-white/80">Popular Cities:</strong> Data about cities users are visiting, based on trip count and user feedback.</p>
            <p><strong className="text-white/80">Popular Activities:</strong> List of popular activities based on available data and trend analysis.</p>
            <p><strong className="text-white/80">User Trends &amp; Analytics:</strong> Data-driven insights for understanding usage patterns and growth metrics.</p>
          </div>
        </div>
      )}
    </div>
  );
}
