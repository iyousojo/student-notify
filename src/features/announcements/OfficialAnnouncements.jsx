import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Home, Bell, Bookmark, Calendar, Search, LogOut, X, 
  User as UserIcon, Megaphone, Info, Plus, Inbox 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PostCard from '../../components/PostCard';
import Form from "../../components/Form/Form";
import { NavButton, MobileNavButton, QuickLink } from '../../components/Navigation';
import axios from 'axios';

const OfficialAnnouncements = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [user, setUser] = useState({ name: 'Student', department: 'University', role: 'Student' });
  
  // Ref to track the last sync time for the polling endpoint
  const lastCheckRef = useRef(new Date().toISOString());

  // Permissions based on the announcementRoutes.js configuration
  const canCreate = ["SchoolAdmin", "SuperAdmin"].includes(user.role);

  /**
   * Fetches updates from the polling endpoint.
   * If isPolling is true, it runs silently in the background.
   */
  const fetchOfficialFeed = useCallback(async (isPolling = false) => {
    try {
      if (!isPolling) setLoading(true);

      // Connects to the /poll endpoint provided in pollingRoutes.js
      const response = await axios.get(`/api/updates/poll?lastCheck=${lastCheckRef.current}`);
      const newItems = response.data.announcements || [];
      
      if (newItems.length > 0) {
        setAnnouncements(prev => {
          const combined = [...newItems, ...prev];
          // Remove duplicates and ensure unique items by ID
          return Array.from(new Map(combined.map(item => [item._id, item])).values());
        });
        // Update the timestamp to the current time after a successful fetch
        lastCheckRef.current = new Date().toISOString();
      }
    } catch (err) { 
      console.error("Polling error:", err); 
    } finally { 
      setLoading(false); 
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));

    // Reset timestamp to epoch to fetch all history on initial mount
    lastCheckRef.current = new Date(0).toISOString();
    fetchOfficialFeed();

    // Set up 30-second polling interval
    const interval = setInterval(() => fetchOfficialFeed(true), 30000);
    return () => clearInterval(interval);
  }, [fetchOfficialFeed]);

  const handlePostSubmit = async (formData) => {
    try {
      await axios.post('/api/announcements', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Refresh feed immediately after posting
      fetchOfficialFeed();
    } catch (err) { 
      console.error("Post submission error:", err); 
    }
  };

  const filteredAnnouncements = announcements.filter(post => 
    post.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <NavButton icon={<Bell />} label="Official" active={true} onClick={() => navigate('/announcements')} />
          <NavButton icon={<Bookmark />} label="Bookmarks" active={false} />
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

      {/* Main Feed */}
      <main className="flex-1 border-r border-slate-100 min-h-screen pb-24 xl:pb-0">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-50 p-4 px-6 lg:px-8">
          <div className="flex justify-between items-center h-10">
            {!showMobileSearch ? (
              <>
                <div className="flex flex-col">
                   <h1 className="text-xl font-extrabold text-slate-900 leading-none">Official</h1>
                   <p className="xl:hidden text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">School Wide</p>
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
                <input autoFocus type="text" placeholder="Search news..." className="flex-1 bg-transparent outline-none text-sm font-medium" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <button onClick={() => {setShowMobileSearch(false); setSearchQuery('');}}><X size={18} className="text-slate-400" /></button>
              </div>
            )}
          </div>
        </header>

        <div className="divide-y divide-slate-50">
          {loading ? (
             <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>
          ) : filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((post) => (
              <PostCard 
                key={post._id} 
                type="Official" 
                author="University Admin" 
                content={post.content} 
                time={post.createdAt} 
                files={post.files} 
                isNotification={false} 
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Inbox size={32} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No announcements yet</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-xs">
                When official university updates are posted, they will appear here. Check back later!
              </p>
              <button 
                onClick={() => fetchOfficialFeed()} 
                className="mt-6 text-xs font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4"
              >
                Refresh feed
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="hidden lg:block w-80 p-6 sticky top-0 h-screen shrink-0">
        <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search news..." 
            className="bg-transparent outline-none text-sm w-full font-medium" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <div className="space-y-6">
          <div className="p-5 bg-[#020617] rounded-3xl text-white shadow-xl shadow-slate-200">
            <div className="flex items-center gap-2 mb-3 text-amber-400">
               <Megaphone size={16} fill="currentColor" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified</span>
            </div>
            <p className="text-xs leading-relaxed font-bold">
              All updates in this section are strictly verified by the university senate and academic board.
            </p>
          </div>
          <div>
             <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 mb-3">Support</h3>
             <QuickLink icon={<Info size={14} />} label="Help Center" />
          </div>
        </div>
      </aside>

      {/* Floating Action Button for Admins */}
      {canCreate && (
        <button 
          onClick={() => setIsFormOpen(true)}
          className="fixed bottom-24 right-6 xl:bottom-10 xl:right-10 z-[60] bg-[#020617] text-white p-4 rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-3 group"
        >
          <Plus size={24} strokeWidth={3} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold text-sm whitespace-nowrap">Create Announcement</span>
        </button>
      )}

      {/* Mobile Navigation */}
      <div className="xl:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-[#020617]/90 backdrop-blur-xl border border-white/10 px-6 py-3 z-50 rounded-2xl flex justify-between items-center shadow-2xl">
        <MobileNavButton icon={<Home />} active={false} onClick={() => navigate('/dashboard')} />
        <MobileNavButton icon={<Bell />} active={true} onClick={() => navigate('/announcements')} />
        <MobileNavButton icon={<Bookmark />} active={false} />
        <MobileNavButton icon={<Calendar />} active={false} />
        <button onClick={handleLogout} className="p-2 text-red-400"><LogOut size={20} /></button>
      </div>

      {/* Post Creation Modal */}
      <Form 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        type="Announcement" 
        onSubmit={handlePostSubmit} 
      />
    </div>
  );
};

export default OfficialAnnouncements;