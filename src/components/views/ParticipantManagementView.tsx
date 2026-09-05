import React, { useState } from 'react';
import { ArrowLeft, Award, CheckCircle2, QrCode } from 'lucide-react';
import type { User } from '../../types';
import { db } from '../../services/db';
import { useToast } from '../common/Toast';
import { QrScannerModal } from '../qr/QrScannerModal';

interface ParticipantManagementViewProps {
  currentUser: User;
  selectedEventId?: string;
  onBack: () => void;
  onRefresh: () => void;
}

export const ParticipantManagementView: React.FC<ParticipantManagementViewProps> = ({
  currentUser,
  selectedEventId,
  onBack,
  onRefresh
}) => {
  const { showToast } = useToast();
  const organizerEvents = db.getAllEvents().filter(e => e.organizer_id === currentUser.id);

  const [activeEventId, setActiveEventId] = useState<string>(
    selectedEventId || (organizerEvents[0]?.id || '')
  );
  const [showScanner, setShowScanner] = useState(false);

  const currentEvent = db.getEventById(activeEventId);
  const registrations = activeEventId ? db.getStudentRegistrations().filter(r => r.event_id === activeEventId) : [];
  const attendanceList = activeEventId ? db.getAttendanceByEvent(activeEventId) : [];
  const allUsers = db.getAllUsers();

  const handleToggleCertificate = (studentId: string, currentStatus?: string) => {
    if (!activeEventId) return;
    const newStatus = currentStatus === 'Available' ? 'Not Available' : 'Available';
    db.toggleCertificateAvailability(activeEventId, studentId, newStatus);
    showToast('Certificate Updated', `Certificate status set to "${newStatus}".`, 'success');
    onRefresh();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white font-heading">Participant Roster & Certificates</h1>
            <p className="text-xs text-slate-400">Track check-in status and issue completion certificates.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={activeEventId}
            onChange={(e) => setActiveEventId(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 font-semibold focus:border-orange-500"
          >
            {organizerEvents.map(evt => (
              <option key={evt.id} value={evt.id}>{evt.title}</option>
            ))}
          </select>

          <button
            onClick={() => setShowScanner(true)}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-glow-orange flex items-center space-x-1.5 cursor-pointer font-heading"
          >
            <QrCode className="w-4 h-4" />
            <span>QR Scanner</span>
          </button>
        </div>
      </div>

      {/* Main Roster Card */}
      <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100 font-heading">
            {currentEvent?.title || 'Selected Event Roster'}
          </h3>
          <span className="text-xs text-orange-300 font-bold">
            {registrations.length} Total Registrations
          </span>
        </div>

        {registrations.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No registrations found for this event yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Registration ID</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Check-in Status</th>
                  <th className="p-3 text-right">Certificate Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {registrations.map(reg => {
                  const student = allUsers.find(u => u.id === reg.student_id);
                  const isCheckedIn = attendanceList.some(a => a.student_id === reg.student_id) || reg.checked_in_at;
                  const cert = activeEventId ? db.getEventCertificates(activeEventId).find(c => c.student_id === reg.student_id) : undefined;
                  const certStatus = cert?.status || 'Not Available';

                  return (
                    <tr key={reg.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3 font-semibold text-slate-100 font-heading">{student?.full_name || reg.student_id}</td>
                      <td className="p-3 font-mono text-amber-400">{reg.registration_id}</td>
                      <td className="p-3 text-slate-300">{student?.department || 'Engineering'}</td>
                      <td className="p-3">
                        {isCheckedIn ? (
                          <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded-full flex items-center gap-1 w-max">
                            <CheckCircle2 className="w-3 h-3" /> Checked In
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-semibold rounded-full">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleToggleCertificate(reg.student_id, certStatus)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 ml-auto transition-all cursor-pointer ${
                            certStatus === 'Available'
                              ? 'bg-amber-500 text-slate-950 shadow-glow-gold'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>{certStatus === 'Available' ? 'Issued (Revoke)' : 'Issue Certificate'}</span>
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

      {/* Scanner Modal */}
      {showScanner && (
        <QrScannerModal
          organizerUser={currentUser}
          onClose={() => setShowScanner(false)}
          onCheckInSuccess={() => {
            onRefresh();
          }}
        />
      )}

    </div>
  );
};
