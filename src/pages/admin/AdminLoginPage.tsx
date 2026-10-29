import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GlassNavbar } from '../../components/layout/GlassNavbar';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassInput } from '../../components/ui/GlassInput';
import { GlassButton } from '../../components/ui/GlassButton';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { adminLogin, isAdmin } = useAuth();

  const [email, setEmail] = useState('admin@koodal.dev');
  const [password, setPassword] = useState('Admin@Koodal2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    setLoading(true);
    const res = await adminLogin(email.trim(), password);
    setLoading(false);

    if (res.success) {
      navigate('/admin', { replace: true });
    } else {
      setError(res.error || 'Admin verification failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      <GlassNavbar />

      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-md w-full relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 mx-auto flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Administrator Console
            </h2>
            <p className="text-xs text-slate-400">
              Restricted portal. Access requires verified <code className="font-mono text-purple-400">ROLE_ADMIN</code> credentials.
            </p>
          </div>

          <GlassCard className="p-7 space-y-5 border-purple-500/20 shadow-purple-500/5">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Bootstrap notice for local testing */}
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 text-[11px] leading-relaxed">
              <span className="font-bold block mb-0.5">Initial Server Admin Bootstrap:</span>
              <span>Default credentials initialized on server: <code className="font-mono text-white">admin@koodal.dev</code> / <code className="font-mono text-white">Admin@Koodal2026!</code>. Configurable via environment variables.</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <GlassInput
                label="Admin Identifier"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                leftIcon={Mail}
              />

              <GlassInput
                label="Master Password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                leftIcon={Lock}
              />

              <GlassButton
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full py-2.5 mt-2 bg-purple-600 hover:bg-purple-500 shadow-purple-500/20"
                icon={ArrowRight}
              >
                Authenticate as Admin
              </GlassButton>
            </form>
          </GlassCard>

          <div className="text-center text-xs text-slate-500">
            <Link to="/login" className="hover:text-slate-300">
              ← Return to Candidate Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
