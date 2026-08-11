'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { TopNav } from '@/components/layout/TopNav';
import { LeftExplorer } from '@/components/layout/LeftExplorer';
import { RightAIAssistant } from '@/components/layout/RightAIAssistant';
import { BottomConsole } from '@/components/layout/BottomConsole';
import { ActionDock } from '@/components/ui/ActionDock';

// Dynamically import 3D Universe Canvas with SSR disabled for Three.js/WebGL compatibility
const UniverseCanvas = dynamic(
  () => import('@codeverse/universe-sdk').then((mod) => mod.UniverseCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-cyan-400 rounded-full animate-spin mb-3" />
        <span className="text-xs font-mono text-cyan-400 animate-pulse">
          Initializing 3D WebGL Canvas...
        </span>
      </div>
    ),
  },
);

export default function AppShell() {
  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 overflow-hidden select-none">
      {/* 1. Top Navigation Bar */}
      <TopNav />

      {/* 2. Primary Workspace Layout */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Left Repository Explorer */}
        <LeftExplorer />

        {/* Center Interactive 3D Software Universe Canvas */}
        <main className="flex-1 relative h-full w-full overflow-hidden">
          <UniverseCanvas />
          <ActionDock />
        </main>

        {/* Right AI Assistant Drawer */}
        <RightAIAssistant />
      </div>

      {/* 3. Bottom Console & Real-time Telemetry */}
      <BottomConsole />
    </div>
  );
}
