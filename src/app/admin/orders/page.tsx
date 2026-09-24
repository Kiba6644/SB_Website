'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getAdminUser, clearAdminSession, getLocalOrders, updateLocalOrderStatus } from '@/lib/auth';
import {
  Loader2, CheckCircle2, XCircle, Clock, Search, Filter, Download,
  ExternalLink, LogOut, Megaphone, ShieldCheck, Eye, RefreshCw, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [rejectingOrder, setRejectingOrder] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Payment screenshot is unclear or transaction reference does not match.');
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = async () => {
    setIsLoading(true);
    const activeAdmin = await getAdminUser();
    if (!activeAdmin) {
      router.push('/admin/login');
      return;
    }
    setAdmin(activeAdmin);

    let allOrders: any[] = [];
    try {
      const { data: dbOrders } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (full_name, usn, email, department, year_of_study, phone)
        `)
        .order('created_at', { ascending: false });

      if (dbOrders && dbOrders.length > 0) {
        allOrders = dbOrders.map(o => ({
          ...o,
          student_name: o.profiles?.full_name || o.student_name,
          usn: o.profiles?.usn || o.usn,
          email: o.profiles?.email || o.email,
          department: o.profiles?.department || o.department,
          year_of_study: o.profiles?.year_of_study || o.year_of_study,
          phone: o.profiles?.phone || o.phone,
        }));
      }
    } catch (e) {
      // Fallback
    }

    if (allOrders.length === 0) {
      allOrders = getLocalOrders();
    }

    setOrders(allOrders);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [router]);

  const handleSignOut = () => {
    clearAdminSession();
    router.push('/admin/login');
  };

  // Verify Order
  const handleVerify = async (order: any) => {
    setProcessingOrderId(order.id);
    try {
      // 1. Update Supabase if available
      try {
        await supabase
          .from('orders')
          .update({
            status: 'verified',
            verified_at: new Date().toISOString(),
          })
          .eq('id', order.id);
      } catch (e) {}

      // 2. Update local state
      updateLocalOrderStatus(order.id, 'verified');

      // 3. Dispatch automated receipt email
      try {
        await fetch('/api/send-receipt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: order.email,
            name: order.student_name || 'Member',
            orderRef: order.order_reference,
            amount: order.total_amount,
            chaptersList: order.chapters || ['Core Branch Membership'],
          }),
        });
      } catch (err) {
        console.warn('Receipt email dispatch error:', err);
      }

      showToast(`Order ${order.order_reference} marked as Verified! Receipt email queued.`);
      loadData();
    } catch (err: any) {
      showToast(`Verification failed: ${err.message}`);
    } finally {
      setProcessingOrderId(null);
    }
  };

  // Reject Order
  const handleConfirmReject = async () => {
    if (!rejectingOrder) return;
    setProcessingOrderId(rejectingOrder.id);
    try {
      try {
        await supabase
          .from('orders')
          .update({
            status: 'rejected',
            rejection_reason: rejectionReason,
          })
          .eq('id', rejectingOrder.id);
      } catch (e) {}

      updateLocalOrderStatus(rejectingOrder.id, 'rejected', rejectionReason);
      showToast(`Order ${rejectingOrder.order_reference} marked as Rejected.`);
      setRejectingOrder(null);
      loadData();
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    } finally {
      setProcessingOrderId(null);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (orders.length === 0) return;
    const headers = ['Order Ref', 'Student Name', 'USN', 'Email', 'Dept', 'Year', 'Phone', 'Amount', 'Status', 'UTR', 'Date'];
    const rows = orders.map(o => [
      `"${o.order_reference || ''}"`,
      `"${o.student_name || ''}"`,
      `"${o.usn || ''}"`,
      `"${o.email || ''}"`,
      `"${o.department || ''}"`,
      `"${o.year_of_study || ''}"`,
      `"${o.phone || ''}"`,
      o.total_amount,
      o.status,
      `"${o.utr_reference || ''}"`,
      `"${new Date(o.created_at).toLocaleDateString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bmsce_ieee_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filters & Search
  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      o.order_reference?.toLowerCase().includes(query) ||
      o.student_name?.toLowerCase().includes(query) ||
      o.usn?.toLowerCase().includes(query) ||
      o.email?.toLowerCase().includes(query) ||
      o.utr_reference?.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const totalCollected = orders
    .filter(o => o.status === 'verified')
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const verifiedCount = orders.filter(o => o.status === 'verified').length;

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-orange" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface-dark border border-sky-blue/50 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-sky-blue" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Navbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-deep-navy/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-primary-navy/40 border border-sky-blue/40 text-sky-blue text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              Admin Portal
            </span>
            <span className="text-xs text-text-muted">Signed in as {admin?.email}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Membership Verifications</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/announcement"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-surface-dark border border-deep-navy/50 rounded-lg text-text-muted hover:text-white hover:border-primary-orange transition-colors"
          >
            <Megaphone className="w-3.5 h-3.5 text-primary-orange" />
            <span>Edit Announcement</span>
          </Link>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-surface-dark border border-deep-navy/50 rounded-lg text-text-muted hover:text-white hover:border-sky-blue transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-sky-blue" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-surface-dark border border-deep-navy/50 rounded-lg text-red-400 hover:text-red-300 hover:border-red-500/50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-dark border border-deep-navy/40 p-5 rounded-2xl shadow-xl">
          <p className="text-xs uppercase font-bold text-text-muted">Total Orders</p>
          <p className="text-2xl font-extrabold text-white mt-1">{orders.length}</p>
        </div>
        <div className="bg-surface-dark border border-yellow-500/30 p-5 rounded-2xl shadow-xl bg-yellow-500/5">
          <p className="text-xs uppercase font-bold text-yellow-400 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Pending Review
          </p>
          <p className="text-2xl font-extrabold text-yellow-400 mt-1">{pendingCount}</p>
        </div>
        <div className="bg-surface-dark border border-green-500/30 p-5 rounded-2xl shadow-xl bg-green-500/5">
          <p className="text-xs uppercase font-bold text-green-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Verified Members
          </p>
          <p className="text-2xl font-extrabold text-green-400 mt-1">{verifiedCount}</p>
        </div>
        <div className="bg-surface-dark border border-sky-blue/30 p-5 rounded-2xl shadow-xl bg-sky-blue/5">
          <p className="text-xs uppercase font-bold text-sky-blue">Verified Funds</p>
          <p className="text-2xl font-extrabold text-white mt-1">₹{totalCollected}</p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-dark border border-deep-navy/40 p-4 rounded-2xl mb-6 shadow-xl">
        {/* Status Tabs */}
        <div className="flex bg-bg-dark p-1 rounded-xl border border-deep-navy/40 w-full sm:w-auto">
          {(['all', 'pending', 'verified', 'rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                statusFilter === tab
                  ? 'bg-primary-orange text-white shadow'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search USN, name, ref, UTR..."
            className="w-full bg-bg-dark border border-deep-navy/50 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-orange"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-surface-dark border border-deep-navy/40 rounded-2xl shadow-2xl overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-text-muted">
            <p className="text-sm">No orders matching criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-deep-navy/50 bg-bg-dark/60 text-text-muted uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">USN & Dept</th>
                  <th className="py-3 px-4">Order Ref / Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Proof</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-deep-navy/30">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-primary-navy/5 transition-colors">
                    {/* Student Info */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white text-sm">{order.student_name || 'Anonymous Student'}</p>
                      <p className="text-text-muted text-[11px] truncate max-w-[180px]">{order.email}</p>
                      {order.phone && <p className="text-text-muted text-[10px]">{order.phone}</p>}
                    </td>

                    {/* USN & Academic Details */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-sky-blue uppercase bg-sky-blue/10 px-2 py-0.5 rounded">
                        {order.usn || 'N/A'}
                      </span>
                      <p className="text-text-muted text-[11px] mt-1">{order.department} &bull; Year {order.year_of_study}</p>
                      {order.chapters && order.chapters.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {order.chapters.map((ch: string) => (
                            <span key={ch} className="text-[9px] bg-primary-navy/40 text-text-muted px-1.5 py-0.5 rounded">
                              {ch}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Order Reference */}
                    <td className="py-3.5 px-4">
                      <p className="font-mono font-bold text-white">{order.order_reference}</p>
                      <p className="text-text-muted text-[10px]">
                        {new Date(order.created_at).toLocaleDateString()} &bull; {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {order.utr_reference && (
                        <p className="text-[10px] font-mono text-text-muted mt-0.5">UTR: {order.utr_reference}</p>
                      )}
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-sm text-primary-orange">₹{order.total_amount}</span>
                    </td>

                    {/* Payment Screenshot */}
                    <td className="py-3.5 px-4">
                      {order.payment_screenshot_url ? (
                        <button
                          type="button"
                          onClick={() => setPreviewImage(order.payment_screenshot_url)}
                          className="flex items-center gap-1.5 text-xs text-sky-blue hover:text-white font-medium bg-bg-dark border border-deep-navy/50 px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Proof</span>
                        </button>
                      ) : (
                        <span className="text-text-muted text-[10px]">No File</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {order.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 px-2.5 py-1 rounded-full text-[11px] font-medium">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                      {order.status === 'verified' && (
                        <span className="inline-flex items-center gap-1 bg-green-500/15 border border-green-500/30 text-green-400 px-2.5 py-1 rounded-full text-[11px] font-medium">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      )}
                      {order.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 bg-red-500/15 border border-red-500/30 text-red-400 px-2.5 py-1 rounded-full text-[11px] font-medium" title={order.rejection_reason}>
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {order.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            disabled={processingOrderId === order.id}
                            onClick={() => handleVerify(order)}
                            className="bg-green-600 hover:bg-green-500 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 disabled:opacity-50"
                          >
                            {processingOrderId === order.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                            <span>Verify</span>
                          </button>

                          <button
                            type="button"
                            disabled={processingOrderId === order.id}
                            onClick={() => setRejectingOrder(order)}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-text-muted">
                          {order.status === 'verified' ? 'Completed' : 'Requires Resubmission'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-surface-dark border border-deep-navy/50 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white text-base">Payment Screenshot Proof</h3>
              <button
                onClick={() => setPreviewImage(null)}
                className="text-text-muted hover:text-white p-1 rounded-lg"
              >
                &times; Close
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto rounded-xl border border-deep-navy/40 flex items-center justify-center bg-bg-dark">
              <img
                src={previewImage}
                alt="Payment screenshot proof"
                className="max-h-[65vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-surface-dark border border-red-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-bold text-white text-base">Reject Payment Proof</h3>
            </div>
            <p className="text-xs text-text-muted mb-4">
              Order: <span className="font-mono text-sky-blue font-bold">{rejectingOrder.order_reference}</span> ({rejectingOrder.student_name})
            </p>

            <div className="space-y-2 mb-6">
              <label className="block text-xs font-semibold text-text-muted">Reason for Rejection</label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full bg-bg-dark border border-deep-navy/50 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary-orange"
              />
              <p className="text-[11px] text-text-muted">
                The applicant will see this reason in their account portal so they can re-upload a valid proof.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRejectingOrder(null)}
                className="px-4 py-2 bg-bg-dark border border-deep-navy/50 rounded-lg text-xs font-semibold text-text-muted hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={processingOrderId === rejectingOrder.id}
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                {processingOrderId === rejectingOrder.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
