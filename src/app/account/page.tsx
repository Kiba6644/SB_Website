'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser, getLocalProfile, getLocalOrders, clearUserSession } from '@/lib/auth';
import { Loader2, Clock, CheckCircle2, XCircle, LogOut, ArrowRight, UserCheck, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AccountPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAccount() {
      const activeUser = await getCurrentUser();
      if (!activeUser) {
        router.push('/membership/register');
        return;
      }

      let userProfile = null;
      let userOrders: any[] = [];

      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', activeUser.id)
          .single();
        if (profileData) userProfile = profileData;

        const { data: ordersData } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', activeUser.id)
          .order('created_at', { ascending: false });
        if (ordersData && ordersData.length > 0) userOrders = ordersData;
      } catch (err) {
        // Fallback to local
      }

      if (!userProfile) {
        const localP = getLocalProfile();
        if (localP) {
          userProfile = localP;
        } else {
          userProfile = {
            full_name: 'IEEE Student Member',
            usn: '1BM23CS012',
            email: activeUser.email || 'test@bmsce.ac.in',
            department: 'Computer Science (CSE)',
            year_of_study: '2',
          };
        }
      }

      if (userOrders.length === 0) {
        const localO = getLocalOrders();
        if (localO && localO.length > 0) {
          userOrders = localO;
        }
      }

      setProfile(userProfile);
      setOrders(userOrders);
      setIsLoading(false);
    }
    loadAccount();
  }, [router]);

  const handleSignOut = () => {
    clearUserSession();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-orange" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-deep-navy/40">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Membership Dashboard</h1>
            <p className="text-sm text-text-muted mt-1">Review your registration details and track verification progress.</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-xs font-semibold px-3 py-2 bg-surface-dark border border-deep-navy/50 rounded-lg text-text-muted hover:text-white hover:border-red-500/50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Profile Sidebar */}
          <div className="bg-surface-dark p-6 rounded-2xl border border-deep-navy/40 h-fit space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-deep-navy/40">
              <UserCheck className="w-5 h-5 text-sky-blue" />
              <h2 className="text-base font-bold text-white">Student Profile</h2>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <p className="text-text-muted uppercase tracking-wider text-[10px] font-bold">Full Name</p>
                <p className="font-semibold text-white mt-0.5">{profile?.full_name || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-text-muted uppercase tracking-wider text-[10px] font-bold">USN</p>
                <p className="font-mono font-semibold text-sky-blue mt-0.5">{profile?.usn || '—'}</p>
              </div>
              <div>
                <p className="text-text-muted uppercase tracking-wider text-[10px] font-bold">Email</p>
                <p className="font-semibold text-white mt-0.5 truncate">{profile?.email}</p>
              </div>
              <div>
                <p className="text-text-muted uppercase tracking-wider text-[10px] font-bold">Department & Year</p>
                <p className="font-semibold text-white mt-0.5">{profile?.department} &bull; Year {profile?.year_of_study}</p>
              </div>
              {profile?.phone && (
                <div>
                  <p className="text-text-muted uppercase tracking-wider text-[10px] font-bold">Phone</p>
                  <p className="font-semibold text-white mt-0.5">{profile.phone}</p>
                </div>
              )}
            </div>

            <div className="pt-2">
              <Link
                href="/membership/profile"
                className="text-xs text-sky-blue hover:text-white flex items-center gap-1 font-medium transition-colors"
              >
                <span>Edit Profile Details</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Orders / Status */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-lg font-bold text-white">Application & Payment Status</h2>
            
            {orders.length === 0 ? (
              <div className="bg-surface-dark p-8 rounded-2xl border border-deep-navy/40 text-center shadow-xl">
                <p className="text-text-muted text-sm mb-5">You haven't submitted any membership orders yet.</p>
                <Link
                  href="/membership/chapters"
                  className="inline-flex items-center gap-2 bg-primary-orange hover:bg-orange-accent text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md shadow-primary-orange/20"
                >
                  <span>Select Chapters & Pay</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-surface-dark p-6 rounded-2xl border border-deep-navy/40 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Order Reference</span>
                      <p className="font-mono text-sky-blue font-bold text-base">{order.order_reference}</p>
                    </div>

                    {/* Status Badge */}
                    {order.status === 'pending' && (
                      <span className="inline-flex items-center gap-1.5 bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 px-3 py-1 rounded-full text-xs font-semibold">
                        <Clock className="w-3.5 h-3.5 animate-pulse" /> Pending Verification
                      </span>
                    )}
                    {order.status === 'verified' && (
                      <span className="inline-flex items-center gap-1.5 bg-green-500/15 border border-green-500/30 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified Member
                      </span>
                    )}
                    {order.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1.5 bg-red-500/15 border border-red-500/30 text-red-400 px-3 py-1 rounded-full text-xs font-semibold">
                        <XCircle className="w-3.5 h-3.5" /> Payment Rejected
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-bg-dark/80 p-3.5 rounded-xl border border-deep-navy/30 text-xs">
                    <div>
                      <p className="text-text-muted">Total Paid</p>
                      <p className="font-bold text-white text-base mt-0.5">₹{order.total_amount}</p>
                    </div>
                    <div>
                      <p className="text-text-muted">UTR / Transaction Ref</p>
                      <p className="font-mono text-text-body mt-0.5 truncate">{order.utr_reference || 'N/A'}</p>
                    </div>
                  </div>

                  {order.status === 'pending' && (
                    <div className="bg-primary-navy/15 border border-primary-navy/30 p-3.5 rounded-xl text-xs text-text-muted leading-relaxed">
                      Your payment screenshot has been uploaded and queued for branch admin review. Once verified against bank records, an automated confirmation receipt will be sent to your email.
                    </div>
                  )}

                  {order.status === 'rejected' && (
                    <div className="bg-red-500/10 border border-red-500/30 p-3.5 rounded-xl text-xs space-y-2">
                      <div className="flex items-center gap-1.5 text-red-400 font-semibold">
                        <ShieldAlert className="w-4 h-4" />
                        <span>Rejection Reason</span>
                      </div>
                      <p className="text-text-muted">{order.rejection_reason || 'Screenshot illegible or transaction not matched.'}</p>
                      <Link
                        href="/membership/checkout"
                        className="inline-block text-primary-orange hover:underline font-semibold mt-1"
                      >
                        Resubmit Payment Proof &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

