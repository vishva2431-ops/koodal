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
  Sparkles,
  MapPin,
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type NavView = 
  | 'dashboard'
  | 'discover'
  | 'applications'
  | 'recovery'
  | 'profile'
  | 'resume'
  | 'outreach'
  | 'springboot'
  | 'zero-cost';

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: NavView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number | string | null;
  alert?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { jobs, applications, errorLogs, selectedJobIds, profile } = useApp();

  const unresolvedErrors = errorLogs.filter(e => !applications.find(a => a.id === e.applicationId && a.isResolved)).length;
  const submittedCount = applications.filter(a => a.status === 'SUBMITTED').length;
  const inProgressCount = applications.filter(a => a.status === 'IN_PROGRESS').length;

  const navSections: { group: string; items: NavItem[] }[] = [
    {
      group: 'OVERVIEW',
      items: [
        {
          id: 'dashboard' as NavView,
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
          id: 'discover' as NavView,
          label: 'Discover Jobs',
          icon: Search,
          count: jobs.length,
        },
        {
          id: 'applications' as NavView,
          label: 'Application Tracker',
          icon: Briefcase,
          count: applications.length,
        },
      ],
    },
    {
      group: 'QUALITY & DIAGNOSTICS',
      items: [
        {
          id: 'recovery' as NavView,
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
          id: 'profile' as NavView,
          label: 'Profile & Preferences',
          icon: UserCheck,
          count: `${profile.completenessScore || 0}%`,
        },
        {
          id: 'resume' as NavView,
          label: 'Resume Manager',
          icon: FileText,
          count: profile.resumes?.length || 0,
        },
        {
          id: 'outreach' as NavView,
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
          id: 'springboot' as NavView,
          label: 'Spring Boot Backend Code',
          icon: Server,
          count: null,
        },
        {
          id: 'zero-cost' as NavView,
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
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Lockup: Single line wordmark */}
        <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
              K
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight">
                Koodal
              </span>
              <span className="text-[11px] text-slate-500 font-medium block">
                Tamil Nadu Tech Jobs
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-1.5 py-0.5 rounded">
            v1.0
          </span>
        </div>

        {/* Target Scope Pill-Free Notice */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-medium text-slate-800 mb-0.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>Target Region</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
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
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors text-left ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-700 font-semibold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
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
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'text-slate-500 bg-slate-100'
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
        <div className="p-3 border-t border-slate-200 bg-white">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold shrink-0">
              {profile.fullName ? profile.fullName.charAt(0) : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-900 truncate">
                {profile.fullName || 'Vishva Kumar'}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {profile.email || 'vishva2431@gmail.com'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
