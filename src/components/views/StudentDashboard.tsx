import React from 'react';
import { 
  Calendar, 
  Bookmark, 
  Award, 
  QrCode, 
  Activity, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import type { User } from '../../types';
import { db } from '../../services/db';

interface StudentDashboardProps {
  currentUser: User;
  onSelectEvent: (eventId: string) => void;
  onNavigate: (tab: string) => void;
  onOpenQr: (eventId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  onSelectEvent,
  onNavigate,
  onOpenQr
}) => {
  const registrations = db.getStudentRegistrations(currentUser.id).filter(r => r.status === 'Confirmed');
  const savedEvents = db.getSavedEvents(currentUser.id);
  const certificates = db.getStudentCertificates(currentUser.id).filter(c => c.status === 'Available');
  const activityFeed = db.getActivityFeed().slice(0, 5);

  const allEvents = db.getAllEvents();
  const registeredEvtIds = registrations.map(r => r.event_id);
  const upcomingEvents = allEvents.filter(e => registeredEvtIds.includes(e.id) && e.status === 'published');
  const recommendedEvents = allEvents.filter(e => !registeredEvtIds.includes(e.id) && e.status === 'published').slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-orange-500/30 relative overflow-hidden bg-gradient-to-r from-orange-950/70 via-slate-900 to-amber-950/40 shadow-glow-orange">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-bold rounded-full uppercase tracking-wider">
              Student Dashboard
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading mt-2">
              Welcome back, {currentUser.full_name}! 👋
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              {currentUser.department} • {currentUser.college} ({currentUser.academic_year})
            </p>
          </div>

          <button
            onClick={() => onNavigate('explore')}
            className="px-6 py-3 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-glow-orange flex items-center space-x-2 transition-all cursor-pointer font-heading"
          >
            <span>Explore All Events</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Events</span>
            <div className="p-2 rounded-xl bg-orange-600/20 text-orange-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-heading">{registrations.length}</p>
          <p className="text-[11px] text-slate-400">Confirmed seats booked</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saved Bookmarks</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-heading">{savedEvents.length}</p>
          <p className="text-[11px] text-slate-400">Events saved for later</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Certificates Earned</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-heading">{certificates.length}</p>
          <p className="text-[11px] text-slate-400">Verified digital credentials</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Status</span>
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-400 font-heading">Active</p>
          <p className="text-[11px] text-slate-400">Schedule in good standing</p>
        </div>

      </div>

      {/* Main Grid: My Upcoming Events & Campus Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upcoming Events Column */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-100 font-heading">My Upcoming Registered Events</h3>
            <button
              onClick={() => onNavigate('my_events')}
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 cursor-pointer"
            >
              View all ({registrations.length}) →
            </button>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="glass-panel p-8 text-center rounded-2xl border border-slate-800 space-y-3">
              <Calendar className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">No registered upcoming events yet.</p>
              <button
                onClick={() => onNavigate('explore')}
                className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-semibold"
              >
                Browse Events
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => onSelectEvent(evt.id)}
                  className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-1.5">
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-orange-500/20 text-orange-300 rounded uppercase">
                      {evt.category}
                    </span>
                    <h4 className="font-bold text-base text-slate-100 font-heading">{evt.title}</h4>
                    <p className="text-xs text-slate-400">
                      {evt.event_date} ({evt.start_time} - {evt.end_time}) • {evt.location}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenQr(evt.id);
                    }}
                    className="px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-xs rounded-xl shadow-glow-orange flex items-center space-x-2 shrink-0 cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>View QR Pass</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Recommended Events */}
          <div className="pt-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-100 font-heading">Recommended For You</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recommendedEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => onSelectEvent(evt.id)}
                  className="glass-card p-4 rounded-xl border border-slate-800 space-y-2 cursor-pointer"
                >
                  <div className="aspect-[16/9] rounded-lg overflow-hidden bg-slate-900">
                    <img src={evt.banner_url} alt={evt.title} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[9px] font-bold text-amber-300 uppercase block">{evt.category}</span>
                  <h5 className="font-bold text-xs text-slate-100 line-clamp-1 font-heading">{evt.title}</h5>
                  <p className="text-[11px] text-slate-400">{evt.event_date}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Live Campus Activity Feed */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-slate-100 font-heading">Campus Activity Feed</h3>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            {activityFeed.map((item) => (
              <div key={item.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-orange-300">{item.title}</span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-300 leading-snug">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
