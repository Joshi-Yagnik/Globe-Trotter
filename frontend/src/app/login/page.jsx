'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from '@/lib/supabase';
import { useToast } from '@/components/Toast';

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
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6">
      <div className="w-full max-w-md glass-card p-10 animate-scale-in">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🌍</div>
          <h1 className="text-3xl font-heading font-bold gradient-text mb-2">GlobeTrotter</h1>
          <p className="text-white/50 text-sm">Welcome back! Login to continue your adventures.</p>
        </div>

        <div className="mx-auto w-20 h-20 rounded-full bg-white/[0.06] border-2 border-dashed border-white/20 flex items-center justify-center text-sm text-white/30 mb-6">
          📸<br/>Photo
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-400/10 text-red-400 text-sm border border-red-400/20">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">Username / Email</label>
            <input type="email" placeholder="Enter your email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="gt-input py-3" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">Password</label>
            <input type="password" placeholder="Enter your password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="gt-input py-3" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-bold gradient-btn hover:-translate-y-0.5 transition-all disabled:opacity-50">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-white/40">
          Don&apos;t have an account? <Link href="/register" className="text-teal-400 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
