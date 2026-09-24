'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Shield, User, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-bg-dark/85 backdrop-blur-md border-b border-surface-dark">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <span className="font-extrabold text-xl tracking-tight text-primary-orange">BMSCE IEEE</span>
          <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 bg-surface-dark border border-deep-navy/40 rounded text-text-muted">
            BRANCH 06261 &bull; R10
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/#chapters" className="text-text-body hover:text-primary-orange transition-colors">
            Chapters
          </Link>
          <Link href="/#about" className="text-text-body hover:text-primary-orange transition-colors">
            About
          </Link>
          <Link href="/account" className="text-text-muted hover:text-white transition-colors">
            My Account
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/admin/login"
            className="text-xs text-sky-blue hover:text-white font-medium px-3 py-1.5 rounded-lg hover:bg-surface-dark border border-sky-blue/30 transition-colors flex items-center gap-1.5"
            title="Executive Admin Portal"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>
          <Link
            href="/membership/register"
            className="text-xs text-text-muted hover:text-white font-medium px-3 py-1.5 rounded-lg hover:bg-surface-dark transition-colors"
          >
            Member Sign In
          </Link>
          <Link
            href="/membership/register"
            className="bg-primary-orange hover:bg-orange-accent text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md shadow-primary-orange/20"
          >
            Become a Member
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/membership/register"
            className="bg-primary-orange text-white text-[11px] font-bold px-3 py-1.5 rounded-md"
          >
            Join
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-text-muted hover:text-white focus:outline-none focus:ring-1 focus:ring-primary-orange rounded-md"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-surface-dark/95 backdrop-blur-lg border-b border-deep-navy/40 px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-medium">
            <Link
              href="/#chapters"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-bg-dark text-text-body transition-colors"
            >
              Our Chapters
            </Link>
            <Link
              href="/#about"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-bg-dark text-text-body transition-colors"
            >
              About BMSCE IEEE
            </Link>
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-bg-dark text-text-body transition-colors flex items-center justify-between"
            >
              <span>Member Account Portal</span>
              <User className="w-4 h-4 text-sky-blue" />
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-bg-dark text-sky-blue transition-colors flex items-center justify-between"
            >
              <span>Executive Admin Portal</span>
              <Shield className="w-4 h-4" />
            </Link>
          </nav>

          <div className="pt-2 border-t border-deep-navy/40 flex flex-col gap-2">
            <Link
              href="/membership/register"
              onClick={() => setIsOpen(false)}
              className="w-full text-center bg-primary-orange hover:bg-orange-accent text-white font-bold py-2.5 rounded-lg text-sm transition-colors"
            >
              Become a Member
            </Link>
            <Link
              href="/membership/register"
              onClick={() => setIsOpen(false)}
              className="w-full text-center bg-bg-dark border border-deep-navy/40 text-text-muted hover:text-white py-2 rounded-lg text-xs transition-colors"
            >
              Existing Member Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
