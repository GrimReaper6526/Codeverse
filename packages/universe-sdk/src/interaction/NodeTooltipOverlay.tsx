import React from 'react';
import { HoverDetails } from './InteractionTypes';

interface NodeTooltipOverlayProps {
  hoverDetails: HoverDetails | null;
}

export const NodeTooltipOverlay: React.FC<NodeTooltipOverlayProps> = ({ hoverDetails }) => {
  if (!hoverDetails || !hoverDetails.node) return null;

  const { node, screenPosition } = hoverDetails;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${Math.min(Math.max(screenPosition.x + 15, 10), window.innerWidth - 300)}px`,
    top: `${Math.min(Math.max(screenPosition.y - 40, 10), window.innerHeight - 200)}px`,
    pointerEvents: 'none',
  };

  const typeColorMap: Record<string, string> = {
    star: 'from-amber-500 to-yellow-400 border-amber-400/50 text-amber-300',
    planet: 'from-cyan-500 to-blue-500 border-cyan-400/50 text-cyan-300',
    moon: 'from-slate-400 to-slate-200 border-slate-300/50 text-slate-200',
    satellite: 'from-pink-500 to-rose-400 border-pink-400/50 text-pink-300',
    galaxy: 'from-indigo-500 to-purple-500 border-indigo-400/50 text-indigo-300',
  };

  const badgeClass =
    typeColorMap[node.type] || 'from-cyan-500 to-blue-500 border-cyan-400/50 text-cyan-300';

  return (
    <div style={style} className="z-30 transition-all duration-75 ease-out animate-in fade-in zoom-in-95">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-xl p-3.5 shadow-2xl min-w-[240px] text-slate-100 space-y-2">
        <div className="flex items-center justify-between space-x-2">
          <span className="font-mono font-bold text-sm text-cyan-300 truncate max-w-[170px]">
            {node.name}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-gradient-to-r ${badgeClass} border border-opacity-30`}
          >
            {node.type}
          </span>
        </div>

        {node.path && (
          <div className="text-[11px] font-mono text-slate-400 truncate bg-slate-950/50 px-2 py-1 rounded border border-slate-800">
            {node.path}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1 border-t border-slate-800">
          <div>
            <span className="text-slate-500 block">Symbols:</span>
            <span className="text-slate-200 font-bold">{node.symbolCount ?? 0}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Connections:</span>
            <span className="text-slate-200 font-bold">{node.connections?.length ?? 0}</span>
          </div>
        </div>

        {node.language && (
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
            <span>Language:</span>
            <span className="text-cyan-400 font-semibold">{node.language}</span>
          </div>
        )}
      </div>
    </div>
  );
};
