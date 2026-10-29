import React from 'react';

export const GlassButton = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-xs font-semibold',
    lg: 'px-5 py-2.5 text-sm font-semibold',
  }[size] || 'px-4 py-2 text-xs font-semibold';

  const variantStyles = {
    primary:
      'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs shadow-indigo-500/20 active:translate-y-px',
    secondary:
      'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100',
    glass:
      'backdrop-blur-md bg-white/70 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 shadow-xs',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white shadow-xs shadow-rose-500/20',
    ghost:
      'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5',
  }[variant] || 'bg-indigo-600 hover:bg-indigo-500 text-white';

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-150 select-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        Icon && <Icon className="w-3.5 h-3.5 shrink-0" />
      )}
      <span className="truncate">{children}</span>
    </button>
  );
};
