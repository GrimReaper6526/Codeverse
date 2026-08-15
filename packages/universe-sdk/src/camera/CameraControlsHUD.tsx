'use client';

import React from 'react';
import { CameraMode } from './CameraEngineTypes';

interface CameraControlsHUDProps {
  mode: CameraMode;
  autoRotate: boolean;
  isTransitioning: boolean;
  selectedNodeName?: string | null;
  onOverview: () => void;
  onFocusNode: () => void;
  onTopDownMap: () => void;
  onToggleCinematic: () => void;
  onToggleAutoRotate: () => void;
}

export const CameraControlsHUD: React.FC<CameraControlsHUDProps> = ({
  mode,
  autoRotate,
  isTransitioning,
  selectedNodeName,
  onOverview,
  onFocusNode,
  onTopDownMap,
  onToggleCinematic,
  onToggleAutoRotate,
}) => {
  return (
    <div className="absolute top-4 right-4 z-20 flex flex-col items-end space-y-2 select-none">
      {/* Floating Glass Container */}
      <div className="glass-panel p-1.5 rounded-2xl border border-slate-800/80 bg-slate-950/80 backdrop-blur-xl shadow-2xl flex items-center space-x-1">
        {/* Galaxy Overview Button */}
        <button
          onClick={onOverview}
          title="Galaxy Overview (HotKey: R)"
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center space-x-1.5 ${
            mode === 'OVERVIEW'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
          }`}
        >
          <span>🌌</span>
          <span>Overview</span>
        </button>

        {/* Focus Node Button */}
        <button
          onClick={onFocusNode}
          disabled={!selectedNodeName}
          title={
            selectedNodeName
              ? `Focus on ${selectedNodeName} (HotKey: F)`
              : 'Select a Body to Focus'
          }
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center space-x-1.5 ${
            mode === 'FOCUS_NODE'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
              : selectedNodeName
              ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              : 'text-slate-600 cursor-not-allowed border border-transparent'
          }`}
        >
          <span>🎯</span>
          <span>Focus</span>
        </button>

        {/* Top-Down Map Button */}
        <button
          onClick={onTopDownMap}
          title="Top-Down Map View (HotKey: T)"
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center space-x-1.5 ${
            mode === 'TOP_DOWN_MAP'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
          }`}
        >
          <span>🗺️</span>
          <span>Top Map</span>
        </button>

        {/* Cinematic View Button */}
        <button
          onClick={onToggleCinematic}
          title="Cinematic Drift (HotKey: C)"
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center space-x-1.5 ${
            mode === 'CINEMATIC_AUTO_ROTATE'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-glow-purple'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
          }`}
        >
          <span>🛸</span>
          <span>Cinematic</span>
        </button>

        <div className="w-[1px] h-5 bg-slate-800 mx-1" />

        {/* Auto Rotate Toggle */}
        <button
          onClick={onToggleAutoRotate}
          title="Toggle Auto Rotation (HotKey: Space)"
          className={`p-1.5 rounded-xl text-xs font-mono transition-all ${
            autoRotate
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
          }`}
        >
          <svg
            className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {/* Mode Status Indicator */}
      <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded-full bg-slate-900/60 border border-slate-800/60 backdrop-blur-md">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isTransitioning
              ? 'bg-amber-400 animate-ping'
              : 'bg-cyan-400 animate-pulse'
          }`}
        />
        <span>
          MODE:{' '}
          <strong className="text-cyan-300 uppercase">
            {mode.replace('_', ' ')}
          </strong>
        </span>
        {isTransitioning && (
          <span className="text-amber-400 font-semibold">[FLYING...]</span>
        )}
      </div>
    </div>
  );
};
