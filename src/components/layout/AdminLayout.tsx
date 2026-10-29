import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  Activity, 
  ArrowLeft, 
  Database, 
  Server, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import { GlassButton } from '../ui/GlassButton';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const adminNav = [
    { to: '/admin', label: 'Admin Overview', icon: Activity, end: true },
    { to: '/admin/users', label: 'User Directory', icon: Users, end: false },
    { to: '/admin/system', label: 'System & Integrations', icon: Server, end: false },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col antialiased">
      {/* Admin Header */}
      <header className="h-16 border-b border-purple-500/20 backdrop-blur-md bg-purple-950/20 px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-xs text-purple-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to User App</span>
          </Link>
          <span className="text-purple-800">|</span>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-600/30 text-purple-300 border border-purple-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm tracking-tight text-white">
              Koodal Administration Console
            </span>
            <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full">
              ROLE_ADMIN
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <GlassButton variant="ghost" size="sm" onClick={logout} icon={LogOut}>
            Sign Out
          </GlassButton>
        </div>
      </header>

      {/* Admin Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-6 gap-6">
        {/* Navigation Sidebar */}
        <aside className="w-56 shrink-0 space-y-1">
          <div className="px-3 mb-2 text-[10px] font-semibold tracking-wider text-purple-400 uppercase">
            Management
          </div>
          {adminNav.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-xs shadow-purple-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </aside>

        {/* Admin Content Area */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
