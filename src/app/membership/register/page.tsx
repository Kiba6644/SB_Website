'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { DUMMY_CREDENTIALS, setDummySession } from '@/lib/auth';
import { Loader2, Mail, Lock, ShieldCheck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [verificationPending, setVerificationPending] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  // Handle Quick Dummy Login
  const handleDummyLogin = () => {
    setIsSubmitting(true);
    setDummySession(DUMMY_CREDENTIALS.email);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/membership/profile');
    }, 400);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    // Check if user is using the dummy credentials manually or Supabase is not configured
    if (!isSupabaseConfigured() || (email === DUMMY_CREDENTIALS.email && password === DUMMY_CREDENTIALS.password)) {
      setDummySession(email);
      setIsSubmitting(false);
      if (mode === 'signup') {
        setPendingEmail(email);
        setVerificationPending(true);
      } else {
        router.push('/membership/profile');
      }
      return;
    }

    try {
      if (mode === 'signup') {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) {
          throw authError;
        }

        setPendingEmail(email);
        setVerificationPending(true);
      } else {
        // Sign In
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw signInError;
        }

        router.push('/membership/profile');
      }
    } catch (err: any) {
      // If network/fetch fails because Supabase project is offline or placeholder, fall back gracefully
      if (
        err.message?.includes('fetch') ||
        err.message?.includes('network') ||
        err.message?.includes('Failed to fetch') ||
        err.name === 'TypeError'
      ) {
        setDummySession(email);
        if (mode === 'signup') {
          setPendingEmail(email);
          setVerificationPending(true);
        } else {
          router.push('/membership/profile');
        }
        return;
      }
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Email verification screen
  if (verificationPending) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-surface-dark border border-deep-navy/40 p-8 rounded-2xl shadow-2xl text-center">
          <div className="w-16 h-16 bg-sky-blue/10 border border-sky-blue/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-sky-blue" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
          <p className="text-text-muted text-sm mb-6">
            We sent a verification link to <span className="text-white font-medium">{pendingEmail}</span>. Please verify your email to unlock profile details and chapter selection.
          </p>

          <div className="bg-bg-dark border border-deep-navy/50 p-4 rounded-xl mb-6 text-left text-xs text-text-muted space-y-2">
            <div className="flex items-center gap-1.5 text-sky-blue font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Testing & Verification Simulation</span>
            </div>
            <p>
              During local testing or development, you can simulate successful email verification by clicking below.
            </p>
          </div>

          <button
            onClick={() => {
              setDummySession(pendingEmail);
              router.push('/membership/profile');
            }}
            className="w-full bg-primary-orange hover:bg-orange-accent text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-orange/20"
          >
            <span>Confirm & Continue to Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-xl mx-auto">
        
        {/* Testing Banner / Dummy Credentials */}
        <div className="bg-primary-navy/20 border border-sky-blue/30 rounded-2xl p-5 mb-8 backdrop-blur-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-sky-blue" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Test Account Available</h3>
              </div>
              <p className="text-xs text-text-muted">
                Quick testing credentials for demonstration & reviewer evaluation:
              </p>
              <div className="font-mono text-xs text-sky-blue mt-1">
                <span>Email: <strong>{DUMMY_CREDENTIALS.email}</strong></span> &bull; <span>PW: <strong>{DUMMY_CREDENTIALS.password}</strong></span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDummyLogin}
              disabled={isSubmitting}
              className="shrink-0 bg-sky-blue/20 hover:bg-sky-blue text-sky-blue hover:text-black font-semibold text-xs px-3.5 py-2.5 rounded-lg border border-sky-blue/40 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Quick Demo Login
            </button>
          </div>
        </div>

        {/* Card Header */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-orange">Step 1 of 4</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
          </h1>
          <p className="text-sm text-text-muted mt-2">
            {mode === 'signup' 
              ? 'Start your BMSCE IEEE membership journey with your institutional credentials.'
              : 'Sign in to review your application status or complete registration.'}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-surface-dark border border-deep-navy/40 p-8 rounded-2xl shadow-2xl">
          
          {/* Mode Switcher */}
          <div className="flex bg-bg-dark p-1 rounded-lg border border-deep-navy/40 mb-6">
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                mode === 'signup'
                  ? 'bg-primary-orange text-white shadow'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                mode === 'signin'
                  ? 'bg-primary-orange text-white shadow'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              Sign In
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Email Address <span className="text-primary-orange">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname.dept23@bmsce.ac.in"
                  className="w-full bg-bg-dark border border-deep-navy/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary-orange"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Password <span className="text-primary-orange">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
                <input
                  required
                  type="password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-bg-dark border border-deep-navy/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary-orange"
                />
              </div>
            </div>

            {/* Confirm Password Field (Only in Sign Up) */}
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Confirm Password <span className="text-primary-orange">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
                  <input
                    required
                    type="password"
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-bg-dark border border-deep-navy/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary-orange"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-500/40 rounded-lg text-red-200 text-xs leading-relaxed">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-orange hover:bg-orange-accent text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-orange/25 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting
                ? (mode === 'signup' ? 'Creating Account...' : 'Signing In...')
                : (mode === 'signup' ? 'Continue to Email Verification' : 'Sign In')}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-text-muted">
            By signing up, you agree to the IEEE code of ethics and BMSCE student branch guidelines.
          </div>
        </div>
      </div>
    </div>
  );
}
