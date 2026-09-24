'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getAdminUser, getAnnouncement, saveAnnouncement, Announcement } from '@/lib/auth';
import { Loader2, Megaphone, ArrowLeft, CheckCircle2, Eye, Link as LinkIcon, ToggleLeft, ToggleRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminAnnouncementPage() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function init() {
      const admin = await getAdminUser();
      if (!admin) {
        router.push('/admin/login');
        return;
      }

      try {
        const { data } = await supabase
          .from('announcement')
          .select('*')
          .limit(1)
          .single();

        if (data) {
          setMessage(data.message || '');
          setLinkUrl(data.link_url || '');
          setIsActive(data.is_active ?? true);
          setIsLoading(false);
          return;
        }
      } catch (e) {}

      // Fallback
      const ann = getAnnouncement();
      setMessage(ann.message);
      setLinkUrl(ann.link_url || '');
      setIsActive(ann.is_active);
      setIsLoading(false);
    }
    init();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    const payload: Announcement = {
      message,
      link_url: linkUrl,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    };

    saveAnnouncement(payload);

    try {
      await supabase
        .from('announcement')
        .upsert([{ id: 1, ...payload }]);
    } catch (e) {
      console.warn('Supabase announcement table not yet initialized; saved locally');
    }

    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-orange" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-6">
        <Link
          href="/admin/orders"
          className="text-xs text-text-muted hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Verifications</span>
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary-orange/20 border border-primary-orange/40 flex items-center justify-center text-primary-orange">
          <Megaphone className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Announcement Banner Manager</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Configure the global notification banner displayed across the top of the branch website.
          </p>
        </div>
      </div>

      {/* Live Preview Box */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-text-muted">
          <Eye className="w-3.5 h-3.5 text-sky-blue" />
          <span>Live Site Preview</span>
        </div>
        {isActive ? (
          <div className="bg-primary-navy/40 border border-sky-blue/30 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="bg-primary-orange text-white font-bold text-[10px] px-2 py-0.5 rounded">
                ANNOUNCEMENT
              </span>
              <span className="text-white font-medium">{message || 'Your announcement text here...'}</span>
            </div>
            {linkUrl && (
              <span className="text-sky-blue font-semibold underline text-xs shrink-0">
                Learn More &rarr;
              </span>
            )}
          </div>
        ) : (
          <div className="bg-bg-dark border border-deep-navy/40 rounded-xl p-3 text-xs text-center text-text-muted italic">
            Banner is currently toggled OFF (hidden on public site)
          </div>
        )}
      </div>

      {/* Editor Form */}
      <div className="bg-surface-dark border border-deep-navy/40 p-8 rounded-2xl shadow-xl">
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Active Toggle */}
          <div className="flex items-center justify-between p-4 bg-bg-dark border border-deep-navy/40 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-white">Banner Status</p>
              <p className="text-xs text-text-muted">Toggle whether visitors can see this banner on the site.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isActive
                  ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                  : 'bg-red-500/20 text-red-400 border border-red-500/40'
              }`}
            >
              {isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
              <span>{isActive ? 'ENABLED' : 'DISABLED'}</span>
            </button>
          </div>

          {/* Message Text */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
              Banner Message Text <span className="text-primary-orange">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. BMSCE IEEE Membership Drive is now open! Early bird chapter access included."
              className="w-full bg-bg-dark border border-deep-navy/50 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-orange"
            />
          </div>

          {/* Link URL */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
              Call-to-Action Link URL <span className="text-xs text-text-muted/60">(Optional)</span>
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-text-muted absolute left-3.5 top-3" />
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="/membership/register or https://..."
                className="w-full bg-bg-dark border border-deep-navy/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-orange"
              />
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Announcement banner saved and published successfully!</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-primary-orange hover:bg-orange-accent text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-orange/20 disabled:opacity-60"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isSaving ? 'Saving Changes...' : 'Save & Publish Banner'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
