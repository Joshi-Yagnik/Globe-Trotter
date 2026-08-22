'use client';
import { motion, AnimatePresence } from 'framer-motion';
import CinematicBackground from './CinematicBackground';

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#07111F]">
      <CinematicBackground />
      
      <div className="relative z-10 w-full px-5 sm:px-6 py-12 flex items-center justify-center h-full min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key="auth-card"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[440px]"
          >
            {/* Premium Glass Card */}
            <div className="glass-card relative overflow-hidden bg-[#07111F]/70 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
              {/* Subtle inner highlight */}
              <div className="absolute inset-0 rounded-3xl pointer-events-none border border-white/5 mask-image:linear-gradient(to_bottom,white,transparent)" />
              
              <div className="p-8 sm:p-10 relative z-10">
                {children}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
