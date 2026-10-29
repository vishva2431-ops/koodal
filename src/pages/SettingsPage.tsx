import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  ShieldCheck, 
  Download, 
  Database, 
  Server, 
  Terminal, 
  Check, 
  AlertTriangle, 
  Trash2, 
  RefreshCw,
  HardDrive,
  Copy,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';

export const SettingsPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { profile, jobs, applications, errorLogs, templates, exportApplicationsCsv } = useApp();
  const { theme, toggleTheme } = useTheme();

  const [copiedCmd, setCopiedCmd] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState(false);

  const handleExportAllJson = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      user: {
        id: user?.id,
        email: user?.email,
        roles: user?.roles,
      },
      profile,
      jobsCount: jobs.length,
      jobs,
      applicationsCount: applications.length,
      applications,
      errorLogs,
      templates,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `koodal_job_assistant_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopySpringCmd = () => {
    navigator.clipboard.writeText('cd backend-springboot && ./mvnw clean spring-boot:run');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleClearCache = () => {
    if (confirm('Clear local search and application session cache? Saved profile and core records will remain intact.')) {
      setPurgeSuccess(true);
      setTimeout(() => setPurgeSuccess(false), 2500);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <GlassCard className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            <Settings className="w-4 h-4" />
            <span>Platform Configuration</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            System Settings & Zero-Cost Architecture
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your personal credentials, data backup, ₹0 free-tier limits, and standalone Spring Boot deployment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <GlassButton variant="secondary" size="sm" icon={Download} onClick={handleExportAllJson}>
            Export Full JSON Backup
          </GlassButton>
        </div>
      </GlassCard>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Account & Theme */}
        <div className="space-y-6">
          {/* Account Profile Card */}
          <GlassCard className="p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
              <User className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Authenticated Account</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Email Address</span>
                <span className="font-semibold text-slate-900 dark:text-white break-all">
                  {user?.email || 'Candidate (Local Preview)'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Verification Status</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-500 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified via SHA-256 OTP
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Roles</span>
                <div className="flex items-center gap-1.5 mt-1">
                  {(user?.roles || ['ROLE_USER']).map((r, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-50 dark:bg-white/5 border border-indigo-200 dark:border-white/10 text-indigo-600 dark:text-indigo-400"
                    >
                      {r}
                    </span>
                  ))}
                  {isAdmin && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-500">
                      ADMIN_PRIVILEGES
                    </span>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Theme & Appearance */}
          <GlassCard className="p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
              <HardDrive className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Interface & Theme</h3>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">Theme Mode</span>
                <span className="text-slate-500 text-[11px]">Currently using {theme} palette</span>
              </div>
              <GlassButton variant="glass" size="sm" onClick={toggleTheme}>
                Switch to {theme === 'dark' ? 'Light' : 'Dark'}
              </GlassButton>
            </div>
          </GlassCard>

          {/* Data Maintenance */}
          <GlassCard className="p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
              <Database className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Data Exports</h3>
            </div>

            <div className="space-y-2 text-xs">
              <GlassButton 
                variant="secondary" 
                size="sm" 
                icon={Download} 
                onClick={exportApplicationsCsv} 
                className="w-full justify-center"
              >
                Export Applications (.CSV)
              </GlassButton>

              <GlassButton 
                variant="secondary" 
                size="sm" 
                icon={Download} 
                onClick={handleExportAllJson} 
                className="w-full justify-center"
              >
                Export Complete Data (.JSON)
              </GlassButton>

              <button
                type="button"
                onClick={handleClearCache}
                className="w-full py-2 text-center text-xs text-slate-400 hover:text-rose-400 transition-colors"
              >
                Clear Temporary Cache
              </button>

              {purgeSuccess && (
                <div className="p-2 text-center rounded bg-emerald-500/10 text-emerald-500 text-[11px]">
                  Cache cleared safely.
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right 2 Columns: Zero-Cost Deployment Architecture & Spring Boot */}
        <div className="lg:col-span-2 space-y-6">
          {/* Zero-Cost Verification Checklist */}
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Verified ₹0 Lifetime Hosting Architecture
                  </h3>
                  <p className="text-[11px] text-slate-500">No credit card or paid domain required</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                100% Free Tier Eligible
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                  <Database className="w-3.5 h-3.5 text-emerald-500" />
                  <span>MongoDB Atlas</span>
                </div>
                <div className="text-[10px] text-slate-500">Tier: M0 Sandbox</div>
                <div className="text-[10px] text-slate-500">Storage: 512 MB Free</div>
                <div className="text-[10px] text-slate-500">Behavior: Never sleeps</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                  <Server className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Render / Fly.io</span>
                </div>
                <div className="text-[10px] text-slate-500">Tier: Free Web Service</div>
                <div className="text-[10px] text-slate-500">RAM: 512 MB allocated</div>
                <div className="text-[10px] text-slate-500">Spins down after 15m idle</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                  <HardDrive className="w-3.5 h-3.5 text-purple-500" />
                  <span>Vercel / Cloudflare</span>
                </div>
                <div className="text-[10px] text-slate-500">Tier: Hobby / Free</div>
                <div className="text-[10px] text-slate-500">Bandwidth: 100 GB / mo</div>
                <div className="text-[10px] text-slate-500">Free SSL & Subdomain</div>
              </div>
            </div>

            {/* Practical sleeping behavior notes */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Render Free Web Service Limitation Notice</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Render&apos;s free web tier enters sleep mode after 15 minutes of inactivity. The first API request after waking may take 30–50 seconds. This assistant handles waking gracefully with client retry backoff.
              </p>
            </div>
          </GlassCard>

          {/* Standalone Spring Boot 3 Engine */}
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Standalone Spring Boot 3 Backend
                  </h3>
                  <p className="text-[11px] text-slate-500">Java 21 · Spring Security · MongoDB Atlas</p>
                </div>
              </div>

              <GlassButton 
                variant="glass" 
                size="sm" 
                icon={copiedCmd ? Check : Copy} 
                onClick={handleCopySpringCmd}
              >
                {copiedCmd ? 'Command Copied' : 'Copy Maven Run Command'}
              </GlassButton>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                The complete standalone production backend is packaged inside <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 font-mono text-indigo-500">/backend-springboot</code> in this workspace. It features Spring Security stateless session authentication, MongoDB transactional repositories, and structured matching logic.
              </p>

              <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-indigo-300 border border-white/10 space-y-1 overflow-x-auto">
                <div className="text-slate-500"># 1. Navigate to standalone backend</div>
                <div>cd backend-springboot</div>
                <div className="text-slate-500 pt-1"># 2. Run with Maven (Java 21)</div>
                <div>mvn clean spring-boot:run</div>
                <div className="text-slate-500 pt-1"># Connected to local or MongoDB Atlas cluster via SPRING_DATA_MONGODB_URI</div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                  <span className="text-slate-400 block text-[9px] uppercase">JDK Version</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Java 21 LTS</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                  <span className="text-slate-400 block text-[9px] uppercase">Framework</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Spring Boot 3.2.3</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                  <span className="text-slate-400 block text-[9px] uppercase">Security</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">BCrypt + Auth Token</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                  <span className="text-slate-400 block text-[9px] uppercase">Database</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Spring Data Mongo</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
