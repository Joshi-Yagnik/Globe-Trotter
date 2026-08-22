'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCalendar } from '@/lib/api';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const FALLBACK_TRIPS = (y, m) => [
  { id: 1, name: 'PARIS TRIP', start_date: `${y}-${String(m).padStart(2, '0')}-04`, end_date: `${y}-${String(m).padStart(2, '0')}-07`, color: '#00d4aa', status: 'planned' },
  { id: 2, name: 'NYC GETAWAY', start_date: `${y}-${String(m).padStart(2, '0')}-14`, end_date: `${y}-${String(m).padStart(2, '0')}-16`, color: '#ff6b6b', status: 'ongoing' },
  { id: 3, name: 'JAPAN ADVENTURE', start_date: `${y}-${String(m).padStart(2, '0')}-23`, end_date: `${y}-${String(m).padStart(2, '0')}-28`, color: '#ffd93d', status: 'planned' },
];

export default function CalendarPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [trips, setTrips] = useState([]);

  useEffect(() => { loadCalendar(); }, [year, month]);

  async function loadCalendar() {
    try {
      const data = await getCalendar(year, month);
      setTrips(data.trips || FALLBACK_TRIPS(year, month));
    } catch { setTrips(FALLBACK_TRIPS(year, month)); }
  }

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear(year - 1); } else setMonth(month - 1);
  }
  function nextMonth() {
    if (month === 12) { setMonth(1); setYear(year + 1); } else setMonth(month + 1);
  }

  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = now.getFullYear() === year && now.getMonth() + 1 === month ? now.getDate() : -1;

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push({ day: null });
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const events = trips.filter((t) => dateStr >= t.start_date && dateStr <= t.end_date);
    cells.push({ day: d, isToday: d === today, events, dateStr });
  }

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-8 animate-fade-in">
      <h1 className="text-3xl font-heading font-bold mb-8"><span className="gradient-text">Calendar</span> View</h1>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 glass-card mb-6">
        <div className="flex-1 min-w-[200px] relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
          <input type="text" placeholder="Search events..." className="w-full py-2 pl-10 pr-4 bg-white/[0.06] border border-transparent rounded-xl text-white text-sm outline-none focus:border-teal-400 transition-all" />
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-8">
          <button onClick={prevMonth} className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-lg hover:bg-white/[0.1] transition-all">←</button>
          <div className="text-2xl font-heading font-bold">{MONTH_NAMES[month - 1]} {year}</div>
          <button onClick={nextMonth} className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-lg hover:bg-white/[0.1] transition-all">→</button>
        </div>

        <div className="grid grid-cols-7 gap-[1px] bg-white/[0.04]">
          {DAY_NAMES.map((d) => (
            <div key={d} className="bg-[#06080f] text-center py-3 text-xs font-bold text-white/40 tracking-wider">{d}</div>
          ))}
          {cells.map((cell, i) => (
            <div key={i}
              className={`bg-[#06080f] min-h-[80px] p-2 transition-colors ${cell.day ? 'hover:bg-white/[0.04]' : ''} ${cell.isToday ? 'bg-teal-400/[0.06] border border-teal-400/30' : ''}`}>
              {cell.day && (
                <>
                  <div className={`text-sm font-semibold mb-1 ${cell.isToday ? 'text-teal-400' : 'text-white/60'}`}>{cell.day}</div>
                  {cell.events.map((ev) => (
                    <Link href={`/trips/${ev.id}`} key={ev.id}
                      className="block text-[10px] font-semibold px-1.5 py-0.5 rounded mb-0.5 truncate cursor-pointer hover:brightness-125 transition-all"
                      style={{ background: `${ev.color}22`, color: ev.color, borderLeft: `3px solid ${ev.color}` }}>
                      {ev.name}
                    </Link>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Trip Legend */}
      {trips.length > 0 && (
        <div className="mt-8">
          <h3 className="font-heading font-bold mb-4">📅 This Month&apos;s Trips</h3>
          <div className="flex gap-3 flex-wrap">
            {trips.map((trip) => (
              <Link href={`/trips/${trip.id}`} key={trip.id}
                className="glass-card px-4 py-2 hover:glass-card-hover transition-all flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: trip.color }} />
                <span className="font-medium text-sm">{trip.name}</span>
                <span className="text-xs text-white/30">{trip.start_date} → {trip.end_date}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
