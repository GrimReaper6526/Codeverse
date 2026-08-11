'use client';

import React from 'react';
import { TopNav } from '@/components/layout/TopNav';
import { LeftExplorer } from '@/components/layout/LeftExplorer';
import { RightAIAssistant } from '@/components/layout/RightAIAssistant';
import { BottomConsole } from '@/components/layout/BottomConsole';
import { UniverseCanvasPlaceholder } from '@/components/universe/UniverseCanvasPlaceholder';
import { ActionDock } from '@/components/ui/ActionDock';

export default function AppShell() {
  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 overflow-hidden select-none">
      {/* 1. Top Navigation */}
      <TopNav />

      {/* 2. Main Workspace Body */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Left Explorer Drawer */}
        <LeftExplorer />

        {/* Center Primary Viewport — 3D Universe */}
        <main className="flex-1 relative h-full w-full overflow-hidden">
          <UniverseCanvasPlaceholder />
          <ActionDock />
        </main>

        {/* Right AI Assistant Workspace */}
        <RightAIAssistant />
      </div>

      {/* 3. Bottom Console & Telemetry */}
      <BottomConsole />
    </div>
  );
}
