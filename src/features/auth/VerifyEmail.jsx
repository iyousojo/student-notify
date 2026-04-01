import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(!!token);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (token) {
      const verifyToken = async () => {
        try {
          const response = await fetch(`https://student-notification-system-1.onrender.com/api/auth/verify-email/${token}`);
          const data = await response.json();
          
          if (response.ok) {
            setMessage("Email Verified! Redirecting to login...");
            setIsError(false);
            setTimeout(() => navigate('/login'), 3000);
          } else {
            setMessage(data.message || "Invalid or expired link.");
            setIsError(true);
          }
        } catch (err) {
          setMessage("Connection error. Try again.");
          setIsError(true);
        } finally {
          setVerifying(false);
        }
      };
      verifyToken();
    }
  }, [token, navigate]);

  const handleResend = async () => {
    const email = localStorage.getItem('tempEmail');
    if (!email) return setMessage("Email not found. Please re-register.");

    setResending(true);
    try {
      const response = await fetch('https://student-notification-system-1.onrender.com/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (response.ok) setMessage('A new link has been dispatched.');
    } catch (err) {
      setMessage('Failed to resend. Check connection.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center bg-white p-12 rounded-[2rem] shadow-xl border border-slate-100">
        <div className={`h-20 w-20 flex items-center justify-center mx-auto mb-8 rounded-full ${isError ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-600'} ${verifying ? 'animate-spin' : ''}`}>
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
          {verifying ? 'Verifying...' : (token ? (isError ? 'Link Expired' : 'Success') : 'Check Email')}
        </h2>
        
        <p className="text-slate-500 text-sm mb-10 leading-relaxed px-4">
          {!token ? "We've sent a secure activation link to your inbox. Check your institutional email to proceed." : message}
        </p>

        {(!token || isError) && (
          <button 
            onClick={handleResend}
            disabled={resending}
            className="w-full bg-[#020617] text-white font-bold py-4 rounded-xl text-xs uppercase tracking-[0.2em] shadow-lg mb-6 disabled:opacity-50"
          >
            {resending ? 'Dispatching...' : 'Resend Link'}
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