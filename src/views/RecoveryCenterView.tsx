import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  HelpCircle, 
  CheckCircle2, 
  RefreshCw, 
  ExternalLink, 
  FileEdit, 
  Mail, 
  Check, 
  Search,
  ArrowRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ErrorLogRecord } from '../types';
import { NavView } from '../components/layout/Sidebar';

interface RecoveryCenterViewProps {
  onNavigate: (view: NavView) => void;
}

export const RecoveryCenterView: React.FC<RecoveryCenterViewProps> = ({ onNavigate }) => {
  const { errorLogs, resolveErrorLog, applications, jobs } = useApp();

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
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Root-Cause Analysis & Application Diagnostics</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Error & Recovery Center
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Every interrupted, blocked, or failed submission is tracked with verifiable evidence, confirmed diagnostics, and safe recovery workflows.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[11px] text-slate-500 block">Logged Issues</span>
            <span className="text-2xl font-bold font-mono text-rose-700 tabular-nums">
              {errorLogs.length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-lg max-w-fit text-xs font-medium">
        <button
          onClick={() => setFilterType('ALL')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            filterType === 'ALL' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Recorded Issues ({errorLogs.length})
        </button>
        <button
          onClick={() => setFilterType('CONFIRMED')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            filterType === 'CONFIRMED' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Confirmed Root Causes
        </button>
        <button
          onClick={() => setFilterType('UNCONFIRMED')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            filterType === 'UNCONFIRMED' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Uncertain Outcomes (Cause Not Confirmed)
        </button>
        <button
          onClick={() => setFilterType('SAFE_RETRY')}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            filterType === 'SAFE_RETRY' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Safe to Retry Only
        </button>
      </div>

      {/* Diagnostic Cards List */}
      {filteredErrors.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200 space-y-3">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No issues found in this category</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            All submitted application attempts are verified or resolved.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredErrors.map(err => {
            const correspondingApp = applications.find(a => a.id === err.applicationId);
            const correspondingJob = jobs.find(j => j.id === err.jobId);

            return (
              <div
                key={err.id}
                className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs transition-all hover:border-slate-300"
              >
                {/* Header row: Job title + Error Code + Confirmation status */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-slate-700">{err.source}</span>
                      <span aria-hidden="true">·</span>
                      <span>Recorded {new Date(err.timestamp).toLocaleString('en-IN')}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-600">Stage: {err.stage}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {err.jobTitle} — <span className="font-medium text-slate-600">{err.company}</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                      {err.errorCode}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                        err.rootCauseConfirmed
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-purple-50 text-purple-800 border-purple-200'
                      }`}
                    >
                      {err.rootCauseConfirmed ? 'Confirmed Root Cause' : 'Cause Not Confirmed'}
                    </span>
                  </div>
                </div>

                {/* Grid: Error Message, Verifiable Evidence, Diagnosis, Recovery Action */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Left Column: Symptoms & Evidence */}
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="font-semibold text-slate-800 block mb-1">Observed Error Message</span>
                      <p className="text-slate-700 leading-relaxed font-mono text-[11px]">
                        {err.errorMessage}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="font-semibold text-slate-800 block mb-1">Verifiable Evidence Available</span>
                      <p className="text-slate-600 leading-relaxed font-mono text-[11px]">
                        {err.evidence}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Diagnosis & Prescribed Action */}
                  <div className="space-y-3">
                    <div className={`p-3 rounded-lg border ${err.rootCauseConfirmed ? 'bg-amber-50/50 border-amber-200' : 'bg-purple-50/50 border-purple-200'}`}>
                      <span className="font-semibold text-slate-900 block mb-1">
                        {err.rootCauseConfirmed ? 'Confirmed Diagnostic Cause' : 'Likely Cause (Investigation Required)'}
                      </span>
                      <p className="text-slate-700 leading-relaxed">
                        {err.causeDescription}
                      </p>
                    </div>

                    <div className="p-3 bg-emerald-50/40 rounded-lg border border-emerald-200">
                      <span className="font-semibold text-emerald-900 block mb-1">Prescribed Recovery Action</span>
                      <p className="text-emerald-800 leading-relaxed">
                        {err.recoveryAction}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Safe Retry Banner & Action Toolbar */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Retry Safeguard:</span>
                    {err.isSafeToRetry ? (
                      <span className="font-medium text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Safe to retry without risk of duplicate application
                      </span>
                    ) : (
                      <span className="font-medium text-amber-700 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Do not retry blindly — verify email and portal first
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {correspondingJob && (
                      <a
                        href={correspondingJob.directApplicationUrl || correspondingJob.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                      >
                        <span>Open Official Portal</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    )}

                    <button
                      onClick={() => onNavigate('outreach')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                    >
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>Contact Recruiter</span>
                    </button>

                    <button
                      onClick={() => resolveErrorLog(err.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-2xs"
                    >
                      <Check className="w-3 h-3" />
                      <span>Mark as Resolved</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
