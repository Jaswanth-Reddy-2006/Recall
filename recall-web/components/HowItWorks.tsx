'use client';

import React from 'react';
import { Camera, Sparkles, Check, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-[#FAFBFE] border-t border-slate-100 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Eyebrow & Headline */}
        <div className="space-y-3 mb-14">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#3B5BDB]">
            HOW RECALL WORKS
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Capture → Understand → Act
          </h2>
        </div>

        {/* 3 Step Cards Connected by Arrows */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-6">
          
          {/* Step 1: Capture */}
          <div className="w-full md:w-1/3 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 text-center space-y-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-center gap-2">
              <span className="w-8 h-8 rounded-full bg-pink-100/70 text-[#E6007A] font-bold text-xs flex items-center justify-center">
                01
              </span>
              <div className="w-8 h-8 rounded-full bg-pink-100/70 text-[#E6007A] flex items-center justify-center">
                <Camera className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">Capture</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Save screenshots, links, notes or calls.
              </p>
            </div>
          </div>

          {/* Arrow 1 */}
          <div className="hidden md:flex text-slate-300">
            <ArrowRight className="w-5 h-5" />
          </div>

          {/* Step 2: Understand */}
          <div className="w-full md:w-1/3 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 text-center space-y-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-center gap-2">
              <span className="w-8 h-8 rounded-full bg-purple-100/70 text-[#8B5CF6] font-bold text-xs flex items-center justify-center">
                02
              </span>
              <div className="w-8 h-8 rounded-full bg-purple-100/70 text-[#8B5CF6] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">Understand</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                AI extracts key information, context, and actionable items.
              </p>
            </div>
          </div>

          {/* Arrow 2 */}
          <div className="hidden md:flex text-slate-300">
            <ArrowRight className="w-5 h-5" />
          </div>

          {/* Step 3: Act */}
          <div className="w-full md:w-1/3 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 text-center space-y-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-center gap-2">
              <span className="w-8 h-8 rounded-full bg-emerald-100/70 text-emerald-600 font-bold text-xs flex items-center justify-center">
                03
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-100/70 text-emerald-600 flex items-center justify-center">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">Act</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Find it instantly, get reminders, and turn it into action.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
