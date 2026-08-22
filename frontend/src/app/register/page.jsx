'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/lib/supabase';
import { useToast } from '@/components/Toast';
import { User, Mail, Lock, Eye, EyeOff, Globe, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '@/components/auth/AuthLayout';

export default function RegisterPage() {
  const router = useRouter();
  const showToast = useToast();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0); // 0-3

  // Password strength calculation
  useEffect(() => {
    let strength = 0;
    if (form.password.length >= 8) strength += 1;
    if (form.password.match(/[A-Z]/) && form.password.match(/[0-9]/)) strength += 1;
    if (form.password.match(/[^A-Za-z0-9]/)) strength += 1;
    setPasswordStrength(form.password ? Math.max(1, strength) : 0);
  }, [form.password]);

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const getErrorMessage = (err) => {
    return "We couldn't create your account. Please check your information and try again.";
  };

  async function handleRegister(e) {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the Terms of Service to continue.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await signUp(form.email, form.password, {
        name: form.fullName.trim()
      });
      showToast('Registration successful! 🎉', 'success');
      setTimeout(() => router.push('/'), 600);
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
        {/* Header */}
        <motion.div variants={fadeUp} className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#22D3A7] to-[#7C5CFC] flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(34,211,167,0.3)]">
            <Globe className="w-6 h-6 text-[#07111F]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#F8FAFC] mb-2 tracking-tight">Start your journey</h1>
          <p className="text-[#94A3B8] text-sm">Create your GlobeTrotter account and start planning.</p>
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

        <form onSubmit={handleRegister} className="space-y-4">
          
          <motion.div variants={fadeUp}>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] group-focus-within:text-[#22D3A7] transition-colors" />
              <input 
                type="text" 
                placeholder="John Doe" 
                value={form.fullName}
                onChange={(e) => update('fullName', e.target.value)}
                disabled={loading}
                className="w-full py-3.5 pl-11 pr-4 bg-[#07111F]/50 border border-white/10 rounded-xl text-[#F8FAFC] placeholder:text-[#94A3B8]/50 outline-none focus:border-[#22D3A7]/50 focus:bg-[#07111F]/80 focus:shadow-[0_0_15px_rgba(34,211,167,0.15)] transition-all disabled:opacity-50"
              />
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] group-focus-within:text-[#22D3A7] transition-colors" />
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                disabled={loading}
                className="w-full py-3.5 pl-11 pr-4 bg-[#07111F]/50 border border-white/10 rounded-xl text-[#F8FAFC] placeholder:text-[#94A3B8]/50 outline-none focus:border-[#22D3A7]/50 focus:bg-[#07111F]/80 focus:shadow-[0_0_15px_rgba(34,211,167,0.15)] transition-all disabled:opacity-50"
              />
            </div>
          </motion.div>
          
          <motion.div variants={fadeUp}>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] group-focus-within:text-[#22D3A7] transition-colors" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="•••••••••••••••" 
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                disabled={loading}
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
            
            {/* Password Strength Indicator */}
            <AnimatePresence>
              {form.password.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 mt-2 px-1 overflow-hidden"
                >
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        passwordStrength === 1 ? 'bg-[#FF4A4A] w-1/3' :
                        passwordStrength === 2 ? 'bg-[#FFB86B] w-2/3' :
                        passwordStrength === 3 ? 'bg-[#22D3A7] w-full' : 'w-0'
                      }`}
                    />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    passwordStrength === 1 ? 'text-[#FF4A4A]' :
                    passwordStrength === 2 ? 'text-[#FFB86B]' :
                    passwordStrength === 3 ? 'text-[#22D3A7]' : 'text-[#94A3B8]'
                  }`}>
                    {passwordStrength === 1 ? 'Weak' : passwordStrength === 2 ? 'Medium' : passwordStrength === 3 ? 'Strong' : ''}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={fadeUp}>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider">Confirm Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] group-focus-within:text-[#22D3A7] transition-colors" />
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="•••••••••••••••" 
                value={form.confirmPassword}
                onChange={(e) => update('confirmPassword', e.target.value)}
                disabled={loading}
                className="w-full py-3.5 pl-11 pr-12 bg-[#07111F]/50 border border-white/10 rounded-xl text-[#F8FAFC] placeholder:text-[#94A3B8]/50 outline-none focus:border-[#22D3A7]/50 focus:bg-[#07111F]/80 focus:shadow-[0_0_15px_rgba(34,211,167,0.15)] transition-all disabled:opacity-50"
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 transition-colors focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
          
          {/* Terms Checkbox */}
          <motion.div variants={fadeUp} className="py-2">
            <label className="flex items-start gap-3 text-sm text-[#94A3B8] cursor-pointer group">
              <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                <input 
                  type="checkbox" 
                  checked={agreeTerms}
                  onChange={(e) => {setAgreeTerms(e.target.checked); setError('');}}
                  className="peer appearance-none w-5 h-5 border border-white/20 rounded-md bg-[#07111F]/50 checked:bg-[#22D3A7] checked:border-[#22D3A7] transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#22D3A7]/50" 
                />
                <CheckCircle2 className="absolute w-3.5 h-3.5 text-[#07111F] opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
              </div>
              <span className="leading-relaxed select-none group-hover:text-[#F8FAFC] transition-colors">
                I agree to the <Link href="/terms" className="text-[#22D3A7] hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-[#22D3A7] hover:underline">Privacy Policy</Link>.
              </span>
            </label>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={fadeUp} className="pt-2">
            <button 
              type="submit" 
              disabled={loading || !form.email || !form.password || !form.fullName || !form.confirmPassword || !agreeTerms}
              className="w-full py-4 rounded-xl font-bold gradient-btn flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </motion.div>
        </form>

        {/* Footer */}
        <motion.p variants={fadeUp} className="text-center mt-8 text-sm text-[#94A3B8]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#F8FAFC] font-semibold hover:text-[#22D3A7] transition-colors">
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </AuthLayout>
  );
}
