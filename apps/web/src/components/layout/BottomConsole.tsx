'use client';

import React, { useState } from 'react';
import { Terminal, Activity, AlertTriangle, CheckCircle2, ChevronUp, ChevronDown } from 'lucide-react';

export const BottomConsole: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`w-full glass-panel border-t border-slate-800/80 z-20 transition-all duration-300 select-none ${collapsed ? 'h-8' : 'h-28'}`}>
      {/* Header bar */}
      <div className="h-8 px-4 border-b border-slate-800/60 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 font-semibold text-slate-200">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Console & Telemetry</span>
          </div>

          <div className="flex items-center space-x-2 text-[11px] font-mono">
            <span className="flex items-center space-x-1 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
              <span>AST Engine: Active</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1 text-indigo-400">
              <Activity className="w-3 h-3" />
              <span>Vector Index: 100%</span>
            </span>
          </div>
        </div>

        <button 
          type="button"
          aria-label={collapsed ? "Expand Console" : "Collapse Console"}
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded cursor-pointer transition-colors"
        >
          {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Log Feed */}
      {!collapsed && (
        <div className="p-3 overflow-y-auto h-[calc(7rem-2rem)] font-mono text-[11px] space-y-1 bg-slate-950/90 text-slate-300">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">[11:15:02]</span>
            <span className="text-cyan-400 font-semibold">[Universe Engine]</span>
            <span>Constructed 3D graph with 12 module planets and 313 function nodes.</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">[11:15:05]</span>
            <span className="text-purple-400 font-semibold">[AI Gateway]</span>
            <span>Model Router selected Gemini 1.5 Pro for repository RAG query.</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">[11:15:10]</span>
            <span className="text-emerald-400 font-semibold">[Physics Engine]</span>
            <span>Force-directed spatial layout converged in 140ms.</span>
          </div>
        </div>
      )}
    </div>
  );
};
