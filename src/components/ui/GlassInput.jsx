import React, { forwardRef } from 'react';

export const GlassInput = forwardRef(
  ({ label, error, hint, leftIcon: LeftIcon, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5 text-left w-full">
        {label && (
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          {LeftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <LeftIcon className="w-4 h-4" />
            </div>
          )}
          <input
            ref={ref}
            className={`w-full rounded-xl backdrop-blur-xs bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/90 dark:border-white/10 px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all ${
              LeftIcon ? 'pl-9' : ''
            } ${error ? 'border-rose-500 focus:ring-rose-500/50' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-[11px] text-rose-500 font-medium">{error}</p>}
        {hint && !error && <p className="text-[11px] text-slate-400">{hint}</p>}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';
