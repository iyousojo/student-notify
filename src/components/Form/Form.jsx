import React, { useState, useEffect } from 'react';
import { X, Send, Paperclip, ChevronDown, Megaphone, Bell, Globe } from 'lucide-react';

const Form = ({ isOpen, onClose, type: initialType, onSubmit }) => {
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [activeType, setActiveType] = useState(initialType || 'Notification');
  const [target, setTarget] = useState({ faculty: '', department: '' });
  const [files, setFiles] = useState([]);
  const [user, setUser] = useState(null);

  // Example data structure - replace with your actual data/API
  const facultyData = {
    "Science": ["Computer Science", "Microbiology", "Biochemistry"],
    "Engineering": ["Civil Engineering", "Mechanical Engineering", "Electrical"],
    "Arts": ["History", "Linguistics", "Fine Arts"]
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    setActiveType(initialType || 'Notification');
  }, [isOpen, initialType]);

  if (!isOpen) return null;

  const isSuperAdmin = user?.role === 'SuperAdmin';
  const isFacultyAdmin = user?.role === 'FacultyAdmin';
  const isDeptAdmin = user?.role === 'DepartmentAdmin';
  const canPostAnnouncement = isSuperAdmin || user?.role === 'SchoolAdmin';

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    
    data.append('title', formData.title);
    data.append('content', formData.content);
    
    if (activeType === "Notification") {
      if (isSuperAdmin) {
        // 1. Explicit Department selected
        if (target.department) {
          data.append('department', target.department);
          data.append('faculty', target.faculty); 
        } 
        // 2. Explicit Faculty only selected
        else if (target.faculty) {
          data.append('faculty', target.faculty);
        }
        // 3. NO SELECTION: Apply fallback hierarchy
        else {
          if (user.department) {
            data.append('department', user.department);
            data.append('faculty', user.faculty);
          } else if (user.faculty) {
            data.append('faculty', user.faculty);
          } else {
            // Root admin with no profile scope
            data.append('isGlobal', 'true');
          }
        }
      } else if (isFacultyAdmin) {
        data.append('faculty', user.faculty);
      } else if (isDeptAdmin) {
        data.append('faculty', user.faculty);
        data.append('department', user.department);
      }
    } else {
      data.append('isGlobal', 'true');
    }

    files.forEach(file => data.append('files', file));
    onSubmit(data, activeType); 
    
    // Reset
    setFormData({ title: '', content: '' });
    setTarget({ faculty: '', department: '' });
    setFiles([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Create New Post</h2>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
              {user?.role} — {user?.department || user?.faculty || 'Full Access'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          
          {/* Type Selector */}
          {canPostAnnouncement && (
            <div className="flex p-1 bg-slate-100 rounded-2xl">
              {['Announcement', 'Notification'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setActiveType(t)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeType === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {t === 'Announcement' ? <Megaphone size={14} /> : <Bell size={14} />} {t}
                </button>
              ))}
            </div>
          )}

          {/* TARGETING UI */}
          {activeType === "Notification" ? (
            <div className="animate-in slide-in-from-top-2 duration-300">
              {isSuperAdmin ? (
                <div className="space-y-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest">Target Audience</label>
                    {!target.faculty && (
                      <span className="text-[9px] font-bold text-indigo-500 bg-white px-2 py-0.5 rounded-full border border-indigo-100">
                        Defaulting to your profile
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <select 
                        className="w-full bg-white border border-indigo-100 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 appearance-none outline-none focus:ring-2 focus:ring-indigo-500/20"
                        value={target.faculty}
                        onChange={(e) => setTarget({ faculty: e.target.value, department: '' })}
                      >
                        <option value="">All Faculties</option>
                        {Object.keys(facultyData).map(f => (
                          <option key={f} value={f}>{f} Faculty</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-3 text-indigo-300 pointer-events-none" />
                    </div>

                    <div className="relative">
                      <select 
                        className="w-full bg-white border border-indigo-100 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 appearance-none outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
                        value={target.department}
                        disabled={!target.faculty}
                        onChange={(e) => setTarget({ ...target, department: e.target.value })}
                      >
                        <option value="">Whole Faculty</option>
                        {target.faculty && facultyData[target.faculty].map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-3 text-indigo-300 pointer-events-none" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Bell size={16} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest leading-none">Recipient Scope</p>
                    <p className="text-xs font-bold text-amber-900">
                      {isDeptAdmin ? user.department : `${user.faculty} Faculty`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-[#020617] rounded-2xl flex items-center gap-4 animate-in zoom-in-95">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Globe size={20} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none text-white/60">Broadcast Type</p>
                <p className="text-xs font-bold text-white">Public School-Wide Announcement</p>
              </div>
            </div>
          )}

          {/* Standard Form Inputs */}
          <div className="space-y-4">
            <input 
              required
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all"
              placeholder="Give your post a title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <textarea 
              required
              rows="4"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-medium outline-none resize-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all"
              placeholder="Write your message here..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          {/* Attachments & Submit */}
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer transition-colors">
              <Paperclip size={18} className="text-slate-500" />
              <span className="text-xs font-bold text-slate-600">Attach files</span>
              <input type="file" multiple className="hidden" onChange={(e) => setFiles([...files, ...Array.from(e.target.files)])} />
            </label>
            
            <button 
              type="submit" 
              className="bg-[#020617] text-white px-8 py-3 rounded-2xl font-bold text-sm hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Send size={16} /> Publish Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;