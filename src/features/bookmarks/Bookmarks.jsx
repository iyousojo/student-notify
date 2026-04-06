import React, { useState, useEffect, useCallback } from 'react';
import { Home, Bell, Bookmark, Calendar, LogOut, User as UserIcon, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../../components/PostCard';
import { NavButton, MobileNavButton } from '../../components/Navigation';

const Bookmarks = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: 'Student', department: 'University', profilePic: '' });

  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Use full URL to match your Profile and Dashboard consistency
      const response = await axios.get('https://student-notification-system-1.onrender.com/api/bookmarks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setBookmarks(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
      if (err.response?.status === 401) navigate('/login');
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    // Get updated user info including the new profile picture
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleRemoveBookmark = async (bookmarkId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://student-notification-system-1.onrender.com/api/bookmarks/${bookmarkId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Optimistic update
      setBookmarks(prev => prev.filter(b => b._id !== bookmarkId));
    } catch (err) {
      console.error("Error removing bookmark:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white flex selection:bg-indigo-100">
      {/* Sidebar - Desktop */}
      <aside className="hidden xl:flex flex-col w-72 p-6 border-r border-slate-100 sticky top-0 h-screen shrink-0">
        <div className="mb-10 px-4 flex items-center gap-3">
          <div className="h-9 w-9 bg-[#020617] rounded-xl flex items-center justify-center text-white font-bold shadow-lg">S</div>
          <span className="font-bold text-slate-900 tracking-tight">StudentNotify</span>
        </div>
        <nav className="space-y-1 flex-1">
          <NavButton icon={<Home />} label="Home" active={false} onClick={() => navigate('/dashboard')} />
          <NavButton icon={<Bell />} label="Official" active={false} onClick={() => navigate('/announcements')} />
          <NavButton icon={<Bookmark />} label="Bookmarks" active={true} onClick={() => navigate('/bookmarks')} />
          <NavButton icon={<Calendar />} label="Schedule" active={false} onClick={() => navigate('/schedule')} />
          <NavButton icon={<UserIcon />} label="Profile" active={false} onClick={() => navigate('/profile')} />
        </nav>
        
        <div className="mt-auto pt-6 border-t border-slate-50">
          <div className="flex items-center gap-3 p-2 mb-4">
            {/* PROFILE PICTURE SYNC */}
            <div className="h-10 w-10 rounded-full bg-indigo-600 overflow-hidden flex items-center justify-center text-white font-bold text-xs shadow-sm">
              {user.profilePic ? (
                <img src={user.profilePic} alt="Me" className="h-full w-full object-cover" />
              ) : (
                user.name?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase truncate">{user.department}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all text-left">
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen pb-24 xl:pb-0 border-r border-slate-100">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-50 p-4 px-6 lg:px-8">
          <div className="flex justify-between items-center h-10">
            <div className="flex flex-col">
              <h1 className="text-xl font-extrabold text-slate-900 leading-none">Saved Items</h1>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Your Bookmarks</p>
            </div>
            <div 
              className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-indigo-600 shadow-sm cursor-pointer"
              onClick={() => navigate('/profile')}
            >
              {user.profilePic ? (
                <img src={user.profilePic} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <UserIcon size={18} />
              )}
            </div>
          </div>
        </header>

        <div className="divide-y divide-slate-50">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : bookmarks.length > 0 ? (
            bookmarks.map((bookmark) => {
              if (!bookmark.itemId) return null;
              
              return (
                <PostCard 
                  key={bookmark._id}
                  {...bookmark.itemId} 
                  type={bookmark.itemType}
                  author={bookmark.itemId.faculty || "Admin"}
                  isBookmarked={true}
                  onBookmarkToggle={() => handleRemoveBookmark(bookmark._id)}
                />
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Inbox size={32} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No bookmarks yet</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-xs">
                Items you bookmark will appear here for quick access later.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Nav */}
      <div className="xl:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-[#020617]/90 backdrop-blur-xl border border-white/10 px-6 py-3 z-50 rounded-2xl flex justify-between items-center shadow-2xl">
        <MobileNavButton icon={<Home />} active={false} onClick={() => navigate('/dashboard')} />
        <MobileNavButton icon={<Bell />} active={false} onClick={() => navigate('/announcements')} />
        <MobileNavButton icon={<Bookmark />} active={true} onClick={() => navigate('/bookmarks')} />
        <MobileNavButton icon={<Calendar />} active={false} onClick={() => navigate('/schedule')} />
        <MobileNavButton icon={<UserIcon />} active={false} onClick={() => navigate('/profile')} />
        <button onClick={handleLogout} className="p-2 text-red-400"><LogOut size={20} /></button>
      </div>
    </div>
  );
};

export default Bookmarks;