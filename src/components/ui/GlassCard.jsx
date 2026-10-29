import React from 'react';

export const GlassCard = ({
  children,
  className = '',
  hoverEffect = false,
  onClick,
  accent = 'none',
}) => {
  const accentBorder = {
    none: 'border-slate-200/80 dark:border-white/10',
    indigo: 'border-indigo-500/30 dark:border-indigo-400/20 shadow-indigo-500/5',
    emerald: 'border-emerald-500/30 dark:border-emerald-400/20 shadow-emerald-500/5',
    amber: 'border-amber-500/30 dark:border-amber-400/20 shadow-amber-500/5',
    rose: 'border-rose-500/30 dark:border-rose-400/20 shadow-rose-500/5',
  }[accent] || 'border-slate-200/80 dark:border-white/10';

  return (
    <div
      onClick={onClick}
      className={`relative backdrop-blur-md bg-white/80 dark:bg-slate-900/60 rounded-2xl border ${accentBorder} shadow-sm dark:shadow-2xl transition-all duration-200 ${
        hoverEffect ? 'hover:border-indigo-400/50 hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
