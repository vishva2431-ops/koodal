import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  HelpCircle, 
  Search, 
  ArrowUpRight, 
  MapPin, 
  UserCheck, 
  FileText, 
  Building2,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { calculateJobMatch } from '../services/matchingEngine';
import { JobListing } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { StatCard } from '../components/ui/StatCard';
import { GlassButton } from '../components/ui/GlassButton';
import { EmptyState } from '../components/ui/EmptyState';
import { JobDetailModal } from '../components/modals/JobDetailModal';
import { ApplicationModal } from '../components/modals/ApplicationModal';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { jobs, applications, errorLogs, profile, selectedJobIds } = useApp();

  const [inspectingJob, setInspectingJob] = useState<JobListing | null>(null);
  const [applyingJob, setApplyingJob] = useState<JobListing | null>(null);

  // Dynamic calculations from actual database records
  const totalDiscovered = jobs.length;
  const highMatchJobs = jobs.filter(j => calculateJobMatch(j, profile).overallScore >= 70).length;
  const selectedCount = selectedJobIds.length;
  const submittedCount = applications.filter(a => a.status === 'SUBMITTED').length;
  const inProgressCount = applications.filter(a => a.status === 'IN_PROGRESS' || a.status === 'READY').length;
  const failedCount = applications.filter(a => a.status === 'FAILED' || a.status === 'BLOCKED').length;
  const uncertainCount = applications.filter(a => a.status === 'SUBMISSION_UNKNOWN').length;

  const latestJobs = [...jobs]
    .sort((a, b) => new Date(b.dateDiscovered).getTime() - new Date(a.dateDiscovered).getTime())
    .slice(0, 4);

  const isProfileEmpty = !profile.fullName && (!profile.skills || profile.skills.length === 0);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Onboarding Banner if Profile is Empty */}
      {isProfileEmpty ? (
        <GlassCard className="p-6 border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <UserCheck className="w-4 h-4" />
            <span>First-Time Setup Required</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Welcome to Koodal! Let&apos;s Set Up Your Developer Profile
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Your profile currently has no personal or technical details. Add your target roles (React, Frontend, Full Stack), preferred Tamil Nadu cities, and upload your resume to enable accurate rules-based matching.
          </p>
          <div className="pt-1 flex gap-3">
            <GlassButton variant="primary" size="sm" onClick={() => navigate('/profile')}>
              Complete Profile
            </GlassButton>
            <GlassButton variant="glass" size="sm" onClick={() => navigate('/resumes')}>
              Upload Resume
            </GlassButton>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
              <span>Personal Career Dashboard</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{user?.email}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {profile.fullName ? `Hello, ${profile.fullName}` : 'Welcome Back'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Profile completeness is at <strong className="font-mono text-indigo-600 dark:text-indigo-400">{profile.completenessScore || 0}%</strong>. You have <strong className="font-mono">{highMatchJobs} high-match</strong> opportunities across Tamil Nadu matching your requirements.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <GlassButton variant="primary" size="sm" icon={Search} onClick={() => navigate('/jobs')}>
              Discover Jobs
            </GlassButton>
            <GlassButton variant="glass" size="sm" onClick={() => navigate('/profile')}>
              Edit Profile
            </GlassButton>
          </div>
        </GlassCard>
      )}

      {/* Real Database KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Cataloged Jobs"
          value={totalDiscovered}
          subValue={`${highMatchJobs} High Fit`}
          icon={Search}
          accent="none"
          onClick={() => navigate('/jobs')}
        />
        <StatCard
          label="Selected for Application"
          value={selectedCount}
          subValue="Active Queue"
          icon={Briefcase}
          accent="indigo"
          onClick={() => navigate('/jobs')}
        />
        <StatCard
          label="Submitted Successfully"
          value={submittedCount}
          subValue={`${inProgressCount} in progress`}
          icon={CheckCircle2}
          accent="emerald"
          onClick={() => navigate('/applications')}
        />
        <StatCard
          label="Errors & Uncertain"
          value={failedCount + uncertainCount}
          subValue={`${uncertainCount} unconfirmed`}
          icon={AlertTriangle}
          accent={failedCount + uncertainCount > 0 ? 'rose' : 'none'}
          onClick={() => navigate('/recovery')}
        />
      </div>

      {/* Main Grid: Latest Opportunities + Recovery Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Opportunities (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Latest Job Discoveries
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sorted by discovery date across Tamil Nadu tech hubs
              </p>
            </div>
            <button
              onClick={() => navigate('/jobs')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1"
            >
              <span>View All ({jobs.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {latestJobs.length === 0 ? (
            <GlassCard className="p-8">
              <EmptyState
                icon={Briefcase}
                title="No jobs discovered yet"
                description="Use the Discover Jobs view to browse compliant links or use Quick Capture to add postings."
                actionLabel="Find Jobs"
                onAction={() => navigate('/jobs')}
              />
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {latestJobs.map(job => {
                const match = calculateJobMatch(job, profile);
                return (
                  <GlassCard
                    key={job.id}
                    hoverEffect
                    onClick={() => setInspectingJob(job)}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">
                          {job.source}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{job.location}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-slate-700 dark:text-slate-300">
                          {job.salaryDisplay || 'Competitive'}
                        </span>
                        {job.isDemoData && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-[10px] font-mono bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.2 rounded">
                              Demo Data
                            </span>
                          </>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {job.title} — <span className="font-normal text-slate-500">{job.company}</span>
                      </h4>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {job.requiredSkills.slice(0, 4).map(s => (
                          <span
                            key={s}
                            className="text-[10px] font-mono bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums block">
                          {match.overallScore}%
                        </span>
                        <span className="text-[10px] text-slate-400 block">Match Score</span>
                      </div>
                      <GlassButton
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setApplyingJob(job);
                        }}
                      >
                        Apply
                      </GlassButton>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Sidebar: Recovery Center quick summary */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recovery Center Status
            </h3>
            <button
              onClick={() => navigate('/recovery')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              Open Center
            </button>
          </div>

          <GlassCard className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Application Interruption Monitor
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every failed or uncertain application is held here with verifiable evidence to prevent dangerous duplicate submissions.
            </p>

            {errorLogs.length === 0 ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>All submitted applications currently verified.</span>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                {errorLogs.slice(0, 3).map(err => (
                  <div key={err.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-white truncate">{err.jobTitle}</span>
                      <span className="font-mono text-[10px] text-rose-500 bg-rose-500/10 px-1.5 py-0.2 rounded">
                        {err.errorCode}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{err.errorMessage}</p>
                    <div className="text-[10px] text-slate-500 pt-0.5">
                      {err.rootCauseConfirmed ? 'Confirmed Diagnostic' : 'Cause Not Confirmed'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      {/* Modals */}
      <JobDetailModal
        job={inspectingJob}
        onClose={() => setInspectingJob(null)}
        onApply={(job) => {
          setInspectingJob(null);
          setApplyingJob(job);
        }}
        onOpenOutreach={() => {
          setInspectingJob(null);
          navigate('/outreach');
        }}
      />

      <ApplicationModal
        job={applyingJob}
        onClose={() => setApplyingJob(null)}
        onCompleted={() => {
          setApplyingJob(null);
          navigate('/applications');
        }}
      />
    </div>
  );
};
