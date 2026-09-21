'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Calendar, CheckCircle2, ArrowRight, Image as ImageIcon, Link2, FileText, Zap } from 'lucide-react';
import { DEMO_SCENARIOS } from '../data/demoData';

export default function InteractiveSimulator() {
  const [activeTab, setActiveTab] = useState<'screenshot' | 'link' | 'note'>('screenshot');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepIndex, setStepIndex] = useState(3);

  const scenario = DEMO_SCENARIOS[activeTab];

  const handleSwitchTab = (tab: 'screenshot' | 'link' | 'note') => {
    setActiveTab(tab);
    setIsProcessing(true);
    setStepIndex(0);

    setTimeout(() => setStepIndex(1), 150);
    setTimeout(() => setStepIndex(2), 300);
    setTimeout(() => {
      setStepIndex(3);
      setIsProcessing(false);
    }, 450);
  };

  const steps = [
    'Reading raw content',
    'Identifying context & topics',
    'Extracting key entities',
    'Generating actionable commitments',
  ];

  return (
    <section id="demo" className="py-20 md:py-28 bg-white border-y border-surface-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-pale-blue border border-surface-border text-xs font-bold uppercase tracking-wider text-primary shadow-subtle">
            HANDS-ON SIMULATOR
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-4 mb-4">
            See Recall understand information.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Click between Screenshot, Link, and Note to watch how Recall processes input, extracts entities, and creates actionable tasks in real time.
          </p>
        </div>

        {/* Tab Selector - RU_Ready Styled */}
        <div className="flex justify-center mb-10">
          <div className="bg-pale-blue p-1.5 rounded-2xl flex gap-1 sm:gap-2 border border-surface-border shadow-subtle">
            <button
              onClick={() => handleSwitchTab('screenshot')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'screenshot'
                  ? 'bg-primary text-white shadow-royal'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Screenshot</span>
            </button>

            <button
              onClick={() => handleSwitchTab('link')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'link'
                  ? 'bg-primary text-white shadow-royal'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Link2 className="w-4 h-4" />
              <span>Saved Link</span>
            </button>

            <button
              onClick={() => handleSwitchTab('note')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'note'
                  ? 'bg-primary text-white shadow-royal'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Quick Note</span>
            </button>
          </div>
        </div>

        {/* Simulator Content Card */}
        <div className="max-w-4xl mx-auto bg-pale-blue rounded-2xl border border-surface-border shadow-card p-6 sm:p-10 space-y-8">
          
          {/* Input Preview Bar */}
          <div className="bg-white p-5 rounded-xl border border-surface-border space-y-2 shadow-subtle">
            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-400">
              <span>INPUT DATA SOURCE ({scenario.tabTitle.toUpperCase()})</span>
              <span className="text-primary font-bold">Simulated Real Capture</span>
            </div>

            {activeTab === 'screenshot' && (
              <div className="flex items-center gap-4 pt-1">
                <div className="w-16 h-20 rounded-lg overflow-hidden border border-surface-border shrink-0 bg-surface-secondary">
                  <Image
                    src={scenario.input.imageUri!}
                    alt="Input flyer preview"
                    width={64}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">{scenario.input.title}</div>
                  <div className="text-xs text-slate-600 line-clamp-2 mt-0.5">{scenario.input.snippet}</div>
                </div>
              </div>
            )}

            {activeTab === 'link' && (
              <div className="flex items-center gap-3.5 pt-1">
                <div className="w-10 h-10 rounded-xl bg-pale-blue border border-surface-border text-primary flex items-center justify-center shrink-0">
                  <Link2 className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="text-sm font-black text-slate-900 truncate">{scenario.input.title}</div>
                  <div className="text-xs text-slate-500 font-mono">{scenario.input.url}</div>
                </div>
              </div>
            )}

            {activeTab === 'note' && (
              <div className="p-3.5 bg-pale-blue/60 rounded-lg border border-surface-border text-sm font-semibold text-slate-800 italic">
                "{scenario.input.noteText}"
              </div>
            )}
          </div>

          {/* Animated AI Pipeline Status */}
          <div className="bg-white p-5 rounded-xl border border-surface-border space-y-3 shadow-subtle">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <div className="flex items-center gap-2 text-primary font-black">
                <Zap className="w-4 h-4 fill-primary" />
                <span>AI EXTRACTION PIPELINE</span>
              </div>
              <span className="font-mono text-[11px] text-primary font-bold">
                {isProcessing ? 'Processing...' : 'Completed (38ms)'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {steps.map((step, idx) => {
                const isDone = idx <= stepIndex;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-bold transition-all ${
                      isDone
                        ? 'bg-pale-blue border-primary text-primary'
                        : 'bg-surface-secondary border-surface-border text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                        isDone ? 'bg-primary text-white' : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      ✓
                    </div>
                    <span className="truncate">{step}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Result Output Card */}
          <div className="bg-white rounded-xl border border-surface-border p-6 sm:p-8 space-y-6 shadow-card">
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-black tracking-wider flex items-center gap-1.5 shadow-royal">
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>UNDERSTOOD BY RECALL AI</span>
              </span>
              <span className="text-xs text-slate-500 font-bold">
                Stored in Local SQLite
              </span>
            </div>

            <div className="space-y-3.5">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {scenario.output.title}
              </h3>

              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-pale-blue text-primary border border-surface-border">
                  {scenario.output.category}
                </span>
                {scenario.output.topics.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-surface-secondary text-slate-700 border border-surface-border"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                {scenario.output.summary}
              </p>

              {/* Details Bullet Points */}
              <div className="pt-3 border-t border-surface-border space-y-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Extracted Facts:
                </span>
                {scenario.output.importantDetails.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>

              {/* Action Box */}
              <div className="bg-pale-blue border border-surface-border rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                    AUTOMATED ACTION DETECTED
                  </span>
                  <div className="text-sm font-black text-slate-900">
                    {scenario.output.action.title}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Due: {scenario.output.action.dueDate}</span>
                  </div>
                </div>

                <div className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold inline-flex items-center gap-1.5 self-start sm:self-center shadow-royal">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>In Action Inbox</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
