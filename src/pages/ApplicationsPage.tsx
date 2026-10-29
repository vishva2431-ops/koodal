import React, { useState, useMemo } from 'react';
import { 
  Download, 
  Search, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  HelpCircle, 
  Edit3, 
  ExternalLink,
  Briefcase 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ApplicationRecord, ApplicationStatus } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { EmptyState } from '../components/ui/EmptyState';

export const ApplicationsPage: React.FC = () => {
  const { applications, recordApplicationOutcome, exportApplicationsCsv } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editFollowUp, setEditFollowUp] = useState('');

  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      if (statusFilter !== 'ALL' && app.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          app.jobTitle.toLowerCase().includes(q) ||
          app.company.toLowerCase().includes(q) ||
          app.notes.toLowerCase().includes(q) ||
          (app.confirmationReference && app.confirmationReference.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [applications, statusFilter, searchQuery]);

  const handleStartEdit = (app: ApplicationRecord) => {
    setEditingId(app.id);
    setEditNotes(app.notes || '');
    setEditFollowUp(app.followUpDate || '');
  };

  const handleSaveEdit = async (appId: string) => {
    const target = applications.find(a => a.id === appId);
    if (!target) return;

    await recordApplicationOutcome(appId, target.status, {
      notes: editNotes,
      followUpDate: editFollowUp,
    });
    setEditingId(null);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            SUBMITTED
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-indigo-400" />
            IN_PROGRESS
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            FAILED
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            BLOCKED
          </span>
        );
      case 'SUBMISSION_UNKNOWN':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
            <HelpCircle className="w-3 h-3 text-purple-400" />
            UNKNOWN
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header & Export Action */}
      <GlassCard className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Application Tracker
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Audit history, confirmation codes, follow-ups, and verified submission outcomes
          </p>
        </div>

        <GlassButton
          variant="glass"
          size="sm"
          icon={Download}
          onClick={exportApplicationsCsv}
        >
          Export Records (CSV)
        </GlassButton>
      </GlassCard>

      {/* Filter Toolbar */}
      <GlassCard className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by role, company, or confirmation code..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500 whitespace-nowrap">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white"
          >
            <option value="ALL">All Statuses ({applications.length})</option>
            <option value="SUBMITTED">SUBMITTED</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="FAILED">FAILED</option>
            <option value="BLOCKED">BLOCKED</option>
            <option value="SUBMISSION_UNKNOWN">SUBMISSION_UNKNOWN</option>
          </select>
        </div>
      </GlassCard>

      {/* Applications Table */}
      <GlassCard className="overflow-hidden">
        {filteredApps.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No applications tracked yet"
            description="Start an assisted application from Discover Jobs to record confirmation codes and follow-up dates."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/60 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Role & Company</th>
                  <th className="py-3.5 px-4">Portal</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Applied Date</th>
                  <th className="py-3.5 px-4">Confirmation Code</th>
                  <th className="py-3.5 px-4">Follow-up</th>
                  <th className="py-3.5 px-4">Notes & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                {filteredApps.map(app => {
                  const isEditing = editingId === app.id;

                  return (
                    <tr key={app.id} className="hover:bg-slate-100/40 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 min-w-[200px]">
                        <div className="font-bold text-slate-900 dark:text-white">{app.jobTitle}</div>
                        <div className="text-slate-500 text-[11px] flex items-center gap-1.5 mt-0.5">
                          <span>{app.company}</span>
                          {app.jobUrl && (
                            <a
                              href={app.jobUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-500 hover:text-indigo-400"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {app.source}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(app.status)}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {new Date(app.appliedDate).toLocaleDateString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        {app.confirmationReference ? (
                          <span className="text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded border border-slate-200 dark:border-white/10">
                            {app.confirmationReference}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">None logged</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        {isEditing ? (
                          <input
                            type="date"
                            value={editFollowUp}
                            onChange={e => setEditFollowUp(e.target.value)}
                            className="p-1 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs"
                          />
                        ) : app.followUpDate ? (
                          <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{app.followUpDate}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 min-w-[220px]">
                        {isEditing ? (
                          <div className="space-y-1.5">
                            <input
                              type="text"
                              value={editNotes}
                              onChange={e => setEditNotes(e.target.value)}
                              placeholder="Update notes..."
                              className="w-full p-1.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs"
                            />
                            <div className="flex items-center gap-2">
                              <GlassButton
                                variant="primary"
                                size="sm"
                                onClick={() => handleSaveEdit(app.id)}
                              >
                                Save
                              </GlassButton>
                              <button
                                onClick={() => setEditingId(null)}
                                className="text-slate-400 hover:text-white text-[11px]"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-slate-600 dark:text-slate-400 text-[11px] line-clamp-2">
                              {app.notes || 'No notes.'}
                            </p>
                            <button
                              onClick={() => handleStartEdit(app)}
                              className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/10 shrink-0"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
};
