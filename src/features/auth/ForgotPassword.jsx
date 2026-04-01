import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', isError: false });

    try {
      const response = await fetch('https://student-notification-system-1.onrender.com/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Something went wrong');

      // Success message from your controller: "Reset instructions sent"
      setMessage({ text: data.message, isError: false });
    } catch (err) {
      setMessage({ text: err.message, isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recover Password</h2>
          <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-semibold">Institutional Access</p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-xl text-xs font-bold text-center border animate-in fade-in zoom-in duration-300 ${
            message.isError ? 'bg-red-50 text-red-600 border-red-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Registered Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-1 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-300"
              placeholder="id@university.edu.ng"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#020617] text-white font-bold py-4 rounded-xl text-[10px] uppercase tracking-[0.25em] shadow-lg disabled:opacity-50 active:scale-95 transition-transform"
          >
            {loading ? 'Processing...' : 'Send Recovery Link'}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-slate-50 pt-6">
          <Link to="/login" className="text-slate-400 text-[10px] font-bold hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]">
            &larr; Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;