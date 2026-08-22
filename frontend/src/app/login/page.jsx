'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from '@/lib/supabase';
import { useToast } from '@/components/Toast';
import { Mail, Lock, Eye, EyeOff, Globe, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '@/components/auth/AuthLayout';

export default function LoginPage() {
  const router = useRouter();
  const showToast = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  // Simplified and human-readable error messages
  const getErrorMessage = (err) => {
    const msg = err.message || '';
    if (msg.toLowerCase().includes('invalid login credentials')) {
      return 'Email or password is incorrect.';
    }
    return 'An error occurred while signing in. Please try again.';
  };

  async function handleLogin(e) {
    e.preventDefault();
    if (!form.email || !form.password) { 
      setError('Please fill in all fields.'); 
      return; 
    }
    setLoading(true); 
    setError('');
    
    try {
      await signIn(form.email, form.password);
      setSuccess(true);
      showToast('Welcome back! 🎉', 'success');
      setTimeout(() => router.push('/'), 600); // Small delay to show success state
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  }

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <AuthLayout>
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="w-full">
        {/* Logo & Header */}
        <motion.div variants={fadeUp} className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#22D3A7] to-[#7C5CFC] flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(34,211,167,0.3)]">
            <Globe className="w-6 h-6 text-[#07111F]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#F8FAFC] mb-2 tracking-tight">Welcome back</h1>
          <p className="text-[#94A3B8] text-sm">Continue your journey.</p>
        </motion.div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="overflow-hidden"
            >
              <div className="p-4 mb-6 rounded-xl bg-[#FF4A4A]/10 text-[#FF4A4A] text-sm border border-[#FF4A4A]/20 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-tight">{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <motion.div variants={fadeUp}>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-2 uppercase tracking-wider">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] group-focus-within:text-[#22D3A7] transition-colors" />
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={form.email}
                onChange={(e) => {setForm({ ...form, email: e.target.value }); setError('');}}
                disabled={loading || success}
                className="w-full py-3.5 pl-11 pr-4 bg-[#07111F]/50 border border-white/10 rounded-xl text-[#F8FAFC] placeholder:text-[#94A3B8]/50 outline-none focus:border-[#22D3A7]/50 focus:bg-[#07111F]/80 focus:shadow-[0_0_15px_rgba(34,211,167,0.15)] transition-all disabled:opacity-50"
              />
            </div>
          </motion.div>
          
          {/* Password Field */}
          <motion.div variants={fadeUp}>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-2 uppercase tracking-wider">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] group-focus-within:text-[#22D3A7] transition-colors" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="•••••••••••••••" 
                value={form.password}
                onChange={(e) => {setForm({ ...form, password: e.target.value }); setError('');}}
                disabled={loading || success}
                className="w-full py-3.5 pl-11 pr-12 bg-[#07111F]/50 border border-white/10 rounded-xl text-[#F8FAFC] placeholder:text-[#94A3B8]/50 outline-none focus:border-[#22D3A7]/50 focus:bg-[#07111F]/80 focus:shadow-[0_0_15px_rgba(34,211,167,0.15)] transition-all disabled:opacity-50"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
          
          {/* Forgot Password */}
          <motion.div variants={fadeUp} className="flex justify-end pt-1 mb-2">
            <Link href="/forgot-password" className="text-xs text-[#94A3B8] hover:text-[#22D3A7] transition-colors font-medium decoration-[#22D3A7]/30 hover:underline underline-offset-4">
              Forgot password?
            </Link>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={fadeUp} className="pt-2">
            <button 
              type="submit" 
              disabled={loading || success || !form.email || !form.password}
              className="w-full py-4 rounded-xl font-bold gradient-btn flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
            >
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div key="success" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Signed In
                  </motion.div>
                ) : loading ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Signing in...
                  </motion.div>
                ) : (
                  <motion.span key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    Sign In
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        </form>

        {/* Footer */}
        <motion.p variants={fadeUp} className="text-center mt-8 text-sm text-[#94A3B8]">
          New to GlobeTrotter?{' '}
          <Link href="/register" className="text-[#F8FAFC] font-semibold hover:text-[#22D3A7] transition-colors">
            Create an account
          </Link>
        </motion.p>
      </motion.div>
    </AuthLayout>
  );
}
