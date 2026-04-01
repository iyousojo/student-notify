import React from 'react';
import { Bookmark, CalendarPlus, MoreHorizontal, Download, FileText } from 'lucide-react';

const PostCard = ({ type, author, content, time, files, isNotification }) => {
  const isDept = type === 'Department';
  const initial = author ? author.charAt(0) : '?';

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const handleDownload = (filename) => {
    const fileType = isNotification ? 'notification' : 'announcement';
    // Link to the route in fileRoutes.js
    window.open(`/api/files/${fileType}/download/${filename}`, '_blank');
  };

  return (
    <div className="p-4 hover:bg-slate-50/50 transition-colors group">
      <div className="flex gap-4">
        <div className={`h-12 w-12 rounded-full flex-shrink-0 border-2 flex items-center justify-center font-bold ${
          isDept ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-purple-500 bg-purple-50 text-purple-600'
        }`}>
          {initial}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900">{author}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                isDept ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'
              }`}>{type}</span>
              <span className="text-slate-400 text-xs">· {formatDate(time)}</span>
            </div>
            <MoreHorizontal className="w-4 h-4 text-slate-300" />
          </div>
          
          <p className="text-slate-600 text-[14px] leading-relaxed mb-3">{content}</p>

          {/* File Attachments Section (using fileRoutes.js) */}
          {files && files.length > 0 && (
            <div className="mb-4 space-y-2">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 px-3 bg-slate-50 rounded-lg border border-slate-100 group/file">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText size={16} className="text-slate-400" />
                    <span className="text-xs font-medium text-slate-600 truncate">{file.originalname}</span>
                  </div>
                  <button 
                    onClick={() => handleDownload(file.filename)}
                    className="p-1 hover:bg-white rounded-md text-indigo-600 transition-all shadow-sm border border-transparent hover:border-slate-200"
                  >
                    <Download size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-6 pt-1">
            <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Bookmark size={18} />
              <span className="text-[11px] font-bold uppercase tracking-widest">Save</span>
            </button>
            <button className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors">
              <CalendarPlus size={18} />
              <span className="text-[11px] font-bold uppercase tracking-widest">Schedule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;