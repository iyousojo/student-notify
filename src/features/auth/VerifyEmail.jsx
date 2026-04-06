import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(!!token);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const verifyToken = useCallback(async () => {
    if (!token) return;
    
    try {
      setVerifying(true);
      const response = await fetch(`https://student-notification-system-1.onrender.com/api/auth/verify-email/${token}`);
      const data = await response.json();
      
      if (response.ok) {
        setMessage("Email Verified! Redirecting to login...");
        setIsError(false);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setMessage(data.message || "This link is invalid or has expired.");
        setIsError(true);
      }
    } catch (err) {
      setMessage("Server connection failed. Please try again later.");
      setIsError(true);
    } finally {
      setVerifying(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token, verifyToken]);

  const handleResend = async () => {
    const email = localStorage.getItem('tempEmail');
    if (!email) {
      setMessage("Registration data not found. Please sign up again.");
      setIsError(true);
      return;
    }

    setResending(true);
    setMessage('');
    try {
      const response = await fetch('https://student-notification-system-1.onrender.com/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setMessage('A fresh activation link has been dispatched to your inbox.');
        setIsError(false);
      } else {
        const data = await response.json();
        setMessage(data.message || 'Failed to resend link.');
        setIsError(true);
      }
    } catch (err) {
      setMessage('Network error. Check your connection.');
      setIsError(true);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center bg-white p-12 rounded-[2rem] shadow-xl border border-slate-100">
        <div className={`h-20 w-20 flex items-center justify-center mx-auto mb-8 rounded-full ${isError ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-600'} ${verifying ? 'animate-spin border-4 border-t-indigo-600 border-indigo-100' : ''}`}>
          {!verifying && (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d={isError ? "M6 18L18 6M6 6l12 12" : "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"} />
            </svg>
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
          {verifying ? 'Verifying Account' : (token ? (isError ? 'Verification Failed' : 'Success') : 'Check Your Email')}
        </h2>
        
        <p className={`text-sm mb-10 leading-relaxed px-4 ${isError ? 'text-red-500' : 'text-slate-500'}`}>
          {!token ? "We've sent a secure activation link to your institutional inbox. Please click it to verify your account." : message}
        </p>

        {(!token || isError) && (
          <button 
            onClick={handleResend}
            disabled={resending || verifying}
            className="w-full bg-[#020617] text-white font-bold py-4 rounded-xl text-xs uppercase tracking-[0.2em] shadow-lg mb-6 disabled:opacity-50 transition-all hover:bg-slate-800"
          >
            {resending ? 'Dispatching...' : 'Resend Activation Link'}
          </button>
        )}

        <Link to="/login" className="text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-indigo-600 transition-colors">
          &larr; Back to Login
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;