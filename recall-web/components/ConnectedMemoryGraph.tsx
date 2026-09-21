'use client';

import React, { useState } from 'react';
import { Layers, Image as ImageIcon, Link2, FileText, PhoneCall, CheckCircle2, Zap, ArrowRight } from 'lucide-react';

export default function ConnectedMemoryGraph() {
  const [selectedNode, setSelectedNode] = useState('techcorp');

  const nodes = [
    {
      id: 'techcorp',
      label: 'TechCorp Hiring Drive',
      category: 'Campus Placement',
      type: 'Screenshot',
      icon: ImageIcon,
      connections: ['dbms', 'resume', 'prep', 'auditorium'],
      explanation: 'Central recruitment notice captured via mobile screenshot. Connected to academic assignments, resume versions, and calendar commitments.',
    },
    {
      id: 'dbms',
      label: 'DBMS Normalization Lab',
      category: 'Academic',
      type: 'Assignment Note',
      icon: FileText,
      explanation: 'Assignment 3 covering B+ trees and indexing. Prerequisite technical topic frequently tested in TechCorp technical rounds.',
    },
    {
      id: 'resume',
      label: 'Resume Final Draft v4',
      category: 'Document',
      type: 'File Link',
      icon: Link2,
      explanation: 'Updated PDF draft containing React Native and distributed systems projects tailored for the Associate Software Engineer role.',
    },
    {
      id: 'meeting',
      label: 'Sprint Sync w/ Sarah',
      category: 'Engineering Call',
      type: 'Call Recording',
      icon: PhoneCall,
      explanation: '38-minute architectural call recording on Redis caching. Serves as direct project proof during system design interviews.',
    },
  ];

  const activeNodeData = nodes.find((n) => n.id === selectedNode) || nodes[0];

  return (
    <section className="py-20 md:py-28 bg-pale-blue relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-white border border-surface-border text-xs font-bold uppercase tracking-wider text-primary shadow-subtle">
            GRAPH CONTEXTUAL ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-4 mb-4">
            Your knowledge is connected.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Unlike siloed directories or disconnected notes, Recall maps semantic relationships between your screenshots, voice memos, documents, and contacts.
          </p>
        </div>

        {/* Visual Graph Container - RU_Ready Styled */}
        <div className="bg-white rounded-2xl border border-surface-border shadow-card p-6 sm:p-10 relative">
          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            
            {/* Left: Interactive Node Selector */}
            <div className="space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                INTERACTIVE GRAPH NODES:
              </span>
              <div className="space-y-2.5">
                {nodes.map((node) => {
                  const Icon = node.icon;
                  const isSelected = node.id === selectedNode;
                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNode(node.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-pale-blue border-primary shadow-subtle'
                          : 'bg-surface-secondary border-surface-border hover:border-primary'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-primary border-primary text-white'
                              : 'bg-white border-surface-border text-primary'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900">{node.label}</div>
                          <div className="text-[10px] text-slate-500 font-bold">{node.category}</div>
                        </div>
                      </div>
                      <span className="text-xs text-primary font-bold">
                        {isSelected ? 'Inspecting' : 'Tap'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Center: Graph Canvas Visualization - RU_Ready Clean Pale Blue Canvas */}
            <div className="lg:col-span-2 bg-pale-blue rounded-2xl p-6 sm:p-8 border border-surface-border flex flex-col justify-between">
              
              <div className="flex items-center justify-between border-b border-surface-border pb-3">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <Zap className="w-4 h-4 fill-primary" />
                  <span>KNOWLEDGE GRAPH RELATION EXPLORER</span>
                </div>
                <span className="text-xs font-bold text-primary px-2.5 py-1 bg-white rounded-md border border-surface-border">
                  4 Active Relations
                </span>
              </div>

              {/* Node Visualization Diagram */}
              <div className="py-8 flex flex-col items-center justify-center gap-6">
                {/* Central Root Hub */}
                <div className="px-6 py-3.5 rounded-xl bg-primary text-white font-black text-sm sm:text-base shadow-royal border border-royal-blue-hover text-center">
                  Campus Recruitment &amp; Tech Prep Cluster
                </div>

                {/* Sub-node cluster pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                  <div className="bg-white border border-surface-border p-3.5 rounded-xl text-center shadow-subtle">
                    <ImageIcon className="w-5 h-5 text-primary mx-auto mb-1" />
                    <div className="text-xs font-bold text-slate-900">TechCorp Notice</div>
                    <div className="text-[10px] text-slate-500">Screenshot</div>
                  </div>

                  <div className="bg-white border border-surface-border p-3.5 rounded-xl text-center shadow-subtle">
                    <FileText className="w-5 h-5 text-primary mx-auto mb-1" />
                    <div className="text-xs font-bold text-slate-900">DBMS Lab 3</div>
                    <div className="text-[10px] text-slate-500">Assignment</div>
                  </div>

                  <div className="bg-white border border-surface-border p-3.5 rounded-xl text-center shadow-subtle">
                    <Link2 className="w-5 h-5 text-primary mx-auto mb-1" />
                    <div className="text-xs font-bold text-slate-900">Resume v4</div>
                    <div className="text-[10px] text-slate-500">Draft PDF</div>
                  </div>

                  <div className="bg-white border border-surface-border p-3.5 rounded-xl text-center shadow-subtle">
                    <PhoneCall className="w-5 h-5 text-primary mx-auto mb-1" />
                    <div className="text-xs font-bold text-slate-900">Sprint Sync</div>
                    <div className="text-[10px] text-slate-500">38 min Call</div>
                  </div>
                </div>
              </div>

              {/* Active Inspector Details Box */}
              <div className="bg-white border border-surface-border p-5 rounded-xl space-y-1.5 shadow-subtle">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-pale-blue text-primary border border-surface-border">
                    {activeNodeData.category}
                  </span>
                  <span className="text-xs font-black text-slate-900">
                    {activeNodeData.label}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeNodeData.explanation}
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
