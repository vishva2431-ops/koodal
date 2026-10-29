import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShieldCheck, 
  Zap, 
  FileCheck, 
  AlertTriangle, 
  Mail, 
  Server, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Sparkles,
  Lock
} from 'lucide-react';
import { GlassNavbar } from '../components/layout/GlassNavbar';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-indigo-500 selection:text-white flex flex-col antialiased">
      <GlassNavbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        {/* Ambient Gradient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-violet-600/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-md bg-white/5 border border-white/10 text-xs font-medium text-indigo-300 shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            <span>Dedicated Tamil Nadu Tech Job Assistant · React & Full Stack</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Discover, Match, and Apply with Complete Privacy & Zero API Cost.
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A secure, rules-driven personal job hunting engine built for React, Frontend, and Full Stack engineers across Chennai, Coimbatore, Madurai, Trichy, and Salem. Never scrapes illegally, never leaks your resume, and runs permanently at ₹0.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <GlassButton
              variant="primary"
              size="lg"
              icon={ArrowRight}
              onClick={() => navigate('/login?mode=register')}
            >
              Get Started for Free
            </GlassButton>
            <GlassButton
              variant="glass"
              size="lg"
              onClick={() => navigate('/login')}
            >
              Sign In to Your Workspace
            </GlassButton>
          </div>

          {/* Trust strip */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Rules-Based (No Paid AI APIs)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Client-Side PDF & DOCX Extraction</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full Standalone Spring Boot 3 Backend</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Architecture & Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Engineered for High-Affinity Tech Applications
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Built from first principles to ensure your personal data remains private, application attempts are tracked with evidence, and submissions respect portal terms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassCard className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Multi-Portal Compliant Search</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates compliant official search URLs with Tamil Nadu geo-identifiers for Naukri, LinkedIn, Indeed, and direct career pages without automated scraping or TOS breaches.
            </p>
          </GlassCard>

          <GlassCard className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Transparent Rules Matcher</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No black-box hallucinations. Transparent, weighted algorithm grades technical skills (45%), Tamil Nadu location (20%), and experience (15%) with clear matching/missing lists.
            </p>
          </GlassCard>

          <GlassCard className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Assisted Application Workflow</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pre-application checklist confirms expected salary and notice period before opening official employer links, then allows recording verified confirmation numbers.
            </p>
          </GlassCard>

          <GlassCard className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Root-Cause Recovery Center</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Diagnoses interrupted applications with actual evidence, distinguishing confirmed causes from unconfirmed network drops and blocking risky duplicate retries.
            </p>
          </GlassCard>

          <GlassCard className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Dynamic Outreach Generator</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Resolves placeholders dynamically from your verified profile and selected jobs. Generates prefilled email drafts and WhatsApp messages for personal review.
            </p>
          </GlassCard>

          <GlassCard className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Spring Boot 3 & MongoDB Atlas</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Production Java 21 backend code provided with Spring Security, Jakarta Validation, and Mongo Repositories ready for free deployment to Render.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Workflow Steps */}
      <section id="workflow" className="py-20 px-6 border-t border-white/5 bg-slate-950/40">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Step-by-Step
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              A Disciplined Application Lifecycle
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="space-y-2 p-5 rounded-2xl bg-white/5 border border-white/5">
              <div className="font-mono text-indigo-400 font-bold text-sm">01. Setup Profile</div>
              <h4 className="font-bold text-white text-sm">Upload & Verify</h4>
              <p className="text-slate-400 leading-relaxed">
                Upload your PDF/DOCX resume. Review and edit extracted text in-browser with zero external API transmission.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-2xl bg-white/5 border border-white/5">
              <div className="font-mono text-indigo-400 font-bold text-sm">02. Discover & Match</div>
              <h4 className="font-bold text-white text-sm">Targeted Scoring</h4>
              <p className="text-slate-400 leading-relaxed">
                Filter jobs across Chennai, Coimbatore, and Tamil Nadu. Inspect transparent match breakdown scores.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-2xl bg-white/5 border border-white/5">
              <div className="font-mono text-indigo-400 font-bold text-sm">03. Assisted Apply</div>
              <h4 className="font-bold text-white text-sm">Guided Submission</h4>
              <p className="text-slate-400 leading-relaxed">
                Confirm sensitive declarations (CTC, notice period), copy tailored portfolio links, and open the official portal.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-2xl bg-white/5 border border-white/5">
              <div className="font-mono text-indigo-400 font-bold text-sm">04. Audit & Follow-Up</div>
              <h4 className="font-bold text-white text-sm">Evidence Logging</h4>
              <p className="text-slate-400 leading-relaxed">
                Record confirmation codes, schedule follow-up emails, and diagnose failures in the Recovery Center.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Zero Cost Section */}
      <section id="privacy" className="py-20 px-6 max-w-5xl mx-auto w-full text-center space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mx-auto flex items-center justify-center">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Strict Privacy & ₹0 Operating Cost
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Your personal contact details and resume never leave your controlled database or browser environment. The entire stack runs on free tier services without recurring fees.
        </p>
        <div className="pt-2">
          <GlassButton
            variant="primary"
            size="lg"
            onClick={() => navigate('/login?mode=register')}
          >
            Create Your Account Now
          </GlassButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/10 py-8 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Koodal. Personal Job Search & Application Assistant.</p>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-slate-300 transition-colors">Candidate Sign In</Link>
            <Link to="/admin/login" className="hover:text-purple-400 transition-colors">Admin Console</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
