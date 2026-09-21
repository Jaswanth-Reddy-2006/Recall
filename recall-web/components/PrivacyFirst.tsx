'use client';

import React from 'react';
import { Lock, EyeOff, Plane, Settings } from 'lucide-react';

export default function PrivacyFirst() {
  return (
    <section id="privacy" className="py-16 md:py-24 bg-[#FAFBFE] border-t border-slate-100 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Eyebrow, Headline & Subtitle */}
        <div className="space-y-3 mb-14 max-w-2xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#3B5BDB]">
            PRIVACY FIRST
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Your data. Your device. Your control.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Recall is designed with local-first AI. Your information stays private, and you are always in control.
          </p>
        </div>

        {/* 4 Privacy Guarantees Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Card 1: Local AI processing */}
          <div className="bg-white/80 border border-slate-200/80 rounded-3xl p-6 text-center space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Local AI processing</h3>
              <p className="text-xs text-slate-500 mt-0.5">Powered by open models</p>
            </div>
          </div>

          {/* Card 2: No data selling */}
          <div className="bg-white/80 border border-slate-200/80 rounded-3xl p-6 text-center space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-100/80 text-[#8B5CF6] flex items-center justify-center mx-auto shadow-sm">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">No data selling</h3>
              <p className="text-xs text-slate-500 mt-0.5">Your data stays yours</p>
            </div>
          </div>

          {/* Card 3: Works offline */}
          <div className="bg-white/80 border border-slate-200/80 rounded-3xl p-6 text-center space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-100/80 text-[#2563EB] flex items-center justify-center mx-auto shadow-sm">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Works offline</h3>
              <p className="text-xs text-slate-500 mt-0.5">No internet required</p>
            </div>
          </div>

          {/* Card 4: You're in control */}
          <div className="bg-white/80 border border-slate-200/80 rounded-3xl p-6 text-center space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100/80 text-[#3B5BDB] flex items-center justify-center mx-auto shadow-sm">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">You're in control</h3>
              <p className="text-xs text-slate-500 mt-0.5">Export or delete anytime</p>
            </div>
          </div>

        </div>

        {/* Handwritten Quote below Privacy Cards */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="flex items-center gap-3">
            <span className="font-handwriting text-3xl sm:text-4xl font-bold text-[#1E3A8A] -rotate-2">
              A smarter you, every day
            </span>
            <svg width="40" height="40" viewBox="0 0 50 50" fill="none" className="text-[#1E3A8A] -rotate-12 hidden sm:block">
              <path
                d="M10 25C22 15 36 20 42 32M42 32L34 32M42 32L40 24"
                stroke="#1E3A8A"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
}
