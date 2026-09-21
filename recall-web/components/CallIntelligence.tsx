'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PhoneCall, CheckCircle2, Clock, Calendar, Users, Zap, ArrowRight, Eye } from 'lucide-react';

export default function CallIntelligence() {
  const [showMockup, setShowMockup] = useState(false);

  return (
    <section className="py-20 md:py-28 bg-white border-y border-surface-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-pale-blue border border-surface-border text-xs font-bold uppercase tracking-wider text-primary shadow-subtle">
            MEETING &amp; CALL INTELLIGENCE
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-4 mb-4">
            Conversations turn into concrete actions.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Recall transcribes phone calls and team syncs locally. It isolates architecture decisions, assigns follow-up owners, and extracts deadlines directly into your inbox.
          </p>
        </div>

        {/* View Switcher Pill */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 rounded-xl bg-pale-blue border border-surface-border">
            <button
              onClick={() => setShowMockup(false)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                !showMockup
                  ? 'bg-primary text-white shadow-royal'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Interactive Analysis View
            </button>
            <button
              onClick={() => setShowMockup(true)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                showMockup
                  ? 'bg-primary text-white shadow-royal'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Mobile App Screen
            </button>
          </div>
        </div>

        {showMockup ? (
          /* Real Mobile Screen Mockup */
          <div className="max-w-sm mx-auto rounded-[36px] overflow-hidden border-4 border-slate-900 shadow-2xl bg-slate-900 p-2">
            <Image
              src="/screenshots/call-intelligence.svg"
              alt="Call Intelligence Screen"
              width={420}
              height={860}
              className="w-full h-auto block rounded-[28px]"
            />
          </div>
        ) : (
          /* Interactive Call Analysis Card - RU_Ready Styled */
          <div className="max-w-3xl mx-auto bg-pale-blue rounded-2xl border border-surface-border shadow-card p-6 sm:p-10 space-y-8">
            
            {/* Call Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-surface-border gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-white border border-surface-border text-primary shadow-subtle">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">
                      Backend Sprint Sync Call
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 font-medium mt-0.5">
                      <Users className="w-3.5 h-3.5 text-primary" />
                      <span>Sarah Lin, Alex Chen, Jaswanth Reddy</span>
                      <span>•</span>
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>38 min duration</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-xl bg-white text-primary text-xs font-bold border border-surface-border shadow-subtle">
                  Whisper + Qwen3 8B
                </span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
              <div className="bg-white border border-surface-border p-4 rounded-xl shadow-subtle">
                <div className="text-2xl sm:text-3xl font-black text-primary">2</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-0.5">Decisions</div>
              </div>
              <div className="bg-white border border-surface-border p-4 rounded-xl shadow-subtle">
                <div className="text-2xl sm:text-3xl font-black text-primary">2</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-0.5">Follow-ups</div>
              </div>
              <div className="bg-white border border-surface-border p-4 rounded-xl shadow-subtle">
                <div className="text-2xl sm:text-3xl font-black text-primary">Sep 25</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-0.5">Next Deadline</div>
              </div>
            </div>

            {/* Extracted Decisions & Action Items */}
            <div className="space-y-4">
              
              {/* Decision 1 */}
              <div className="bg-white border border-surface-border p-5 rounded-xl space-y-2 shadow-subtle">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-pale-blue text-primary border border-surface-border">
                    DECISION #1
                  </span>
                  <span className="text-xs text-slate-400 font-bold">Consensus Approved</span>
                </div>
                <div className="text-sm font-black text-slate-900">
                  Migrate session management to Redis 7.2 cluster
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Context: Resolves DB lock contention during high-frequency sync bursts and decreases mobile client latency to under 30ms.
                </p>
              </div>

              {/* Follow-up Action 1 */}
              <div className="bg-white border border-surface-border p-5 rounded-xl space-y-2 shadow-subtle">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-pale-blue text-primary border border-surface-border">
                    ACTION ITEM • SARAH
                  </span>
                  <span className="text-xs text-primary font-bold">Due Sep 25</span>
                </div>
                <div className="text-sm font-black text-slate-900">
                  Publish updated OpenAPI specs for cache invalidation
                </div>
                <p className="text-xs text-slate-600">
                  Transcript excerpt: "I'll draft and commit the OpenAPI cache invalidation spec before Wednesday EOD."
                </p>
              </div>

              {/* Follow-up Action 2 */}
              <div className="bg-white border border-primary p-5 rounded-xl space-y-2 shadow-card">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-primary text-white">
                    ACTION ITEM • ALEX
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-primary">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Due Sep 26</span>
                  </span>
                </div>
                <div className="text-sm font-black text-slate-900">
                  Benchmark Redis cluster latency on AWS staging environment
                </div>
                <p className="text-xs text-slate-600">
                  Direct assignment created in Action Inbox and synced to team calendar.
                </p>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
