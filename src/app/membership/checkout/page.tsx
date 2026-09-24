'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getCurrentUser, saveLocalOrder } from '@/lib/auth';
import { Loader2, UploadCloud, Info, CheckCircle2, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function CheckoutPage() {
  const router = useRouter();
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [baseFee, setBaseFee] = useState<number>(0);
  const [chapters, setChapters] = useState<any[]>([]);
  const [upiString, setUpiString] = useState('');
  const [orderRef, setOrderRef] = useState('');
  
  const [file, setFile] = useState<File | null>(null);
  const [utr, setUtr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function initCheckout() {
      const activeUser = await getCurrentUser();
      if (!activeUser) {
        router.push('/membership/register');
        return;
      }

      const storedChapters = JSON.parse(sessionStorage.getItem('checkout_chapters') || '[]');
      const storedBase = Number(sessionStorage.getItem('checkout_base_fee') || 0);
      
      const total = storedBase + storedChapters.reduce((sum: number, c: any) => sum + Number(c.price), 0);
      setChapters(storedChapters);
      setBaseFee(storedBase);
      setTotalAmount(total > 0 ? total : 250);

      // Generate a unique order reference
      const ref = `BMSCE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setOrderRef(ref);

      // Fetch UPI config from DB (or use fallback)
      let vpa = 'bmsceieee@okhdfcbank';
      let name = 'BMSCE IEEE Student Branch';

      try {
        const { data: config } = await supabase
          .from('membership_config')
          .select('payee_vpa, payee_name')
          .eq('id', 1)
          .single();
        if (config?.payee_vpa) vpa = config.payee_vpa;
        if (config?.payee_name) name = config.payee_name;
      } catch (e) {
        // fallback
      }
      
      // Generate UPI Intent String
      const intent = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(name)}&am=${total > 0 ? total : 250}&cu=INR&tn=${ref}`;
      setUpiString(intent);
    }
    
    initCheckout();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a screenshot of your payment.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      const activeUser = await getCurrentUser();
      if (!activeUser) {
        throw new Error("You must be logged in to checkout. Please restart registration.");
      }

      let screenshotUrl = '';
      try {
        // 1. Upload screenshot to Supabase Storage if available
        const fileExt = file.name.split('.').pop();
        const fileName = `${activeUser.id}/${orderRef}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('public-assets')
          .upload(fileName, file);

        if (!uploadError) {
          screenshotUrl = supabase.storage.from('public-assets').getPublicUrl(fileName).data.publicUrl;
        }
      } catch (uploadErr) {
        console.warn('Storage upload fallback triggered:', uploadErr);
      }

      // If storage is unconfigured, create local preview URL for demonstration
      if (!screenshotUrl) {
        screenshotUrl = URL.createObjectURL(file);
      }

      const orderPayload = {
        id: 'ord-' + Math.random().toString(36).substring(2, 10),
        user_id: activeUser.id,
        base_fee: baseFee,
        total_amount: totalAmount,
        payment_screenshot_url: screenshotUrl,
        utr_reference: utr || 'UTR-MOCK-' + Math.floor(100000000 + Math.random() * 900000000),
        order_reference: orderRef,
        status: 'pending',
        created_at: new Date().toISOString(),
        chapters: chapters.map(c => c.name || c.code),
      };

      // Always save to local orders for instant test reactivity
      saveLocalOrder(orderPayload);

      // Attempt Supabase DB insert
      try {
        await supabase.from('orders').insert([{
          user_id: activeUser.id,
          base_fee: baseFee,
          total_amount: totalAmount,
          payment_screenshot_url: screenshotUrl,
          utr_reference: utr,
          order_reference: orderRef,
          status: 'pending'
        }]);
      } catch (dbErr) {
        console.warn('Supabase orders table not yet initialized; saved locally:', dbErr);
      }

      // Clear session cart
      sessionStorage.removeItem('checkout_chapters');
      sessionStorage.removeItem('checkout_base_fee');
      router.push('/account');

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during checkout.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-primary-orange">Step 4 of 4</span>
        <h1 className="text-3xl font-bold mb-2 mt-1">Payment & Verification</h1>
        <p className="text-text-muted mb-8">Scan the QR code to pay the exact amount, then upload your transaction receipt.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Payment QR Section */}
          <div className="bg-surface-dark p-8 rounded-xl border border-deep-navy/30 text-center flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-6">Pay via any UPI App</h2>
            
            <div className="bg-white p-4 rounded-xl mb-6 inline-block shadow-lg">
              {upiString ? (
                <QRCodeSVG value={upiString} size={200} />
              ) : (
                <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-200">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              )}
            </div>

            <div className="bg-bg-dark border border-deep-navy/50 p-4 rounded-lg w-full text-left space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-text-muted text-xs uppercase tracking-wider">Amount Due</span>
                <span className="font-bold text-xl text-primary-orange">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted text-xs uppercase tracking-wider">Order Reference</span>
                <span className="font-mono text-sky-blue text-sm font-semibold">{orderRef}</span>
              </div>
            </div>
            
            <div className="mt-4 flex items-start gap-2.5 text-xs text-text-muted text-left bg-primary-navy/10 border border-primary-navy/30 p-3.5 rounded-lg">
              <Info className="w-4 h-4 text-sky-blue shrink-0 mt-0.5" />
              <p>Supported apps: Google Pay, PhonePe, Paytm, BHIM, Amazon Pay. The amount & reference ID will be auto-filled in the intent.</p>
            </div>
          </div>

          {/* Verification Form */}
          <div className="bg-surface-dark p-8 rounded-xl border border-deep-navy/30">
            <h2 className="text-xl font-bold mb-6">Submit Payment Proof</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Upload Payment Screenshot <span className="text-primary-orange">*</span>
                </label>
                <div className="border-2 border-dashed border-deep-navy/50 rounded-xl p-6 text-center hover:border-primary-orange transition-colors cursor-pointer bg-bg-dark relative">
                  <input 
                    required 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="pointer-events-none flex flex-col items-center">
                    <UploadCloud className="w-8 h-8 text-sky-blue mb-2" />
                    <span className="text-sm font-medium text-white">{file ? file.name : 'Click or drop screenshot here'}</span>
                    {!file && <span className="text-xs text-text-muted mt-1">PNG, JPG, or PDF up to 5MB</span>}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                  UPI Reference / UTR Number
                </label>
                <input 
                  type="text" 
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  className="w-full bg-bg-dark border border-deep-navy/50 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-orange" 
                  placeholder="e.g. 423456789012 (12-digit UPI ref)" 
                />
              </div>

              {error && (
                <div className="p-3 bg-red-900/30 border border-red-500/40 rounded-lg text-red-200 text-xs">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !file}
                className="w-full bg-primary-orange hover:bg-orange-accent text-white font-bold py-3 px-4 rounded-lg transition-all flex justify-center items-center gap-2 shadow-lg shadow-primary-orange/20 disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? 'Uploading Proof...' : 'Complete & Submit Registration'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
