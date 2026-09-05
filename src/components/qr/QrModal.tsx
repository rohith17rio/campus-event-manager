import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, CheckCircle, Calendar, MapPin, Clock, ShieldCheck } from 'lucide-react';
import type { Registration, EventItem, User } from '../../types';

interface QrModalProps {
  registration: Registration;
  event: EventItem;
  student: User;
  onClose: () => void;
}

export const QrModal: React.FC<QrModalProps> = ({
  registration,
  event,
  student,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08080a]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md rounded-3xl border border-orange-500/30 shadow-2xl p-6 sm:p-8 relative text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="mb-6">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Entry Pass Verified
          </span>
          <h3 className="text-xl font-bold text-slate-100 mt-2 font-heading">{event.title}</h3>
          <p className="text-xs text-slate-400 mt-1">{student.full_name} • {student.department}</p>
        </div>

        {/* QR Code Card Box */}
        <div className="bg-white p-6 rounded-2xl shadow-glow-orange inline-block mx-auto mb-6 border-4 border-orange-500/30">
          <QRCodeSVG
            value={registration.qr_token}
            size={180}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Token details */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 mb-6 font-mono text-xs text-orange-300 flex items-center justify-between">
          <span className="text-slate-400 font-sans">Reg ID:</span>
          <span className="font-bold">{registration.registration_id}</span>
        </div>

        {/* Event Quick Specs */}
        <div className="text-left text-xs text-slate-300 space-y-2 mb-6 bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-orange-400" />
            <span>{event.event_date}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{event.start_time} - {event.end_time}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>{event.location}</span>
          </div>
          {registration.checked_in_at && (
            <div className="flex items-center space-x-2 text-emerald-400 font-medium pt-1 border-t border-slate-800">
              <ShieldCheck className="w-4 h-4" />
              <span>Checked in at {new Date(registration.checked_in_at).toLocaleTimeString()}</span>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition-all shadow-glow-orange cursor-pointer font-heading"
        >
          Close Pass
        </button>

      </div>
    </div>
  );
};
