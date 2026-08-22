'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProfile, getTrips } from '@/lib/api';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [p, t] = await Promise.all([getProfile(), getTrips({})]);
        setProfile(p);
        setTrips(Array.isArray(t) ? t : []);
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-3 border-white/[0.08] border-t-teal-400 rounded-full animate-spin" /></div>;

  const planned = trips.filter((t) => ['draft', 'planned'].includes(t.status));
  const previous = trips.filter((t) => t.status === 'completed');

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-8 animate-fade-in">
      {/* Profile Header */}
      <div className="glass-card p-8 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-blue-400 flex items-center justify-center text-4xl font-bold">
            {(profile?.name || 'T')[0]}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-heading font-bold">{profile?.name || 'Traveler'}</h1>
            <p className="text-white/40 text-sm">{profile?.email}</p>
            <p className="text-xs text-white/30 mt-2">User Details with appropriate option to edit those information…</p>
          </div>
          <button className="px-4 py-2 rounded-xl text-sm border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.06] transition-all">
            ✏️ Edit Profile
          </button>
        </div>

        {/* Stats */}
        {profile?.stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/[0.06]">
            {[
              { label: 'Total Trips', value: profile.stats.total, icon: '🧳' },
              { label: 'Planned', value: profile.stats.planned + profile.stats.draft, icon: '📋' },
              { label: 'Ongoing', value: profile.stats.ongoing, icon: '✈️' },
              { label: 'Completed', value: profile.stats.completed, icon: '✅' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-white/40">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preplanned Trips */}
      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-4">📋 Preplanned Trips</h2>
        {planned.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {planned.map((trip) => (
              <div key={trip.id} className="glass-card p-5 hover:glass-card-hover transition-all">
                <div className="font-heading font-bold mb-1">{trip.name}</div>
                <div className="text-xs text-white/40 mb-3">📍 {trip.destination_name} · {trip.duration_days || '—'} days</div>
                <Link href={`/trips/${trip.id}`} className="inline-block text-xs px-4 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] transition-all">View</Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center text-white/40 text-sm">No preplanned trips yet</div>
        )}
      </section>

      {/* Previous Trips */}
      <section>
        <h2 className="text-xl font-heading font-bold mb-4">🏆 Previous Trips</h2>
        {previous.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {previous.map((trip) => (
              <div key={trip.id} className="glass-card p-5 hover:glass-card-hover transition-all">
                <div className="font-heading font-bold mb-1">{trip.name}</div>
                <div className="text-xs text-white/40 mb-3">📍 {trip.destination_name}</div>
                <Link href={`/trips/${trip.id}`} className="inline-block text-xs px-4 py-1.5 rounded-lg bg-teal-400/15 text-teal-400 hover:bg-teal-400/25 transition-all">View</Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center text-white/40 text-sm">Complete your first trip to see it here!</div>
        )}
      </section>
    </div>
  );
}
