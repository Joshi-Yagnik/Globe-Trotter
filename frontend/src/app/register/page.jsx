'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/lib/supabase';
import { useToast } from '@/components/Toast';
import { UserPlus, Mail, Lock, User, Phone, MapPin, Camera, Globe } from 'lucide-react';

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
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-[url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2068&auto=format&fit=crop')] bg-cover bg-center bg-fixed relative">
      <div className="absolute inset-0 bg-[#07111F]/80 backdrop-blur-md" />
      
      <div className="w-full max-w-2xl glass-card p-10 animate-scale-in relative z-10 mt-8 mb-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#22D3A7] to-[#7C5CFC] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,211,167,0.3)]">
            <Globe className="w-8 h-8 text-[#07111F]" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-[#F8FAFC]">Join <span className="gradient-text">GlobeTrotter</span></h1>
          <p className="text-[#94A3B8] text-sm mt-2">Create your account and start exploring the world.</p>
        </div>

        <div className="mx-auto w-24 h-24 rounded-full bg-[#0D1B2A]/50 border border-white/10 flex flex-col items-center justify-center text-xs text-[#94A3B8] mb-8 cursor-pointer hover:border-[#22D3A7]/50 hover:bg-[#132238] transition-all group shadow-inner">
          <Camera className="w-6 h-6 mb-1 text-[#94A3B8] group-hover:text-[#22D3A7] transition-colors" />
          <span>Photo</span>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-xl bg-red-500/10 text-red-400 text-sm border border-red-500/20 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">First Name *</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input type="text" placeholder="First Name" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} className="gt-input py-3.5 pl-11" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">Last Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input type="text" placeholder="Last Name" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} className="gt-input py-3.5 pl-11" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">Email *</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input type="email" placeholder="email@example.com" value={form.email} onChange={(e) => update('email', e.target.value)} className="gt-input py-3.5 pl-11" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => update('phone', e.target.value)} className="gt-input py-3.5 pl-11" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">City</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input type="text" placeholder="Your City" value={form.city} onChange={(e) => update('city', e.target.value)} className="gt-input py-3.5 pl-11" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">Country</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input type="text" placeholder="Your Country" value={form.country} onChange={(e) => update('country', e.target.value)} className="gt-input py-3.5 pl-11" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">Password *</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input type="password" placeholder="Create a strong password" value={form.password} onChange={(e) => update('password', e.target.value)} className="gt-input py-3.5 pl-11" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">Travel Interests</label>
            <textarea placeholder="Tell us about your favorite destinations, travel style, etc..." value={form.additionalInfo} onChange={(e) => update('additionalInfo', e.target.value)}
              className="gt-input py-4 min-h-[100px] resize-y leading-relaxed" />
          </div>
          
          <button type="submit" disabled={loading}
            className="w-full mt-8 py-4 rounded-xl font-bold gradient-btn flex items-center justify-center gap-2 transition-all disabled:opacity-50">
            {loading ? (
               <span className="w-5 h-5 border-2 border-[#07111F]/30 border-t-[#07111F] rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Create Account
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-[#94A3B8]">
          Already have an account? <Link href="/login" className="text-[#22D3A7] font-semibold hover:text-[#7C5CFC] transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
