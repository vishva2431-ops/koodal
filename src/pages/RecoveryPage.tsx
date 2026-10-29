import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink, 
  Mail, 
  Check 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { EmptyState } from '../components/ui/EmptyState';

export const RecoveryPage: React.FC = () => {
  const { errorLogs, resolveErrorLog, jobs } = useApp();

  const [filterType, setFilterType] = useState<'ALL' | 'CONFIRMED' | 'UNCONFIRMED' | 'SAFE_RETRY'>('ALL');

  const filteredErrors = errorLogs.filter(err => {
    if (filterType === 'CONFIRMED') return err.rootCauseConfirmed;
    if (filterType === 'UNCONFIRMED') return !err.rootCauseConfirmed;
    if (filterType === 'SAFE_RETRY') return err.isSafeToRetry;
    return true;
  });

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <GlassCard className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-500 uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Root-Cause Analysis & Diagnostics</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Error & Recovery Center
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Documented evidence and root causes for interrupted, blocked, or failed submissions.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-500 block">Logged Incidents</span>
          <span className="text-2xl font-bold font-mono text-rose-500 tabular-nums">
            {errorLogs.length}
          </span>
        </div>
      </GlassCard>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 max-w-fit text-xs font-medium">
        <button
          onClick={() => setFilterType('ALL')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filterType === 'ALL'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-500 hover:text-white'
          }`}
        >
          All Issues ({errorLogs.length})
        </button>
        <button
          onClick={() => setFilterType('CONFIRMED')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filterType === 'CONFIRMED'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-500 hover:text-white'
          }`}
        >
          Confirmed Root Causes
        </button>
        <button
          onClick={() => setFilterType('UNCONFIRMED')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filterType === 'UNCONFIRMED'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-500 hover:text-white'
          }`}
        >
          Cause Not Confirmed
        </button>
        <button
          onClick={() => setFilterType('SAFE_RETRY')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filterType === 'SAFE_RETRY'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
              : 'text-slate-500 hover:text-white'
          }`}
        >
          Safe to Retry Only
        </button>
      </div>

      {/* Issues Cards */}
      {filteredErrors.length === 0 ? (
        <GlassCard className="p-12">
          <EmptyState
            icon={CheckCircle2}
            title="No application issues recorded"
            description="All application attempts are currently confirmed or resolved."
          />
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {filteredErrors.map(err => {
            const correspondingJob = jobs.find(j => j.id === err.jobId);

            return (
              <GlassCard key={err.id} className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">
                        {err.source}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{new Date(err.timestamp).toLocaleString('en-IN')}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">Stage: {err.stage}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {err.jobTitle} — <span className="font-medium text-slate-500">{err.company}</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-xs font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md">
                      {err.errorCode}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${
                        err.rootCauseConfirmed
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      }`}
                    >
                      {err.rootCauseConfirmed ? 'Confirmed Diagnostic' : 'Cause Not Confirmed'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                        Observed Error Message
                      </span>
                      <p className="text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                        {err.errorMessage}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                        Verifiable Evidence Logged
                      </span>
                      <p className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        {err.evidence}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                        {err.rootCauseConfirmed ? 'Confirmed Root Cause' : 'Likely Cause (Investigation Required)'}
                      </span>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {err.causeDescription}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <span className="font-semibold text-emerald-400 block mb-1">
                        Recommended Recovery Action
                      </span>
                      <p className="text-emerald-300 leading-relaxed">
                        {err.recoveryAction}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Retry Safeguard:</span>
                    {err.isSafeToRetry ? (
                      <span className="font-medium text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Safe to retry (no duplicate risk)
                      </span>
                    ) : (
                      <span className="font-medium text-amber-400 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Do not retry blindly without portal verification
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {correspondingJob && (
                      <a
                        href={correspondingJob.directApplicationUrl || correspondingJob.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300"
                      >
                        <span>Open Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <GlassButton
                      variant="primary"
                      size="sm"
                      icon={Check}
                      onClick={() => resolveErrorLog(err.id)}
                      className="bg-emerald-600 hover:bg-emerald-500"
                    >
                      Mark Resolved
                    </GlassButton>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
