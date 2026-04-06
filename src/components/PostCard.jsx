import React, { useState } from 'react';
import { Bookmark, CalendarPlus, MoreHorizontal, Download, FileText, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PostCard = ({ 
  id, type, author, content, time, files, isNotification, 
  isBookmarked, onBookmarkToggle, onDelete, currentUser,
  postTarget 
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isDept = type === 'Department';
  const initial = author ? author.charAt(0) : '?';

  const TEXT_LIMIT = 280;
  // Ensure content exists before checking length
  const isLongText = content?.length > TEXT_LIMIT;
  
  // Logic to determine what to show
  const displayContent = (isExpanded || !isLongText) 
    ? content 
    : `${content.substring(0, TEXT_LIMIT)}...`;

  const canDelete = (() => {
    if (!currentUser) return false;
    const role = currentUser.role;
    if (role === "SuperAdmin" || role === "SchoolAdmin") return true;
    if (role === "FacultyAdmin") return postTarget?.faculty === currentUser.faculty;
    if (role === "DepartmentAdmin") return postTarget?.department === currentUser.department;
    return false;
  })();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = (file) => {
    const baseUrl = 'https://student-notification-system-1.onrender.com';
    const downloadUrl = `${baseUrl}${file.path}`;
    window.open(downloadUrl, '_blank');
  };

  const toggleExpand = (e) => {
    if (isLongText) {
      e.preventDefault();
      e.stopPropagation();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="p-4 hover:bg-slate-50/50 transition-all duration-300 group relative border-b border-slate-50 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className={`h-12 w-12 rounded-full flex-shrink-0 border-2 flex items-center justify-center font-bold shadow-sm ${
          isDept ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-purple-500 bg-purple-50 text-purple-600'
        }`}>
          {initial}
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="font-bold text-sm text-slate-900 truncate">{author}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                isDept ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'
              }`}>{type}</span>
              <span className="text-slate-400 text-xs shrink-0">· {formatDate(time)}</span>
            </div>
            
            <div className="flex items-center gap-1 shrink-0">
              {canDelete && (
                <button 
                  onClick={() => onDelete(id)}
                  className="p-1.5 md:opacity-0 group-hover:opacity-100 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-all"
                >
                  <Trash2 size={15} />
                </button>
              )}
              <button className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                <MoreHorizontal className="w-4 h-4 text-slate-300" />
              </button>
            </div>
          </div>
          
          {/* CONTENT AREA */}
          <div className={`relative ${isLongText ? 'cursor-pointer' : ''}`}>
            <p className="text-slate-600 text-[14px] leading-relaxed mb-2 break-words whitespace-pre-wrap transition-all duration-300">
              {displayContent}
            </p>
            
            {isLongText && (
              <button 
                onClick={toggleExpand}
                className="text-indigo-600 text-[11px] font-bold uppercase tracking-wider mb-3 flex items-center gap-1 hover:text-indigo-800 transition-colors"
              >
                {isExpanded ? (
                  <><ChevronUp size={14} /> Show Less</>
                ) : (
                  <><ChevronDown size={14} /> Read Full Post</>
                )}
              </button>
            )}
          </div>

          {/* Files Section */}
          {files && files.length > 0 && (
            <div className="mb-4 space-y-2">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 px-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white transition-colors">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText size={16} className="text-slate-400 shrink-0" />
                    <span className="text-xs font-medium text-slate-600 truncate">{file.originalname}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDownload(file); }}
                    className="p-1.5 bg-white rounded-lg text-indigo-600 shadow-sm border border-slate-200 hover:bg-indigo-50 transition-all"
                  >
                    <Download size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center gap-6 pt-1 border-t border-slate-50 mt-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onBookmarkToggle(); }}
              className={`flex items-center gap-2 transition-colors ${
                isBookmarked ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'
              }`}
            >
              <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
              <span className="text-[11px] font-bold uppercase tracking-widest">
                {isBookmarked ? 'Saved' : 'Save'}
              </span>
            </button>
            
            <button 
              onClick={(e) => { e.stopPropagation(); navigate('/schedule'); }}
              className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-all active:scale-90 duration-200"
            >
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