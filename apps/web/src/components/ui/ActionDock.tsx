'use client';

import React from 'react';
import { Orbit, RotateCcw, Zap, Camera, Sliders, HelpCircle, Eye } from 'lucide-react';

export const ActionDock: React.FC = () => {
  return (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 glass-panel rounded-full px-4 py-2 border border-slate-800/80 shadow-glass flex items-center space-x-3 select-none">
      <button
        type="button"
        aria-label="Reset Camera View"
        className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
        title="Reset Camera View"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      <button
        type="button"
        aria-label="Toggle Physics Simulation"
        className="p-2 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/30 transition-colors cursor-pointer"
        title="Physics Layout Active"
      >
        <Zap className="w-4 h-4" />
      </button>

      <div className="h-4 w-px bg-slate-800" />

      <button
        type="button"
        aria-label="Orbit View Mode"
        className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
        title="Orbit View Mode"
      >
        <Orbit className="w-4 h-4" />
      </button>

      <button
        type="button"
        aria-label="Toggle Level of Detail"
        className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
        title="Level of Detail (LOD)"
      >
        <Eye className="w-4 h-4" />
      </button>

      <button
        type="button"
        aria-label="Graph Physics Sliders"
        className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
        title="Graph Settings"
      >
        <Sliders className="w-4 h-4" />
      </button>

      <div className="h-4 w-px bg-slate-800" />

      <button
        type="button"
        aria-label="Capture Universe Screenshot"
        className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
        title="Capture 3D Viewport"
      >
        <Camera className="w-4 h-4" />
      </button>

      <button
        type="button"
        aria-label="Keyboard Shortcuts Help"
        className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
        title="Shortcuts Help"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
    </div>
  );
};
