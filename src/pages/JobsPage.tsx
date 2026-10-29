import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Building2, 
  ExternalLink, 
  Send, 
  CheckSquare, 
  Square, 
  RefreshCw, 
  ShieldCheck, 
  Plus 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { JobListing, PortalSource } from '../types';
import { calculateJobMatch } from '../services/matchingEngine';
import { SOURCE_ADAPTERS } from '../services/sourceAdapters';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { EmptyState } from '../components/ui/EmptyState';
import { JobDetailModal } from '../components/modals/JobDetailModal';
import { ApplicationModal } from '../components/modals/ApplicationModal';
import { AddJobModal } from '../components/modals/AddJobModal';

const TN_CITIES = ['ALL', 'Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Remote'];

export const JobsPage: React.FC = () => {
  const { 
    jobs, 
    profile, 
    selectedJobIds, 
    toggleJobSelection, 
    selectAllFilteredJobs, 
    clearSelection,
    refreshJobs,
    loading 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [minMatch, setMinMatch] = useState<number>(0);
  const [onlyDemo, setOnlyDemo] = useState<boolean | null>(null);

  // Modals
  const [inspectingJob, setInspectingJob] = useState<JobListing | null>(null);
  const [applyingJob, setApplyingJob] = useState<JobListing | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // External search builder
  const [externalRole, setExternalRole] = useState('React JS Developer');
  const [externalCity, setExternalCity] = useState('Chennai');

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText = 
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.description.toLowerCase().includes(q) ||
          job.requiredSkills.some(s => s.toLowerCase().includes(q));
        if (!matchesText) return false;
      }

      if (selectedCity !== 'ALL') {
        const jobLoc = job.location.toLowerCase();
        const sel = selectedCity.toLowerCase();
        if (selectedCity === 'Remote') {
          if (job.workArrangement !== 'REMOTE' && !jobLoc.includes('remote')) return false;
        } else if (!jobLoc.includes(sel) && !(sel === 'trichy' && jobLoc.includes('tiruchirappalli'))) {
          return false;
        }
      }

      if (selectedSource !== 'ALL' && job.source !== selectedSource) {
        return false;
      }

      if (minMatch > 0) {
        const match = calculateJobMatch(job, profile);
        if (match.overallScore < minMatch) return false;
      }

      if (onlyDemo === true && !job.isDemoData) return false;
      if (onlyDemo === false && job.isDemoData) return false;

      return true;
    });
  }, [jobs, searchQuery, selectedCity, selectedSource, minMatch, onlyDemo, profile]);

  const allFilteredSelected = filteredJobs.length > 0 && filteredJobs.every(j => selectedJobIds.includes(j.id));

  const handleSelectAllToggle = () => {
    if (allFilteredSelected) {
      clearSelection();
    } else {
      selectAllFilteredJobs(filteredJobs.map(j => j.id));
    }
  };

  const openCompliantPortalSearch = (sourceKey: PortalSource) => {
    const adapter = SOURCE_ADAPTERS[sourceKey];
    if (!adapter) return;
    const url = adapter.generateCompliantSearchUrl({
      role: externalRole,
      location: externalCity,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header and Controls */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Multi-Portal Job Discovery
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Compliant search links, verified feeds, and quick capture for Tamil Nadu tech roles
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <GlassButton
              variant="glass"
              size="sm"
              icon={RefreshCw}
              loading={loading}
              onClick={refreshJobs}
            >
              Refresh
            </GlassButton>
            <GlassButton
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setIsAddOpen(true)}
            >
              Capture Job
            </GlassButton>
          </div>
        </div>

        {/* Compliant Official Portal Search Generator */}
        <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                Compliant Search URL Generator
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Generate official portal search links with verified Tamil Nadu geo-IDs
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={externalCity}
              onChange={e => setExternalCity(e.target.value)}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-mono"
            >
              <option value="Chennai">Chennai</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Madurai">Madurai</option>
              <option value="Trichy">Trichy</option>
              <option value="Salem">Salem</option>
              <option value="Tamil Nadu">All Tamil Nadu</option>
            </select>

            <button
              onClick={() => openCompliantPortalSearch('NAUKRI')}
              className="px-2.5 py-1.5 bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-lg font-medium text-[11px] flex items-center gap-1"
            >
              <span>Naukri</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
            <button
              onClick={() => openCompliantPortalSearch('LINKEDIN')}
              className="px-2.5 py-1.5 bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-lg font-medium text-[11px] flex items-center gap-1"
            >
              <span>LinkedIn</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
            <button
              onClick={() => openCompliantPortalSearch('INDEED')}
              className="px-2.5 py-1.5 bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-lg font-medium text-[11px] flex items-center gap-1"
            >
              <span>Indeed</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 text-xs">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by role, company, or skills..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
            >
              {TN_CITIES.map(c => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'Location: All Tamil Nadu' : `Location: ${c}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedSource}
              onChange={e => setSelectedSource(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-mono"
            >
              <option value="ALL">Source: All Portals</option>
              <option value="NAUKRI">Naukri.com</option>
              <option value="LINKEDIN">LinkedIn</option>
              <option value="INDEED">Indeed</option>
              <option value="COMPANY_CAREER">Company Direct</option>
            </select>
          </div>
        </div>

        {/* Batch Selection & Demo Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-white/10 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAllToggle}
              className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300 hover:text-white transition-colors"
            >
              {allFilteredSelected ? (
                <CheckSquare className="w-4 h-4 text-indigo-500" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>Select All Filtered ({filteredJobs.length})</span>
            </button>

            {selectedJobIds.length > 0 && (
              <span className="font-mono text-indigo-500 font-semibold tabular-nums">
                {selectedJobIds.length} Selected
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyDemo(onlyDemo === true ? null : true)}
              className={`px-2 py-1 rounded-lg text-[11px] font-mono border transition-colors ${
                onlyDemo === true
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              Demo Data Only
            </button>
            <button
              onClick={() => setOnlyDemo(onlyDemo === false ? null : false)}
              className={`px-2 py-1 rounded-lg text-[11px] font-mono border transition-colors ${
                onlyDemo === false
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-bold'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              Captured Only
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Job Cards Feed */}
      {filteredJobs.length === 0 ? (
        <GlassCard className="p-8">
          <EmptyState
            icon={Building2}
            title="No matching job listings"
            description="Adjust your search filters or capture a direct job posting using the Quick Capture button."
            actionLabel="Quick Capture Job"
            actionIcon={Plus}
            onAction={() => setIsAddOpen(true)}
          />
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {filteredJobs.map(job => {
            const match = calculateJobMatch(job, profile);
            const isSelected = selectedJobIds.includes(job.id);

            return (
              <GlassCard
                key={job.id}
                accent={isSelected ? 'indigo' : 'none'}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Checkbox and Info */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <button
                    onClick={() => toggleJobSelection(job.id)}
                    className="mt-1 text-slate-400 hover:text-indigo-500 shrink-0"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-indigo-500" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">
                        {job.source}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {job.location}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{job.salaryDisplay || 'Competitive'}</span>
                      <span aria-hidden="true">·</span>
                      <span>{job.workArrangement}</span>
                      {job.isDemoData && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[10px] font-mono bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.2 rounded">
                            Demo Data
                          </span>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => setInspectingJob(job)}
                      className="text-base font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left block truncate"
                    >
                      {job.title} — <span className="font-medium text-slate-500">{job.company}</span>
                    </button>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.requiredSkills.map(skill => {
                        const isMatched = match.matchingSkills.includes(skill);
                        return (
                          <span
                            key={skill}
                            className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                              isMatched
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/5'
                            }`}
                          >
                            {skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Score & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-white/5">
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-400 block uppercase">
                      Match Score
                    </span>
                    <span className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
                      {match.overallScore}%
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {match.matchingSkills.length}/{job.requiredSkills.length} Skills
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <GlassButton
                      variant="glass"
                      size="sm"
                      onClick={() => setInspectingJob(job)}
                    >
                      Details
                    </GlassButton>
                    <GlassButton
                      variant="secondary"
                      size="sm"
                      icon={Send}
                      onClick={() => setApplyingJob(job)}
                    >
                      Apply
                    </GlassButton>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <JobDetailModal
        job={inspectingJob}
        onClose={() => setInspectingJob(null)}
        onApply={(job) => {
          setInspectingJob(null);
          setApplyingJob(job);
        }}
        onOpenOutreach={() => setInspectingJob(null)}
      />

      <ApplicationModal
        job={applyingJob}
        onClose={() => setApplyingJob(null)}
        onCompleted={() => setApplyingJob(null)}
      />

      <AddJobModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
};
