'use client';

import React from 'react';
import { Cpu, ArrowDown, Zap, Server, HardDrive, Layout } from 'lucide-react';

export default function ArchitectureSection() {
  return (
    <section id="architecture" className="py-20 md:py-28 bg-white border-y border-surface-border relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-pale-blue border border-surface-border text-xs font-bold uppercase tracking-wider text-primary shadow-subtle">
            SYSTEM ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-4 mb-4">
            Under the Hood
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            How Recall coordinates multi-modal vision parsing, on-device LLMs, and high-dimensional vector embeddings into an instantaneous mobile experience.
          </p>
        </div>

        {/* Technical Architecture Flow Diagram - RU_Ready Styled */}
        <div className="max-w-4xl mx-auto bg-pale-blue border border-surface-border rounded-2xl p-6 sm:p-10 shadow-card space-y-8">
          
          {/* Layer 1: Ingestion */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>LAYER 01: CAPTURE &amp; INGESTION</span>
              <span className="text-primary font-bold">Multi-Modal Inputs</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white border border-surface-border p-4 rounded-xl text-center shadow-subtle">
                <div className="text-xs font-black text-slate-900">Screenshots</div>
                <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Android Share Target</div>
              </div>
              <div className="bg-white border border-surface-border p-4 rounded-xl text-center shadow-subtle">
                <div className="text-xs font-black text-slate-900">Web Links</div>
                <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Metadata Extractor</div>
              </div>
              <div className="bg-white border border-surface-border p-4 rounded-xl text-center shadow-subtle">
                <div className="text-xs font-black text-slate-900">Quick Notes</div>
                <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Scratchpad / Thoughts</div>
              </div>
              <div className="bg-white border border-surface-border p-4 rounded-xl text-center shadow-subtle">
                <div className="text-xs font-black text-slate-900">Meeting Calls</div>
                <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Audio Streams &amp; Transcripts</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-primary" />
          </div>

          {/* Layer 2: Intelligence Engine */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>LAYER 02: INTELLIGENCE &amp; INFERENCE GATEWAY</span>
              <span className="text-primary font-bold">FastAPI + Ollama</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-3.5">
              <div className="bg-white border border-surface-border p-5 rounded-xl text-center space-y-1.5 shadow-subtle">
                <div className="text-[10px] font-black text-primary uppercase">Vision Model</div>
                <div className="text-sm font-black text-slate-900">Qwen2.5-VL 3B</div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Extracts spatial layout, visible text strings, tables, and date formats.
                </p>
              </div>

              <div className="bg-white border-2 border-primary p-5 rounded-xl text-center space-y-1.5 shadow-royal">
                <div className="text-[10px] font-black text-primary uppercase">Context &amp; Actions</div>
                <div className="text-sm font-black text-slate-900">Qwen3 8B / Local LLM</div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Classifies categories, creates crisp summaries, and synthesizes action items.
                </p>
              </div>

              <div className="bg-white border border-surface-border p-5 rounded-xl text-center space-y-1.5 shadow-subtle">
                <div className="text-[10px] font-black text-primary uppercase">Vector Embeddings</div>
                <div className="text-sm font-black text-slate-900">Nomic Embed v1.5</div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Generates dense 768-dim embeddings for hybrid semantic search.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-primary" />
          </div>

          {/* Layer 3: Storage & Delivery */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>LAYER 03: LOCAL MEMORY STORE &amp; USER EXPERIENCE</span>
              <span className="text-primary font-bold">Local-First Persistence</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white border border-surface-border p-4 rounded-xl text-center shadow-subtle">
                <div className="text-xs font-black text-slate-900">Action Inbox</div>
                <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Deadlines &amp; Tasks</div>
              </div>
              <div className="bg-white border border-surface-border p-4 rounded-xl text-center shadow-subtle">
                <div className="text-xs font-black text-slate-900">Hybrid Search</div>
                <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Vector + Keyword</div>
              </div>
              <div className="bg-white border border-surface-border p-4 rounded-xl text-center shadow-subtle">
                <div className="text-xs font-black text-slate-900">Context Graph</div>
                <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Topic Relations</div>
              </div>
              <div className="bg-white border border-surface-border p-4 rounded-xl text-center shadow-subtle">
                <div className="text-xs font-black text-slate-900">Offline SQLite</div>
                <div className="text-[10px] text-slate-500 font-semibold mt-0.5">AsyncStorage Store</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Badges - RU_Ready Styled */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5 text-xs font-bold text-slate-700">
          <span className="px-3.5 py-1.5 rounded-xl bg-pale-blue border border-surface-border text-primary font-black">Expo SDK 57</span>
          <span className="px-3.5 py-1.5 rounded-xl bg-pale-blue border border-surface-border text-primary font-black">React Native</span>
          <span className="px-3.5 py-1.5 rounded-xl bg-pale-blue border border-surface-border text-primary font-black">TypeScript</span>
          <span className="px-3.5 py-1.5 rounded-xl bg-pale-blue border border-surface-border text-primary font-black">Next.js 14</span>
          <span className="px-3.5 py-1.5 rounded-xl bg-pale-blue border border-surface-border text-primary font-black">Tailwind CSS</span>
          <span className="px-3.5 py-1.5 rounded-xl bg-pale-blue border border-surface-border text-primary font-black">Ollama AI</span>
          <span className="px-3.5 py-1.5 rounded-xl bg-pale-blue border border-surface-border text-primary font-black">FastAPI</span>
        </div>

      </div>
    </section>
  );
}
