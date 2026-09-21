'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  Camera,
  ShieldCheck,
  Inbox,
  ChevronDown,
} from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

interface FaqCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  items: FaqItem[];
}

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: 'general',
    name: 'General',
    icon: HelpCircle,
    items: [
      {
        q: 'What is Recall and how does it work?',
        a: 'Recall is your private, on-device AI memory assistant. It captures scattered screenshots, web links, notes, and recorded calls, runs local AI models to understand the content, and organizes everything into structured, searchable cards with actionable next steps.',
      },
      {
        q: 'Is Recall completely free and open source?',
        a: 'Yes. Recall is 100% open-source and free to run on your own devices. You own your code, your local database, and all your personal memory data forever.',
      },
      {
        q: 'What platforms and devices are supported?',
        a: 'Recall is built as a cross-platform React Native / Expo mobile app that works seamlessly on iOS and Android, accompanied by a local AI backend service that runs on macOS, Linux, and Windows.',
      },
      {
        q: 'How is Recall different from Notion or Apple Notes?',
        a: 'Standard note apps require manual tagging, filing, and typing. Recall is zero-effort: you dump raw screenshots, audio, and links, and local AI extracts dates, venues, contacts, and deadlines, automatically triaging them into actionable priorities.',
      },
    ],
  },
  {
    id: 'captures',
    name: 'Captures & AI',
    icon: Camera,
    items: [
      {
        q: 'How does Recall extract data from screenshots?',
        a: 'Recall uses an on-device OCR and multimodal vision model that identifies text, event dates, seminar venues, registration requirements, contacts, and QR codes. It transforms raw pixels into clean structured data without requiring manual typing.',
      },
      {
        q: 'Can I capture links, voice memos, and call recordings?',
        a: 'Yes. You can save web links for automatic content distillation, type quick scratchpad memos, or feed recorded voice calls. Recall extracts key decisions, assigned owners, and committed deadlines automatically.',
      },
      {
        q: 'What local AI models does Recall use under the hood?',
        a: 'Recall leverages Ollama for local LLM inference (e.g. Llama 3, Gemma 2, or Mistral), Whisper for high-accuracy voice transcription, and local Nomic embeddings for fast vector similarity search.',
      },
      {
        q: 'Can I run Recall on modest hardware without a dedicated GPU?',
        a: 'Yes. With quantized 4-bit and 8-bit model weights, Recall runs efficiently on modern Apple Silicon Macs (M1/M2/M3), Windows laptops with CPU acceleration, and Linux workstations.',
      },
    ],
  },
  {
    id: 'privacy',
    name: 'Privacy & Security',
    icon: ShieldCheck,
    items: [
      {
        q: 'Does Recall work offline without cloud servers?',
        a: 'Yes. Recall is built local-first. OCR, transcription, and semantic embeddings run locally on your device, meaning your captures, voice recordings, and personal thoughts never leave your hardware.',
      },
      {
        q: 'Do you sell, track, or train AI models on my data?',
        a: 'Never. Your information is stored exclusively in your local SQLite database. We do not sell data, track browsing activity, or train third-party models on your private notes.',
      },
      {
        q: 'Where is my personal data stored on my device?',
        a: 'All extracted notes, metadata, and embeddings are saved in a local SQLite database (`recall.db`) on your machine. Screenshots and audio recordings reside in your local app storage directory.',
      },
      {
        q: 'How do I backup, export, or migrate my data?',
        a: 'Because your data resides in standard SQLite, you can copy the database file directly, export your notes as JSON/Markdown, or sync across devices using end-to-end encrypted tools like Syncthing.',
      },
    ],
  },
  {
    id: 'inbox',
    name: 'Action Inbox',
    icon: Inbox,
    items: [
      {
        q: 'How does the Action Inbox prioritize my items?',
        a: 'Recall groups your memories into 4 clear categories: Needs Action (deadlines and follow-ups), Decisions (architectural or team choices), Knowledge (reference articles), and Ideas (scratchpad thoughts).',
      },
      {
        q: 'Can I search my memories with natural language?',
        a: 'Yes. With semantic vector search, you can search by concept (e.g., "internship flyer next week" or "Redis rate limiter architecture") even if you do not remember the exact wording.',
      },
      {
        q: 'What happens when a deadline or committed date approaches?',
        a: 'Recall flags items with upcoming deadlines in the "Needs Attention" queue, sorted chronologically with countdown badges so you never miss an assignment submission or follow-up call.',
      },
      {
        q: 'Can I manually edit, tag, or reclassify my captured memories?',
        a: 'Absolutely. Every AI-extracted field—title, tags, category, action items, and notes—can be edited, expanded, or reclassified directly inside the app with a single tap.',
      },
    ],
  },
];

