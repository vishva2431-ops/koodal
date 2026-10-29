import React from 'react';
import { GlassButton } from './GlassButton.jsx';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  children,
}) => {
  return (
    <div className="py-12 px-6 text-center max-w-md mx-auto space-y-4">
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-500/20 mx-auto flex items-center justify-center shadow-xs">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <div className="pt-2">
          <GlassButton variant="primary" icon={actionIcon} onClick={onAction}>
            {actionLabel}
          </GlassButton>
        </div>
      )}
      {children}
    </div>
  );
};
