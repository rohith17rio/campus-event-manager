import React, { useState } from 'react';
import { X, QrCode, CheckCircle2, AlertCircle, ShieldCheck, User as UserIcon, Calendar } from 'lucide-react';
import { db } from '../../services/db';
import type { User, EventItem, Registration } from '../../types';

interface QrScannerModalProps {
  organizerUser: User;
  onClose: () => void;
  onCheckInSuccess: () => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  organizerUser,
  onClose,
  onCheckInSuccess
}) => {
  const [tokenInput, setTokenInput] = useState('');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    student?: User;
    event?: EventItem;
    registration?: Registration;
  } | null>(null);

  const handleVerifyToken = (tokenToVerify?: string) => {
    const code = tokenToVerify || tokenInput;
    if (!code.trim()) return;

    const res = db.checkInParticipant(code, organizerUser.id);
    setScanResult(res);

    if (res.success) {
      onCheckInSuccess();
    }
  };

  const sampleRegistrations = db.getStudentRegistrations('user_student_1');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08080a]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg rounded-3xl border border-orange-500/30 shadow-2xl p-6 sm:p-8 relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center shrink-0">
            <QrCode className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 font-heading">Attendance Check-in Scanner</h3>
            <p className="text-xs text-slate-400">Validate participant QR code or enter Registration ID</p>
          </div>
        </div>

        {/* Input & Verification Box */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="e.g. REG-2026-8941 or QR-EVT1-STUDENT1-8941"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-orange-500 font-mono"
            />
            <button
              onClick={() => handleVerifyToken()}
              className="absolute right-2 top-2 px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs rounded-lg transition-colors shadow-glow-orange cursor-pointer"
            >
              Verify Check-in
            </button>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 block mb-2 font-medium">Quick Demo Test Tokens:</span>
            <div className="flex flex-wrap gap-2">
              {sampleRegistrations.map(r => (
                <button
                  key={r.id}
                  onClick={() => {
                    setTokenInput(r.registration_id);
                    handleVerifyToken(r.registration_id);
                  }}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-orange-300 font-mono text-[11px] rounded-md border border-slate-700 cursor-pointer"
                >
                  {r.registration_id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scan Result Feedback Card */}
        {scanResult && (
          <div className={`p-5 rounded-2xl border mb-6 transition-all animate-in zoom-in-95 duration-200 ${
            scanResult.success
              ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-100'
              : 'bg-rose-950/50 border-rose-500/40 text-rose-100'
          }`}>
            <div className="flex items-start space-x-3">
              {scanResult.success ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-7 h-7 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 text-xs space-y-1">
                <h4 className="font-bold text-sm font-heading">{scanResult.message}</h4>
                {scanResult.student && scanResult.event && (
                  <div className="mt-3 pt-3 border-t border-slate-800/60 text-slate-200 space-y-1">
                    <div className="flex items-center space-x-2">
                      <UserIcon className="w-3.5 h-3.5 text-orange-400" />
                      <span className="font-semibold">{scanResult.student.full_name}</span>
                      <span className="text-slate-400">({scanResult.student.department})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{scanResult.event.title}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-400 font-mono text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verified by {organizerUser.full_name}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
        >
          Done
        </button>

      </div>
    </div>
  );
};
