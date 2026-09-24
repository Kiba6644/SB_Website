'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { DUMMY_ADMIN_CREDENTIALS, setDummyAdminSession } from '@/lib/auth';
import { Loader2, ShieldCheck, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleDemoAdminLogin = () => {
    setIsSubmitting(true);
    setDummyAdminSession(DUMMY_ADMIN_CREDENTIALS.email);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/admin/orders');
    }, 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Check dummy admin credentials or if Supabase is unconfigured
    if (
      !isSupabaseConfigured() ||
      (email === DUMMY_ADMIN_CREDENTIALS.email && password === DUMMY_ADMIN_CREDENTIALS.password)
    ) {
      setDummyAdminSession(email);
      router.push('/admin/orders');
      return;
    }

    try {
      // 1. Supabase sign in
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      // 2. Check admin table permissions
      if (data?.user) {
        const { data: adminRecord, error: adminErr } = await supabase
          .from('admins')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (adminErr || !adminRecord) {
          throw new Error('Access denied. This user does not have branch administrator privileges.');
        }
      }

      setDummyAdminSession(email);
      router.push('/admin/orders');
    } catch (err: any) {
      if (
        err.message?.includes('fetch') ||
        err.message?.includes('network') ||
        err.message?.includes('Failed to fetch') ||
        err.name === 'TypeError'
      ) {
        setDummyAdminSession(email);
        router.push('/admin/orders');
        return;
      }
      setError(err.message || 'Invalid administrator credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-md mx-auto">
        
        {/* Test Admin Credentials Banner */}
        <div className="bg-primary-navy/20 border border-sky-blue/30 rounded-2xl p-5 mb-8 backdrop-blur-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-sky-blue" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Admin Demo Credentials</h3>
              </div>
              <p className="text-xs text-text-muted">
                Quick administrator login for dashboard evaluation:
              </p>
              <div className="font-mono text-xs text-sky-blue mt-1">
                <span>Email: <strong>{DUMMY_ADMIN_CREDENTIALS.email}</strong></span><br />
                <span>Password: <strong>{DUMMY_ADMIN_CREDENTIALS.password}</strong></span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDemoAdminLogin}
              disabled={isSubmitting}
              className="shrink-0 bg-sky-blue/20 hover:bg-sky-blue text-sky-blue hover:text-black font-semibold text-xs px-3.5 py-2.5 rounded-lg border border-sky-blue/40 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Demo Login
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-orange">Staff & Executive Portal</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Branch Admin Sign-In</h1>
          <p className="text-sm text-text-muted mt-2">
            Restricted to BMSCE IEEE Executive Committee members to review payments and verify memberships.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-dark border border-deep-navy/40 p-8 rounded-2xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Admin Email <span className="text-primary-orange">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bmsce.ac.in"
                  className="w-full bg-bg-dark border border-deep-navy/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-orange"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Password <span className="text-primary-orange">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-bg-dark border border-deep-navy/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-orange"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-500/40 rounded-lg text-red-200 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-orange hover:bg-orange-accent text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-orange/20 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isSubmitting ? 'Authenticating...' : 'Enter Dashboard'}</span>
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-text-muted hover:text-white transition-colors">
              &larr; Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
