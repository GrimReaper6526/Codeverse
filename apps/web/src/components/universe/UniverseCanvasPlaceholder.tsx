'use client';

import React from 'react';
import { Orbit, Sparkles, Cpu, Layers, Maximize2, Zap } from 'lucide-react';

export const UniverseCanvasPlaceholder: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden select-none">
      {/* Background Starfield / Grid lines simulation */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/30 via-slate-950 to-slate-950" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Simulated 3D Galaxy Hub */}
      <div className="relative z-10 flex flex-col items-center text-center p-8 max-w-xl glass-panel rounded-2xl border border-slate-800/80 shadow-glow-cyan">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-cyan-400 to-emerald-400 p-0.5 shadow-glow-indigo mb-6 animate-pulse">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Orbit className="w-8 h-8 text-cyan-400" />
          </div>
        </div>

        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-cyan-300 bg-clip-text text-transparent tracking-tight mb-2">
          CodeVerse 3D Universe Engine
        </h1>
        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          Transforming repository AST graphs into interactive 3D solar systems. Explore modules, services, and functions with physics-based force layout.
        </p>

        {/* Metaphor Indicators */}
        <div className="grid grid-cols-3 gap-3 w-full text-left mb-6 text-[11px]">
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-cyan-400 font-semibold flex items-center space-x-1 mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Repository</span>
            </div>
            <div className="text-slate-300 font-mono">Galaxy Hub</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-indigo-400 font-semibold flex items-center space-x-1 mb-1">
              <Cpu className="w-3 h-3" />
              <span>Modules</span>
            </div>
            <div className="text-slate-300 font-mono">Planets</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-emerald-400 font-semibold flex items-center space-x-1 mb-1">
              <Zap className="w-3 h-3" />
              <span>Functions</span>
            </div>
            <div className="text-slate-300 font-mono">Nodes</div>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <button 
            type="button"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-slate-950 font-bold transition-all shadow-glow-cyan cursor-pointer flex items-center space-x-1.5"
          >
            <Orbit className="w-4 h-4" />
            <span>Launch 3D Viewport</span>
          </button>
        </div>
      </div>
    </div>
  );
};
