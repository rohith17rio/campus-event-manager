import React from 'react';
import { ShieldCheck, Users, Calendar, Award } from 'lucide-react';
import type { User } from '../../types';
import { db } from '../../services/db';
import { useToast } from '../common/Toast';

interface AdminDashboardProps {
  currentUser: User;
  onRefresh: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser: _currentUser, onRefresh }) => {
  const { showToast } = useToast();
  const users = db.getAllUsers();
  const events = db.getAllEvents();
  const registrations = db.getStudentRegistrations();

  const handleToggleEventStatus = (eventId: string, currentStatus: string, title: string) => {
    const newStatus = currentStatus === 'published' ? 'registration_closed' : 'published';
    db.updateEvent(eventId, { status: newStatus as any });
    showToast('Event Moderated', `"${title}" status updated to ${newStatus}.`, 'info');
    onRefresh();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white font-heading tracking-tight">Central Governance & Admin Console</h1>
        <p className="text-xs text-slate-400 mt-1">Platform metrics, user governance, and global event moderation.</p>
      </div>

      {/* Global Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
            <div className="p-2 rounded-xl bg-orange-600/20 text-orange-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-heading">{users.length}</p>
          <p className="text-[11px] text-slate-400">Students, Organizers & Admins</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Published Events</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-heading">{events.length}</p>
          <p className="text-[11px] text-slate-400">Total campus activities</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registrations</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-400 font-heading">{registrations.length}</p>
          <p className="text-[11px] text-slate-400">Confirmed seats booked</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platform Status</span>
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-amber-400 font-heading">Healthy</p>
          <p className="text-[11px] text-slate-400">Database synced</p>
        </div>
      </div>

      {/* Global Event Moderation Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl">
        <h3 className="text-lg font-bold text-slate-100 font-heading">Global Event Moderation</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Event Title</th>
                <th className="p-3">Organizer</th>
                <th className="p-3">Department</th>
                <th className="p-3">Registrations</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {events.map((evt) => {
                const regCount = db.getEventConfirmedRegistrationCount(evt.id);
                return (
                  <tr key={evt.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3 font-semibold text-slate-100 font-heading">{evt.title}</td>
                    <td className="p-3 text-slate-300">{evt.organizer_name}</td>
                    <td className="p-3 text-slate-400">{evt.department}</td>
                    <td className="p-3 font-bold text-orange-300">{regCount} / {evt.max_participants}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        evt.status === 'published'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}>
                        {evt.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleEventStatus(evt.id, evt.status, evt.title)}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-lg cursor-pointer"
                      >
                        {evt.status === 'published' ? 'Close Registration' : 'Re-open Registration'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
