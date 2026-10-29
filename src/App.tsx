import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Public Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { VerifyOtpPage } from './pages/VerifyOtpPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminSystemPage } from './pages/admin/AdminSystemPage';

// Candidate Protected Pages
import { DashboardPage } from './pages/DashboardPage';
import { JobsPage } from './pages/JobsPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { RecoveryPage } from './pages/RecoveryPage';
import { ProfilePage } from './pages/ProfilePage';
import { ResumePage } from './pages/ResumePage';
import { OutreachPage } from './pages/OutreachPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/verify-email" element={<VerifyOtpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Protected Candidate Workspace */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/applications" element={<ApplicationsPage />} />
                <Route path="/recovery" element={<RecoveryPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/resumes" element={<ResumePage />} />
                <Route path="/outreach" element={<OutreachPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              {/* Protected Admin Workspace */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboardPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="system" element={<AdminSystemPage />} />
              </Route>

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
