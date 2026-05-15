import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';

// Lazy load pages
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Attendance = lazy(() => import('./pages/Attendance'));
const Homework = lazy(() => import('./pages/Homework'));
const Assessments = lazy(() => import('./pages/Assessments'));
const Communication = lazy(() => import('./pages/Communication'));
const Reports = lazy(() => import('./pages/Reports'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D1B2A]">
        <div className="w-12 h-12 border-4 border-[#00C9A7] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
}

function RoleRoute({ children, roles }: { children: React.ReactNode, roles: string[] }) {
  const { profile, loading } = useAuth();
  
  if (loading) return null;
  if (!profile || !roles.includes(profile.role)) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
}

function AppContent() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#0D1B2A]">
        <div className="w-12 h-12 border-4 border-[#00C9A7] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="attendance" element={
            <RoleRoute roles={['admin', 'teacher']}>
              <Attendance />
            </RoleRoute>
          } />
          <Route path="homework" element={
            <RoleRoute roles={['admin', 'teacher', 'student']}>
              <Homework />
            </RoleRoute>
          } />
          <Route path="assessments" element={
            <RoleRoute roles={['admin', 'teacher', 'student']}>
              <Assessments />
            </RoleRoute>
          } />
          <Route path="messages" element={<Communication />} />
          <Route path="reports" element={
            <RoleRoute roles={['admin']}>
              <Reports />
            </RoleRoute>
          } />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#0D1B2A] text-[#F5F7FA] font-sans selection:bg-[#00C9A7]/30 selection:text-[#00C9A7]">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}
