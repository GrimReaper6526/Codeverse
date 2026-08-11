import React from 'react';

export interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
  intensity = 'medium',
}) => {
  const blurStyle =
    intensity === 'high'
      ? 'backdrop-blur-xl bg-slate-900/85 border-slate-700/80 shadow-glow-cyan'
      : intensity === 'low'
        ? 'backdrop-blur-sm bg-slate-950/50 border-slate-850/50'
        : 'backdrop-blur-md bg-slate-900/75 border-slate-800/80 shadow-lg';

  return (
    <div className={`border rounded-xl transition-all duration-300 ${blurStyle} ${className}`}>
      {children}
    </div>
  );
};
