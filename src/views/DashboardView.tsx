import React from 'react';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  HelpCircle, 
  Sparkles, 
  Search, 
  ArrowUpRight, 
  MapPin, 
  Send,
  Building2,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavView } from '../components/layout/Sidebar';
import { calculateJobMatch } from '../services/matchingEngine';
import { JobListing } from '../types';

interface DashboardViewProps {
  onNavigate: (view: NavView) => void;
  onOpenJobDetail: (job: JobListing) => void;
  onStartApply: (job: JobListing) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenJobDetail,
  onStartApply,
}) => {
  const { jobs, applications, errorLogs, profile, selectedJobIds } = useApp();

  // Metric Computations
  const totalDiscovered = jobs.length;
  const highMatchJobs = jobs.filter(j => calculateJobMatch(j, profile).overallScore >= 70).length;
  const selectedCount = selectedJobIds.length;
  const submittedCount = applications.filter(a => a.status === 'SUBMITTED').length;
  const inProgressCount = applications.filter(a => a.status === 'IN_PROGRESS' || a.status === 'READY').length;
  const failedCount = applications.filter(a => a.status === 'FAILED' || a.status === 'BLOCKED').length;
  const uncertainCount = applications.filter(a => a.status === 'SUBMISSION_UNKNOWN').length;

  const latestJobs = [...jobs].sort((a, b) => new Date(b.dateDiscovered).getTime() - new Date(a.dateDiscovered).getTime()).slice(0, 4);
  const recentErrors = [...errorLogs].slice(0, 3);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Welcome Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 mb-1">
            <span>Tamil Nadu Career Pipeline</span>
            <span aria-hidden="true">·</span>
            <span className="font-normal text-slate-500">React · Frontend · Full Stack</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {profile.fullName || 'Vishva'}
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            You have <strong className="text-slate-900 font-mono tabular-nums">{highMatchJobs} high-affinity opportunities</strong> across Chennai, Coimbatore, Madurai, and Trichy matching your 2.5 years experience and React/TypeScript stack.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('discover')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Find Jobs</span>
          </button>
          <button
            onClick={() => onNavigate('profile')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-medium rounded-lg transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* KPI Stat Cards (Single Elevation, Tabular Numerals) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Discovered Jobs</span>
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {totalDiscovered}
            </span>
            <span className="text-[11px] font-mono text-emerald-600">
              {highMatchJobs} High Match
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Naukri · LinkedIn · Indeed · Portals</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Selected for Application</span>
            <Briefcase className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-indigo-600 tabular-nums">
              {selectedCount}
            </span>
            <button
              onClick={() => onNavigate('discover')}
              className="text-[11px] text-indigo-600 hover:underline font-medium"
            >
              Review Queue
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Ready for assisted workflow</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Submitted Successfully</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
              {submittedCount}
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {inProgressCount} In Progress
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Evidence confirmed applications</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Errors & Uncertain</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-rose-700 tabular-nums">
              {failedCount + uncertainCount}
            </span>
            <span className="text-[11px] font-mono text-amber-700">
              {uncertainCount} Unconfirmed
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Actionable in Recovery Center</p>
        </div>
      </div>

      {/* Main Grid: Latest Opportunities + Error Log Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Opportunities (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Latest Job Discoveries in Tamil Nadu</h3>
              <p className="text-xs text-slate-500">Verified postings matching your core frontend stack</p>
            </div>
            <button
              onClick={() => onNavigate('discover')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
            >
              <span>View All ({jobs.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {latestJobs.map(job => {
              const match = calculateJobMatch(job, profile);
              return (
                <div key={job.id} className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-0.5">
                      <span className="font-semibold text-slate-700">{job.source}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{job.location}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{job.salaryDisplay || 'Competitive'}</span>
                    </div>
                    <button
                      onClick={() => onOpenJobDetail(job)}
                      className="text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors text-left block truncate"
                    >
                      {job.title} — <span className="font-normal text-slate-600">{job.company}</span>
                    </button>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {job.requiredSkills.slice(0, 4).map(s => (
                        <span key={s} className="text-[10px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-indigo-700 tabular-nums block">
                        {match.overallScore}%
                      </span>
                      <span className="text-[10px] text-slate-400 block">Match</span>
                    </div>
                    <button
                      onClick={() => onStartApply(job)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar: Recovery Center & Quick Action Card */}
        <div className="space-y-6">
          {/* Recovery Center Quick Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">Recovery Center</h3>
              </div>
              <button
                onClick={() => onNavigate('recovery')}
                className="text-xs text-indigo-600 hover:underline font-medium"
              >
                Inspect
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every interrupted submission is documented with verifiable evidence and recovery steps.
            </p>

            {recentErrors.length > 0 ? (
              <div className="space-y-2.5 pt-1">
                {recentErrors.map(err => (
                  <div key={err.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 truncate">{err.jobTitle}</span>
                      <span className="text-[10px] font-mono text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded">
                        {err.errorCode}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{err.errorMessage}</p>
                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                      <span>{err.rootCauseConfirmed ? 'Confirmed Cause' : 'Cause not confirmed'}</span>
                      <button
                        onClick={() => onNavigate('recovery')}
                        className="text-indigo-600 hover:underline font-medium"
                      >
                        Resolve →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All applications currently healthy and verified.</span>
              </div>
            )}
          </div>

          {/* Spring Boot & MongoDB Integration Status */}
          <div className="bg-slate-900 text-white rounded-xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-wider">
                Full-Stack Architecture
              </span>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                ₹0 Cost
              </span>
            </div>
            <h4 className="text-sm font-bold">Spring Boot 3 + MongoDB Atlas Ready</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Production Java code structured with Spring Security, Mongo Repositories, and REST APIs. Ready for free deployment to Render/Fly.io.
            </p>
            <button
              onClick={() => onNavigate('springboot')}
              className="w-full mt-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Inspect Java Backend Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
