import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  Briefcase, 
  AlertTriangle, 
  UserCheck, 
  FileText, 
  Mail, 
  Settings, 
  ShieldCheck, 
  Menu, 
  X, 
  LogOut, 
  Plus,
  Sparkles,
  Bot
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { ThemeToggle } from '../ui/ThemeToggle.jsx';
import { AddJobModal } from '../modals/AddJobModal.jsx';
import { CareerAssistantModal } from '../ai/CareerAssistantModal.jsx';

export const AppLayout = () => {
  const { user, logout, isAdmin } = useAuth();
  const { profile, applications, errorLogs } = useApp();
  const location = useLocation();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const unresolvedErrors = (errorLogs || []).filter(e => !(applications || []).find(a => a.id === e.applicationId && a.isResolved)).length;

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/jobs', label: 'Discover Jobs', icon: Search },
    { to: '/applications', label: 'Application Tracker', icon: Briefcase, count: applications?.length || null },
    { to: '/recovery', label: 'Recovery Center', icon: AlertTriangle, count: unresolvedErrors > 0 ? unresolvedErrors : null, alert: unresolvedErrors > 0 },
    { to: '/profile', label: 'My Profile', icon: UserCheck, count: profile?.completenessScore ? `${profile.completenessScore}%` : null },
    { to: '/resumes', label: 'Resume Manager', icon: FileText, count: profile?.resumes?.length || null },
    { to: '/outreach', label: 'Outreach & Templates', icon: Mail },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors">
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar: Premium Frosted Glass */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 backdrop-blur-xl bg-white/80 dark:bg-slate-900/60 border-r border-slate-200/80 dark:border-white/10 flex flex-col transition-transform duration-200 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Lockup */}
        <div className="h-16 px-6 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
          <NavLink to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs shadow-indigo-500/25">
              K
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white block leading-tight">
                Koodal
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                Job Search Assistant
              </span>
            </div>
          </NavLink>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
          <div className="px-3 mb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Navigation
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white font-bold shadow-xs shadow-indigo-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.count !== null && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                          item.alert
                            ? 'bg-rose-500/20 text-rose-300 font-bold'
                            : isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200/60 dark:bg-white/10 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          {/* AI Career Assistant Sidebar Shortcut */}
          <div className="pt-2">
            <button
              onClick={() => {
                setIsAiModalOpen(true);
                setIsMobileOpen(false);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-500/20 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>AI Career Copilot</span>
              </div>
              <span className="text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-mono">
                Gemini
              </span>
            </button>
          </div>

          {isAdmin && (
            <div className="pt-4 mt-4 border-t border-slate-200/80 dark:border-white/10 space-y-1">
              <div className="px-3 mb-2 text-[10px] font-semibold tracking-wider text-purple-400 uppercase">
                Administration
              </div>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white font-bold'
                      : 'text-purple-600 dark:text-purple-300 hover:bg-purple-500/10'
                  }`
                }
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Admin Console</span>
              </NavLink>
            </div>
          )}
        </nav>

        {/* User Card & Logout in Footer */}
        <div className="p-3 border-t border-slate-200/80 dark:border-white/10">
          <div className="p-2.5 rounded-xl bg-white/50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {profile?.fullName || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-[10px] text-slate-400 font-mono truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 sticky top-0 z-30 backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/80 dark:border-white/10 px-4 md:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 text-slate-500 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-400 truncate">
              <span className="hidden sm:inline">Workspace</span>
              <span className="hidden sm:inline text-slate-600">/</span>
              <span className="font-semibold text-slate-900 dark:text-white truncate">
                {location.pathname.replace('/', '').toUpperCase() || 'DASHBOARD'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold transition-all shadow-xs shadow-indigo-500/25 cursor-pointer"
              title="Open Gemini AI Career Assistant with Search & Maps Grounding"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Assistant</span>
            </button>

            <ThemeToggle />

            <button
              onClick={() => setIsAddJobOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Capture Job</span>
            </button>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <AddJobModal isOpen={isAddJobOpen} onClose={() => setIsAddJobOpen(false)} />
      <CareerAssistantModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
    </div>
  );
};
