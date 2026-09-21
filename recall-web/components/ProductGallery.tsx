'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Layout, Eye, Inbox, Search, PhoneCall, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { GALLERY_SCREENS } from '../data/demoData';

export default function ProductGallery() {
  const [activeIndex, setActiveIndex] = useState(0);

  const screenIcons = [Layout, Eye, Inbox, Search, PhoneCall];
  const current = GALLERY_SCREENS[activeIndex];
  const Icon = screenIcons[activeIndex];

  return (
    <section id="gallery" className="py-20 md:py-28 bg-pale-blue relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-white border border-surface-border text-xs font-bold uppercase tracking-wider text-primary shadow-subtle">
            AUTHENTIC APP SCREENS
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-4 mb-4">
            Engineered for real mobile workflows.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Browse authentic screens from the working Recall mobile prototype. Every screen is designed for frictionless capture and instantaneous context retrieval.
          </p>
        </div>

        {/* Screen Switcher Tabs - RU_Ready Styled */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {GALLERY_SCREENS.map((screen, idx) => {
            const TabIcon = screenIcons[idx];
            const isActive = idx === activeIndex;
            return (
              <button
                key={screen.id}
                onClick={() => setActiveIndex(idx)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-royal'
                    : 'bg-white border border-surface-border text-slate-700 hover:border-primary'
                }`}
              >
                <TabIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-primary'}`} />
                <span>{screen.title}</span>
              </button>
            );
          })}
        </div>

        {/* Showcase Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-center bg-white rounded-2xl border border-surface-border p-6 sm:p-12 shadow-card">
          
          {/* Left Details */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-pale-blue text-primary text-xs font-black border border-surface-border">
              <Icon className="w-4 h-4" />
              <span>{current.tag.toUpperCase()}</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
              {current.title}
            </h3>

            <p className="text-base text-slate-600 leading-relaxed">
              {current.subtitle}
            </p>

            {/* Feature highlights specific to each screen */}
            <div className="space-y-2 pt-2">
              {activeIndex === 0 && (
                <>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Real-time action tracker with countdown badges</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>One-tap quick capture for Screenshot, Link, Note, and Call</span>
                  </div>
                </>
              )}
              {activeIndex === 1 && (
                <>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>On-device vision OCR via Qwen2.5-VL 3B</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Automatic deadline &amp; venue entity linking</span>
                  </div>
                </>
              )}
              {activeIndex === 2 && (
                <>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Confirmed calendar deadlines (no ambiguous "later")</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Instant state toggle with full undo support</span>
                  </div>
                </>
              )}
              {activeIndex === 3 && (
                <>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Nomic Embed v1.5 local cosine vector similarity</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>"Why it matched" reasoning rationale displayed</span>
                  </div>
                </>
              )}
              {activeIndex === 4 && (
                <>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Local Whisper transcription &amp; Qwen summarization</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Clear separation of Decisions vs Assigned Actions</span>
                  </div>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-surface-border flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Screen {activeIndex + 1} of {GALLERY_SCREENS.length}</span>
              <button
                onClick={() => setActiveIndex((prev) => (prev + 1) % GALLERY_SCREENS.length)}
                className="text-primary hover:text-royal-blue-hover flex items-center gap-1 font-bold"
              >
                <span>Next Screen</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Mobile Phone Frame with REAL SVG Screenshot */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-[340px] rounded-[42px] p-2.5 bg-slate-900 shadow-2xl border-4 border-slate-800 transition-all">
              <div className="rounded-[34px] overflow-hidden bg-pale-blue">
                <Image
                  src={current.image}
                  alt={current.title}
                  width={420}
                  height={860}
                  priority
                  className="w-full h-auto block rounded-[34px]"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
