import React, { useState } from 'react';
import { 
  Calendar, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  GraduationCap, 
  Briefcase, 
  Bookmark, 
  Award, 
  ChevronDown, 
  Menu, 
  X,
  CheckCheck
} from 'lucide-react';
import type { User, UserRole, NotificationItem } from '../../types';
import { db } from '../../services/db';

interface HeaderProps {
  currentUser: User;
  onRoleSwitch: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAiAssistant: () => void;
  notifications: NotificationItem[];
  onRefreshNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onRoleSwitch,
  activeTab,
  setActiveTab,
  onOpenAiAssistant,
  notifications,
  onRefreshNotifications
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAllRead = () => {
    db.markAllNotificationsRead(currentUser.id);
    onRefreshNotifications();
  };

  const handleMarkSingleRead = (id: string) => {
    db.markNotificationRead(id);
    onRefreshNotifications();
  };

  const allRoleUsers = db.getAllUsers();
  const studentUser = allRoleUsers.find(u => u.role === 'student');
  const organizerUser = allRoleUsers.find(u => u.role === 'organizer');
  const adminUser = allRoleUsers.find(u => u.role === 'admin');

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-[#08080a]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab(currentUser.role === 'student' ? 'explore' : 'dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 p-0.5 shadow-glow-orange">
            <div className="w-full h-full bg-[#08080a] rounded-[10px] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-orange-400 font-heading tracking-tight">
              Campus<span className="text-orange-500">Events</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold">
              PRO SaaS
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1">
          {currentUser.role === 'student' && (
            <>
              <button
                onClick={() => setActiveTab('explore')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'explore'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-glow-orange'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Search className="w-3.5 h-3.5 inline mr-1.5" />
                Explore Events
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-glow-orange'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('my_events')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'my_events'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-glow-orange'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                My Events
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'calendar'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-glow-orange'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Calendar
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'saved'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-glow-orange'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 inline mr-1.5" />
                Saved
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'achievements'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-glow-orange'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Award className="w-3.5 h-3.5 inline mr-1.5" />
                Achievements
              </button>
            </>
          )}

          {currentUser.role === 'organizer' && (
            <>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Organizer Dashboard
              </button>
              <button
                onClick={() => setActiveTab('manage_events')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'manage_events'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                My Events
              </button>
              <button
                onClick={() => setActiveTab('create_event')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 text-white shadow-glow-orange hover:brightness-110 transition-all cursor-pointer"
              >
                + Create Event
              </button>
              <button
                onClick={() => setActiveTab('checkin')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'checkin'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                QR Check-in
              </button>
            </>
          )}

          {currentUser.role === 'admin' && (
            <>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Admin Overview
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'users'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                User Management
              </button>
              <button
                onClick={() => setActiveTab('all_events')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'all_events'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Event Moderation
              </button>
            </>
          )}
        </nav>

        {/* Right Action Icons & Role Switcher */}
        <div className="flex items-center space-x-3">

          {/* AI Assistant Button */}
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-950/90 to-amber-900/60 border border-orange-500/40 text-amber-300 hover:text-white hover:border-orange-400/60 transition-all text-xs font-semibold shadow-glow-gold animate-pulse-glow cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Assistant</span>
          </button>

          {/* Quick Role Switcher Pill */}
          <div className="relative group">
            <div className="flex items-center bg-[#12141a] border border-slate-800 rounded-xl p-1 text-xs font-medium text-slate-300">
              <span className="hidden md:inline text-slate-400 px-1.5">Role:</span>
              <button
                onClick={() => {
                  if (studentUser) {
                    db.setCurrentUserId(studentUser.id);
                    onRoleSwitch('student');
                  }
                }}
                className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  currentUser.role === 'student'
                    ? 'bg-orange-600 text-white font-semibold shadow'
                    : 'hover:text-white hover:bg-slate-800'
                }`}
                title="Switch to Student Persona"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Student</span>
              </button>
              <button
                onClick={() => {
                  if (organizerUser) {
                    db.setCurrentUserId(organizerUser.id);
                    onRoleSwitch('organizer');
                  }
                }}
                className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  currentUser.role === 'organizer'
                    ? 'bg-amber-600 text-white font-semibold shadow'
                    : 'hover:text-white hover:bg-slate-800'
                }`}
                title="Switch to Organizer Persona"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Organizer</span>
              </button>
              <button
                onClick={() => {
                  if (adminUser) {
                    db.setCurrentUserId(adminUser.id);
                    onRoleSwitch('admin');
                  }
                }}
                className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  currentUser.role === 'admin'
                    ? 'bg-slate-800 text-amber-400 font-semibold border border-slate-700 shadow'
                    : 'hover:text-white hover:bg-slate-800'
                }`}
                title="Switch to Admin Persona"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            </div>
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel rounded-2xl shadow-2xl border border-slate-800 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-orange-400" />
                    <h3 className="font-semibold text-sm text-slate-100 font-heading">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-xs bg-orange-500/20 text-orange-300 rounded-full font-medium">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="mt-3 max-h-72 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No notifications yet.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleMarkSingleRead(n.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          n.is_read
                            ? 'bg-slate-900/40 border-slate-800/60 text-slate-400'
                            : 'bg-orange-950/40 border-orange-500/30 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold">
                          <span className={n.is_read ? 'text-slate-300' : 'text-orange-300'}>{n.title}</span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="mt-1 text-slate-300 leading-snug">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-800/60 border border-slate-800 transition-colors cursor-pointer"
            >
              <img
                src={currentUser.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={currentUser.full_name}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-orange-500/40"
              />
              <span className="hidden md:inline font-medium text-xs text-slate-200">{currentUser.full_name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-56 glass-panel rounded-2xl shadow-2xl border border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-3 border-b border-slate-800">
                  <p className="font-semibold text-xs text-slate-100">{currentUser.full_name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                  <p className="mt-1 text-[10px] uppercase font-bold text-orange-400">{currentUser.role} • {currentUser.department}</p>
                </div>
                <div className="p-1 space-y-1">
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg flex items-center space-x-2 cursor-pointer"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('landing');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 rounded-lg flex items-center space-x-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 text-slate-300 hover:text-white cursor-pointer"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {showMobileMenu && (
        <div className="lg:hidden border-t border-slate-800 bg-[#08080a] p-4 space-y-2">
          {currentUser.role === 'student' && (
            <>
              <button onClick={() => { setActiveTab('explore'); setShowMobileMenu(false); }} className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-900">Explore Events</button>
              <button onClick={() => { setActiveTab('dashboard'); setShowMobileMenu(false); }} className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-900">Student Dashboard</button>
              <button onClick={() => { setActiveTab('my_events'); setShowMobileMenu(false); }} className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-900">My Registered Events</button>
              <button onClick={() => { setActiveTab('calendar'); setShowMobileMenu(false); }} className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-900">Campus Calendar</button>
              <button onClick={() => { setActiveTab('saved'); setShowMobileMenu(false); }} className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-900">Saved Events</button>
              <button onClick={() => { setActiveTab('achievements'); setShowMobileMenu(false); }} className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-900">My Certificates & Achievements</button>
            </>
          )}

          {currentUser.role === 'organizer' && (
            <>
              <button onClick={() => { setActiveTab('dashboard'); setShowMobileMenu(false); }} className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-900">Organizer Dashboard</button>
              <button onClick={() => { setActiveTab('manage_events'); setShowMobileMenu(false); }} className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-900">My Events & Participants</button>
              <button onClick={() => { setActiveTab('create_event'); setShowMobileMenu(false); }} className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-orange-400 font-semibold hover:bg-slate-900">+ Create Event</button>
              <button onClick={() => { setActiveTab('checkin'); setShowMobileMenu(false); }} className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-900">QR Check-in Scanner</button>
            </>
          )}

          {currentUser.role === 'admin' && (
            <>
              <button onClick={() => { setActiveTab('dashboard'); setShowMobileMenu(false); }} className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-900">Admin Dashboard</button>
              <button onClick={() => { setActiveTab('users'); setShowMobileMenu(false); }} className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-900">User Management</button>
              <button onClick={() => { setActiveTab('all_events'); setShowMobileMenu(false); }} className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-900">Event Moderation</button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
