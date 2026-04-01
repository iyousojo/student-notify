import React from 'react';

/**
 * NavButton: Main sidebar navigation links
 */
export const NavButton = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
      active ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-500 hover:bg-slate-50'
    }`}
  >
    {React.cloneElement(icon, { size: 20, strokeWidth: active ? 2.5 : 2 })}
    <span className="text-sm tracking-tight">{label}</span>
  </button>
);

/**
 * MobileNavButton: Icons for the bottom floating dock on mobile
 */
export const MobileNavButton = ({ icon, active, onClick }) => (
  <button 
    onClick={onClick} 
    className={`p-2 transition-all ${active ? 'text-white' : 'text-slate-500'}`}
  >
    {React.cloneElement(icon, { size: 22, strokeWidth: active ? 2.5 : 2 })}
  </button>
);

/**
 * QuickLink: Small resource links in the right sidebar
 */
export const QuickLink = ({ icon, label }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
    <div className="text-slate-400 group-hover:text-indigo-600">{icon}</div>
    <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900">{label}</span>
  </div>
);