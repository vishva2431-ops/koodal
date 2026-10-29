import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { UserAccount, AuthState } from '../types';

interface AuthContextType extends AuthState {
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string; requiresVerification?: boolean; email?: string }>;
  register: (email: string, pass: string) => Promise<{ success: boolean; message?: string; requiresOtp?: boolean; email?: string; devOtp?: string; error?: string }>;
  verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  resendOtp: (email: string) => Promise<{ success: boolean; message?: string; devOtp?: string; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string; devOtp?: string; error?: string }>;
  resetPassword: (email: string, otp: string, newPass: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  adminLogin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const savedUser = localStorage.getItem('koodal_auth_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('koodal_auth_token') || null;
  });

  const [loading, setLoading] = useState(true);

  // Set default Authorization header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('koodal_auth_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('koodal_auth_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('koodal_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('koodal_auth_user');
    }
  }, [user]);

  // Check current session on mount
  useEffect(() => {
    async function checkSession() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('/api/auth/me');
        if (res.data?.user) {
          setUser(res.data.user);
        }
      } catch {
        // Token expired or invalid
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, [token]);

  const login = async (email: string, pass: string) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password: pass });
      if (res.data.token && res.data.user) {
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, error: 'Authentication failed' };
    } catch (err: any) {
      const data = err.response?.data;
      return {
        success: false,
        error: data?.error || 'Login failed. Please check your credentials.',
        requiresVerification: data?.requiresVerification,
        email: data?.email,
      };
    }
  };

  const register = async (email: string, pass: string) => {
    try {
      const res = await axios.post('/api/auth/register', { email, password: pass });
      return {
        success: true,
        message: res.data.message,
        requiresOtp: res.data.requiresOtp,
        email: res.data.email,
        devOtp: res.data.devOtp,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.error || 'Registration failed. Please try again.',
      };
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const res = await axios.post('/api/auth/verify-otp', { email, otp });
      if (res.data.token && res.data.user) {
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, error: 'OTP verification failed' };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.error || 'Invalid or expired verification code.',
      };
    }
  };

  const resendOtp = async (email: string) => {
    try {
      const res = await axios.post('/api/auth/resend-otp', { email });
      return {
        success: true,
        message: res.data.message,
        devOtp: res.data.devOtp,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.error || 'Unable to resend verification code.',
      };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      return {
        success: true,
        message: res.data.message,
        devOtp: res.data.devOtp,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.error || 'Error dispatching recovery code.',
      };
    }
  };

  const resetPassword = async (email: string, otp: string, newPass: string) => {
    try {
      const res = await axios.post('/api/auth/reset-password', {
        email,
        otp,
        newPassword: newPass,
      });
      return { success: true, message: res.data.message };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.error || 'Password reset failed.',
      };
    }
  };

  const adminLogin = async (email: string, pass: string) => {
    try {
      const res = await axios.post('/api/auth/admin-login', { email, password: pass });
      if (res.data.token && res.data.user) {
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, error: 'Admin authentication failed' };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.error || 'Invalid administrator credentials.',
      };
    }
  };

  const logout = () => {
    axios.post('/api/auth/logout').catch(() => {});
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = !!user && user.roles.includes('ROLE_ADMIN');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        register,
        verifyOtp,
        resendOtp,
        forgotPassword,
        resetPassword,
        adminLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
