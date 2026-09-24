'use client';

import { useState, useEffect } from 'react';
import { getAnnouncement, Announcement } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { X, Megaphone, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from('announcement')
          .select('*')
          .limit(1)
          .single();
        if (data && data.is_active) {
          setAnnouncement(data);
          return;
        }
      } catch (e) {}

      const localAnn = getAnnouncement();
      if (localAnn && localAnn.is_active) {
        setAnnouncement(localAnn);
      }
    }
    load();
  }, []);

  if (!announcement || !announcement.is_active || dismissed) {
    return null;
  }

  return (
    <aside className="bg-gradient-to-r from-primary-navy via-deep-navy to-primary-navy border-b border-sky-blue/20 text-white text-xs py-2 px-4 relative z-50">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-center gap-2.5 text-center flex-wrap">
          <span className="bg-primary-orange text-white font-bold text-[9px] px-2 py-0.5 rounded tracking-wider uppercase">
            Notice
          </span>
          <span className="font-medium text-text-body">{announcement.message}</span>
          {announcement.link_url && (
            <Link
              href={announcement.link_url}
              className="text-sky-blue hover:text-white font-semibold underline flex items-center gap-0.5 ml-1 transition-colors"
            >
              <span>Learn More</span>
              <ArrowRight className="w-3 h-3 inline" />
            </Link>
          )}
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-text-muted hover:text-white p-1 rounded transition-colors shrink-0"
          title="Dismiss notification"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
