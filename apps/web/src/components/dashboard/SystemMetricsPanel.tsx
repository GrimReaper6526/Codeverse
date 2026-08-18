'use client';

import React from 'react';
import { Activity, ShieldCheck, FileCheck, Layers, Cpu } from 'lucide-react';

export const SystemMetricsPanel: React.FC = () => {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5 shadow-xl backdrop-blur-xl space-y-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-200 tracking-wide">
            System Architecture Health
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          HEALTH SCORE: 96/100
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Metric 1 */}
        <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Circular Dependencies
            </span>
            <span className="font-mono text-emerald-400 font-bold">0 Detected</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-emerald-400 w-full" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span className="flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
              Documentation Coverage
            </span>
            <span className="font-mono text-cyan-300 font-bold">88.4%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-cyan-400 w-[88%]" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Architectural Cohesion
            </span>
            <span className="font-mono text-indigo-300 font-bold">High (0.84)</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-indigo-400 w-[84%]" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              AST Physics Simulation
            </span>
            <span className="font-mono text-purple-300 font-bold">60 FPS</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-purple-400 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
