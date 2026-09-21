'use client';

import React from 'react';
import { Camera, Link2, FileText, PhoneCall } from 'lucide-react';

export default function Problem() {
  return (
    <section id="problem" className="py-16 md:py-24 bg-[#FAFBFE] border-t border-slate-100 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Eyebrow & Headline */}
        <div className="space-y-3 mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#3B5BDB]">
            THE PROBLEM
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
            Information is everywhere. <br />
            But finding it later is hard.
          </h2>
        </div>

        {/* 4 Cards Grid matching image exactly */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          
          {/* Card 1: Screenshots */}
          <div className="bg-[#F8F7FF] border border-purple-100/80 rounded-2xl p-6 text-center space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-full bg-purple-100/70 text-[#8B5CF6] flex items-center justify-center mx-auto">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Screenshots</h3>
              <p className="text-xs text-slate-500 mt-0.5">Saved, but forgotten</p>
            </div>
          </div>

          {/* Card 2: Links */}
          <div className="bg-[#EFF6FF] border border-blue-100/80 rounded-2xl p-6 text-center space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-full bg-blue-100/70 text-[#2563EB] flex items-center justify-center mx-auto">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Links</h3>
              <p className="text-xs text-slate-500 mt-0.5">Lost in bookmarks</p>
            </div>
          </div>

          {/* Card 3: Notes */}
          <div className="bg-[#FDF2F8] border border-pink-100/80 rounded-2xl p-6 text-center space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-full bg-pink-100/70 text-[#E6007A] flex items-center justify-center mx-auto">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Notes</h3>
              <p className="text-xs text-slate-500 mt-0.5">Buried in apps</p>
            </div>
          </div>

          {/* Card 4: Calls */}
          <div className="bg-[#F0F9FF] border border-cyan-100/80 rounded-2xl p-6 text-center space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-full bg-cyan-100/70 text-[#0284C7] flex items-center justify-center mx-auto">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Calls</h3>
              <p className="text-xs text-slate-500 mt-0.5">Important details slip away</p>
            </div>
          </div>

        </div>

        {/* Punchline */}
        <div className="space-y-1 text-slate-600 text-sm sm:text-base font-medium">
          <p>You remember saving it.</p>
          <p>
            You just don't remember <span className="text-[#E6007A] font-bold">where.</span>
          </p>
        </div>

      </div>
    </section>
  );
}
