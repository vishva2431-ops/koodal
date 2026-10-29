import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Building2, 
  ExternalLink, 
  Send, 
  CheckSquare, 
  Square, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles, 
  Plus, 
  SlidersHorizontal,
  DollarSign,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { JobListing, PortalSource, WorkArrangement } from '../types';
import { calculateJobMatch } from '../services/matchingEngine';
import { SOURCE_ADAPTERS, SourceSearchQuery } from '../services/sourceAdapters';

interface DiscoverJobsViewProps {
  onOpenJobDetail: (job: JobListing) => void;
  onStartApply: (job: JobListing) => void;
  onOpenAddJob: () => void;
}

const TN_CITIES = ['ALL', 'Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Remote'];

export const DiscoverJobsView: React.FC<DiscoverJobsViewProps> = ({
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
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [selectedWorkType, setSelectedWorkType] = useState<string>('ALL');
  const [minMatch, setMinMatch] = useState<number>(0);
  const [onlyDemo, setOnlyDemo] = useState<boolean | null>(null);

  // External compliant search portal launcher
  const [externalRole, setExternalRole] = useState('React JS Developer');
  const [externalCity, setExternalCity] = useState('Chennai');

  // Filter & match logic
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // 1. Search Query (title, company, description, skills)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText = 
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.description.toLowerCase().includes(q) ||
          job.requiredSkills.some(s => s.toLowerCase().includes(q));
        if (!matchesText) return false;
      }

      // 2. City Filter
      if (selectedCity !== 'ALL') {
        const jobLoc = job.location.toLowerCase();
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
      {/* Top Controls: Header, Capture Button, Compliance Search Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Multi-Portal Job Discovery (Tamil Nadu)
            </h2>
            <p className="text-xs text-slate-500">
              Targeted React, Frontend, and Full Stack opportunities from Naukri, LinkedIn, Indeed, and Company Career Portals
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={refreshJobs}
              disabled={loading}
              className="p-2 border border-slate-300 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors"
              title="Refresh job listings"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
            <button
              onClick={onOpenAddJob}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Quick Capture Job</span>
            </button>
          </div>
        </div>

        {/* Compliant Official Portal Search Generator */}
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <div className="min-w-0">
              <span className="font-semibold text-slate-800 block">
                Compliant Official Search Link Generator
              </span>
              <p className="text-[11px] text-slate-500 truncate">
                Generate official search URLs with Tamil Nadu geo-IDs without violating platform terms
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <select
              value={externalCity}
              onChange={e => setExternalCity(e.target.value)}
              className="p-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
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
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded font-medium text-[11px] flex items-center gap-1"
            >
              <span>Naukri TN</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
            <button
              onClick={() => openCompliantPortalSearch('LINKEDIN')}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded font-medium text-[11px] flex items-center gap-1"
            >
              <span>LinkedIn TN</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
            <button
              onClick={() => openCompliantPortalSearch('INDEED')}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded font-medium text-[11px] flex items-center gap-1"
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
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* City */}
          <div>
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
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
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white font-mono"
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
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white font-mono"
            >
              <option value={0}>Match Score: All</option>
              <option value={50}>Match: 50%+ Eligible</option>
              <option value={70}>Match: 70%+ Strong</option>
              <option value={85}>Match: 85%+ Top Fit</option>
            </select>
          </div>
        </div>

        {/* Active Filter Indicators & Batch Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAllToggle}
              className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              {allFilteredSelected ? (
                <CheckSquare className="w-4 h-4 text-indigo-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>Select All Filtered ({filteredJobs.length})</span>
            </button>

            {selectedJobIds.length > 0 && (
              <span className="font-mono text-indigo-700 font-semibold tabular-nums">
                {selectedJobIds.length} Selected
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyDemo(onlyDemo === true ? null : true)}
              className={`px-2 py-1 rounded text-[11px] font-mono border transition-colors ${
                onlyDemo === true
                  ? 'bg-amber-100 text-amber-800 border-amber-300 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Sample Data Only
            </button>
            <button
              onClick={() => setOnlyDemo(onlyDemo === false ? null : false)}
              className={`px-2 py-1 rounded text-[11px] font-mono border transition-colors ${
                onlyDemo === false
                  ? 'bg-indigo-100 text-indigo-800 border-indigo-300 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Captured Only
            </button>
          </div>
        </div>
      </div>

      {/* Job Listings Grid / Feed */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200 space-y-3">
          <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No matching jobs discovered</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search keywords, location filter across Tamil Nadu, or lower the match threshold. You can also capture a direct job posting using Quick Capture.
          </p>
          <button
            onClick={onOpenAddJob}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Quick Capture New Job</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {filteredJobs.map(job => {
            const match = calculateJobMatch(job, profile);
            const isSelected = selectedJobIds.includes(job.id);

            return (
              <div
                key={job.id}
                className={`bg-white rounded-xl border p-5 transition-all duration-150 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isSelected ? 'border-indigo-400 bg-indigo-50/20 shadow-2xs' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Left zone: Checkbox + Job meta */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <button
                    onClick={() => toggleJobSelection(job.id)}
                    className="mt-1 text-slate-400 hover:text-indigo-600 shrink-0"
                    title={isSelected ? 'Deselect job' : 'Select job'}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>

                  <div className="min-w-0 space-y-1">
                    {/* Unboxed metadata line with typographic dots */}
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700 font-mono">{job.source}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {job.location}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-700">{job.salaryDisplay || 'Competitive'}</span>
                      <span aria-hidden="true">·</span>
                      <span>{job.workArrangement}</span>
                      {job.isDemoData && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[10px] font-mono bg-amber-50 text-amber-700 border border-amber-200/70 px-1.5 py-0.2 rounded">
                            Sample
                          </span>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => onOpenJobDetail(job)}
                      className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors text-left block leading-snug truncate"
                    >
                      {job.title} — <span className="font-medium text-slate-600">{job.company}</span>
                    </button>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Skill tokens */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.requiredSkills.map(skill => {
                        const isMatched = match.matchingSkills.includes(skill);
                        return (
                          <span
                            key={skill}
                            className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                              isMatched
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200/60'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
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
                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-400 block uppercase">
                      Match Fit
                    </span>
                    <span className="text-xl font-bold font-mono text-indigo-700 tabular-nums">
                      {match.overallScore}%
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {match.matchingSkills.length}/{job.requiredSkills.length} Skills
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenJobDetail(job)}
                      className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onStartApply(job)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-indigo-600 rounded-lg transition-colors shadow-xs"
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
