'use client';

import React, { useState } from 'react';
import {
  Camera,
  Link2,
  FileText,
  PhoneCall,
  Calendar,
  Tag,
  ExternalLink,
  Volume2,
  Play,
  Clock,
  Shield,
  Zap,
  Lock,
} from 'lucide-react';
import { RecallLogo } from './Navbar';

type TabType = 'Screenshot' | 'Link' | 'Note' | 'Call';

interface ScenarioData {
  leftCard: {
    type: string;
    render: () => React.ReactNode;
  };
  rightCard: {
    title: string;
    category: string;
    date: string;
    keyDetails: string[];
  };
  handwrittenNote: string;
}

export default function SeeItInAction() {
  const [activeTab, setActiveTab] = useState<TabType>('Screenshot');

  const scenarios: Record<TabType, ScenarioData> = {
    Screenshot: {
      leftCard: {
        type: 'Screenshot Flyer',
        render: () => (
          <div className="w-full max-w-[310px] bg-white border border-slate-200 rounded-3xl p-5 shadow-card text-left space-y-3.5 animate-in fade-in duration-300">
            {/* Flyer Header */}
            <div>
              <h3 className="text-xl font-black text-[#0D9488] tracking-tight">
                Walk-in Drive
              </h3>
              <p className="text-[11px] font-semibold text-slate-500">
                Opening: ASM's Engineer Interns
              </p>
            </div>

            {/* Date Box */}
            <div className="bg-[#F0FDFA] rounded-xl p-2.5 space-y-1 border border-teal-100 text-xs text-slate-700">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span className="w-2 h-2 rounded-full bg-[#0D9488]" />
                <span>22 Sept 2026, 10:00 AM</span>
              </div>
              <div className="text-[11px] text-slate-500 pl-4">Seminar Hall B</div>
              <div className="text-[10px] text-slate-400 pl-4">8:00 PM to 11:30 PM</div>
            </div>

            {/* Requirements Bullet Points */}
            <ul className="space-y-1 text-xs text-slate-600 pl-1">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] shrink-0" />
                <span>Resume required</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] shrink-0" />
                <span>Technical interview</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] shrink-0" />
                <span>7+ CGPA preferred</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] shrink-0" />
                <span>Full-time opportunity</span>
              </li>
            </ul>

            {/* Flyer Action Button & QR */}
            <div className="flex items-center gap-2 pt-1">
              <button className="flex-1 py-2 rounded-xl bg-[#0D9488] text-white text-xs font-bold shadow-sm">
                Register Now
              </button>
              <div className="w-8 h-8 bg-slate-900 rounded-lg p-1 shrink-0 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-xs p-0.5">
                  <div className="w-full h-full bg-slate-900 rounded-xs" />
                </div>
              </div>
            </div>
          </div>
        ),
      },
      rightCard: {
        title: 'Walk-in Drive – Engineer Interns',
        category: 'Work',
        date: '22 September 2026, 10:00 AM',
        keyDetails: [
          'Walk-in opportunity',
          'Open to CSE, IT, ECE',
          'Resume required',
          'Technical interview',
          'Full-time opportunity',
        ],
      },
      handwrittenNote: 'From screenshot\nto actionable\ninsights!',
    },

    Link: {
      leftCard: {
        type: 'Saved Web Article',
        render: () => (
          <div className="w-full max-w-[310px] bg-white border border-slate-200 rounded-3xl p-5 shadow-card text-left space-y-3 animate-in fade-in duration-300">
            {/* Browser Address Header */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 text-[10px] text-slate-500 truncate">
              <Link2 className="w-3 h-3 text-[#2563EB] shrink-0" />
              <span className="truncate font-mono">blog.bytebytego.com/p/rate-limiter</span>
            </div>

            {/* Article Title & Source */}
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-[#2563EB]">
                System Design • 8 min read
              </span>
              <h3 className="text-base font-black text-slate-900 tracking-tight mt-1 leading-snug">
                Designing a Scalable Rate Limiter
              </h3>
              <p className="text-[10px] text-slate-500">By Alex Xu • ByteByteGo</p>
            </div>

            {/* Diagram graphic mock */}
            <div className="bg-[#EFF6FF] rounded-xl p-3 border border-blue-100 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold text-[#2563EB]">
                <span>Sliding Window Counter</span>
                <span className="text-[9px] font-mono bg-white px-1.5 py-0.5 rounded border border-blue-200">Redis Cluster</span>
              </div>
              <div className="h-1.5 w-full bg-blue-200 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-[#2563EB] rounded-full" />
              </div>
              <p className="text-[10px] text-slate-600 leading-tight">
                Bounds memory usage while handling high-throughput bursts smoothly.
              </p>
            </div>

            {/* Excerpt */}
            <p className="text-[11px] text-slate-600 line-clamp-2 italic">
              "Redis atomic counters provide thread-safe rate checks under 2ms latency."
            </p>

            {/* Link Button */}
            <button className="w-full py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5">
              <span>Read Full Article</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        ),
      },
      rightCard: {
        title: 'Designing a Scalable Rate Limiter – ByteByteGo',
        category: 'Development',
        date: '23 September 2026 (Sprint Prep)',
        keyDetails: [
          'Sliding window counter algorithm',
          'Redis atomic counters for state synchronization',
          'Prevents cascading microservice failures',
          'Bound memory usage under high load',
          'Direct architecture reference saved',
        ],
      },
      handwrittenNote: 'From web link\nto structured\nknowledge!',
    },

    Note: {
      leftCard: {
        type: 'Quick Scratchpad Note',
        render: () => (
          <div className="w-full max-w-[310px] bg-[#FFFDF5] border border-amber-200/90 rounded-3xl p-5 shadow-card text-left space-y-3 animate-in fade-in duration-300">
            {/* Note Memo Header */}
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
              <div className="flex items-center gap-1.5 text-amber-700 font-bold text-[11px]">
                <FileText className="w-3.5 h-3.5" />
                <span>Quick Scratchpad Memo</span>
              </div>
              <span className="text-[9px] text-amber-600/80 font-mono">11:24 AM</span>
            </div>

            {/* Handwritten Note Body */}
            <div className="bg-white/80 p-3 rounded-xl border border-amber-100 shadow-inner">
              <p className="font-handwriting text-xl text-slate-800 leading-snug">
                "Ask Ravi about staging deployment keys and update the mobile auth API endpoints tomorrow before 5 PM."
              </p>
            </div>

            {/* Metadata Tags */}
            <div className="flex flex-wrap gap-1 text-[9px] font-bold text-amber-800">
              <span className="px-2 py-0.5 rounded-full bg-amber-100">#Deployment</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100">#API</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100">#Ravi</span>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-amber-700/80 font-medium pt-1">
              <Clock className="w-3 h-3" />
              <span>Voice-to-Text captured on mobile</span>
            </div>
          </div>
        ),
      },
      rightCard: {
        title: 'Discuss deployment and API updates',
        category: 'Development',
        date: '22 September 2026, 5:00 PM',
        keyDetails: [
          'Stakeholder: Ravi Kumar (Backend Lead)',
          'Verify staging deployment readiness',
          'Update mobile authentication API',
          'Scheduled deadline before 5:00 PM',
          'Synced to Action Inbox with calendar alarm',
        ],
      },
      handwrittenNote: 'From raw thought\nto scheduled\ncommitment!',
    },

    Call: {
      leftCard: {
        type: 'Recorded Meeting Audio',
        render: () => (
          <div className="w-full max-w-[310px] bg-white border border-slate-200 rounded-3xl p-5 shadow-card text-left space-y-3.5 animate-in fade-in duration-300">
            {/* Audio Header */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#3B5BDB]">
                <Volume2 className="w-3.5 h-3.5" />
                <span>Recorded Call (Whisper AI)</span>
              </div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight mt-0.5">
                Project Discussion & Architecture
              </h3>
              <p className="text-[10px] text-slate-500">Sarah Lin, Alex Chen, Jaswanth</p>
            </div>

            {/* Audio Player Track with Waveforms */}
            <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-600">
                <span className="text-[#3B5BDB]">42:18</span>
                <span className="text-slate-400">Total Duration</span>
              </div>

              {/* Waveform graphic bars */}
              <div className="flex items-center gap-1 h-6 px-1">
                {[4, 12, 18, 8, 22, 16, 10, 24, 14, 20, 9, 15, 23, 11, 7, 19, 13, 8].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-[#3B5BDB] rounded-full opacity-80"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
            </div>

            {/* Live Transcript Quote */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-700 space-y-1">
              <div className="font-bold text-[#3B5BDB] text-[10px]">VERIFIED TRANSCRIPT:</div>
              <p className="italic leading-tight">
                "Sarah: I will finalize the Redis cache invalidation spec before Wednesday."
              </p>
            </div>

            <button className="w-full py-2 rounded-xl bg-[#3B5BDB] text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5">
              <Play className="w-3 h-3 fill-white" />
              <span>Listen Audio Snippet</span>
            </button>
          </div>
        ),
      },
      rightCard: {
        title: 'Project Discussion – System Architecture',
        category: 'Work',
        date: '22 September 2026, 3:00 PM',
        keyDetails: [
          '3 Decisions: PostgreSQL, Redis, microservices',
          '2 Follow-ups: Share API documentation, review docs',
          '1 Deadline: Complete integration by 24 Sept 2026',
          'Assigned owners & deadlines recorded',
          'Synced to Action Inbox automatically',
        ],
      },
      handwrittenNote: 'From spoken call\nto tracked\ndecisions!',
    },
  };

  const current = scenarios[activeTab];

  return (
    <section id="screens" className="py-16 md:py-24 bg-white border-t border-slate-100 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Eyebrow & Headline */}
        <div className="space-y-3 mb-10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#3B5BDB]">
            SEE IT IN ACTION
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            One app. Many possibilities.
          </h2>
        </div>

        {/* 4 Filter Tab Buttons matching image */}
        <div className="flex justify-center items-center gap-2 sm:gap-3 mb-14">
          {(['Screenshot', 'Link', 'Note', 'Call'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#E6007A] text-white shadow-pink scale-105'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Interactive Split Transformation Display: Left Image/Card & Right Understood Card */}
        <div className="relative max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-12">
          
          {/* Left Card: Input Media (Screenshot / Link / Note / Call) */}
          <div className="transition-all duration-300 transform hover:scale-[1.01]">
            {current.leftCard.render()}
          </div>

          {/* Center Pink Curved Arrow */}
          <div className="shrink-0 flex items-center justify-center transform md:-translate-y-2">
            <svg width="48" height="48" viewBox="0 0 54 54" fill="none" className="text-[#E6007A]">
              <path
                d="M8 22C20 18 36 24 44 36M44 36L42 26M44 36L34 38"
                stroke="#E6007A"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Right Card: Recall Understands */}
          <div className="w-full max-w-[340px] bg-white border border-slate-200 rounded-3xl p-6 shadow-card text-left space-y-4 relative transition-all duration-300 hover:scale-[1.01]">
            
            {/* Card Header */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <RecallLogo size={20} />
              <span>Recall understands</span>
            </div>

            {/* Content Table / Key Attributes */}
            <div className="space-y-3 text-xs">
              {/* Title */}
              <div className="flex items-start gap-3">
                <span className="text-slate-400 font-medium w-16 shrink-0 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-slate-400" /> Title
                </span>
                <span className="font-extrabold text-slate-900 leading-snug">
                  {current.rightCard.title}
                </span>
              </div>

              {/* Category */}
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-medium w-16 shrink-0 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-slate-400" /> Category
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] font-bold text-[11px] border border-blue-100">
                  {current.rightCard.category}
                </span>
              </div>

              {/* Date */}
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-medium w-16 shrink-0 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" /> Date
                </span>
                <span className="font-bold text-slate-900">
                  {current.rightCard.date}
                </span>
              </div>

              {/* Key Details */}
              <div className="flex items-start gap-3 pt-1">
                <span className="text-slate-400 font-medium w-16 shrink-0">
                  Key details
                </span>
                <ul className="space-y-1 text-slate-700 text-[11px] font-medium leading-tight">
                  {current.rightCard.keyDetails.map((detail, idx) => (
                    <li key={idx}>• {detail}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Hot Pink Save Button */}
            <button className="w-full py-2.5 rounded-xl bg-[#E6007A] hover:bg-[#C20067] text-white text-xs font-bold shadow-pink transition-all cursor-pointer">
              Save to Recall
            </button>
          </div>

          {/* Small Handwritten Quote beside the right card */}
          <div className="hidden lg:flex flex-col items-center absolute -right-28 top-1/4 pointer-events-none">
            <span className="font-handwriting text-2xl font-bold text-[#1E3A8A] -rotate-6 transform leading-tight text-center whitespace-pre-line">
              {current.handwrittenNote}
            </span>
            <svg width="42" height="42" viewBox="0 0 50 50" fill="none" className="text-[#1E3A8A] mt-1 -rotate-45">
              <path
                d="M38 8C30 26 18 36 10 38M10 38L18 30M10 38L14 44"
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
