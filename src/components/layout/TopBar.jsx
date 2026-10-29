import React from 'react';
import { Menu, Plus, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

const VIEW_TITLES = {
  dashboard: { title: 'Personal Dashboard', section: 'Overview' },
  discover: { title: 'Discover Jobs', section: 'Job Hunting' },
  applications: { title: 'Application Tracker', section: 'Applications' },
  recovery: { title: 'Error & Recovery Center', section: 'Diagnostics' },
  profile: { title: 'My Profile & Preferences', section: 'Profile' },
  resume: { title: 'Resume Extractor & Versions', section: 'Documents' },
  outreach: { title: 'Outreach & Message Templates', section: 'Outreach' },
  springboot: { title: 'Spring Boot 3 + MongoDB Architecture', section: 'Backend Code' },
  'zero-cost': { title: 'Zero-Cost Hosting & Limits Guide', section: 'Deployment' },
};

export const TopBar = ({ currentView, onOpenMobile, onOpenAddJob }) => {
  const { profile, refreshJobs, loading } = useApp();
  const info = VIEW_TITLES[currentView] || { title: 'Dashboard', section: 'App' };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 px-4 md:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Zone 1: Mobile toggle + Breadcrumb trail */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobile}
          className="md:hidden p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
          <span className="hidden sm:inline font-medium text-slate-400 dark:text-slate-500">{info.section}</span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">/</span>
          <h1 className="font-semibold text-slate-900 dark:text-white text-sm truncate">{info.title}</h1>
        </div>
      </div>

      {/* Zone 2: Profile Readiness & Scope Trust Marker */}
      <div className="hidden lg:flex items-center gap-6 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Profile Readiness:</span>
          <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
            {profile?.completenessScore || 0}%
          </span>
          {(profile?.completenessScore || 0) >= 80 ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
          )}
        </div>
        <span className="text-slate-300 dark:text-slate-700">|</span>
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <span>Roles:</span>
          <span className="font-medium text-slate-700 dark:text-slate-300">React · Frontend · Full Stack</span>
        </div>
      </div>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={refreshJobs}
          disabled={loading}
          title="Refresh verified job feeds"
          className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
        </button>

        <button
          onClick={onOpenAddJob}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Quick Capture Job</span>
        </button>
      </div>
    </header>
  );
};
