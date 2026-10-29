import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Briefcase, 
  AlertTriangle, 
  UserCheck, 
  FileText, 
  Mail, 
  Server, 
  ShieldCheck, 
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export const Sidebar = ({
  currentView,
  onSelectView,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { jobs, applications, errorLogs, profile } = useApp();

  const unresolvedErrors = (errorLogs || []).filter(e => !(applications || []).find(a => a.id === e.applicationId && a.isResolved)).length;

  const navSections = [
    {
      group: 'OVERVIEW',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          count: null,
        },
      ],
    },
    {
      group: 'JOB HUNTING (TAMIL NADU)',
      items: [
        {
          id: 'discover',
          label: 'Discover Jobs',
          icon: Search,
          count: jobs?.length || 0,
        },
        {
          id: 'applications',
          label: 'Application Tracker',
          icon: Briefcase,
          count: applications?.length || 0,
        },
      ],
    },
    {
      group: 'QUALITY & DIAGNOSTICS',
      items: [
        {
          id: 'recovery',
          label: 'Error & Recovery Center',
          icon: AlertTriangle,
          count: unresolvedErrors > 0 ? unresolvedErrors : null,
          alert: unresolvedErrors > 0,
        },
      ],
    },
    {
      group: 'PERSONAL PROFILE & ASSETS',
      items: [
        {
          id: 'profile',
          label: 'Profile & Preferences',
          icon: UserCheck,
          count: `${profile?.completenessScore || 0}%`,
        },
        {
          id: 'resume',
          label: 'Resume Manager',
          icon: FileText,
          count: profile?.resumes?.length || 0,
        },
        {
          id: 'outreach',
          label: 'Outreach & Templates',
          icon: Mail,
          count: null,
        },
      ],
    },
    {
      group: 'ARCHITECTURE & DEPLOYMENT',
      items: [
        {
          id: 'springboot',
          label: 'Spring Boot Backend Code',
          icon: Server,
          count: null,
        },
        {
          id: 'zero-cost',
          label: 'Zero-Cost Guide & Limits',
          icon: ShieldCheck,
          count: '₹0',
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/10 flex flex-col transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Lockup */}
        <div className="h-16 px-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
              K
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white block leading-tight">
                Koodal
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                Tamil Nadu Tech Jobs
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-500/20 px-1.5 py-0.5 rounded">
            v1.0
          </span>
        </div>

        {/* Target Scope Pill-Free Notice */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-white/5 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200 mb-0.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>Target Region</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Chennai · Coimbatore · Madurai · Trichy · Salem · Remote
          </p>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map(section => (
            <div key={section.group}>
              <div className="px-3 mb-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                {section.group}
              </div>
              <ul className="space-y-0.5">
                {section.items.map(item => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          onSelectView(item.id);
                          onCloseMobile();
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors text-left cursor-pointer ${
                          isActive
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.count !== null && (
                          <span
                            className={`text-[11px] font-mono tabular-nums px-1.5 py-0.2 rounded ${
                              item.alert
                                ? 'bg-rose-100 text-rose-700 font-bold'
                                : isActive
                                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
                                : 'text-slate-500 bg-slate-100 dark:bg-slate-800'
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Card */}
        <div className="p-3 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5">
            <div className="w-8 h-8 rounded-full bg-slate-800 dark:bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold shrink-0">
              {profile?.fullName ? profile.fullName.charAt(0) : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-900 dark:text-slate-200 truncate">
                {profile?.fullName || 'Vishva Kumar'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {profile?.email || 'vishva2431@gmail.com'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
