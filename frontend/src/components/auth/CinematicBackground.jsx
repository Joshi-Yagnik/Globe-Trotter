'use client';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

const CITIES = [
  { name: 'PARIS', coords: '48.8566° N', top: '25%', left: '20%' },
  { name: 'BALI', coords: '8.3405° S', top: '70%', left: '80%' },
  { name: 'JAIPUR', coords: '26.9124° N', top: '40%', left: '60%' },
  { name: 'KYOTO', coords: '35.0116° N', top: '30%', left: '85%' },
  { name: 'SANTORINI', coords: '36.3932° N', top: '65%', left: '15%' },
];

export default function CinematicBackground() {
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="fixed inset-0 bg-[#07111F]" />;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base Image */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"
      />
      
      {/* Overlays */}
      <div className="absolute inset-0 bg-[#07111F]/75 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#07111F] via-transparent to-[#132238]/80" />
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(7,17,31,1)]" />

      {/* Grid Texture */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] mix-blend-overlay" />

      {/* Route Animation & Map Elements (Hidden on reduced motion) */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 opacity-40">
          {/* Animated Route Lines */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <motion.path
              d="M 20vw 25vh Q 40vw 10vh 60vw 40vh T 80vw 70vh"
              fill="none"
              stroke="url(#route-gradient)"
              strokeWidth="2"
              strokeDasharray="4 8"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 8, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
            />
            <motion.path
              d="M 15vw 65vh Q 35vw 80vh 85vw 30vh"
              fill="none"
              stroke="url(#route-gradient)"
              strokeWidth="1.5"
              strokeDasharray="4 8"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ duration: 12, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse', delay: 2 }}
            />
            <defs>
              <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22D3A7" stopOpacity="0" />
                <stop offset="50%" stopColor="#22D3A7" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#7C5CFC" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Floating Labels */}
          {CITIES.map((city, i) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                y: [0, -10, 0]
              }}
              transition={{ 
                duration: 8 + i * 2, 
                repeat: Infinity,
                delay: i * 0.5,
                ease: 'easeInOut' 
              }}
              className="absolute flex items-center gap-2"
              style={{ top: city.top, left: city.left }}
            >
              <div className="relative flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22D3A7]" />
                <div className="absolute w-4 h-4 rounded-full border border-[#22D3A7]/50 animate-ping" />
              </div>
              <div className="hidden md:block">
                <p className="text-[10px] font-bold tracking-[0.2em] text-[#F8FAFC] uppercase">{city.name}</p>
                <p className="text-[8px] tracking-wider text-[#22D3A7]">{city.coords}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
