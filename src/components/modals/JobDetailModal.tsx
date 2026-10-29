import React from 'react';
import { 
  X, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Building2, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Mail,
  Send
} from 'lucide-react';
import { JobListing, MatchScoreBreakdown } from '../../types';
import { calculateJobMatch } from '../../services/matchingEngine';
import { useApp } from '../../context/AppContext';
import { SOURCE_ADAPTERS } from '../../services/sourceAdapters';

interface JobDetailModalProps {
  job: JobListing | null;
  onClose: () => void;
  onApply: (job: JobListing) => void;
  onOpenOutreach: (job: JobListing) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  onClose,
  onApply,
  onOpenOutreach,
}) => {
  const { profile } = useApp();

  if (!job) return null;

  const match: MatchScoreBreakdown = calculateJobMatch(job, profile);
  const adapter = SOURCE_ADAPTERS[job.source] || SOURCE_ADAPTERS.COMPANY_CAREER;
  const compliance = adapter.getComplianceDetails();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-500">
              <span className="font-semibold text-indigo-700">{job.source}</span>
              <span aria-hidden="true">·</span>
              <span>Discovered {new Date(job.dateDiscovered).toLocaleDateString('en-IN')}</span>
              {job.isDemoData && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[11px] font-mono bg-amber-50 text-amber-700 border border-amber-200 px-1.5 rounded">
                    Sample Listing
                  </span>
                </>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">{job.title}</h2>
            <div className="flex items-center gap-3 mt-1 text-sm text-slate-600">
              <span className="font-medium text-slate-800 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {job.company}
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {job.location}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Match Score Card */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Rules-Based Match Score
                </span>
                <span className="text-2xl font-bold font-mono text-indigo-600 tabular-nums">
                  {match.overallScore}%
                </span>
              </div>
              <div className="text-right text-xs">
                <span className={`inline-flex items-center gap-1 font-semibold ${match.overallScore >= 70 ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {match.overallScore >= 70 ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {match.overallScore >= 70 ? 'Strong Match' : 'Potential Match'}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">Calculated AI-free via modular rule engine</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-200/80 pt-2.5">
              {match.explanation}
            </p>

            {/* Skills breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[11px] font-semibold text-emerald-800 block mb-1">
                  Matching Skills ({match.matchingSkills.length}):
                </span>
                <div className="flex flex-wrap gap-1">
                  {match.matchingSkills.map(s => (
                    <span key={s} className="text-[11px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-0.5 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-rose-800 block mb-1">
                  Missing Requirements ({match.missingSkills.length}):
                </span>
                <div className="flex flex-wrap gap-1">
                  {match.missingSkills.length > 0 ? (
                    match.missingSkills.map(s => (
                      <span key={s} className="text-[11px] font-mono bg-rose-50 text-rose-800 border border-rose-200/60 px-2 py-0.5 rounded">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">None - full technical alignment</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-[11px] text-slate-500 block">Experience</span>
              <span className="text-xs font-semibold text-slate-800 block mt-0.5">
                {job.experienceMin} - {job.experienceMax} Years
              </span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-[11px] text-slate-500 block">Compensation</span>
              <span className="text-xs font-semibold text-slate-800 block mt-0.5">
                {job.salaryDisplay || 'Not Disclosed'}
              </span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-[11px] text-slate-500 block">Work Type</span>
              <span className="text-xs font-semibold text-slate-800 block mt-0.5">
                {job.workArrangement}
              </span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-[11px] text-slate-500 block">Employment</span>
              <span className="text-xs font-semibold text-slate-800 block mt-0.5">
                {job.employmentType}
              </span>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Role Overview & Responsibilities
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-3.5 rounded-lg border border-slate-100">
              {job.description}
            </p>
          </div>

          {/* Compliance & Permitted Method */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Official Access & Application Protocol</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {compliance.authorizedMethod}
            </p>
            <p className="text-[10px] text-slate-400 mt-1 italic">
              {compliance.termsConstraint}
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <a
              href={job.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <span>View on {job.source}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <button
              onClick={() => onOpenOutreach(job)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Outreach Draft</span>
            </button>
          </div>

          <button
            onClick={() => onApply(job)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Start Assisted Application</span>
          </button>
        </div>
      </div>
    </div>
  );
};
