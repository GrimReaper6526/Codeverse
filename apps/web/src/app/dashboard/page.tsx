'use client';

import React from 'react';
import { TopNav } from '@/components/layout/TopNav';
import { DashboardView } from '@/components/dashboard/DashboardView';

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen w-screen bg-slate-950 overflow-x-hidden">
      {/* Shared Top Navigation */}
      <TopNav />

      {/* Main Dashboard Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto">
        <DashboardView />
      </main>
    </div>
  );
}
