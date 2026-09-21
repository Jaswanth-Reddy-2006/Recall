'use client';

import React, { useState } from 'react';
import { Search, ArrowRight, Database, Calendar, Zap, CheckCircle2 } from 'lucide-react';

export default function PersonalSearch() {
  const [activeQuery, setActiveQuery] = useState('When is the placement test and what are requirements?');

  const queries = [
    'When is the placement test and what are requirements?',
    'What did Sarah say about Redis caching?',
    'DBMS lab submission deadline',
  ];

  const resultsMap: Record<string, { aiAnswer: string; items: any[] }> = {
    'When is the placement test and what are requirements?': {
      aiAnswer:
        'The TechCorp placement drive is on Tuesday, September 22, 2026 at 10:00 AM in Main Auditorium 3. Portal registration closes at 09:00 AM. Requirements: 7.5+ CGPA, B.Tech CSE/IT/ECE, College ID and 2 hard-copy resumes.',
      items: [
        {
          title: 'TechCorp On-Campus Hiring Drive 2026',
          category: 'Placement',
          reason: 'Direct match: Contains full recruitment schedule, package (18 LPA), venue, and eligibility criteria.',
          snippet: 'Official TechCorp drive notice. Pre-placement talk at 10:00 AM. Requires 7.5+ CGPA and 2 resumes.',
          date: '22 September 2026',
          similarity: '98% Vector Cosine Match',
        },
        {
          title: 'Campus Placement Guidelines 2026 (PDF)',
          category: 'Academic',
          reason: 'Semantic relation: General college rules for campus hiring drives and attire.',
          snippet: 'College placement cell policy on attendance, ID cards, and interview protocol.',
          date: '20 September 2026',
          similarity: '87% Vector Cosine Match',
        },
      ],
    },
    'What did Sarah say about Redis caching?': {
      aiAnswer:
        'During the Sprint Sync call yesterday, Sarah confirmed migrating session storage to Redis 7.2 to resolve DB locking. She is drafting the OpenAPI cache invalidation spec by Sep 25.',
      items: [
        {
          title: 'Backend Sprint Sync with Sarah & Alex (Call)',
          category: 'Meeting',
          reason: 'Audio Transcript Match: Sarah discussed Redis cache-aside architecture and latency reduction.',
          snippet: 'Sarah agreed to write the cache invalidation schema for the mobile gateway by Sep 25.',
          date: '21 September 2026',
          similarity: '96% Vector Cosine Match',
        },
        {
          title: 'Redis Cache Architecture RFC',
          category: 'Engineering',
          reason: 'Keyword & Semantic match on Redis clustering and failover logic.',
          snippet: 'P99 latency drops from 280ms to 18ms with Redis cluster. WebSockets replace HTTP polling.',
          date: '19 September 2026',
          similarity: '91% Vector Cosine Match',
        },
      ],
    },
    'DBMS lab submission deadline': {
      aiAnswer:
        'Your DBMS Assignment 3 (B+ Trees & Normalization) is due on Thursday, September 24, 2026 at 11:59 PM on the college portal.',
      items: [
        {
          title: 'DBMS Assignment 3: B+ Trees & Indexing',
          category: 'Academic',
          reason: 'Extracted task commitment with deadline: 24 September 2026.',
          snippet: 'Submit report and SQL normalization scripts before Thursday midnight.',
          date: '24 September 2026',
          similarity: '99% Vector Cosine Match',
        },
      ],
    },
  };

  const activeData = resultsMap[activeQuery] || resultsMap['When is the placement test and what are requirements?'];

  return (
    <section id="search" className="py-20 md:py-28 bg-white border-y border-surface-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-pale-blue border border-surface-border text-xs font-bold uppercase tracking-wider text-primary shadow-subtle">
            HYBRID CONTEXTUAL SEARCH
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-4 mb-4">
            Ask your personal memory anything.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Recall combines Nomic Embed v1.5 vector representations with local keyword inverted indexes. It answers in natural language and reveals exactly which memory it derived the answer from.
          </p>
        </div>

        {/* Search Simulator Card */}
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Query Suggestion Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              CLICK TO QUERY:
            </span>
            {queries.map((q) => (
              <button
                key={q}
                onClick={() => setActiveQuery(q)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeQuery === q
                    ? 'bg-primary text-white shadow-royal'
                    : 'bg-pale-blue hover:bg-surface-secondary text-slate-700 border border-surface-border'
                }`}
              >
                "{q}"
              </button>
            ))}
          </div>

          {/* Search Input Box - Solid Royal Blue Highlight */}
          <div className="bg-pale-blue p-3.5 rounded-2xl border-2 border-primary shadow-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-surface-border text-primary flex items-center justify-center shrink-0 shadow-subtle">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              readOnly
              value={activeQuery}
              className="bg-transparent flex-1 text-slate-900 font-bold text-base sm:text-lg focus:outline-none"
            />
            <div className="shrink-0 px-3 py-1.5 rounded-xl bg-white text-primary text-xs font-bold flex items-center gap-1.5 border border-surface-border shadow-subtle">
              <Zap className="w-3.5 h-3.5 fill-primary" />
              <span className="hidden sm:inline">Nomic Embed Vector</span>
            </div>
          </div>

          {/* AI Synthesized Answer Box */}
          <div className="bg-pale-blue border border-surface-border rounded-2xl p-6 sm:p-7 space-y-3 shadow-subtle">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-primary">
                RECALL SYNTHESIZED CONTEXT ANSWER
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-slate-600 border border-surface-border">
                On-Device
              </span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
              {activeData.aiAnswer}
            </p>
          </div>

          {/* Matched Source Memories */}
          <div className="bg-white border border-surface-border rounded-2xl p-6 sm:p-8 space-y-4 shadow-card">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider pb-3 border-b border-surface-border">
              <span>{activeData.items.length} Source Memories Cited</span>
              <span className="text-primary font-bold">Vector + Keyword Match</span>
            </div>

            <div className="space-y-3.5">
              {activeData.items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-pale-blue/60 p-4 sm:p-5 rounded-xl border border-surface-border space-y-2 hover:border-primary transition-all shadow-subtle"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white text-primary border border-surface-border">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-3">
                      {item.date && (
                        <span className="flex items-center gap-1 text-xs font-bold text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span>{item.date}</span>
                        </span>
                      )}
                      <span className="text-[11px] font-bold text-primary">
                        {item.similarity}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-base font-black text-slate-900">
                    {item.title}
                  </h4>

                  <div className="text-xs font-semibold text-primary bg-white px-3 py-1.5 rounded-lg border border-surface-border inline-block">
                    Why it matched: {item.reason}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.snippet}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Punchline */}
        <div className="text-center mt-14 pt-8 border-t border-surface-border">
          <p className="text-xl sm:text-2xl font-black text-slate-900">
            Recall connects what you asked with why it was captured.
          </p>
        </div>

      </div>
    </section>
  );
}
