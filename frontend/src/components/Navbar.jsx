'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/trips', label: 'My Trips', icon: '🧳' },
  { href: '/explore', label: 'Explore', icon: '🔍' },
  { href: '/community', label: 'Community', icon: '🌍' },
  { href: '/calendar', label: 'Calendar', icon: '📅' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-[#06080f]/80 backdrop-blur-xl border-b border-white/[0.08]">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-blue-400 flex items-center justify-center text-lg">
          🌍
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent font-heading">
          GlobeTrotter
        </span>
      </Link>

      <ul className="hidden md:flex items-center gap-1">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all relative
                ${pathname === item.href
                  ? 'text-white bg-white/[0.08]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                }`}
            >
              {item.label}
              {pathname === item.href && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 h-0.5 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full" />
              )}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className={`hidden md:block text-xs px-3 py-1.5 rounded-lg transition-all
            ${pathname === '/admin' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
        >
          Admin
        </Link>
        <Link href="/profile">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-blue-400 flex items-center justify-center text-sm font-semibold cursor-pointer hover:scale-105 transition-transform border-2 border-transparent hover:border-teal-400">
            T
          </div>
        </Link>
      </div>
    </nav>
  );
}
