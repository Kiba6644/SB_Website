'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getCurrentUser, saveLocalProfile, getLocalProfile } from '@/lib/auth';
import { Loader2, User, BookOpen, Building2, Phone, Hash, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [usn, setUsn] = useState('');
  const [department, setDepartment] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [phone, setPhone] = useState('');
  const [ieeeMemberId, setIeeeMemberId] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function checkAuth() {
      const activeUser = await getCurrentUser();
      if (!activeUser) {
        router.push('/membership/register');
        return;
      }
      setUser(activeUser);

      // Check if there is existing profile data
      try {
        const { data: dbProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', activeUser.id)
          .single();

        if (dbProfile) {
          setFullName(dbProfile.full_name || '');
          setUsn(dbProfile.usn || '');
          setDepartment(dbProfile.department || '');
          setYearOfStudy(dbProfile.year_of_study || '');
          setPhone(dbProfile.phone || '');
          setIeeeMemberId(dbProfile.ieee_member_id || '');
        } else {
          // Check local fallback
          const localProf = getLocalProfile();
          if (localProf) {
            setFullName(localProf.full_name || '');
            setUsn(localProf.usn || '');
            setDepartment(localProf.department || '');
            setYearOfStudy(localProf.year_of_study || '');
            setPhone(localProf.phone || '');
            setIeeeMemberId(localProf.ieee_member_id || '');
          }
        }
      } catch (err) {
        const localProf = getLocalProfile();
        if (localProf) {
          setFullName(localProf.full_name || '');
          setUsn(localProf.usn || '');
          setDepartment(localProf.department || '');
          setYearOfStudy(localProf.year_of_study || '');
          setPhone(localProf.phone || '');
          setIeeeMemberId(localProf.ieee_member_id || '');
        }
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  // Demo fill helper
  const handleAutoFill = () => {
    setFullName('Aditya Sharma');
    setUsn('1BM23CS012');
    setDepartment('CSE');
    setYearOfStudy('2');
    setPhone('+91 9876543210');
    setIeeeMemberId('');
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setError('');

    const profilePayload = {
      id: user.id,
      full_name: fullName,
      usn: usn.toUpperCase(),
      email: user.email || 'test@bmsce.ac.in',
      department,
      year_of_study: yearOfStudy,
      phone,
      ieee_member_id: ieeeMemberId,
    };

    // Save locally first to guarantee smooth local testing
    saveLocalProfile(profilePayload);

    try {
      // Attempt database save if Supabase is active
      const { error: dbError } = await supabase
        .from('profiles')
        .upsert([profilePayload]);

      if (dbError) {
        console.warn('Supabase profile upsert error (continuing with local state):', dbError.message);
      }

      router.push('/membership/chapters');
    } catch (err: any) {
      console.warn('Supabase not connected; continuing with local profile for test:', err);
      router.push('/membership/chapters');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-orange" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        
        {/* Verification Success Toast */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6 flex items-center justify-between text-xs text-green-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
            <span>Email verified successfully for <strong>{user?.email}</strong></span>
          </div>
          <button
            type="button"
            onClick={handleAutoFill}
            className="flex items-center gap-1 text-sky-blue hover:underline bg-surface-dark px-2.5 py-1 rounded border border-deep-navy/40"
          >
            <Sparkles className="w-3 h-3" />
            Auto-fill Sample Data
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-orange">Step 2 of 4</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Student & Branch Profile</h1>
          <p className="text-sm text-text-muted mt-2">
            Please provide your academic and contact details to finalize your membership profile.
          </p>
        </div>

        {/* Profile Details Form */}
        <div className="bg-surface-dark border border-deep-navy/40 p-8 rounded-2xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Full Name <span className="text-primary-orange">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-bg-dark border border-deep-navy/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-orange"
                />
              </div>
            </div>

            {/* USN and Department */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                  USN <span className="text-primary-orange">*</span>
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
                  <input
                    required
                    type="text"
                    value={usn}
                    onChange={(e) => setUsn(e.target.value)}
                    placeholder="e.g. 1BM23CS001"
                    className="w-full bg-bg-dark border border-deep-navy/50 rounded-lg pl-10 pr-4 py-2.5 text-sm uppercase text-white focus:outline-none focus:ring-2 focus:ring-primary-orange"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Department <span className="text-primary-orange">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5 pointer-events-none" />
                  <select
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-bg-dark border border-deep-navy/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-orange appearance-none"
                  >
                    <option value="">Select Department</option>
                    <option value="CSE">Computer Science & Engg (CSE)</option>
                    <option value="ISE">Information Science & Engg (ISE)</option>
                    <option value="ECE">Electronics & Communication (ECE)</option>
                    <option value="EEE">Electrical & Electronics (EEE)</option>
                    <option value="AIML">Artificial Intelligence & ML</option>
                    <option value="MECH">Mechanical Engineering</option>
                    <option value="CIVIL">Civil Engineering</option>
                    <option value="OTHER">Other Branch</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Year of Study & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Year of Study <span className="text-primary-orange">*</span>
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5 pointer-events-none" />
                  <select
                    required
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(e.target.value)}
                    className="w-full bg-bg-dark border border-deep-navy/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-orange appearance-none"
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year (Freshman)</option>
                    <option value="2">2nd Year (Sophomore)</option>
                    <option value="3">3rd Year (Junior)</option>
                    <option value="4">4th Year (Senior)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full bg-bg-dark border border-deep-navy/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-orange"
                  />
                </div>
              </div>
            </div>

            {/* IEEE Member ID */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Existing IEEE Member ID <span className="text-xs text-text-muted/70">(Optional, if renewing)</span>
              </label>
              <input
                type="text"
                value={ieeeMemberId}
                onChange={(e) => setIeeeMemberId(e.target.value)}
                placeholder="e.g. 98765432"
                className="w-full bg-bg-dark border border-deep-navy/50 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-orange"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-500/40 rounded-lg text-red-200 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-orange hover:bg-orange-accent text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-orange/25 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isSubmitting ? 'Saving Profile...' : 'Save & Select Chapters'}</span>
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
