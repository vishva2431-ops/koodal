import React from 'react';
import { GlassCard } from './GlassCard';

interface StatCardProps {
  label: string;
  value: number | string;
  subValue?: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'none';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  icon: Icon,
  accent = 'none',
  onClick,
}) => {
  const iconColors = {
    none: 'text-slate-400 bg-slate-100 dark:bg-white/5',
    indigo: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50',
    emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50',
    amber: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50',
    rose: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50',
  }[accent];

  return (
    <GlassCard accent={accent} hoverEffect={!!onClick} onClick={onClick} className="p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
        <div className={`p-2 rounded-xl ${iconColors}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
          {value}
        </span>
        {subValue && (
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
            {subValue}
          </span>
        )}
      </div>
    </GlassCard>
  );
};
