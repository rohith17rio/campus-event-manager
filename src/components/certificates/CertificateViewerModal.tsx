import React from 'react';
import { X, Award, Download, Printer, ShieldCheck } from 'lucide-react';
import type { Certificate, EventItem, User } from '../../types';

interface CertificateViewerModalProps {
  certificate: Certificate;
  event: EventItem;
  student: User;
  onClose: () => void;
}

export const CertificateViewerModal: React.FC<CertificateViewerModalProps> = ({
  certificate,
  event,
  student,
  onClose
}) => {

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([
      `===================================================\nCAMPUS EVENT MANAGER - CERTIFICATE OF ACHIEVEMENT\n===================================================\n\nThis certifies that:\n  ${student.full_name.toUpperCase()}\n\nhas successfully completed the campus activity:\n  ${event.title.toUpperCase()}\n\nDate: ${event.event_date}\nDepartment: ${event.department}\nOrganizer: ${event.organizer_name}\nCertificate ID: CERT-${event.id.toUpperCase()}-${student.id.toUpperCase()}\nStatus: ${certificate.status}\nIssued At: ${certificate.issued_at || new Date().toISOString()}\n\nVerified by Campus Event Management Authority\n===================================================`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Certificate_${event.title.replace(/\s+/g, '_')}_${student.full_name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08080a]/90 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="glass-panel w-full max-w-3xl rounded-3xl border border-amber-500/40 shadow-2xl p-6 sm:p-10 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Action Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Award className="w-6 h-6 text-amber-400" />
            <h3 className="text-lg font-bold text-slate-100 font-heading">Certificate of Completion</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-orange-600 to-amber-500 text-white text-xs font-bold flex items-center gap-1.5 hover:brightness-110 shadow-glow-orange transition-all cursor-pointer font-heading"
            >
              <Download className="w-3.5 h-3.5" /> Download Certificate
            </button>
          </div>
        </div>

        {/* Certificate Card Render Frame */}
        <div id="certificate-print-area" className="bg-gradient-to-br from-slate-900 via-[#181b24] to-slate-900 border-8 border-amber-900/40 rounded-2xl p-8 sm:p-12 relative shadow-2xl text-center overflow-hidden">
          
          <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-amber-500/60" />
          <div className="absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-amber-500/60" />
          <div className="absolute bottom-3 left-3 w-12 h-12 border-b-2 border-l-2 border-amber-500/60" />
          <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-amber-500/60" />

          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 p-0.5 mx-auto mb-4 shadow-glow-gold">
            <div className="w-full h-full bg-[#08080a] rounded-full flex items-center justify-center">
              <Award className="w-8 h-8 text-amber-400" />
            </div>
          </div>

          <p className="text-xs uppercase tracking-widest text-amber-400 font-extrabold mb-1">
            OFFICIAL CAMPUS CREDENTIAL
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-orange-300 font-heading tracking-wide mb-6">
            CERTIFICATE OF ACHIEVEMENT
          </h2>

          <p className="text-xs text-slate-400 italic mb-2">This is proudly presented to</p>
          <h3 className="text-xl sm:text-2xl font-bold text-orange-300 mb-2 font-heading tracking-wide">
            {student.full_name}
          </h3>
          <p className="text-xs text-slate-300 mb-6">
            {student.department} • {student.college}
          </p>

          <p className="text-xs text-slate-400 max-w-md mx-auto mb-2 leading-relaxed">
            for successfully attending and completing the campus event
          </p>
          <h4 className="text-lg font-bold text-amber-300 max-w-lg mx-auto mb-8 font-heading">
            "{event.title}"
          </h4>

          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-800 text-left max-w-lg mx-auto text-xs">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Event Lead Signature</p>
              <p className="font-semibold text-slate-200 mt-1">{event.organizer_name}</p>
              <p className="text-[10px] text-slate-400">{event.department}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Verification Code</p>
              <p className="font-mono text-orange-400 mt-1">CERT-{event.id.toUpperCase()}-{student.id.substring(0, 6)}</p>
              <p className="text-[10px] text-slate-400">Issued: {certificate.issued_at ? new Date(certificate.issued_at).toLocaleDateString() : event.event_date}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center space-x-1 text-[11px] text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Authenticated & Recorded on Campus Event Ledger</span>
          </div>

        </div>

      </div>
    </div>
  );
};
