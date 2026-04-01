import React, { useState } from 'react';
import { X, Send, Paperclip } from 'lucide-react';

const Form = ({ isOpen, onClose, type, onSubmit }) => {
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [files, setFiles] = useState([]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    files.forEach(file => data.append('files', file));
    onSubmit(data);
    setFormData({ title: '', content: '' });
    setFiles([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Create {type}</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">New Broadcast</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-2">Title</label>
            <input 
              required
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              placeholder={`Enter ${type} title...`}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-2">Message</label>
            <textarea 
              required
              rows="5"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
              placeholder="What would you like to announce?"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            ></textarea>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer transition-colors">
              <Paperclip size={16} className="text-slate-600" />
              <span className="text-xs font-bold text-slate-600">Attach Files</span>
              <input type="file" multiple className="hidden" onChange={(e) => setFiles(Array.from(e.target.files))} />
            </label>
            
            <button type="submit" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all active:scale-95">
              <Send size={16} />
              Post
            </button>
          </div>
          {files.length > 0 && (
            <p className="text-[10px] text-indigo-600 font-bold">{files.length} files selected</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Form;