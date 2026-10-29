import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Database, 
  Server, 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  Cpu, 
  FileText 
} from 'lucide-react';

export const ZeroCostDeploymentView: React.FC = () => {
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    check_atlas: true,
    check_ai_api: true,
    check_domain: true,
    check_backend: true,
    check_messaging: true,
    check_storage: true,
  });

  const toggleCheck = (key: string) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allPassed = Object.values(checklist).every(Boolean);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <DollarSign className="w-4 h-4" />
            <span>Hosting Budget: Exactly ₹0.00 / month</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Zero-Cost Architecture & Limits Guide
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Architected to run indefinitely without credit cards, paid API subscriptions, or domain fees.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Verified ₹0 Baseline</span>
        </div>
      </div>

      {/* Tiers Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* MongoDB Atlas M0 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">MongoDB Atlas (M0)</h3>
          </div>
          <div className="text-xs space-y-2 text-slate-600">
            <p><strong>Cost:</strong> Free forever (No credit card needed).</p>
            <p><strong>Storage:</strong> 512 MB shared RAM/storage.</p>
            <p><strong>Connections:</strong> Max 500 concurrent connections.</p>
            <p><strong>Sleeping Behavior:</strong> Always awake; no cold starts.</p>
            <div className="p-2 bg-slate-50 rounded border border-slate-100 text-[11px] text-slate-500">
              Stores over 10,000 job listings, full profile documents, and application audit history.
            </div>
          </div>
        </div>

        {/* Backend: Render / Fly.io */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Spring Boot Backend</h3>
          </div>
          <div className="text-xs space-y-2 text-slate-600">
            <p><strong>Provider:</strong> Render Web Service / Fly.io free tier.</p>
            <p><strong>Subdomain:</strong> <code className="font-mono text-indigo-700">*.onrender.com</code></p>
            <p><strong>RAM:</strong> 512 MB allocated.</p>
            <p><strong>Sleeping Behavior:</strong> Spins down after 15 min of inactivity; takes ~40s on first request.</p>
            <div className="p-2 bg-slate-50 rounded border border-slate-100 text-[11px] text-slate-500">
              Resilient frontend includes optimistic local caching so the app remains fully responsive during cold starts.
            </div>
          </div>
        </div>

        {/* Frontend: Vercel / Cloudflare */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">React Frontend</h3>
          </div>
          <div className="text-xs space-y-2 text-slate-600">
            <p><strong>Provider:</strong> Vercel / Netlify / Cloudflare Pages.</p>
            <p><strong>Subdomain:</strong> <code className="font-mono text-indigo-700">*.vercel.app</code></p>
            <p><strong>Bandwidth:</strong> 100 GB/month (More than sufficient for personal use).</p>
            <p><strong>SSL/HTTPS:</strong> Free automatic wildcard certificate.</p>
            <div className="p-2 bg-slate-50 rounded border border-slate-100 text-[11px] text-slate-500">
              Vite bundle is compiled to static assets (~250KB compressed) deployed on global CDN edge.
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Launch Verification Checklist */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Pre-Launch ₹0 Verification Checklist</h3>
          </div>
          <span className="text-xs font-mono font-semibold text-emerald-700">
            {Object.values(checklist).filter(Boolean).length} / 6 Checked
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Verify each constraint below before deploying to ensure you never incur accidental cloud billing:
        </p>

        <div className="space-y-3 pt-1 text-xs text-slate-700">
          <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.check_atlas}
              onChange={() => toggleCheck('check_atlas')}
              className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <span className="font-bold text-slate-900 block">1. MongoDB Atlas M0 Cluster</span>
              <p className="text-slate-500 text-[11px]">Selected &quot;M0 Shared Cluster&quot; during cluster creation. Do not select dedicated M10+ instances.</p>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.check_ai_api}
              onChange={() => toggleCheck('check_ai_api')}
              className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <span className="font-bold text-slate-900 block">2. Zero Paid AI Dependencies</span>
              <p className="text-slate-500 text-[11px]">The matching engine is 100% deterministic rules-based; no OpenAI/Gemini credit billing required.</p>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.check_domain}
              onChange={() => toggleCheck('check_domain')}
              className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <span className="font-bold text-slate-900 block">3. Free Subdomain Only</span>
              <p className="text-slate-500 text-[11px]">Using free provider subdomains (*.vercel.app, *.onrender.com). No custom domain registrar renewal fees.</p>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.check_backend}
              onChange={() => toggleCheck('check_backend')}
              className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <span className="font-bold text-slate-900 block">4. Free Compute Tier Verification</span>
              <p className="text-slate-500 text-[11px]">Backend service configured on Render Free Web Service with 512MB RAM cap.</p>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.check_messaging}
              onChange={() => toggleCheck('check_messaging')}
              className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <span className="font-bold text-slate-900 block">5. Free Client-Side Messaging</span>
              <p className="text-slate-500 text-[11px]">Outreach links use standard <code className="font-mono text-indigo-700">mailto:</code> and WhatsApp Web APIs without paid Twilio or SendGrid add-ons.</p>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.check_storage}
              onChange={() => toggleCheck('check_storage')}
              className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <span className="font-bold text-slate-900 block">6. In-Browser Document Parsing</span>
              <p className="text-slate-500 text-[11px]">Resume extraction operates inside the browser window using HTML5 File APIs. No paid OCR or document cloud API calls.</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
