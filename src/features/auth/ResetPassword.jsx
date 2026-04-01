import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams(); // Matches the :token in your App.js route
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ message: '', isError: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setStatus({ message: "Passwords do not match", isError: true });
    }

    setLoading(true);
    setStatus({ message: '', isError: false });

    try {
      const response = await fetch(`https://student-notification-system-1.onrender.com/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Reset failed');

      setStatus({ message: "Password updated! Redirecting to login...", isError: false });
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setStatus({ message: err.message, isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight text-center">New Password</h2>
        
        {status.message && (
          <div className={`mb-6 p-3 text-xs font-bold border rounded-lg text-center ${
            status.isError ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'
          }`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Set New Password</label>
            <input 
              type="password" 
              required 
              minLength="6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-1 focus:ring-indigo-600 outline-none"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Confirm New Password</label>
            <input 
              type="password" 
              required 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-1 focus:ring-indigo-600 outline-none"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#020617] text-white font-bold py-4 rounded-xl text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-transform disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Confirm New Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;