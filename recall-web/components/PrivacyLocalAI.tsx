'use client';

import React from 'react';
import { ShieldCheck, Cpu, HardDrive, Lock, ArrowDown, Zap } from 'lucide-react';

export default function PrivacyLocalAI() {
  return (
    <section className="py-20 md:py-28 bg-pale-blue relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-white border border-surface-border text-xs font-bold uppercase tracking-wider text-primary shadow-subtle">
            PRIVACY &amp; LOCAL INTELLIGENCE
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 mt-4 mb-4">
            Designed for local-first AI.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Recall is architected to eliminate third-party cloud surveillance. All visual understanding, entity extraction, and embedding vectors run on your device or local network.
          </p>
        </div>

        {/* Technical Data Flow Architecture Diagram - RU_Ready Styled */}
        <div className="max-w-3xl mx-auto bg-white border border-surface-border rounded-2xl p-6 sm:p-10 shadow-card relative mb-12">
          <div className="text-center mb-8">
            <span className="text-[11px] font-black text-primary uppercase tracking-wider">
              ON-DEVICE LOCAL INFERENCE PIPELINE
            </span>
          </div>

          <div className="flex flex-col items-center space-y-4">
            {/* 1. User Data */}
            <div className="w-full max-w-md bg-pale-blue border border-surface-border rounded-xl p-4 text-center">
              <div className="text-xs font-black uppercase tracking-wider text-primary mb-1">
                STEP 1: CAPTURED PERSONAL CONTEXT
              </div>
              <div className="text-sm font-bold text-slate-900">
                Screenshots, Shared Links, Voice Notes &amp; Phone Calls
              </div>
            </div>

            <ArrowDown className="w-5 h-5 text-primary" />

            {/* 2. Local AI Engine */}
            <div className="w-full max-w-lg bg-surface-secondary border-2 border-primary rounded-xl p-6 text-center space-y-3 shadow-subtle">
              <div className="flex items-center justify-center gap-2 text-xs font-black tracking-wider text-primary uppercase">
                <Cpu className="w-4 h-4" />
                <span>LOCAL AI GATEWAY (FASTAPI + OLLAMA / ON-DEVICE)</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center pt-2">
                <div className="bg-white p-3 rounded-lg border border-surface-border shadow-subtle">
                  <div className="text-xs font-black text-slate-900">Qwen2.5-VL</div>
                  <div className="text-[10px] text-primary font-bold">Visual OCR</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-surface-border shadow-subtle">
                  <div className="text-xs font-black text-slate-900">Qwen3 8B</div>
                  <div className="text-[10px] text-primary font-bold">Context &amp; Actions</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-surface-border shadow-subtle">
                  <div className="text-xs font-black text-slate-900">Nomic Embed</div>
                  <div className="text-[10px] text-primary font-bold">Vector Search</div>
                </div>
              </div>
            </div>

            <ArrowDown className="w-5 h-5 text-primary" />

            {/* 3. Your Personal Memory */}
            <div className="w-full max-w-md bg-pale-blue border border-surface-border rounded-xl p-4 text-center">
              <div className="text-xs font-black uppercase tracking-wider text-primary mb-1">
                STEP 3: ENCRYPTED LOCAL CLIENT STORE
              </div>
              <div className="text-sm font-bold text-slate-900">
                Contextual Graph, Action Inbox &amp; Offline Search
              </div>
            </div>
          </div>
        </div>

        {/* 3 Safe Guarantees */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-surface-border p-6 rounded-2xl space-y-2 shadow-card">
            <div className="w-10 h-10 rounded-xl bg-pale-blue border border-surface-border flex items-center justify-center text-primary mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-black text-slate-900">Zero Model Training</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your personal receipts, job notices, and private voice calls are never sent to external servers or used to train public LLM models.
            </p>
          </div>

          <div className="bg-white border border-surface-border p-6 rounded-2xl space-y-2 shadow-card">
            <div className="w-10 h-10 rounded-xl bg-pale-blue border border-surface-border flex items-center justify-center text-primary mb-3">
              <HardDrive className="w-5 h-5" />
            </div>
            <h4 className="text-base font-black text-slate-900">Local Storage by Default</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              All memory records, embeddings, and relationship nodes live in SQLite / AsyncStorage directly on your mobile device.
            </p>
          </div>

          <div className="bg-white border border-surface-border p-6 rounded-2xl space-y-2 shadow-card">
            <div className="w-10 h-10 rounded-xl bg-pale-blue border border-surface-border flex items-center justify-center text-primary mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-black text-slate-900">Offline Resilience</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              In flight mode or underground transit without data reception, keyword search, action management, and library browsing continue to function flawlessly.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
