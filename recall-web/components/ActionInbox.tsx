'use client';

import React, { useState } from 'react';
import { Check, Calendar, RotateCcw, ArrowUpRight, CheckCircle2, ListFilter, Zap } from 'lucide-react';
import { INBOX_TASKS } from '../data/demoData';

export default function ActionInbox() {
  const [tasks, setTasks] = useState(
    INBOX_TASKS.map((t) => ({ ...t, completed: false }))
  );
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [lastCompletedId, setLastCompletedId] = useState<string | null>(null);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const next = !t.completed;
          if (next) setLastCompletedId(id);
          else if (lastCompletedId === id) setLastCompletedId(null);
          return { ...t, completed: next };
        }
        return t;
      })
    );
  };

  const handleUndo = () => {
    if (!lastCompletedId) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === lastCompletedId ? { ...t, completed: false } : t))
    );
    setLastCompletedId(null);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <section id="inbox" className="py-20 md:py-28 bg-pale-blue">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-white border border-surface-border text-xs font-bold uppercase tracking-wider text-primary shadow-subtle">
            ACTION INBOX ENGINE
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-4 mb-4">
            Remembering is useful only when you act.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Passive bookmarks accumulate dust. Recall detects actionable commitments from screens and voice notes, attaches calendar dates, and creates an executable task list.
          </p>
        </div>

        {/* Interactive Inbox Component Card - RU_Ready Styled */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-surface-border shadow-card p-6 sm:p-8 relative">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-surface-border gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-slate-900">Action Inbox</span>
                <span className="px-3 py-1 rounded-full bg-pale-blue text-primary text-xs font-black border border-surface-border">
                  {pendingCount} Pending
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Extracted automatically with verified deadlines from your captures.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="inline-flex p-1 rounded-xl bg-pale-blue border border-surface-border self-start sm:self-center">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter === 'all'
                    ? 'bg-primary text-white shadow-royal'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({tasks.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter === 'pending'
                    ? 'bg-primary text-white shadow-royal'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter === 'completed'
                    ? 'bg-primary text-white shadow-royal'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Done ({tasks.length - pendingCount})
              </button>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-start sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all ${
                  task.completed
                    ? 'bg-pale-blue/40 border-surface-border opacity-65'
                    : 'bg-white border-surface-border hover:border-primary shadow-subtle'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 mt-0.5 sm:mt-0 ${
                      task.completed
                        ? 'bg-primary border-primary text-white'
                        : 'border-slate-300 hover:border-primary bg-white'
                    }`}
                    aria-label={`Toggle ${task.title}`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-bold text-slate-900 leading-snug truncate ${
                        task.completed ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {task.title}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs mt-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-pale-blue text-primary border border-surface-border">
                        {task.category}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-primary">
                        <Calendar className="w-3 h-3" />
                        <span>{task.dueDate}</span>
                      </span>
                      <span className="text-slate-400">• {task.source}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-primary hover:text-royal-blue-hover cursor-pointer">
                  <span className="hidden sm:inline">Inspect</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>

          {/* Undo Toast Snackbar */}
          {lastCompletedId && (
            <div className="mt-6 flex items-center justify-between bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-card">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Task marked completed.</span>
              </div>
              <button
                onClick={handleUndo}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-primary transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>UNDO</span>
              </button>
            </div>
          )}

          {/* Footer explanation */}
          <div className="mt-8 pt-4 border-t border-surface-border flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <span>Verified concrete calendar dates: zero vague deadlines.</span>
            <span className="font-bold text-primary">Click checkboxes to test live state management</span>
          </div>
        </div>

      </div>
    </section>
  );
}
