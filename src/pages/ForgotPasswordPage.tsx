import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowRight, AlertCircle, KeyRound, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlassNavbar } from '../components/layout/GlassNavbar';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassInput } from '../components/ui/GlassInput';
import { GlassButton } from '../components/ui/GlassButton';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please provide your registered account email address.');
      return;
    }

    setLoading(true);
    const res = await forgotPassword(email.trim());
    setLoading(false);

    if (res.success) {
      navigate(`/reset-password?email=${encodeURIComponent(email.trim())}${res.devOtp ? `&devOtp=${res.devOtp}` : ''}`);
    } else {
      setError(res.error || 'Failed to send recovery code');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col antialiased">
      <GlassNavbar />

      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-md w-full relative z-10 space-y-6">
          <div className="text-center space-y-1.5">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Password Recovery
            </h2>
            <p className="text-xs text-slate-400">
              Enter your email to receive a secure single-use recovery code.
            </p>
          </div>

          <GlassCard className="p-7 space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <GlassInput
                label="Registered Email Address"
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                leftIcon={Mail}
              />

              <GlassButton
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full py-2.5 mt-2"
                icon={ArrowRight}
              >
                Send Reset Code
              </GlassButton>
            </form>
          </GlassCard>

          <div className="text-center text-xs text-slate-500">
            <Link to="/login" className="hover:text-slate-300">
              ← Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
