import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle.jsx';
import { GlassButton } from '../ui/GlassButton.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { ShieldCheck } from 'lucide-react';

export const GlassNavbar = () => {
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/80 dark:border-white/10 px-6 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
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
        </Link>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <a href="#features" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
            Features
          </a>
          <a href="#workflow" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
            Application Workflow
          </a>
          <a href="#privacy" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
            Privacy & ₹0 Free Tier
          </a>
          {isAdmin && (
            <Link to="/admin" className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </Link>
          )}
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <GlassButton variant="primary" size="sm" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </GlassButton>
              <GlassButton variant="ghost" size="sm" onClick={logout}>
                Sign Out
              </GlassButton>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <GlassButton variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Sign In
              </GlassButton>
              <GlassButton variant="primary" size="sm" onClick={() => navigate('/login?mode=register')}>
                Get Started
              </GlassButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
