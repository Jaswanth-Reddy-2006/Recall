'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import SparkleNavbar from './SparkleNavbar';

export function RecallLogo({ size = 32 }: { size?: number }) {
  return (
    <img
      src="/logo.png"
      alt="Recall Logo"
      style={{ width: `${size}px`, height: `${size * 0.58}px` }}
      className="shrink-0 object-contain"
    />
  );
}

const NAV_ITEMS = ['Home', 'Problem', 'Features', 'How it Works', 'Screens', 'Privacy', 'FAQ'];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  // Scroll tracking to update active section index as user scrolls the page
  useEffect(() => {
    const handleScrollTracking = () => {
      const scrollPos = window.scrollY + 200;

      const homeEl = document.getElementById('home');
      const problemEl = document.getElementById('problem');
      const featuresEl = document.getElementById('features');
      const howItWorksEl = document.getElementById('how-it-works');
      const screensEl = document.getElementById('screens');
      const privacyEl = document.getElementById('privacy');
      const faqEl = document.getElementById('faq');

      const faqTop = faqEl ? faqEl.offsetTop : 99999;
      const privacyTop = privacyEl ? privacyEl.offsetTop : 99999;
      const screensTop = screensEl ? screensEl.offsetTop : 99999;
      const howItWorksTop = howItWorksEl ? howItWorksEl.offsetTop : 99999;
      const featuresTop = featuresEl ? featuresEl.offsetTop : 99999;
      const problemTop = problemEl ? problemEl.offsetTop : 99999;

      if (scrollPos >= faqTop - 120) {
        setActiveSectionIndex(6);
      } else if (scrollPos >= privacyTop - 120) {
        setActiveSectionIndex(5);
      } else if (scrollPos >= screensTop - 120) {
        setActiveSectionIndex(4);
      } else if (scrollPos >= howItWorksTop - 120) {
        setActiveSectionIndex(3);
      } else if (scrollPos >= featuresTop - 120) {
        setActiveSectionIndex(2);
      } else if (scrollPos >= problemTop - 120) {
        setActiveSectionIndex(1);
      } else {
        setActiveSectionIndex(0);
      }
    };

    window.addEventListener('scroll', handleScrollTracking, { passive: true });
    handleScrollTracking();
    return () => window.removeEventListener('scroll', handleScrollTracking);
  }, []);

  const handleItemClick = (item: string, index: number) => {
    setActiveSectionIndex(index);
    setMobileMenuOpen(false);

    if (item === 'Home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item === 'Problem') {
      document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' });
    } else if (item === 'Features') {
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    } else if (item === 'How it Works') {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    } else if (item === 'Screens') {
      document.getElementById('screens')?.scrollIntoView({ behavior: 'smooth' });
    } else if (item === 'Privacy') {
      document.getElementById('privacy')?.scrollIntoView({ behavior: 'smooth' });
    } else if (item === 'FAQ') {
      document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-4 inset-x-0 z-50 max-w-4xl mx-auto px-4 transition-all">
      {/* Floating Glassmorphism Navbar with RU_Ready Sparkle Beam Navigation */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-lg shadow-black/5 rounded-full px-5 sm:px-7 py-2 flex items-center justify-between">
        
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <RecallLogo size={30} />
          <span className="font-extrabold text-lg tracking-tight text-slate-900">
            Recall
          </span>
        </Link>

        {/* Center: RU_Ready Style Sparkle Animated Navbar with Scroll Tracking */}
        <div className="hidden md:flex items-center">
          <SparkleNavbar
            items={NAV_ITEMS}
            color="#2563EB"
            activeIndex={activeSectionIndex}
            onItemClick={handleItemClick}
          />
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-xl space-y-2">
          {NAV_ITEMS.map((item, idx) => {
            const isActive = activeSectionIndex === idx;
            return (
              <button
                key={item}
                onClick={() => handleItemClick(item, idx)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-blue-50 text-[#2563EB]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
