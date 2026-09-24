'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser, getLocalProfile, getLocalOrders, clearUserSession, resubmitLocalOrderProof } from '@/lib/auth';
import { Loader2, Clock, CheckCircle2, XCircle, LogOut, ArrowRight, UserCheck, ShieldAlert, UploadCloud, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AccountPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Resubmit Modal State
  const [resubmittingOrder, setResubmittingOrder] = useState<any | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newUtr, setNewUtr] = useState('');
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [resubmitSuccess, setResubmitSuccess] = useState(false);

  const loadAccount = async () => {
    setIsLoading(true);
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
    } catch (err) {}

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
  };

  useEffect(() => {
    loadAccount();
  }, [router]);

  const handleSignOut = () => {
    clearUserSession();
    router.push('/');
  };

  // Handle proof resubmission
  const handleConfirmResubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFile || !resubmittingOrder) return;
    setIsResubmitting(true);

    try {
      let previewUrl = '';
      try {
        const fileExt = newFile.name.split('.').pop();
        const fileName = `${resubmittingOrder.user_id}/${resubmittingOrder.order_reference}_resubmit.${fileExt}`;
        const { error: uploadErr } = await supabase.storage
          .from('public-assets')
          .upload(fileName, newFile, { upsert: true });

        if (!uploadErr) {
          previewUrl = supabase.storage.from('public-assets').getPublicUrl(fileName).data.publicUrl;
        }
      } catch (e) {}

      if (!previewUrl) {
        previewUrl = URL.createObjectURL(newFile);
      }

      // Update Supabase if connected
      try {
        await supabase
          .from('orders')
          .update({
            status: 'pending',
            payment_screenshot_url: previewUrl,
            utr_reference: newUtr || resubmittingOrder.utr_reference,
            rejection_reason: null,
          })
          .eq('id', resubmittingOrder.id);
      } catch (e) {}

      // Update local storage
      resubmitLocalOrderProof(resubmittingOrder.id, previewUrl, newUtr);

      setResubmitSuccess(true);
      setTimeout(() => {
        setResubmittingOrder(null);
        setNewFile(null);
        setNewUtr('');
        setResubmitSuccess(false);
        loadAccount();
      }, 1500);

    } catch (err: any) {
      alert('Resubmission failed: ' + err.message);
    } finally {
      setIsResubmitting(false);
    }
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
                        <XCircle className="w-3.5 h-3.5" /> Action Required (Rejected)
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
                    <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-xs space-y-3">
                      <div className="flex items-center gap-1.5 text-red-400 font-semibold">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>Executive Feedback:</span>
                      </div>
                      <p className="text-white font-medium bg-bg-dark/60 p-2.5 rounded-lg border border-red-500/20">
                        {order.rejection_reason || 'Screenshot illegible or transaction not matched.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setResubmittingOrder(order);
                          setNewUtr(order.utr_reference || '');
                        }}
                        className="bg-primary-orange hover:bg-orange-accent text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-primary-orange/20"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Resubmit Clear Payment Proof &rarr;</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Resubmit Proof Modal */}
      {resubmittingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-surface-dark border border-deep-navy/40 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-bold text-white text-lg mb-1">Resubmit Payment Screenshot</h3>
            <p className="text-xs text-text-muted mb-4">
              Updating Order <span className="font-mono text-sky-blue font-semibold">{resubmittingOrder.order_reference}</span> (₹{resubmittingOrder.total_amount})
            </p>

            {resubmitSuccess ? (
              <div className="p-4 bg-green-500/20 border border-green-500/40 rounded-xl text-center text-xs text-green-300">
                <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <span>New payment screenshot uploaded! Status flipped to Pending for review.</span>
              </div>
            ) : (
              <form onSubmit={handleConfirmResubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-text-muted">
                    New Clear Screenshot <span className="text-primary-orange">*</span>
                  </label>
                  <div className="border-2 border-dashed border-deep-navy/50 rounded-xl p-5 text-center hover:border-primary-orange transition-colors cursor-pointer bg-bg-dark relative">
                    <input 
                      required 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setNewFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="pointer-events-none flex flex-col items-center">
                      <UploadCloud className="w-6 h-6 text-sky-blue mb-1.5" />
                      <span className="text-xs font-medium text-white">{newFile ? newFile.name : 'Select clean screenshot'}</span>
                      {!newFile && <span className="text-[10px] text-text-muted mt-0.5">PNG or JPG up to 5MB</span>}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-text-muted">Correct UTR / Reference Number</label>
                  <input
                    type="text"
                    value={newUtr}
                    onChange={(e) => setNewUtr(e.target.value)}
                    placeholder="12-digit transaction number"
                    className="w-full bg-bg-dark border border-deep-navy/50 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary-orange"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setResubmittingOrder(null)}
                    className="px-3.5 py-2 bg-bg-dark border border-deep-navy/50 rounded-lg text-xs font-medium text-text-muted hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isResubmitting || !newFile}
                    className="px-4 py-2 bg-primary-orange hover:bg-orange-accent text-white font-bold rounded-lg text-xs flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isResubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isResubmitting ? 'Submitting...' : 'Upload & Resubmit'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
