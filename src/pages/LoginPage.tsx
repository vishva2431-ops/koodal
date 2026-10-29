import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlassNavbar } from '../components/layout/GlassNavbar';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassInput } from '../components/ui/GlassInput';
import { GlassButton } from '../components/ui/GlassButton';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState(searchParams.get('mode') === 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setIsRegisterMode(searchParams.get('mode') === 'register');
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessInfo(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email address and password.');
      return;
    }

    if (isRegisterMode) {
      if (password.length < 8) {
        setError('Password must contain at least 8 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      setLoading(true);
      const res = await register(email.trim(), password);
      setLoading(false);

      if (res.success) {
        // Redirect to OTP verification page
        navigate(`/verify-email?email=${encodeURIComponent(res.email || email.trim())}${res.devOtp ? `&devOtp=${res.devOtp}` : ''}`);
      } else {
        setError(res.error || 'Registration failed');
      }
    } else {
      setLoading(true);
      const res = await login(email.trim(), password);
      setLoading(false);

      if (res.success) {
        navigate('/dashboard', { replace: true });
      } else {
        if (res.requiresVerification) {
          navigate(`/verify-email?email=${encodeURIComponent(res.email || email.trim())}`);
        } else {
          setError(res.error || 'Authentication failed');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col antialiased">
      <GlassNavbar />

      <div className="flex-1 flex items-center justify-center p-6 relative">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-md w-full relative z-10 space-y-6">
          <div className="text-center space-y-1.5">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {isRegisterMode ? 'Create Your Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-slate-400">
              {isRegisterMode
                ? 'Sign up to configure your private Tamil Nadu job hunting pipeline.'
                : 'Sign in to access your personal dashboard and applications.'}
            </p>
          </div>

          <GlassCard className="p-7 space-y-5">
            {/* Mode Segmented Switch */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-950/60 border border-white/5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(false);
                  setError(null);
                }}
                className={`py-2 rounded-lg transition-all ${
                  !isRegisterMode
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(true);
                  setError(null);
                }}
                className={`py-2 rounded-lg transition-all ${
                  isRegisterMode
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <GlassInput
                label="Email Address"
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                leftIcon={Mail}
              />

              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  {!isRegisterMode && (
                    <Link
                      to="/forgot-password"
                      className="text-[11px] text-indigo-400 hover:text-indigo-300"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full rounded-xl backdrop-blur-xs bg-slate-900/50 border border-white/10 pl-9 pr-10 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isRegisterMode && (
                <GlassInput
                  label="Confirm Password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  leftIcon={Lock}
                />
              )}

              {!isRegisterMode && (
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-white/10"
                    />
                    <span>Remember my session</span>
                  </label>
                </div>
              )}

              <GlassButton
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full py-2.5 mt-2"
                icon={ArrowRight}
              >
                {isRegisterMode ? 'Send Verification OTP' : 'Sign In'}
              </GlassButton>
            </form>
          </GlassCard>

          <div className="text-center text-xs text-slate-500">
            <span>Administrator access? </span>
            <Link to="/admin/login" className="text-purple-400 hover:text-purple-300 font-semibold">
              Admin Login Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
