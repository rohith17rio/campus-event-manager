import React from 'react';
import { Calendar, Users, QrCode, Plus, CheckCircle2 } from 'lucide-react';
import type { User } from '../../types';
import { db } from '../../services/db';
import { useToast } from '../common/Toast';

interface OrganizerDashboardProps {
  currentUser: User;
  onNavigate: (tab: string, eventId?: string) => void;
  onRefresh: () => void;
}

export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({
  currentUser,
  onNavigate,
  onRefresh
}) => {
  const { showToast } = useToast();
  const events = db.getAllEvents().filter(e => e.organizer_id === currentUser.id);

  let totalRegs = 0;
  let totalAttended = 0;
  events.forEach(evt => {
    const regCount = db.getEventConfirmedRegistrationCount(evt.id);
    totalRegs += regCount;
    const attCount = db.getAttendanceByEvent(evt.id).length;
    totalAttended += attCount;
  });

  const avgAttendancePct = totalRegs > 0 ? Math.round((totalAttended / totalRegs) * 100) : 0;

  const handleDeleteEvent = (eventId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      db.deleteEvent(eventId);
      showToast('Event Deleted', `"${title}" has been removed.`, 'info');
      onRefresh();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-heading tracking-tight">Organizer Control Center</h1>
          <p className="text-xs text-slate-400 mt-1">Manage events, track live registration rosters, scan QR passes & issue credentials.</p>
        </div>

        <button
          onClick={() => onNavigate('create_event')}
          className="px-6 py-3 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 text-white font-bold text-xs rounded-xl shadow-glow-orange hover:brightness-110 flex items-center space-x-2 shrink-0 transition-all cursor-pointer font-heading"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Events Organized</span>
            <div className="p-2 rounded-xl bg-orange-600/20 text-orange-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-heading">{events.length}</p>
          <p className="text-[11px] text-slate-400">Active & completed events</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Registrations</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-heading">{totalRegs}</p>
          <p className="text-[11px] text-slate-400">Total student bookings</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance Rate</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-400 font-heading">{avgAttendancePct}%</p>
          <p className="text-[11px] text-slate-400">Verified QR check-ins</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">QR Scanner</span>
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <button
            onClick={() => onNavigate('checkin')}
            className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold shadow-glow-orange cursor-pointer font-heading"
          >
            Launch Scanner
          </button>
        </div>

      </div>

      {/* Events Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl">
        <h3 className="text-lg font-bold text-slate-100 font-heading">My Organized Events</h3>

        {events.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No events created yet. Click "+ Create New Event" to publish your first campus activity.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">Event Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Capacity</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {events.map((evt) => {
                  const regCount = db.getEventConfirmedRegistrationCount(evt.id);
                  const pct = Math.min(100, Math.round((regCount / evt.max_participants) * 100));

                  return (
                    <tr key={evt.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3 font-semibold text-slate-100 font-heading">{evt.title}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-orange-500/20 text-orange-300 text-[10px] font-bold rounded uppercase">
                          {evt.category}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300">{evt.event_date} ({evt.start_time})</td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-orange-300">{regCount} / {evt.max_participants}</span>
                          <span className="text-[10px] text-slate-400">({pct}%)</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          evt.status === 'published'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {evt.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => onNavigate('participants', evt.id)}
                          className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg text-[11px] shadow-glow-orange cursor-pointer"
                        >
                          Roster & Certs
                        </button>
                        <button
                          onClick={() => onNavigate('edit_event', evt.id)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(evt.id, evt.title)}
                          className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300 rounded-lg text-[11px] cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
