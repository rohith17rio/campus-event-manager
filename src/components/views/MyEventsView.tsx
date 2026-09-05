import React, { useState } from 'react';
import { Calendar, QrCode, XCircle } from 'lucide-react';
import type { User } from '../../types';
import { db } from '../../services/db';
import { useToast } from '../common/Toast';
import { QrModal } from '../qr/QrModal';

interface MyEventsViewProps {
  currentUser: User;
  onSelectEvent: (eventId: string) => void;
  onRefresh: () => void;
}

export const MyEventsView: React.FC<MyEventsViewProps> = ({
  currentUser,
  onSelectEvent,
  onRefresh
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'registered' | 'waitlisted' | 'history'>('registered');
  const [selectedQrEventId, setSelectedQrEventId] = useState<string | null>(null);

  const registrations = db.getStudentRegistrations(currentUser.id);
  const allEvents = db.getAllEvents();
  const waitlists = db.getAllEvents().filter(e => db.isStudentWaitlisted(currentUser.id, e.id));

  const confirmedEvents = registrations
    .filter(r => r.status === 'Confirmed')
    .map(r => ({ reg: r, event: allEvents.find(e => e.id === r.event_id) }))
    .filter((item): item is { reg: typeof item.reg; event: NonNullable<typeof item.event> } => item.event !== undefined);

  const handleCancelRegistration = (eventId: string, title: string) => {
    const res = db.cancelRegistration(currentUser.id, eventId);
    if (res.success) {
      if (res.promotedStudentName) {
        showToast('Cancelled & Promoted', `Your seat was given to waitlisted student ${res.promotedStudentName}.`, 'info');
      } else {
        showToast('Registration Cancelled', `You cancelled your registration for "${title}".`, 'info');
      }
      onRefresh();
    }
  };

  const selectedQrEvt = selectedQrEventId ? db.getEventById(selectedQrEventId) : undefined;
  const selectedQrReg = selectedQrEventId ? registrations.find(r => r.event_id === selectedQrEventId && r.status === 'Confirmed') : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white font-heading tracking-tight">My Registered Events</h1>
        <p className="text-xs text-slate-400 mt-1">Manage your active event passes, QR check-in tokens, and waitlists.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('registered')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'registered'
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Confirmed Registrations ({confirmedEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('waitlisted')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'waitlisted'
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Waitlisted Queue ({waitlists.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'registered' && (
        confirmedEvents.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 space-y-3">
            <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-200 font-heading">No confirmed registrations</h3>
            <p className="text-xs text-slate-400">Explore events and register to view your entry passes here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {confirmedEvents.map(({ reg, event }) => (
              <div key={reg.id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-2 cursor-pointer" onClick={() => onSelectEvent(event.id)}>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[10px] font-bold rounded uppercase">
                      {event.category}
                    </span>
                    <span className="font-mono text-xs text-amber-400 font-bold">{reg.registration_id}</span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-100 font-heading group-hover:text-orange-300 transition-colors">{event.title}</h3>
                  <p className="text-xs text-slate-400">{event.event_date} ({event.start_time} - {event.end_time}) • {event.location}</p>
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedQrEventId(event.id)}
                    className="flex-1 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-glow-orange hover:brightness-110 transition-all cursor-pointer font-heading"
                  >
                    <QrCode className="w-4 h-4" /> View QR Pass
                  </button>
                  <button
                    onClick={() => handleCancelRegistration(event.id, event.title)}
                    className="px-3.5 py-2.5 bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === 'waitlisted' && (
        waitlists.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800">
            <p className="text-xs text-slate-400">You are not currently on any event waitlists.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {waitlists.map(event => (
              <div key={event.id} className="glass-card rounded-2xl p-6 border border-amber-500/30 space-y-3 cursor-pointer" onClick={() => onSelectEvent(event.id)}>
                <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded uppercase">
                  Waitlisted Queue Position #{db.getWaitlistPosition(currentUser.id, event.id) || 1}
                </span>
                <h3 className="font-bold text-base text-slate-100 font-heading">{event.title}</h3>
                <p className="text-xs text-slate-400">You will be automatically promoted when a seat opens up.</p>
              </div>
            ))}
          </div>
        )
      )}

      {/* QR Pass Modal */}
      {selectedQrEventId && selectedQrEvt && selectedQrReg && (
        <QrModal
          registration={selectedQrReg}
          event={selectedQrEvt}
          student={currentUser}
          onClose={() => setSelectedQrEventId(null)}
        />
      )}

    </div>
  );
};
