import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { useAuthCheck } from './hooks/useAuth';
import LoginChoice from './pages/LoginChoice';
import SMSAuthPage from './pages/SMSAuthPage';
import WhatsappAuthPage from "./pages/WhatsAppAuthPage";
import EmailAuthPage from './pages/EmailAuthPage';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/common/LoadingSpinner';
import { useLogout } from './hooks/useAuth';
import { useToast } from './context/ToastContext';

const ProtectedRoute = ({ children }) => {
  const { data: authData, isLoading } = useAuthCheck();
  if (isLoading) return <LoadingSpinner />;
  return authData?.authenticated ? children : <Navigate to="/" replace />;
};

function AppContent() {
  const logoutMutation = useLogout();
  const { data: authData, isLoading } = useAuthCheck();
  const { showToast } = useToast();

  if (isLoading) return <LoadingSpinner />;

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    showToast('Logged out successfully', 'success');
    window.location.href = '/';
  };

  return (
    <Routes>
      <Route path="/" element={<LoginChoice />} />
      <Route path="/login/sms" element={<SMSAuthPage />} />
      <Route path="/login/whatsapp" element={<WhatsAppAuthPage />} />
      <Route path="/login/email" element={<EmailAuthPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard user={authData?.user} onLogout={handleLogout} />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;