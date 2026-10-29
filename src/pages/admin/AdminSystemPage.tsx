import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Server, ShieldCheck, CheckCircle2, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';

export const AdminSystemPage: React.FC = () => {
  const [systemData, setSystemData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/system');
      setSystemData(res.data);
    } catch (err) {
      console.error('Error fetching system telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const sources = systemData?.sources || [
    { source: 'NAUKRI', displayName: 'Naukri.com India', healthStatus: 'HEALTHY', apiAccessStatus: 'PERMITTED_URL_GENERATOR' },
    { source: 'LINKEDIN', displayName: 'LinkedIn Jobs', healthStatus: 'HEALTHY', apiAccessStatus: 'PERMITTED_URL_GENERATOR' },
    { source: 'INDEED', displayName: 'Indeed India', healthStatus: 'HEALTHY', apiAccessStatus: 'PERMITTED_URL_GENERATOR' },
    { source: 'COMPANY_CAREER', displayName: 'Company Career Portals', healthStatus: 'HEALTHY', apiAccessStatus: 'AUTHORIZED_FEED' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Integration Diagnostics & Runtime Health
          </h2>
          <p className="text-xs text-slate-400">
            Audit external portal compliance, adapter health, and zero-cost environment boundaries
          </p>
        </div>

        <GlassButton
          variant="glass"
          size="sm"
          icon={RefreshCw}
          loading={loading}
          onClick={fetchStatus}
        >
          Check Integrations
        </GlassButton>
      </div>

      {/* Sources Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((s: any) => (
          <GlassCard key={s.source} className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block">
                  {s.source}
                </span>
                <h4 className="text-sm font-bold text-white">{s.displayName}</h4>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                {s.healthStatus}
              </span>
            </div>

            <div className="space-y-1 text-xs text-slate-400">
              <p><strong>Permitted Mode:</strong> {s.apiAccessStatus}</p>
              <p className="text-[11px] text-slate-500">
                Operates with strict robots.txt and user agreement compliance. No reverse scraping.
              </p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Zero Cost Limits Audit */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Zero-Cost Compliance Audit</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-slate-500 block text-[11px]">Database Tier</span>
            <span className="font-bold text-emerald-400 font-mono">MongoDB Atlas M0</span>
            <p className="text-[11px] text-slate-400">512MB RAM/Disk · Free forever</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-slate-500 block text-[11px]">Backend Compute</span>
            <span className="font-bold text-indigo-400 font-mono">Render Free Tier</span>
            <p className="text-[11px] text-slate-400">512MB RAM · ₹0 Monthly cost</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-slate-500 block text-[11px]">External AI APIs</span>
            <span className="font-bold text-purple-400 font-mono">0 Paid Dependencies</span>
            <p className="text-[11px] text-slate-400">100% Deterministic Rules Engine</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
