import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, ArrowRight, AlertCircle, KeyRound, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlassNavbar } from '../components/layout/GlassNavbar';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassInput } from '../components/ui/GlassInput';
import { GlassButton } from '../components/ui/GlassButton';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const emailParam = searchParams.get('email') || '';
  const devOtpParam = searchParams.get('devOtp') || '';

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState(devOtpParam || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !otp.trim() || !newPassword.trim()) {
      setError('All fields are required.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await resetPassword(email.trim(), otp.trim(), newPassword);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(res.error || 'Password reset failed');
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
              Set New Password
            </h2>
            <p className="text-xs text-slate-400">
              Enter your reset code and specify your new secure password.
            </p>
          </div>

          <GlassCard className="p-7 space-y-5">
            {success ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
                <p className="font-bold">Password Reset Successfully!</p>
                <p className="text-[11px] text-slate-400">Redirecting to sign-in page...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {devOtpParam && (
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono">
                    Dev Test Reset Code: <strong className="text-white">{devOtpParam}</strong>
                  </div>
                )}

                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <GlassInput
                  label="Registered Email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />

                <GlassInput
                  label="6-Digit Reset Code"
                  type="text"
                  required
                  placeholder="123456"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  leftIcon={KeyRound}
                />

                <GlassInput
                  label="New Password (min 8 chars)"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  leftIcon={Lock}
                />

                <GlassInput
                  label="Confirm New Password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  leftIcon={Lock}
                />

                <GlassButton
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className="w-full py-2.5 mt-2"
                  icon={ArrowRight}
                >
                  Update Password
                </GlassButton>
              </form>
            )}
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
