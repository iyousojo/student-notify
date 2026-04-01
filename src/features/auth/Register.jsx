import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const facultyDepartments = {
  Science: ["Math", "Chemistry", "Physics", "Computer Science"],
  Engineering: ["Civil Engineering", "Mechanical Engineering", "Electrical Engineering", "Computer Engineering"],
  Arts: ["History", "Philosophy", "Linguistics", "Literature"],
  "Social Science": ["Sociology", "Political Science", "Psychology", "Economics"],
  Management: ["Accounting", "Business Administration", "Banking and Finance", "Marketing"],
};

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', faculty: '', department: '', role: 'Student' 
  });
  const [availableDepartments, setAvailableDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (formData.faculty) {
      setAvailableDepartments(facultyDepartments[formData.faculty] || []);
      setFormData(prev => ({ ...prev, department: '' }));
    }
  }, [formData.faculty]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://student-notification-system-1.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      localStorage.setItem('tempEmail', formData.email);
      navigate('/verify-email');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white selection:bg-indigo-100 overflow-hidden">
      {/* Banner Section - Matches Login exactly */}
      <div className="hidden lg:flex w-[35%] bg-[#020617] p-16 flex-col justify-between relative overflow-hidden group">
        {/* Animated Background Bell */}
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
          <h1 className="text-5xl font-light text-white tracking-tight leading-[1.1]">Institutional <br /><span className="font-bold">Identity</span> <br />Setup.</h1>
        </div>
        
        <div className="z-10 text-slate-600 text-[10px] font-mono tracking-widest uppercase">SECURE ENCRYPTION ON</div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#fcfdfe] overflow-y-auto">
        <div className="w-full max-w-sm my-10">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-slate-400 text-sm mt-1">Join the centralized notification network.</p>
            {error && (
              <div className="mt-4 p-3 text-xs text-red-600 font-bold bg-red-50 border border-red-100 rounded-lg animate-shake">
                {error}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5 ml-0.5">Full Name</label>
              <input type="text" name="name" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm focus:ring-1 focus:ring-indigo-600 outline-none transition-all placeholder:opacity-50" placeholder="John Doe" />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5 ml-0.5">Email Address</label>
              <input type="email" name="email" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm focus:ring-1 focus:ring-indigo-600 outline-none transition-all placeholder:opacity-50" placeholder="id@university.edu.ng" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5 ml-0.5">Faculty</label>
                <select name="faculty" required onChange={handleChange} className="w-full px-3 py-3 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-indigo-600 outline-none bg-white transition-all">
                  <option value="">Select...</option>
                  {Object.keys(facultyDepartments).map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5 ml-0.5">Department</label>
                <select name="department" value={formData.department} required onChange={handleChange} disabled={!formData.faculty} className="w-full px-3 py-3 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-indigo-600 outline-none bg-white disabled:opacity-50 transition-all">
                  <option value="">Select...</option>
                  {availableDepartments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5 ml-0.5">Password</label>
              <input type="password" name="password" required minLength="6" onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm focus:ring-1 focus:ring-indigo-600 outline-none transition-all placeholder:opacity-50" placeholder="••••••••" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#020617] text-white font-bold py-3.5 rounded-lg text-xs uppercase tracking-widest shadow-lg disabled:opacity-50 active:scale-[0.98] transition-transform mt-2">
              {loading ? 'Initializing...' : 'Confirm Enrollment'}
            </button>
          </form>

          <div className="mt-12 pt-6 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 uppercase tracking-widest">
              Joined before? <Link to="/login" className="text-indigo-600 font-bold hover:underline ml-1">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;