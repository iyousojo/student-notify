import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Home, Bell, Bookmark, Calendar, Search, LogOut, X, 
  User as UserIcon, BookOpen, Link as LinkIcon, ShieldCheck, Plus, Inbox, Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PostCard from '../../components/PostCard';
import Form from "../../components/Form/Form";
import { NavButton, MobileNavButton, QuickLink } from '../../components/Navigation';
import axios from 'axios';

// Create a dedicated Axios instance for better header management on Vercel
const API = axios.create({
  baseURL: 'https://student-notification-system-1.onrender.com',
});

// Auto-inject token into every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const Dashboard = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  // Start with null to prevent the UI from "flickering" with default 'Student' data
  const [user, setUser] = useState(null); 
  
  const lastCheckRef = useRef(new Date().toISOString());

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  // --- REFINED FILTER LOGIC ---
  const filterNotification = useCallback((item, currentUser) => {
    if (!currentUser) return false;
    if (item.target?.role === 'All' || item.isGlobal) return true;
    if (currentUser.role === 'SuperAdmin') return true;

    if (item.target?.department) {
      return item.target.department === currentUser.department;
    }
    if (item.target?.faculty) {
      return item.target.faculty === currentUser.faculty;
    }
    return false;
  }, []);

  const fetchFeed = useCallback(async () => {
    if (!user) return; // Wait for user profile to exist
    try {
      setLoading(true);
      const [notifRes, bookmarkRes] = await Promise.all([
        API.get(`/api/notifications`),
        API.get(`/api/bookmarks`)
      ]);

      const allNotifs = notifRes.data.data || notifRes.data || [];
      const userBookmarks = bookmarkRes.data.data || bookmarkRes.data || [];
      const bookmarkedIds = new Set(userBookmarks.map(b => b.itemId?._id || b.itemId));

      const processedItems = allNotifs
        .filter(item => filterNotification(item, user))
        .map(item => ({
          ...item,
          isBookmarked: bookmarkedIds.has(item._id)
        }));
      
      setNotifications(processedItems);
      lastCheckRef.current = new Date().toISOString();
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [user, filterNotification, handleLogout]);

  const pollUpdates = useCallback(async () => {
    if (!user) return;
    try {
      const res = await API.get(`/api/updates/poll?lastCheck=${lastCheckRef.current}`);
      const newNotifs = res.data.notifications || [];
      
      if (newNotifs.length > 0) {
        const filteredNew = newNotifs.filter(item => filterNotification(item, user));
        if (filteredNew.length > 0) {
          setNotifications(prev => {
            const existingIds = new Set(prev.map(n => n._id));
            const uniqueNew = filteredNew.filter(n => !existingIds.has(n._id));
            return [...uniqueNew, ...prev];
          });
        }
      }
      lastCheckRef.current = new Date().toISOString();
    } catch (err) {
      console.warn("Polling failed:", err.message);
    }
  }, [user, filterNotification]);

  // NEW: Effect to sync user profile from DB on mount
  useEffect(() => {
    const syncUser = async () => {
      try {
        const res = await API.get('/api/users/me');
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      } catch (err) {
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
        else handleLogout();
      }
    };
    syncUser();
  }, [handleLogout]);

  useEffect(() => {
    // Only fetch if the user is fully synced
    if (user && (user.department || user.faculty || user.role === 'SuperAdmin')) {
      fetchFeed();
      const pollInterval = setInterval(pollUpdates, 30000); 
      return () => clearInterval(pollInterval);
    }
  }, [user, fetchFeed, pollUpdates]);

  const handleBookmarkToggle = async (post) => {
    const isCurrentlyBookmarked = post.isBookmarked;
    setNotifications(prev => prev.map(n => 
      n._id === post._id ? { ...n, isBookmarked: !isCurrentlyBookmarked } : n
    ));

    try {
      if (isCurrentlyBookmarked) {
        await API.delete(`/api/bookmarks`, {
          data: { itemId: post._id, itemType: 'Notification' }
        });
      } else {
        await API.post(`/api/bookmarks`, { itemId: post._id, itemType: 'Notification' });
      }
    } catch (err) {
      setNotifications(prev => prev.map(n => 
        n._id === post._id ? { ...n, isBookmarked: isCurrentlyBookmarked } : n
      ));
    }
  };

  const handleCreateNotification = async (formData) => {
    try {
      await API.post('/api/notifications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsFormOpen(false);
      fetchFeed(); 
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    }
  };

  // Show a loading screen while user profile is being verified
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  const canCreate = ["FacultyAdmin", "DepartmentAdmin", "SuperAdmin"].includes(user.role);

  const filteredNotifications = notifications.filter(item => {
    const search = searchQuery.toLowerCase();
    return (
      item.content?.toLowerCase().includes(search) || 
      item.title?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-white flex selection:bg-indigo-100">
      {/* Sidebar - Desktop */}
      <aside className="hidden xl:flex flex-col w-72 p-6 border-r border-slate-100 sticky top-0 h-screen shrink-0">
        <div className="mb-10 px-4 flex items-center gap-3">
          <div className="h-9 w-9 bg-[#020617] rounded-xl flex items-center justify-center text-white font-bold shadow-lg">S</div>
          <span className="font-bold text-slate-900 tracking-tight">StudentNotify</span>
        </div>
        <nav className="space-y-1 flex-1">
          <NavButton icon={<Home />} label="Home" active={true} onClick={() => navigate('/dashboard')} />
          <NavButton icon={<Bell />} label="Official" active={false} onClick={() => navigate('/announcements')} />
          <NavButton icon={<Bookmark />} label="Bookmarks" active={false} onClick={() => navigate('/bookmarks')} />
          <NavButton icon={<Calendar />} label="Schedule" active={false} onClick={() => navigate('/schedule')} />
          <NavButton icon={<UserIcon />} label="Profile" active={false} onClick={() => navigate('/profile')} />
        </nav>
        
        <div className="mt-auto pt-6 border-t border-slate-50">
          <div className="flex items-center gap-3 p-2 mb-4">
            <div className="h-10 w-10 rounded-full bg-indigo-600 overflow-hidden flex items-center justify-center text-white font-bold text-xs shadow-sm">
              {user.profilePic ? (
                <img src={user.profilePic.replace('http://', 'https://')} alt="Me" className="h-full w-full object-cover" />
              ) : (
                user.name?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase truncate">{user.department || user.role}</p>
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
                  <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">Home Feed</h1>
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">
                    {user.role === 'SuperAdmin' ? 'Global Scope' : user.department || user.faculty || 'General Updates'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setShowMobileSearch(true)} className="lg:hidden p-2 text-slate-500"><Search size={20} /></button>
                  <div 
                    className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-indigo-600 shadow-sm cursor-pointer"
                    onClick={() => navigate('/profile')}
                  >
                    {user.profilePic ? (
                      <img src={user.profilePic.replace('http://', 'https://')} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <UserIcon size={18} />
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 w-full animate-in slide-in-from-top-2">
                <Search size={18} className="text-indigo-600 shrink-0" />
                <input autoFocus type="text" placeholder="Search feed..." className="flex-1 bg-transparent outline-none text-sm font-medium" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <button onClick={() => {setShowMobileSearch(false); setSearchQuery('');}}><X size={18} className="text-slate-400" /></button>
              </div>
            )}
          </div>
        </header>

        <div className="divide-y divide-slate-50">
          {loading ? (
             <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>
          ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((post) => (
                <PostCard 
                  key={post._id} 
                  id={post._id}
                  type={post.target?.department ? "Department" : post.isGlobal ? "Official" : "Faculty"} 
                  author={post.createdByRole || "Admin"} 
                  content={post.content} 
                  time={post.createdAt} 
                  files={post.files} 
                  isNotification={true} 
                  isBookmarked={post.isBookmarked}
                  onBookmarkToggle={() => handleBookmarkToggle(post)}
                  onDelete={() => {}}
                  currentUser={user}
                  postTarget={post.target}
                />
              ))
          ) : (
            <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Inbox size={32} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No updates yet</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-xs">
                Notifications for **{user.department || user.faculty || 'your area'}** will appear here.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Right Panel */}
      <aside className="hidden lg:block w-80 p-6 sticky top-0 h-screen shrink-0">
        <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Filter feed..." className="bg-transparent outline-none text-sm w-full font-medium" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="space-y-6">
          <div className="p-5 bg-[#020617] rounded-3xl text-white shadow-xl">
             <div className="flex items-center gap-2 mb-3 text-indigo-400">
               <Globe size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">Scoped Feed</span>
            </div>
            <p className="text-xs leading-relaxed font-bold">
              Showing updates specifically for **{user.department || user.faculty || 'your institution'}**.
            </p>
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 mb-3">Resources</h3>
            <div className="space-y-2">
              <QuickLink icon={<BookOpen size={14} />} label="Student Handbook" />
              <QuickLink icon={<LinkIcon size={14} />} label="LMS Portal" />
              <QuickLink icon={<ShieldCheck size={14} />} label="Security Desk" />
            </div>
          </div>
        </div>
      </aside>

      {/* Floating Action Button */}
      {canCreate && (
        <button 
          onClick={() => setIsFormOpen(true)}
          className="fixed bottom-24 right-6 xl:bottom-10 xl:right-10 z-[60] bg-[#020617] text-white p-4 rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-3 group"
        >
          <Plus size={24} strokeWidth={3} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold text-sm whitespace-nowrap">New Post</span>
        </button>
      )}

      {/* Mobile Navigation */}
      <div className="xl:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-[#020617]/90 backdrop-blur-xl border border-white/10 px-6 py-3 z-50 rounded-2xl flex justify-between items-center shadow-2xl">
        <MobileNavButton icon={<Home />} active={true} onClick={() => navigate('/dashboard')} />
        <MobileNavButton icon={<Bell />} active={false} onClick={() => navigate('/announcements')} />
        <MobileNavButton icon={<Bookmark />} active={false} onClick={() => navigate('/bookmarks')} />
        <MobileNavButton icon={<Calendar />} active={false} onClick={() => navigate('/schedule')} />
        <MobileNavButton icon={<UserIcon />} active={false} onClick={() => navigate('/profile')} />
        <button onClick={handleLogout} className="p-2 text-red-400"><LogOut size={20} /></button>
      </div>

      <Form 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        type="Notification" 
        onSubmit={handleCreateNotification} 
      />
    </div>
  );
};

export default Dashboard;