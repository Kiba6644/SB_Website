import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import AnnouncementBar from '@/components/AnnouncementBar';

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

        {/* Global Navigation Header */}
        <header className="sticky top-0 z-40 bg-bg-dark/80 backdrop-blur-md border-b border-surface-dark">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-bold text-xl text-primary-orange">BMSCE IEEE</span>
              <span className="hidden sm:inline-block text-xs font-medium px-2 py-1 bg-surface-dark rounded text-text-muted">
                BRANCH 06261
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="#chapters" className="hover:text-primary-orange transition-colors">Chapters</Link>
              <Link href="#about" className="hover:text-primary-orange transition-colors">About</Link>
            </nav>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/admin/login"
                className="text-xs text-sky-blue hover:text-white font-medium px-2.5 py-1.5 rounded-md hover:bg-surface-dark border border-sky-blue/30 transition-colors flex items-center gap-1"
                title="Branch Executive Admin Portal"
              >
                <span>Admin</span>
              </Link>
              <Link
                href="/membership/register"
                className="text-xs text-text-muted hover:text-white font-medium px-2.5 py-1.5 rounded-md hover:bg-surface-dark transition-colors hidden sm:inline-block"
              >
                Member Sign In
              </Link>
              <Link
                href="/membership/register"
                className="bg-primary-orange hover:bg-orange-accent text-white px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors shadow-sm shadow-primary-orange/20"
              >
                Become a Member
              </Link>
            </div>
          </div>
        </header>

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
