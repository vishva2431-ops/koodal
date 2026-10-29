import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowRight, AlertCircle, RefreshCw, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlassNavbar } from '../components/layout/GlassNavbar';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassInput } from '../components/ui/GlassInput';
import { GlassButton } from '../components/ui/GlassButton';

export const VerifyOtpPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyOtp, resendOtp, isAuthenticated } = useAuth();

  const emailParam = searchParams.get('email') || '';
  const devOtpParam = searchParams.get('devOtp') || '';

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState(devOtpParam || '');
  const [devOtp, setDevOtp] = useState<string | null>(devOtpParam || null);
  const [cooldown, setCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [cooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !otp.trim()) {
      setError('Please provide your email address and 6-digit verification code.');
      return;
    }

    setLoading(true);
    const res = await verifyOtp(email.trim(), otp.trim());
    setLoading(false);

    if (res.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setError(res.error || 'Verification failed');
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setError(null);
    setResendMessage(null);

    setLoading(true);
    const res = await resendOtp(email.trim());
    setLoading(false);

    if (res.success) {
      setResendMessage('A new verification code has been dispatched.');
      if (res.devOtp) {
        setDevOtp(res.devOtp);
        setOtp(res.devOtp);
      }
      setCooldown(60);
      setCanResend(false);
    } else {
      setError(res.error || 'Unable to resend verification code');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col antialiased">
      <GlassNavbar />

      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-md w-full relative z-10 space-y-6">
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mx-auto flex items-center justify-center shadow-xs">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Verify Your Email Address
            </h2>
            <p className="text-xs text-slate-400">
              Enter the 6-digit verification code dispatched to <strong className="text-white">{email || 'your email'}</strong>
            </p>
          </div>

          <GlassCard className="p-7 space-y-5">
            {/* Dev Mode OTP Indicator for seamless zero-setup testing */}
            {devOtp && (
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-center justify-between">
                <div>
                  <span className="font-semibold block">Dev Test Environment Code:</span>
                  <span className="font-mono text-base font-bold text-white tracking-widest">{devOtp}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setOtp(devOtp)}
                  className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-[11px] font-semibold hover:bg-indigo-500"
                >
                  Auto Fill
                </button>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {resendMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                {resendMessage}
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              <GlassInput
                label="Registered Email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                leftIcon={Mail}
              />

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-slate-300">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center tracking-[0.4em] font-mono font-bold text-lg rounded-xl backdrop-blur-xs bg-slate-900/50 border border-white/10 px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <GlassButton
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full py-2.5 mt-2"
                icon={ArrowRight}
              >
                Verify & Activate Account
              </GlassButton>
            </form>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span>Didn&apos;t receive code?</span>
              <button
                type="button"
                disabled={!canResend || loading}
                onClick={handleResend}
                className={`font-semibold transition-colors ${
                  canResend ? 'text-indigo-400 hover:text-indigo-300' : 'text-slate-600 cursor-not-allowed'
                }`}
              >
                {canResend ? 'Resend Code' : `Resend in ${cooldown}s`}
              </button>
            </div>
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
