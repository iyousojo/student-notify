import React, { useState, useEffect, useCallback } from 'react';
import { 
  Home, Bell, Bookmark, Calendar, Search, LogOut, X, 
  User as UserIcon, Inbox, Trash2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../../components/PostCard';
import { NavButton, MobileNavButton } from '../../components/Navigation';

const Bookmarks = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [user, setUser] = useState({ name: 'Student', department: 'University' });

  // Fetch bookmarks from /api/bookmarks
  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/bookmarks');
      setBookmarks(response.data || []);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    fetchBookmarks();
  }, [fetchBookmarks]);

  // Remove bookmark using the ID
  const handleRemoveBookmark = async (bookmarkId) => {
    try {
      await axios.delete(`/api/bookmarks/${bookmarkId}`);
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
          <NavButton icon={<Calendar />} label="Schedule" active={false} />
        </nav>
        <div className="mt-auto pt-6 border-t border-slate-50">
          <div className="flex items-center gap-3 p-2 mb-4">
            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase truncate">{user.department}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 border-r border-slate-100 min-h-screen pb-24 xl:pb-0">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-50 p-4 px-6 lg:px-8">
          <div className="flex justify-between items-center h-10">
            {!showMobileSearch ? (
              <>
                <div className="flex flex-col">
                  <h1 className="text-xl font-extrabold text-slate-900 leading-none">Bookmarks</h1>
                  <p className="xl:hidden text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Saved items</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setShowMobileSearch(true)} className="lg:hidden p-2 text-slate-500"><Search size={20} /></button>
                  <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm">
                    <UserIcon size={18} />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 w-full animate-in slide-in-from-top-2">
                <Search size={18} className="text-indigo-600 shrink-0" />
                <input 
                  autoFocus 
                  type="text" 
                  placeholder="Search bookmarks..." 
                  className="flex-1 bg-transparent outline-none text-sm font-medium" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                />
                <button onClick={() => {setShowMobileSearch(false); setSearchQuery('');}}><X size={18} className="text-slate-400" /></button>
              </div>
            )}
          </div>
        </header>

        <div className="divide-y divide-slate-50">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : bookmarks.length > 0 ? (
            bookmarks.map((bookmark) => (
              <div key={bookmark._id} className="relative group">
                {/* Note: PostCard needs to handle the logic of displaying the nested 
                  content based on whether bookmark.itemId is an Announcement or Notification 
                */}
                <PostCard 
                  {...bookmark.itemId} // Spreading the actual post data
                  isBookmarked={true}
                  onRemoveBookmark={() => handleRemoveBookmark(bookmark._id)}
                />
                <button 
                  onClick={() => handleRemoveBookmark(bookmark._id)}
                  className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove Bookmark"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Bookmark size={32} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No bookmarks yet</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-xs">
                Items you bookmark will appear here for quick access later.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar - Desktop Search */}
      <aside className="hidden lg:block w-80 p-6 sticky top-0 h-screen shrink-0">
        <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search bookmarks..." 
            className="bg-transparent outline-none text-sm w-full font-medium" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="xl:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-[#020617]/90 backdrop-blur-xl border border-white/10 px-6 py-3 z-50 rounded-2xl flex justify-between items-center shadow-2xl">
        <MobileNavButton icon={<Home />} active={false} onClick={() => navigate('/dashboard')} />
        <MobileNavButton icon={<Bell />} active={false} onClick={() => navigate('/announcements')} />
        <MobileNavButton icon={<Bookmark />} active={true} onClick={() => navigate('/bookmarks')} />
        <MobileNavButton icon={<Calendar />} active={false} />
        <button onClick={handleLogout} className="p-2 text-red-400"><LogOut size={20} /></button>
      </div>
    </div>
  );
};

export default Bookmarks;