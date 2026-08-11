import React from 'react';

export interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cyan' | 'indigo' | 'slate';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  variant = 'cyan',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const sizeStyles =
    size === 'sm'
      ? 'px-2.5 py-1 text-xs'
      : size === 'lg'
        ? 'px-5 py-2.5 text-sm'
        : 'px-3.5 py-1.5 text-xs';

  const variantStyles =
    variant === 'cyan'
      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30 hover:border-cyan-400 hover:shadow-glow-cyan'
      : variant === 'indigo'
        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/30 hover:border-indigo-400 hover:shadow-glow-indigo'
        : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-700/80 hover:text-white';

  return (
    <button
      className={`font-mono border rounded-lg transition-all duration-200 flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
