'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, MapPin, Globe, CalendarDays, Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/trips', label: 'My Trips', icon: MapPin },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/community', label: 'Community', icon: Globe },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#07111F]/80 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      <Link href="/" className="flex items-center gap-3 group relative z-50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22D3A7] to-[#7C5CFC] flex items-center justify-center text-lg shadow-[0_0_20px_rgba(34,211,167,0.3)] group-hover:shadow-[0_0_25px_rgba(34,211,167,0.5)] transition-all">
          <Globe className="w-6 h-6 text-[#07111F]" />
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-[#22D3A7] to-[#7C5CFC] bg-clip-text text-transparent font-heading tracking-tight">
          GlobeTrotter
        </span>
      </Link>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center gap-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all relative flex items-center gap-2 group
                  ${isActive
                    ? 'text-[#F8FAFC] bg-white/[0.08]'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.05]'
                  }`}
              >
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#22D3A7]' : 'text-[#94A3B8] group-hover:text-[#22D3A7]'}`} />
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-[#22D3A7] to-[#7C5CFC] rounded-t-full shadow-[0_-2px_10px_rgba(34,211,167,0.5)]" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Desktop Actions */}
      <div className="hidden md:flex items-center gap-4">
        <Link
          href="/admin"
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all border border-transparent
            ${pathname === '/admin' ? 'bg-[#132238] text-[#F8FAFC] border-white/10' : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5'}`}
        >
          <Shield className="w-3 h-3" />
          Admin
        </Link>
        <Link href="/profile">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#22D3A7] to-[#7C5CFC] p-[2px] cursor-pointer hover:scale-105 transition-transform shadow-[0_4px_15px_rgba(124,92,252,0.3)]">
            <div className="w-full h-full bg-[#0D1B2A] rounded-full flex items-center justify-center text-sm font-semibold text-[#F8FAFC]">
              T
            </div>
          </div>
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        className="md:hidden relative z-50 text-[#F8FAFC] p-2"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Navigation */}
      <div className={`fixed inset-0 bg-[#07111F]/95 backdrop-blur-2xl z-40 transition-all duration-300 md:hidden flex flex-col pt-24 px-6 gap-6 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <ul className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-4 rounded-2xl text-lg font-medium transition-all flex items-center gap-4
                    ${isActive
                      ? 'text-[#F8FAFC] bg-[#132238] border border-white/10'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.05]'
                    }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#22D3A7]' : 'text-[#94A3B8]'}`} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-auto pb-12 flex items-center justify-between border-t border-white/10 pt-6">
          <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#22D3A7] to-[#7C5CFC] p-[2px]">
              <div className="w-full h-full bg-[#0D1B2A] rounded-full flex items-center justify-center text-lg font-semibold text-[#F8FAFC]">
                T
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[#F8FAFC] font-medium">My Profile</span>
              <span className="text-xs text-[#94A3B8]">View settings</span>
            </div>
          </Link>
          <Link href="/admin" onClick={() => setMobileOpen(false)} className="p-3 rounded-full bg-[#132238] text-[#94A3B8]">
            <Shield className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
