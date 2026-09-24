'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { Loader2, Plus, Minus, Check } from 'lucide-react';

type Chapter = {
  id: string;
  name: string;
  code: string;
  price: number;
};

export default function ChaptersCartPage() {
  const router = useRouter();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [baseFee, setBaseFee] = useState<number>(0);
  const [selectedChapters, setSelectedChapters] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      const activeUser = await getCurrentUser();
      if (!activeUser) {
        router.push('/membership/register');
        return;
      }
      // Fetch chapters and base fee
      const [{ data: chaptersData }, { data: configData }] = await Promise.all([
        supabase.from('chapters').select('*').order('name'),
        supabase.from('membership_config').select('base_fee').eq('id', 1).single()
      ]);

      // Fallback data if DB is empty during development
      if (configData) {
        setBaseFee(configData.base_fee);
      } else {
        setBaseFee(250); // Fallback mock fee
      }

      if (chaptersData && chaptersData.length > 0) {
        setChapters(chaptersData);
      } else {
        // Fallback mock chapters
        setChapters([
          { id: 'mock-1', name: 'Computer Society', code: 'CS', price: 100 },
          { id: 'mock-2', name: 'Power & Energy', code: 'PES', price: 100 },
          { id: 'mock-3', name: 'Women In Engineering', code: 'WIE', price: 50 },
        ]);
      }
      setIsLoading(false);
    }
    loadConfig();
  }, []);

  const toggleChapter = (chapterId: string) => {
    const newSelected = new Set(selectedChapters);
    if (newSelected.has(chapterId)) {
      newSelected.delete(chapterId);
    } else {
      newSelected.add(chapterId);
    }
    setSelectedChapters(newSelected);
  };

  const handleCheckout = () => {
    setIsSubmitting(true);
    // Store selected items in session storage to pass to checkout
    const selected = chapters.filter(c => selectedChapters.has(c.id));
    sessionStorage.setItem('checkout_chapters', JSON.stringify(selected));
    sessionStorage.setItem('checkout_base_fee', baseFee.toString());
    router.push('/membership/checkout');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-orange" /></div>;
  }

  const selectedTotal = chapters
    .filter(c => selectedChapters.has(c.id))
    .reduce((sum, c) => sum + c.price, 0);
  const grandTotal = baseFee + selectedTotal;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-primary-orange">Step 3 of 4</span>
        <h1 className="text-3xl font-bold mb-2 mt-1">Select Technical Chapters</h1>
        <p className="text-text-muted mb-8">Customize your IEEE experience by adding technical chapters.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chapter Selection */}
          <div className="lg:col-span-2 space-y-4">
            {chapters.map(chapter => {
              const isSelected = selectedChapters.has(chapter.id);
              return (
                <div 
                  key={chapter.id} 
                  className={`p-5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-primary-navy/20 border-sky-blue' 
                      : 'bg-surface-dark border-deep-navy/30 hover:border-primary-navy'
                  }`}
                  onClick={() => toggleChapter(chapter.id)}
                >
                  <div>
                    <h3 className="font-bold text-lg text-white">{chapter.name}</h3>
                    <p className="text-text-muted text-sm">{chapter.code}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-sky-blue">₹{chapter.price}</span>
                    <button className={`w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? 'bg-red-500/20 text-red-400' : 'bg-primary-navy text-white'}`}>
                      {isSelected ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary (Cart) */}
          <div className="bg-surface-dark p-6 rounded-xl border border-deep-navy/30 h-fit sticky top-24 shadow-xl">
            <h2 className="text-xl font-bold border-b border-deep-navy/50 pb-4 mb-4">Summary</h2>
            
            <div className="flex justify-between items-center mb-3 text-text-body">
              <span>Base Membership</span>
              <span>₹{baseFee}</span>
            </div>
            
            {chapters.filter(c => selectedChapters.has(c.id)).map(c => (
              <div key={c.id} className="flex justify-between items-center mb-2 text-sm text-text-muted">
                <span>+ {c.code}</span>
                <span>₹{c.price}</span>
              </div>
            ))}

            <div className="border-t border-deep-navy/50 mt-4 pt-4 flex justify-between items-center">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-xl text-primary-orange">₹{grandTotal}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full mt-6 bg-primary-orange hover:bg-orange-accent text-white font-bold py-3 px-4 rounded-md transition-colors flex justify-center items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'Proceeding...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
