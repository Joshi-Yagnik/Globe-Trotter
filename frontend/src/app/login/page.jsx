'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from '@/lib/supabase';
import { useToast } from '@/components/Toast';
import { LogIn, Mail, Lock, Camera, Globe } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const showToast = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields'); return; }
    setLoading(true); setError('');
    try {
      await signIn(form.email, form.password);
      showToast('Welcome back! 🎉', 'success');
      router.push('/');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat relative">
      <div className="absolute inset-0 bg-[#07111F]/80 backdrop-blur-sm" />
      
      <div className="w-full max-w-md glass-card p-10 animate-scale-in relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#22D3A7] to-[#7C5CFC] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,211,167,0.3)]">
            <Globe className="w-8 h-8 text-[#07111F]" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-[#F8FAFC] mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-[#94A3B8] text-sm">Sign in to continue your adventures.</p>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-xl bg-red-500/10 text-red-400 text-sm border border-red-500/20 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input type="email" placeholder="Enter your email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="gt-input py-3.5 pl-11" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input type="password" placeholder="Enter your password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="gt-input py-3.5 pl-11" />
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2 mb-8">
            <label className="flex items-center gap-2 text-sm text-[#94A3B8] cursor-pointer hover:text-[#F8FAFC] transition-colors">
              <input type="checkbox" className="rounded border-white/10 bg-white/5 text-[#22D3A7] focus:ring-[#22D3A7]" />
              Remember me
            </label>
            <Link href="#" className="text-sm text-[#22D3A7] hover:text-[#7C5CFC] transition-colors">Forgot password?</Link>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-xl font-bold gradient-btn flex items-center justify-center gap-2 transition-all disabled:opacity-50">
            {loading ? (
              <span className="w-5 h-5 border-2 border-[#07111F]/30 border-t-[#07111F] rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-[#94A3B8]">
          Don&apos;t have an account? <Link href="/register" className="text-[#22D3A7] font-semibold hover:text-[#7C5CFC] transition-colors">Create one</Link>
        </p>
      </div>
    </div>
  );
}
