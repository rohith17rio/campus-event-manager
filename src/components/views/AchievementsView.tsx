import React, { useState } from 'react';
import { Award, Eye, ShieldCheck } from 'lucide-react';
import type { User, Certificate, EventItem } from '../../types';
import { db } from '../../services/db';
import { CertificateViewerModal } from '../certificates/CertificateViewerModal';

interface AchievementsViewProps {
  currentUser: User;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ currentUser }) => {
  const [selectedCert, setSelectedCert] = useState<{ cert: Certificate; event: EventItem } | null>(null);

  const certificates = db.getStudentCertificates(currentUser.id);
  const allEvents = db.getAllEvents();

  const certList = certificates.map(cert => {
    const event = allEvents.find(e => e.id === cert.event_id);
    return { cert, event };
  }).filter((item): item is { cert: Certificate; event: EventItem } => item.event !== undefined);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white font-heading tracking-tight">My Achievements & Certificates</h1>
        <p className="text-xs text-slate-400 mt-1">Official verified credentials and certificates of completion for campus activities.</p>
      </div>

      {certList.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 space-y-3">
          <Award className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200 font-heading">No certificates yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Attend completed workshops or hackathons to earn verified digital credentials issued by organizers.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certList.map(({ cert, event }) => (
            <div
              key={cert.id}
              className="glass-card rounded-2xl p-6 border border-amber-500/30 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded uppercase">
                    Official Credential
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    cert.status === 'Available'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : cert.status === 'Processing'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {cert.status}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-100 font-heading">{event.title}</h3>
                <p className="text-xs text-slate-400">Issued by {event.organizer_name} • {event.department}</p>
                
                <div className="pt-2 text-xs text-emerald-400 flex items-center space-x-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Attendance Verified</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                {cert.status === 'Available' ? (
                  <button
                    onClick={() => setSelectedCert({ cert, event })}
                    className="w-full py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-glow-orange hover:brightness-110 transition-all cursor-pointer font-heading"
                  >
                    <Eye className="w-4 h-4" /> View & Download Certificate
                  </button>
                ) : (
                  <div className="text-center text-xs text-slate-400 py-2">
                    Certificate generation in progress
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Viewer Modal */}
      {selectedCert && (
        <CertificateViewerModal
          certificate={selectedCert.cert}
          event={selectedCert.event}
          student={currentUser}
          onClose={() => setSelectedCert(null)}
        />
      )}

    </div>
  );
};
