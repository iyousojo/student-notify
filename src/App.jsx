import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Middleware
import ProtectedRoute from './middleware/ProtectedRoute';
import PublicRoute from './middleware/PublicRoute';

// Features
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import VerifyEmail from './features/auth/VerifyEmail';
import ForgotPassword from './features/auth/ForgotPassword';
import ResetPassword from './features/auth/ResetPassword';
import Dashboard from './features/notifications/Dashboard'; 
import OfficialAnnouncements from './features/announcements/OfficialAnnouncements'; 

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100">
        <Routes>
          {/* --- PUBLIC ONLY ROUTES --- */}
          {/* Prevent logged-in users from accessing login/register */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* --- PROTECTED ROUTES --- */}
          {/* Requires valid token/session */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/announcements" element={<OfficialAnnouncements />} />
            
            {/* Placeholder routes for future implementation */}
            <Route path="/bookmarks" element={<Navigate to="/dashboard" replace />} />
            <Route path="/schedule" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* --- HYBRID / UTILITY ROUTES --- */}
          <Route path="/verify-email/:token?" element={<VerifyEmail />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Global Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 Redirect - Catch all unknown routes */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;