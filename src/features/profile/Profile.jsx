import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  User, Mail, School, BookOpen, Shield, 
  Camera, Check, Loader2, ArrowLeft 
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePic: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('https://student-notification-system-1.onrender.com/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(data);
      setFormData({
        name: data.name,
        email: data.email,
        profilePic: data.profilePic || ''
      });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // UPDATED: Increased to 20MB (20 * 1024 * 1024)
      const limit = 20 * 1024 * 1024; 
      
      if (file.size > limit) {
        setMessage({ type: 'error', text: 'Image is too large (max 20MB)' });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(
        'https://student-notification-system-1.onrender.com/api/users/me', 
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // ✅ SYNC LOCAL STORAGE: Update the 'user' object so Dashboard sees the change
      const existingUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...existingUser, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setUser(data);
      setFormData({
        name: data.name,
        email: data.email,
        profilePic: data.profilePic
      });
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={() => navigate(-1)} 
        className="group mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium text-sm"
      >
        <div className="p-2 rounded-lg bg-white border border-slate-100 shadow-sm group-hover:border-indigo-100 group-hover:bg-indigo-50 transition-all">
          <ArrowLeft size={18} />
        </div>
        Back to Dashboard
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="relative group">
              <div className="h-24 w-24 rounded-2xl bg-white p-1 shadow-md overflow-hidden border border-slate-100">
                {formData.profilePic ? (
                  <img 
                    src={formData.profilePic} 
                    alt="Profile" 
                    className="h-full w-full rounded-xl object-cover"
                    key={formData.profilePic} 
                  />
                ) : (
                  <div className="h-full w-full rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                    <User size={40} />
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
              <button 
                type="button" 
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 p-2 bg-white rounded-lg shadow-lg border border-slate-100 text-slate-600 hover:text-indigo-600 hover:scale-110 transition-all z-10"
              >
                <Camera size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-16 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
            <p className="text-slate-500 flex items-center gap-2 mt-1 uppercase text-[10px] font-bold tracking-widest">
              <Shield size={14} className="text-indigo-500" />
              {user.role}
            </p>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300 ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
              {message.type === 'success' && <Check size={18} />}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2 opacity-75">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Faculty</label>
                <div className="relative">
                  <School className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={user.faculty || 'Not Assigned'}
                    readOnly
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2 opacity-75">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Department</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={user.department || 'Not Assigned'}
                    readOnly
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={updating}
                className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2 shadow-md shadow-indigo-200"
              >
                {updating ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;