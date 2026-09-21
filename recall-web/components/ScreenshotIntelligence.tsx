'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Calendar, CheckCircle2, ShieldCheck, Zap, ArrowRight, Eye, Sparkles } from 'lucide-react';

export default function ScreenshotIntelligence() {
  const [completedActions, setCompletedActions] = useState<Record<number, boolean>>({});
  const [activeView, setActiveView] = useState<'both' | 'flyer' | 'mobile'>('both');

  const toggleAction = (id: number) => {
    setCompletedActions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const actions = [
    {
      id: 1,
      title: 'Submit resume on campus placement portal',
      time: '09:00 AM • Sep 22, 2026',
      badge: 'Cutoff Deadline',
    },
    {
      id: 2,
      title: 'Attend Pre-Placement Talk in Auditorium 3',
      time: '10:00 AM • Sep 22, 2026',
      badge: 'Mandatory',
    },
    {
      id: 3,
      title: 'Print 2 hard copies of updated resume & College ID',
      time: '08:30 AM • Sep 22, 2026',
      badge: 'Checklist',
    },
  ];

  return (
    <section id="screenshot-ai" className="py-20 md:py-28 bg-white border-y border-surface-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block px-3.5 py-1 rounded-full bg-pale-blue border border-surface-border text-xs font-bold uppercase tracking-wider text-primary shadow-subtle">
            VISION REASONING ENGINE
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-4 mb-4">
            A screenshot isn't just an image.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Other apps store dead pixels. Recall executes on-device visual OCR, parses entities, identifies deadlines, and routes them straight into your calendar and inbox.
          </p>
        </div>

        {/* View Switcher Tabs (Interactive) */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-xl bg-pale-blue border border-surface-border gap-1">
            <button
              onClick={() => setActiveView('both')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeView === 'both'
                  ? 'bg-primary text-white shadow-royal'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Side-by-Side Comparison
            </button>
            <button
              onClick={() => setActiveView('flyer')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeView === 'flyer'
                  ? 'bg-primary text-white shadow-royal'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Raw Flyer Poster
            </button>
            <button
              onClick={() => setActiveView('mobile')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeView === 'mobile'
                  ? 'bg-primary text-white shadow-royal'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Recall Mobile Extraction
            </button>
          </div>
        </div>

        {/* Side-by-Side Transformation Visual */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Left: Real Captured Screenshot Flyer */}
          {(activeView === 'both' || activeView === 'flyer') && (
            <div className={`bg-pale-blue p-5 sm:p-7 rounded-2xl border border-surface-border shadow-card ${activeView === 'flyer' ? 'lg:col-span-2 max-w-xl mx-auto' : ''}`}>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2 text-primary">
                  <Eye className="w-4 h-4" />
                  RAW CAPTURE INPUT
                </span>
                <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-md border border-surface-border">
                  Shared to Recall via Android Intent
                </span>
              </div>

              {/* Real SVG Screenshot of the Flyer */}
              <div className="relative rounded-xl overflow-hidden border border-surface-border shadow-subtle bg-white">
                <Image
                  src="/screenshots/screenshot-flyer.svg"
                  alt="Real TechCorp Campus Recruitment Flyer"
                  width={480}
                  height={640}
                  className="w-full h-auto block"
                />
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1.5 text-primary font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Original high-res asset saved locally</span>
                </div>
                <span className="text-slate-400 font-mono">1.2 MB PNG</span>
              </div>
            </div>
          )}

          {/* Right: AI Understanding Result */}
          {(activeView === 'both' || activeView === 'mobile') && (
            <div className={`bg-white p-6 sm:p-8 rounded-2xl border border-surface-border shadow-card ${activeView === 'mobile' ? 'lg:col-span-2 max-w-xl mx-auto' : ''}`}>
              
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-pale-blue border border-surface-border text-primary text-xs font-black tracking-wider mb-6">
                <Zap className="w-4 h-4 fill-primary" />
                <span>UNDERSTOOD BY RECALL AI (QWEN2.5-VL 3B)</span>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">STRUCTURED TITLE</span>
                  <h4 className="text-2xl font-black text-slate-900 mt-1">
                    TechCorp On-Campus Hiring Drive 2026
                  </h4>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-pale-blue text-primary border border-surface-border">
                    Campus Placement
                  </span>
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-pale-blue text-primary border border-surface-border">
                    ₹18 LPA CTC
                  </span>
                  <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-surface-secondary text-slate-700 border border-surface-border">
                    Auditorium 3
                  </span>
                  <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-surface-secondary text-slate-700 border border-surface-border">
                    7.5+ CGPA
                  </span>
                </div>

                {/* Key Insights */}
                <div className="bg-pale-blue/60 border border-surface-border rounded-xl p-4 space-y-2">
                  <span className="text-[11px] font-black text-primary uppercase tracking-wider">AI EXTRACTED SUMMARY</span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Official TechCorp walk-in drive for Associate Software Engineer roles. Reporting starts at 09:30 AM on September 22, 2026. Online registration portal cutoff is strict at 09:00 AM.
                  </p>
                </div>

                {/* Interactive Action Box */}
                <div className="border border-surface-border rounded-xl p-5 bg-white shadow-subtle space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-primary">
                      AUTOMATED ACTION INBOX ({actions.length} ITEMS)
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">CLICK TO TOGGLE</span>
                  </div>

                  <div className="space-y-2.5">
                    {actions.map((act) => {
                      const isDone = completedActions[act.id];
                      return (
                        <div
                          key={act.id}
                          onClick={() => toggleAction(act.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isDone
                              ? 'bg-pale-blue/40 border-surface-border opacity-70'
                              : 'bg-pale-blue border-surface-border hover:border-primary'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                isDone ? 'bg-primary border-primary text-white' : 'border-primary bg-white'
                              }`}
                            >
                              {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </div>
                            <div>
                              <p className={`text-xs font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                                {act.title}
                              </p>
                              <p className="text-[11px] text-slate-500">{act.time}</p>
                            </div>
                          </div>

                          <span className="shrink-0 text-[10px] font-extrabold px-2.5 py-1 rounded-md bg-white border border-surface-border text-primary">
                            {act.badge}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Section Punchline */}
        <div className="text-center mt-14 pt-8 border-t border-surface-border">
          <p className="text-xl sm:text-2xl font-black text-slate-900">
            Recall turns visual pixels into actionable commitments.
          </p>
        </div>

      </div>
    </section>
  );
}
