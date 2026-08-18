'use client';

import React, { useState } from 'react';
import { useRuntimeEngine, WeatherType } from '@codeverse/universe-sdk';
import { Play, Pause, Activity, Zap, CloudLightning, Sun, Wind, Eye } from 'lucide-react';

export const RuntimeTelemetryHUD: React.FC = () => {
  const { events, metrics, simulationState, setSimulationState } = useRuntimeEngine();
  const [isExpanded, setIsExpanded] = useState(true);

  const weatherOptions: { type: WeatherType; label: string; icon: React.ReactNode }[] = [
    { type: 'clear_sky', label: 'Clear Sky', icon: <Sun className="w-3.5 h-3.5 text-amber-400" /> },
    {
      type: 'solar_wind',
      label: 'Solar Wind',
      icon: <Wind className="w-3.5 h-3.5 text-amber-300" />,
    },
    {
      type: 'electrical_storm',
      label: 'Electrical Storm',
      icon: <CloudLightning className="w-3.5 h-3.5 text-cyan-400" />,
    },
    {
      type: 'nebula_fog',
      label: 'Nebula Fog',
      icon: <Zap className="w-3.5 h-3.5 text-purple-400" />,
    },
  ];

  const filterPills = ['ALL', 'HTTP', 'DB', 'CACHE', 'KAFKA', 'ERROR'];

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex flex-col justify-between p-4 font-sans text-slate-100 select-none">
      {/* Top Telemetry Header Bar */}
      <div className="pointer-events-auto flex items-center justify-between rounded-xl border border-cyan-500/20 bg-slate-950/70 p-3 backdrop-blur-md shadow-2xl shadow-cyan-950/30">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
            <Activity className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-wider text-xs uppercase text-cyan-400 font-mono">
                AETHER-OS TELEMETRY
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE STREAM
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Real-time Software Physics & Telemetry Engine
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="hidden md:flex items-center gap-6 font-mono text-xs">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-400 uppercase">Throughput</span>
            <span className="font-bold text-cyan-400">
              {metrics.throughput}{' '}
              <span className="text-[10px] font-normal text-slate-400">req/s</span>
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-400 uppercase">Avg Latency</span>
            <span className="font-bold text-emerald-400">
              {metrics.avgLatency}{' '}
              <span className="text-[10px] font-normal text-slate-400">ms</span>
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-400 uppercase">Error Rate</span>
            <span
              className={`font-bold ${metrics.errorRate > 2 ? 'text-rose-400' : 'text-slate-300'}`}
            >
              {metrics.errorRate.toFixed(1)}%
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-400 uppercase">Active Streams</span>
            <span className="font-bold text-purple-400">{metrics.activeParticlesCount}</span>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry HUD Dock */}
      <div className="pointer-events-auto flex flex-col md:flex-row gap-4 items-end justify-between">
        {/* Event Feed Console */}
        <div className="w-full md:w-[480px] rounded-xl border border-cyan-500/20 bg-slate-950/80 p-3 backdrop-blur-md shadow-2xl flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>LIVE TELEMETRY LOG</span>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {isExpanded ? '[MINIMIZE]' : '[EXPAND]'}
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1 overflow-x-auto pb-1">
            {filterPills.map((pill) => (
              <button
                key={pill}
                onClick={() => setSimulationState({ eventFilter: pill })}
                className={`rounded-md px-2 py-0.5 text-[10px] font-mono transition-all ${
                  simulationState.eventFilter === pill
                    ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 shadow-sm shadow-cyan-500/20'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Event Stream List */}
          {isExpanded && (
            <div className="h-36 overflow-y-auto font-mono text-[11px] space-y-1 pr-1 custom-scrollbar">
              {events.slice(0, 15).map((evt) => (
                <div
                  key={evt.id}
                  className="flex items-center justify-between rounded bg-slate-900/40 p-1.5 border border-slate-800/50 hover:border-cyan-500/30 transition-colors"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span
                      className={`inline-block h-1.5 w-1.5 rounded-full ${
                        evt.statusCode >= 400
                          ? 'bg-rose-400 animate-pulse'
                          : evt.type === 'http_request'
                            ? 'bg-emerald-400'
                            : evt.type === 'db_query'
                              ? 'bg-blue-400'
                              : evt.type === 'cache_hit'
                                ? 'bg-cyan-400'
                                : 'bg-purple-400'
                      }`}
                    />
                    <span className="text-slate-400 text-[10px]">{evt.protocol}</span>
                    <span className="text-slate-200 truncate">{evt.endpoint}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-slate-400 text-[10px]">{evt.durationMs}ms</span>
                    <span
                      className={`text-[10px] font-bold ${
                        evt.statusCode >= 400 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {evt.statusCode}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Simulation Controls Dock */}
        <div className="rounded-xl border border-cyan-500/20 bg-slate-950/80 p-3 backdrop-blur-md shadow-2xl flex flex-wrap items-center gap-3">
          {/* Play/Pause Button */}
          <button
            onClick={() => setSimulationState({ isPlaying: !simulationState.isPlaying })}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all shadow-md shadow-cyan-500/10"
            title={simulationState.isPlaying ? 'Pause Simulation' : 'Play Simulation'}
          >
            {simulationState.isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4 ml-0.5" />
            )}
          </button>

          {/* Speed Buttons */}
          <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900/60 p-0.5">
            {[1, 2, 5, 10].map((s) => (
              <button
                key={s}
                onClick={() => setSimulationState({ speed: s })}
                className={`px-2 py-1 text-[10px] font-mono rounded transition-all ${
                  simulationState.speed === s
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Weather System Selector */}
          <div className="flex items-center gap-1.5 border-l border-slate-800 pl-3">
            {weatherOptions.map((w) => (
              <button
                key={w.type}
                onClick={() => setSimulationState({ weather: w.type })}
                className={`flex items-center gap-1 px-2.5 py-1 rounded.lg border text-[11px] font-mono transition-all ${
                  simulationState.weather === w.type
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200'
                }`}
                title={w.label}
              >
                {w.icon}
                <span className="hidden sm:inline">{w.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
