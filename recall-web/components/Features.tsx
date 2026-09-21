'use client';

import React from 'react';
import {
  Camera,
  Link2,
  Mic,
  Inbox,
  Search,
  ShieldCheck,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Camera,
    iconColor: 'text-[#E6007A]',
    iconBg: 'bg-pink-50 border-pink-100',
    tag: 'Vision & OCR',
    title: 'Screenshot Intelligence',
    description:
      'Extracts dates, venues, contacts, requirements, and QR codes instantly from images.',
  },
  {
    icon: Link2,
    iconColor: 'text-[#2563EB]',
    iconBg: 'bg-blue-50 border-blue-100',
    tag: 'Web & Docs',
    title: 'Link Knowledge Extraction',
    description:
      'Summarizes articles, documentation, and web pages into concise key takeaways.',
  },
  {
    icon: Mic,
    iconColor: 'text-[#8B5CF6]',
    iconBg: 'bg-purple-50 border-purple-100',
    tag: 'Whisper AI',
    title: 'Voice & Call Intelligence',
    description:
      'Transcribes voice notes and calls into decisions made, owners, and commitments.',
  },
  {
    icon: Inbox,
    iconColor: 'text-[#E6007A]',
    iconBg: 'bg-pink-50 border-pink-100',
    tag: 'Smart Triage',
    title: 'Action Inbox Prioritization',
    description:
      'Auto-sorts memories into Needs Action, Decisions, Knowledge, and Ideas.',
  },
  {
    icon: Search,
    iconColor: 'text-[#2563EB]',
    iconBg: 'bg-blue-50 border-blue-100',
    tag: 'Vector Search',
    title: 'Natural Semantic Search',
    description:
      'Find memories by concept or meaning, even without remembering exact keywords.',
  },
  {
    icon: ShieldCheck,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50 border-emerald-100',
    tag: '100% Private',
    title: 'Local-First Offline Engine',
    description:
      'Runs locally on your device via Ollama and SQLite with zero cloud tracking.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-10 sm:py-12 lg:py-14 bg-white border-t border-slate-100 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Header */}
        <div className="text-center max-w-2xl mx-auto mb-7 sm:mb-9 space-y-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Everything you need to <br />
            <span className="text-[#E6007A]">remember </span>
            <span className="text-[#2563EB]">&amp; take action.</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-lg mx-auto leading-relaxed">
            Local vision OCR, Whisper audio transcription, and semantic vector embeddings built into a single private engine.
          </p>
        </div>

        {/* 6 Compact Feature Cards Grid - Fits comfortably in screen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between text-left relative overflow-hidden"
              >
                <div className="space-y-3">
                  {/* Icon & Tag */}
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${feature.iconBg} ${feature.iconColor} shadow-xs group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {feature.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-[#2563EB] transition-colors leading-snug">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