export default function Faq() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="faq" className="w-full py-14 sm:py-20 border-t border-slate-100">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 sm:mb-12 space-y-2.5 text-left sm:text-center max-w-2xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#2563EB]">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
            Frequently Asked <span className="text-[#2563EB]">Questions</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            Everything you need to know about Recall's local AI intelligence, capture formats, and privacy guarantees.
          </p>
        </div>

        {/* Rock-solid, fixed layout ensuring button positions NEVER change */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start w-full">
          
          {/* Left Column: Fixed Width 288px (w-72), rock solid, cannot jump or shift */}
          <div className="w-full lg:w-72 shrink-0 flex lg:flex-col gap-2.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none lg:sticky lg:top-28 self-start">
            {FAQ_CATEGORIES.map((cat, idx) => {
              const isActive = activeCategory === idx;
              const Icon = cat.icon;
              const isPink = idx % 2 === 1;

              let buttonClasses = '';
              let iconClasses = '';

              if (isPink) {
                if (isActive) {
                  buttonClasses = 'bg-[#E6007A] text-white shadow-md shadow-[#E6007A]/25 border border-[#E6007A]';
                  iconClasses = 'bg-white/20 text-white';
                } else {
                  buttonClasses = 'bg-white text-slate-800 hover:text-[#E6007A] hover:bg-pink-50 hover:border-[#E6007A]/40 border border-slate-200';
                  iconClasses = 'bg-pink-50 text-[#E6007A]';
                }
              } else {
                if (isActive) {
                  buttonClasses = 'bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/25 border border-[#2563EB]';
                  iconClasses = 'bg-white/20 text-white';
                } else {
                  buttonClasses = 'bg-white text-slate-800 hover:text-[#2563EB] hover:bg-blue-50 hover:border-[#2563EB]/40 border border-slate-200';
                  iconClasses = 'bg-blue-50 text-[#2563EB]';
                }
              }

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(idx);
                    setOpenFaq(null); // Keep questions closed when switching categories
                  }}
                  className={`flex items-center gap-3 px-4 sm:px-5 h-[52px] rounded-xl lg:rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap lg:whitespace-normal text-left w-full shrink-0 ${buttonClasses}`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${iconClasses}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="flex-1 font-extrabold">{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Takes up exactly the remaining width of max-w-6xl */}
          <div className="flex-1 min-w-0 w-full">
            <div className="w-full rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100 min-h-[350px]">
              {FAQ_CATEGORIES[activeCategory].items.map((faq, i) => {
                const isOpen = openFaq === i;
                const isCurrentPink = activeCategory % 2 === 1;

                return (
                  <div key={i} className="transition-colors">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className={`w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-slate-900 transition-colors cursor-pointer gap-4 ${
                        isCurrentPink ? 'hover:text-[#E6007A]' : 'hover:text-[#2563EB]'
                      }`}
                    >
                      <span className="leading-snug">{faq.q}</span>
                      <div
                        className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                          isOpen
                            ? isCurrentPink
                              ? 'rotate-180 bg-pink-100 text-[#E6007A]'
                              : 'rotate-180 bg-blue-100 text-[#2563EB]'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/80 bg-[#FAFDFE]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
