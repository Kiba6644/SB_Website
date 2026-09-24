import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BMSCE IEEE Student Branch',
  description: 'Official student branch of IEEE at B.M.S. College of Engineering, Bengaluru.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <body className={`${inter.className} bg-bg-dark text-text-body antialiased min-h-screen flex flex-col`}>
        {/* Dynamic Announcement Banner */}
        <AnnouncementBar />

        {/* Global Responsive Navigation Header */}
        <Navbar />

        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-surface-dark border-t border-deep-navy/30 py-8 mt-20">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-text-muted text-xs">
            <p>&copy; {new Date().getFullYear()} BMSCE IEEE Student Branch. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/account" className="hover:text-white transition-colors">Member Portal</Link>
              <span>&bull;</span>
              <Link href="/admin/login" className="hover:text-sky-blue transition-colors font-medium">Executive Admin</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
