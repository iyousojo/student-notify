import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, Bell, Bookmark, Calendar as CalendarIcon, LogOut, 
  ChevronLeft, ChevronRight, Inbox, ArrowRight, Clock, User as UserIcon,
  Search, X, Globe, BookOpen, Link as LinkIcon, ShieldCheck
} from 'lucide-react';
import axios from 'axios';
import { NavButton, MobileNavButton, QuickLink } from '../../components/Navigation';

const Schedule = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({ name: 'Student', department: '', faculty: '', role: 'Student' });
  
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [notifRes, announceRes] = await Promise.all([
        axios.get('/api/notifications', { headers }),
        axios.get('/api/announcements', { headers })
      ]);

      const notifs = (notifRes.data.data || notifRes.data || []).map(i => ({ ...i, type: 'notification' }));
      const announces = (announceRes.data.data || announceRes.data || []).map(i => ({ ...i, type: 'announcement' }));

      setAllEvents([...notifs, ...announces]);
    } catch (err) {
      console.error("Error fetching calendar data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    fetchAllData();
  }, [fetchAllData]);

  const filteredItems = useMemo(() => {
    const selStr = selectedDate.toDateString();
    return allEvents.filter(item => {
      const itemDate = new Date(item.createdAt || item.date);
      return itemDate.toDateString() === selStr;
    });
  }, [allEvents, selectedDate]);

  const hasEventOnDay = (day) => {
    const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = dateObj.toDateString();
    return allEvents.some(item => new Date(item.createdAt || item.date).toDateString() === dateStr);
  };

  // Calendar Logic
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const handleMonthSelect = (monthIndex) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
  };

  const handleYearChange = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear() + offset, currentDate.getMonth(), 1));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white flex selection:bg-indigo-100">
      
      {/* Sidebar - Desktop (Matches Dashboard) */}
      <aside className="hidden xl:flex flex-col w-72 p-6 border-r border-slate-100 sticky top-0 h-screen shrink-0">
        <div className="mb-10 px-4 flex items-center gap-3">
          <div className="h-9 w-9 bg-[#020617] rounded-xl flex items-center justify-center text-white font-bold shadow-lg">S</div>
          <span className="font-bold text-slate-900 tracking-tight">StudentNotify</span>
        </div>
        <nav className="space-y-1 flex-1">
          <NavButton icon={<Home />} label="Home" active={false} onClick={() => navigate('/dashboard')} />
          <NavButton icon={<Bell />} label="Official" active={false} onClick={() => navigate('/announcements')} />
          <NavButton icon={<Bookmark />} label="Bookmarks" active={false} onClick={() => navigate('/bookmarks')} />
          <NavButton icon={<CalendarIcon />} label="Schedule" active={true} onClick={() => navigate('/schedule')} />
          <NavButton icon={<UserIcon />} label="Profile" active={false} onClick={() => navigate('/profile')} />
        </nav>
        
        <div className="mt-auto pt-6 border-t border-slate-50">
          <div className="flex items-center gap-3 p-2 mb-4">
            <div className="h-10 w-10 rounded-full bg-indigo-600 overflow-hidden flex items-center justify-center text-white font-bold text-xs shadow-sm">
              {user.profilePic ? (
                <img src={user.profilePic} alt="Me" className="h-full w-full object-cover" />
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
            <div className="flex flex-col">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">Academic Schedule</h1>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Jump to any date</p>
            </div>
            
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button onClick={() => handleYearChange(-1)} className="p-1.5 hover:text-indigo-600 transition-colors"><ChevronLeft size={16}/></button>
              <span className="px-3 text-xs font-black text-slate-900">{currentDate.getFullYear()}</span>
              <button onClick={() => handleYearChange(1)} className="p-1.5 hover:text-indigo-600 transition-colors"><ChevronRight size={16}/></button>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {/* Month Quick-Switcher */}
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-6">
            {months.map((month, index) => (
              <button
                key={month}
                onClick={() => handleMonthSelect(index)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border ${
                  currentDate.getMonth() === index 
                  ? 'bg-[#020617] text-white border-transparent shadow-md' 
                  : 'bg-white text-slate-500 border-slate-100 hover:border-indigo-200'
                }`}
              >
                {month}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Calendar View */}
            <div className="lg:col-span-8 bg-slate-50 rounded-3xl p-6 border border-slate-100 h-fit">
              <div className="grid grid-cols-7 gap-2 lg:gap-4 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2 lg:gap-4">
                {padding.map(i => <div key={`p-${i}`} />)}
                {days.map(day => {
                  const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                  const isSelected = selectedDate.toDateString() === dateObj.toDateString();
                  const isToday = new Date().toDateString() === dateObj.toDateString();
                  const hasEvent = hasEventOnDay(day);

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(dateObj)}
                      className={`h-14 lg:h-24 rounded-2xl flex flex-col items-center justify-center transition-all border relative ${
                        isSelected ? 'bg-[#020617] text-white border-transparent shadow-xl scale-105 z-10' : 
                        isToday ? 'bg-indigo-50 text-indigo-600 border-indigo-100 font-bold' : 
                        'bg-white text-slate-600 border-slate-100 hover:border-indigo-200'
                      }`}
                    >
                      <span className="text-sm lg:text-lg font-bold">{day}</span>
                      {hasEvent && (
                        <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-indigo-600'}`}></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Event List */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                {selectedDate.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} Events
              </h3>
              
              <div className="space-y-3">
                {loading ? (
                  <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>
                ) : filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <div 
                      key={item._id}
                      onClick={() => navigate(item.type === 'announcement' ? '/announcements' : '/dashboard')}
                      className="group p-5 bg-white border border-slate-100 rounded-3xl hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider ${
                          item.type === 'announcement' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {item.type}
                        </span>
                        <Clock size={12} className="text-slate-300" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm leading-snug">{item.title || item.content.substring(0, 45) + "..."}</h4>
                      <div className="mt-3 flex items-center text-indigo-600 text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-all">
                        View Details <ArrowRight size={12} className="ml-1" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-16 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                    <Inbox className="mx-auto text-slate-300 mb-2" size={28}/>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Empty Day</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

    

      {/* Mobile Navigation - Matches Dashboard Structure */}
      <div className="xl:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-[#020617]/90 backdrop-blur-xl border border-white/10 px-6 py-3 z-50 rounded-2xl flex justify-between items-center shadow-2xl">
        <MobileNavButton icon={<Home />} active={false} onClick={() => navigate('/dashboard')} />
        <MobileNavButton icon={<Bell />} active={false} onClick={() => navigate('/announcements')} />
        <MobileNavButton icon={<Bookmark />} active={false} onClick={() => navigate('/bookmarks')} />
        <MobileNavButton icon={<CalendarIcon />} active={true} onClick={() => navigate('/schedule')} />
        <MobileNavButton icon={<UserIcon />} active={false} onClick={() => navigate('/profile')} />
        <button onClick={handleLogout} className="p-2 text-red-400"><LogOut size={20} /></button>
      </div>
    </div>
  );
};

export default Schedule;