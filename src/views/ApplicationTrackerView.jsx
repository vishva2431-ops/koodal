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
  Building2
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export const ApplicationTrackerView = () => {
  const { applications, recordApplicationOutcome, exportApplicationsCsv } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editingId, setEditingId] = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const [editFollowUp, setEditFollowUp] = useState('');

  const filteredApps = useMemo(() => {
    return (applications || []).filter(app => {
      if (statusFilter !== 'ALL' && app.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          app.jobTitle?.toLowerCase().includes(q) ||
          app.company?.toLowerCase().includes(q) ||
          app.notes?.toLowerCase().includes(q) ||
          (app.confirmationReference && app.confirmationReference.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [applications, statusFilter, searchQuery]);

  const handleStartEdit = (app) => {
    setEditingId(app.id);
    setEditNotes(app.notes || '');
    setEditFollowUp(app.followUpDate || '');
  };

  const handleSaveEdit = async (appId) => {
    const target = applications.find(a => a.id === appId);
    if (!target) return;

    await recordApplicationOutcome(appId, target.status, {
      notes: editNotes,
      followUpDate: editFollowUp,
    });
    setEditingId(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            SUBMITTED
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded">
            <Clock className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
            IN_PROGRESS
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-rose-800 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 px-2 py-0.5 rounded">
            <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
            FAILED
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-amber-800 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded">
            <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            BLOCKED
          </span>
        );
      case 'SUBMISSION_UNKNOWN':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-purple-800 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded">
            <HelpCircle className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            UNKNOWN
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header & Export Action */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-white/10 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Personal Application Tracker
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Audit history, confirmation codes, scheduled follow-ups, and verified submission outcomes
          </p>
        </div>

        <button
          onClick={exportApplicationsCsv}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-white/10 rounded-lg text-xs font-semibold transition-colors shadow-2xs shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Records (CSV)</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by role, company, or confirmation ref..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg text-xs focus:bg-white dark:focus:bg-slate-700 focus:ring-1 focus:ring-indigo-500 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg text-xs font-mono dark:text-white"
          >
            <option value="ALL">All Statuses ({applications?.length || 0})</option>
            <option value="SUBMITTED">SUBMITTED</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="FAILED">FAILED</option>
            <option value="BLOCKED">BLOCKED</option>
            <option value="SUBMISSION_UNKNOWN">SUBMISSION_UNKNOWN</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xs">
        {filteredApps.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
            <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">No applications found matching criteria</p>
            <p className="max-w-xs mx-auto">
              Start an assisted application from the Discover Jobs view to automatically begin tracking.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Role & Company</th>
                  <th className="py-3 px-4">Portal</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4">Confirmation Ref</th>
                  <th className="py-3 px-4">Follow-up</th>
                  <th className="py-3 px-4">Notes & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                {filteredApps.map(app => {
                  const isEditing = editingId === app.id;

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/70 dark:hover:bg-white/5 transition-colors">
                      {/* Role & Company */}
                      <td className="py-3.5 px-4 min-w-[200px]">
                        <div className="font-bold text-slate-900 dark:text-white">{app.jobTitle}</div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1.5 mt-0.5">
                          <span>{app.company}</span>
                          {app.jobUrl && (
                            <a
                              href={app.jobUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800"
                              title="Open original portal posting"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Portal */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {app.source}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(app.status)}
                      </td>

                      {/* Applied Date */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {new Date(app.appliedDate).toLocaleDateString('en-IN')}
                      </td>

                      {/* Confirmation Ref */}
                      <td className="py-3.5 px-4 font-mono text-[11px] whitespace-nowrap">
                        {app.confirmationReference ? (
                          <span className="text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/10">
                            {app.confirmationReference}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">None logged</span>
                        )}
                      </td>

                      {/* Follow-up */}
                      <td className="py-3.5 px-4 font-mono text-[11px] whitespace-nowrap">
                        {isEditing ? (
                          <input
                            type="date"
                            value={editFollowUp}
                            onChange={e => setEditFollowUp(e.target.value)}
                            className="p-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded text-xs dark:text-white"
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

                      {/* Notes & Actions */}
                      <td className="py-3.5 px-4 min-w-[220px]">
                        {isEditing ? (
                          <div className="space-y-1.5">
                            <input
                              type="text"
                              value={editNotes}
                              onChange={e => setEditNotes(e.target.value)}
                              placeholder="Update notes..."
                              className="w-full p-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded text-xs dark:text-white"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSaveEdit(app.id)}
                                className="px-2 py-0.5 bg-indigo-600 text-white rounded text-[11px] font-semibold cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="text-slate-500 hover:text-slate-700 dark:hover:text-white text-[11px] cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-slate-600 dark:text-slate-300 text-[11px] line-clamp-2">
                              {app.notes || 'No notes.'}
                            </p>
                            <button
                              onClick={() => handleStartEdit(app)}
                              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 cursor-pointer"
                              title="Edit notes & follow-up"
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
      </div>
    </div>
  );
};
