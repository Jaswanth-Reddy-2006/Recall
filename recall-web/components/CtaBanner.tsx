'use client';

import React from 'react';
import { Github, Play } from 'lucide-react';

export default function CtaBanner() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden text-center bg-white border-t border-slate-100">
      {/* Ambient background soft pastel blobs matching the image */}
      <div className="absolute -left-20 bottom-0 w-[420px] h-[320px] bg-blue-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute -right-20 bottom-0 w-[420px] h-[320px] bg-pink-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#3B5BDB]">
          READY TO TAKE CONTROL?
        </span>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Start remembering what matters.
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Explore the Recall open-source repository and experience a smarter, calmer you.
        </p>

        {/* Action Buttons: GitHub Repo + Watch Demo */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md hover:shadow-lg transition-all"
          >
            <Github className="w-4 h-4" />
            <span>GitHub Repository</span>
          </a>

          <a
            href="#home"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
          >
            <div className="w-5 h-5 rounded-full bg-[#FDF2F8] border border-pink-200 flex items-center justify-center text-[#E6007A]">
              <Play className="w-2.5 h-2.5 fill-[#E6007A] translate-x-0.5" />
            </div>
            <span>Watch Demo</span>
          </a>
        </div>

      </div>
    </section>
  );
}
