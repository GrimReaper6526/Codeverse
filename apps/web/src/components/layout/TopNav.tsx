'use client';

import React from 'react';
import { Box, Search, Layers, Orbit, Cpu, Settings, Bell, Github, Command } from 'lucide-react';

export const TopNav: React.FC = () => {
  return (
    <header className="h-14 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 flex items-center justify-between z-30 select-none">
      {/* Brand & Project Selector */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 cursor-pointer group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-glow-indigo transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <Box className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
            CodeVerse
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono">
            v1.0 MVP
          </span>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        {/* Repository selector */}
        <div className="flex items-center space-x-2 text-sm text-slate-300 hover:text-white cursor-pointer px-2 py-1 rounded-md hover:bg-slate-900 transition-colors">
          <Github className="w-4 h-4 text-slate-400" />
          <span className="font-mono text-xs text-slate-400">GrimReaper6526 /</span>
          <span className="font-semibold text-xs text-cyan-400">Codeverse</span>
          <Layers className="w-3.5 h-3.5 text-slate-500 ml-1" />
        </div>
      </div>

      {/* Global Command Palette / Search Trigger */}
      <div className="flex-1 max-w-md mx-8">
        <button
          type="button"
          aria-label="Open command palette search"
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-400 hover:border-slate-700 hover:bg-slate-900 transition-all cursor-pointer group"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            <span>Search functions, classes, modules...</span>
          </div>
          <div className="flex items-center space-x-1 font-mono text-[10px] text-slate-500 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Camera Presets & Actions */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
          <button
            type="button"
            aria-label="Orbit Camera View"
            className="px-2.5 py-1 rounded-md bg-indigo-600/20 text-indigo-300 font-medium border border-indigo-500/30 flex items-center space-x-1 cursor-pointer"
          >
            <Orbit className="w-3.5 h-3.5" />
            <span>Orbit</span>
          </button>
          <button
            type="button"
            aria-label="System Node Focus View"
            className="px-2.5 py-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Focus</span>
          </button>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        <div className="flex items-center space-x-1">
          <button
            type="button"
            aria-label="System notifications"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Project Settings"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
