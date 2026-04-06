import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Import the hook

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth(); // Extract login function from context

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Centralized login logic
    const result = await login(formData.email, formData.password);

    if (result.success) {
      // AuthContext handles localStorage and state; we just navigate
      navigate('/dashboard');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white selection:bg-indigo-100 overflow-hidden">
      {/* Banner Section */}
      <div className="hidden lg:flex w-[35%] bg-[#020617] p-16 flex-col justify-between relative overflow-hidden group">
        <div className="absolute -bottom-16 -right-16 w-[110%] h-[110%] opacity-[0.02] transition-all duration-1000 group-hover:opacity-[0.04] group-hover:-rotate-12 pointer-events-none rotate-[-20deg] text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
        </div>
        <div className="z-10">
          <div className="mb-12">
            <div className="flex items-center gap-3">
              <div className="h-2 w-10 bg-indigo-500 rounded-full"></div>
              <span className="text-white font-bold tracking-[0.2em] text-xs uppercase opacity-80">Agonix Framework</span>
            </div>
          </div>
          <h1 className="text-5xl font-light text-white tracking-tight leading-[1.1]">Centralized <br /><span className="font-bold">Notification</span> <br />Control.</h1>
        </div>
        <div className="z-10 text-slate-600 text-[10px] font-mono tracking-widest uppercase">SECURE ENCRYPTION ON</div>
      </div>

      {/* Login Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#fcfdfe]">
        <div className="w-full max-w-sm">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Portal Sign-in</h2>
            <p className="text-slate-400 text-sm mt-1">Enter your institutional credentials.</p>
            {error && (
              <div className="mt-4 p-3 text-xs text-red-600 font-bold bg-red-50 border border-red-100 rounded-lg animate-shake">
                {error}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5 ml-0.5">Email Address</label>
              <input 
                type="email" 
                name="email" 
                required 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm focus:ring-1 focus:ring-indigo-600 outline-none transition-all" 
                placeholder="id@university.edu.ng" 
                value={formData.email} 
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1.5 px-0.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Password</label>
                <Link to="/forgot-password" size={12} className="text-[10px] font-bold text-indigo-600 uppercase hover:underline">Forgot?</Link>
              </div>
              <input 
                type="password" 
                name="password" 
                required 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm focus:ring-1 focus:ring-indigo-600 outline-none transition-all" 
                placeholder="••••••••" 
                value={formData.password} 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-[#020617] text-white font-bold py-3.5 rounded-lg text-xs uppercase tracking-widest shadow-lg disabled:opacity-50 active:scale-[0.98] transition-transform"
            >
              {loading ? 'Verifying...' : 'Authenticate'}
            </button>
          </form>

          <div className="mt-12 pt-6 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 uppercase tracking-widest">
              New here? <Link to="/register" className="text-indigo-600 font-bold hover:underline ml-1">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;