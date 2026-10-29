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
import { useApp } from '../context/AppContext.jsx';
import { calculateJobMatch } from '../services/matchingEngine.js';
import { SOURCE_ADAPTERS } from '../services/sourceAdapters.js';

const TN_CITIES = ['ALL', 'Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Remote'];

export const DiscoverJobsView = ({
  onOpenJobDetail,
  onStartApply,
  onOpenAddJob,
}) => {
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
  const [selectedSource, setSelectedSource] = useState('ALL');
  const [selectedWorkType, setSelectedWorkType] = useState('ALL');
  const [minMatch, setMinMatch] = useState(0);
  const [onlyDemo, setOnlyDemo] = useState(null);

  // External compliant search portal launcher
  const [externalRole, setExternalRole] = useState('React JS Developer');
  const [externalCity, setExternalCity] = useState('Chennai');

  // Filter & match logic
  const filteredJobs = useMemo(() => {
    return (jobs || []).filter(job => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText = 
          job.title?.toLowerCase().includes(q) ||
          job.company?.toLowerCase().includes(q) ||
          job.description?.toLowerCase().includes(q) ||
          job.requiredSkills?.some(s => s.toLowerCase().includes(q));
        if (!matchesText) return false;
      }

      // 2. City Filter
      if (selectedCity !== 'ALL') {
        const jobLoc = (job.location || '').toLowerCase();
        const sel = selectedCity.toLowerCase();
        if (selectedCity === 'Remote') {
          if (job.workArrangement !== 'REMOTE' && !jobLoc.includes('remote')) return false;
        } else if (!jobLoc.includes(sel) && !(sel === 'trichy' && jobLoc.includes('tiruchirappalli'))) {
          return false;
        }
      }

      // 3. Source Filter
      if (selectedSource !== 'ALL' && job.source !== selectedSource) {
        return false;
      }

      // 4. Work Type
      if (selectedWorkType !== 'ALL' && job.workArrangement !== selectedWorkType) {
        return false;
      }

      // 5. Match Score filter
      if (minMatch > 0) {
        const match = calculateJobMatch(job, profile);
        if (match.overallScore < minMatch) return false;
      }

      // 6. Demo flag filter
      if (onlyDemo === true && !job.isDemoData) return false;
      if (onlyDemo === false && job.isDemoData) return false;

      return true;
    });
  }, [jobs, searchQuery, selectedCity, selectedSource, selectedWorkType, minMatch, onlyDemo, profile]);

  const allFilteredSelected = filteredJobs.length > 0 && filteredJobs.every(j => (selectedJobIds || []).includes(j.id));

  const handleSelectAllToggle = () => {
    if (allFilteredSelected) {
      clearSelection();
    } else {
      selectAllFilteredJobs(filteredJobs.map(j => j.id));
    }
  };

  const openCompliantPortalSearch = (sourceKey) => {
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
      {/* Top Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-white/10 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Multi-Portal Job Discovery (Tamil Nadu)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Targeted React, Frontend, and Full Stack opportunities from Naukri, LinkedIn, Indeed, and Company Career Portals
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={refreshJobs}
              disabled={loading}
              className="p-2 border border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Refresh job listings"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
            <button
              onClick={onOpenAddJob}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Quick Capture Job</span>
            </button>
          </div>
        </div>

        {/* Compliant Official Portal Search Generator */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200/80 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <div className="min-w-0">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                Compliant Official Search Link Generator
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Generate official search URLs with Tamil Nadu geo-IDs without violating platform terms
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <select
              value={externalCity}
              onChange={e => setExternalCity(e.target.value)}
              className="p-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded text-xs font-mono dark:text-white"
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
              className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-white/10 rounded font-medium text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <span>Naukri TN</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
            <button
              onClick={() => openCompliantPortalSearch('LINKEDIN')}
              className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-white/10 rounded font-medium text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <span>LinkedIn TN</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
            <button
              onClick={() => openCompliantPortalSearch('INDEED')}
              className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-white/10 rounded font-medium text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <span>Indeed TN</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {/* Search box */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by role, company, or skills (e.g. React, TypeScript)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg text-xs focus:bg-white dark:focus:bg-slate-700 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden dark:text-white"
            />
          </div>

          {/* City */}
          <div>
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg text-xs focus:bg-white dark:text-white"
            >
              {TN_CITIES.map(c => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'Location: All Tamil Nadu' : `Location: ${c}`}
                </option>
              ))}
            </select>
          </div>

          {/* Source Portal */}
          <div>
            <select
              value={selectedSource}
              onChange={e => setSelectedSource(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg text-xs focus:bg-white font-mono dark:text-white"
            >
              <option value="ALL">Source: All Portals</option>
              <option value="NAUKRI">Naukri.com</option>
              <option value="LINKEDIN">LinkedIn</option>
              <option value="INDEED">Indeed</option>
              <option value="COMPANY_CAREER">Company Direct</option>
            </select>
          </div>

          {/* Min Match */}
          <div>
            <select
              value={minMatch}
              onChange={e => setMinMatch(Number(e.target.value))}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg text-xs focus:bg-white font-mono dark:text-white"
            >
              <option value={0}>Match Score: All</option>
              <option value={50}>Match: 50%+ Eligible</option>
              <option value={70}>Match: 70%+ Strong</option>
              <option value={85}>Match: 85%+ Top Fit</option>
            </select>
          </div>
        </div>

        {/* Active Filter Indicators & Batch Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-white/5 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAllToggle}
              className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {allFilteredSelected ? (
                <CheckSquare className="w-4 h-4 text-indigo-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>Select All Filtered ({filteredJobs.length})</span>
            </button>

            {(selectedJobIds || []).length > 0 && (
              <span className="font-mono text-indigo-700 dark:text-indigo-400 font-semibold tabular-nums">
                {selectedJobIds.length} Selected
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyDemo(onlyDemo === true ? null : true)}
              className={`px-2 py-1 rounded text-[11px] font-mono border transition-colors cursor-pointer ${
                onlyDemo === true
                  ? 'bg-amber-100 text-amber-800 border-amber-300 font-bold dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-50'
              }`}
            >
              Sample Data Only
            </button>
            <button
              onClick={() => setOnlyDemo(onlyDemo === false ? null : false)}
              className={`px-2 py-1 rounded text-[11px] font-mono border transition-colors cursor-pointer ${
                onlyDemo === false
                  ? 'bg-indigo-100 text-indigo-800 border-indigo-300 font-bold dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-50'
              }`}
            >
              Captured Only
            </button>
          </div>
        </div>
      </div>

      {/* Job Listings Grid / Feed */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-white/10 space-y-3">
          <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No matching jobs discovered</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Try adjusting your search keywords, location filter across Tamil Nadu, or lower the match threshold. You can also capture a direct job posting using Quick Capture.
          </p>
          <button
            onClick={onOpenAddJob}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Quick Capture New Job</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {filteredJobs.map(job => {
            const match = calculateJobMatch(job, profile);
            const isSelected = (selectedJobIds || []).includes(job.id);

            return (
              <div
                key={job.id}
                className={`bg-white dark:bg-slate-900 rounded-xl border p-5 transition-all duration-150 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isSelected 
                    ? 'border-indigo-400 dark:border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-2xs' 
                    : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                {/* Left zone: Checkbox + Job meta */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <button
                    onClick={() => toggleJobSelection(job.id)}
                    className="mt-1 text-slate-400 hover:text-indigo-600 shrink-0 cursor-pointer"
                    title={isSelected ? 'Deselect job' : 'Select job'}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">{job.source}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {job.location}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">{job.salaryDisplay || 'Competitive'}</span>
                      <span aria-hidden="true">·</span>
                      <span>{job.workArrangement}</span>
                      {job.isDemoData && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[10px] font-mono bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200/70 dark:border-amber-800 px-1.5 py-0.2 rounded">
                            Sample
                          </span>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => onOpenJobDetail(job)}
                      className="text-base font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left block leading-snug truncate cursor-pointer"
                    >
                      {job.title} — <span className="font-medium text-slate-600 dark:text-slate-400">{job.company}</span>
                    </button>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Skill tokens */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(job.requiredSkills || []).map(skill => {
                        const isMatched = match.matchingSkills.includes(skill);
                        return (
                          <span
                            key={skill}
                            className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                              isMatched
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10'
                            }`}
                          >
                            {skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right zone: Match breakdown badge + Actions */}
                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-white/10">
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-400 block uppercase">
                      Match Fit
                    </span>
                    <span className="text-xl font-bold font-mono text-indigo-700 dark:text-indigo-400 tabular-nums">
                      {match.overallScore}%
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                      {match.matchingSkills.length}/{job.requiredSkills.length} Skills
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenJobDetail(job)}
                      className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onStartApply(job)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-indigo-600 rounded-lg transition-colors shadow-xs cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Apply</span>
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
