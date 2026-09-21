'use client';

import React from 'react';
import Link from 'next/link';
import { Github, Linkedin, Youtube } from 'lucide-react';
import { RecallLogo } from './Navbar';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 text-slate-600 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Top Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10">
          
          {/* Brand & Tagline */}
          <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
            <Link href="/" className="flex items-center gap-2.5">
              <RecallLogo size={32} />
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                Recall
              </span>
            </Link>
            <p className="text-[11px] text-slate-500 font-medium">
              Your memory, finally organized.
            </p>
          </div>

          {/* Middle Nav Links: FAQ's, Contact, Privacy only */}
          <div className="flex items-center gap-8 font-semibold text-slate-600 text-xs">
            <a href="#faq" className="hover:text-slate-900 transition-colors">
              FAQ's
            </a>
            <a href="mailto:contact@recall.ai" className="hover:text-slate-900 transition-colors">
              Contact
            </a>
            <a href="#privacy" className="hover:text-slate-900 transition-colors">
              Privacy
            </a>
          </div>

          {/* Right Social Icons: GitHub repo, LinkedIn post, YouTube video (No Twitter) */}
          <div className="flex items-center gap-4 text-slate-800">
            <a
              href="https://github.com/Jaswanth-Reddy-2006/Recall"
              target="_blank"
              rel="noreferrer"
              title="GitHub Repository"
              className="p-2 rounded-xl hover:text-[#E6007A] hover:bg-slate-50 transition-all border border-slate-100 shadow-sm"
              aria-label="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              title="LinkedIn Post"
              className="p-2 rounded-xl hover:text-[#2563EB] hover:bg-slate-50 transition-all border border-slate-100 shadow-sm"
              aria-label="LinkedIn Post"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              title="YouTube Video"
              className="p-2 rounded-xl hover:text-rose-600 hover:bg-slate-50 transition-all border border-slate-100 shadow-sm"
              aria-label="YouTube Video"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>

        </div>

        {/* Bottom Sub-Footer Divider Row */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-medium">
          <div>
            Built with <span className="text-[#E6007A]">❤️</span> for a more mindful tomorrow
          </div>
          <div>
            © 2026 Recall. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}
