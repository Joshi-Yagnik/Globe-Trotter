'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/lib/supabase';
import { useToast } from '@/components/Toast';

export default function RegisterPage() {
  const router = useRouter();
  const showToast = useToast();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', city: '', country: '', password: '', additionalInfo: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  async function handleRegister(e) {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.password) { setError('First Name, Email, and Password are required'); return; }
    setLoading(true); setError('');
    try {
      await signUp(form.email, form.password, {
        name: `${form.firstName} ${form.lastName}`.trim(),
        phone: form.phone, city: form.city, country: form.country,
      });
      showToast('Registration successful! 🎉', 'success');
      router.push('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl glass-card p-10 animate-scale-in">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🌍</div>
          <h1 className="text-3xl font-heading font-bold">Join <span className="gradient-text">GlobeTrotter</span></h1>
          <p className="text-white/50 text-sm mt-2">Create your account and start exploring the world.</p>
        </div>

        <div className="mx-auto w-20 h-20 rounded-full bg-white/[0.06] border-2 border-dashed border-white/20 flex items-center justify-center text-sm text-white/30 mb-6 cursor-pointer hover:border-teal-400/50 transition-colors">
          📸<br/>Upload Photo
        </div>

        {error && <div className="p-3 mb-4 rounded-xl bg-red-400/10 text-red-400 text-sm border border-red-400/20">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">First Name *</label>
              <input type="text" placeholder="First Name" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} className="gt-input py-3" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">Last Name</label>
              <input type="text" placeholder="Last Name" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} className="gt-input py-3" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">Email *</label>
              <input type="email" placeholder="email@example.com" value={form.email} onChange={(e) => update('email', e.target.value)} className="gt-input py-3" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">Phone</label>
              <input type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={(e) => update('phone', e.target.value)} className="gt-input py-3" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">City</label>
              <input type="text" placeholder="Your City" value={form.city} onChange={(e) => update('city', e.target.value)} className="gt-input py-3" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">Country</label>
              <input type="text" placeholder="Your Country" value={form.country} onChange={(e) => update('country', e.target.value)} className="gt-input py-3" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">Password *</label>
            <input type="password" placeholder="Create a strong password" value={form.password} onChange={(e) => update('password', e.target.value)} className="gt-input py-3" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">Additional Information</label>
            <textarea placeholder="Tell us about your travel interests..." value={form.additionalInfo} onChange={(e) => update('additionalInfo', e.target.value)}
              className="gt-input py-3 min-h-[80px] resize-y" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-bold gradient-btn hover:-translate-y-0.5 transition-all disabled:opacity-50">
            {loading ? 'Registering...' : 'Register User'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-white/40">
          Already have an account? <Link href="/login" className="text-teal-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
