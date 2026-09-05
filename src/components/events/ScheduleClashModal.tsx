import React from 'react';
import { AlertTriangle, Calendar, Clock, MapPin, X } from 'lucide-react';
import type { EventItem } from '../../types';

interface ScheduleClashModalProps {
  existingEvent: EventItem;
  targetEvent: EventItem;
  onClose: () => void;
  onProceed: () => void;
}

export const ScheduleClashModal: React.FC<ScheduleClashModalProps> = ({
  existingEvent,
  targetEvent,
  onClose,
  onProceed
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08080a]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-xl rounded-3xl border border-amber-500/40 shadow-2xl p-6 sm:p-8 relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 font-heading">
              Schedule Conflict Detected
            </h2>
            <p className="text-xs text-amber-300/90 mt-0.5">
              The selected event overlaps in time with an event you are already registered for.
            </p>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="space-y-4 mb-8">

          {/* Existing Event Card */}
          <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-slate-800 text-slate-300 text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Existing Registration
            </div>
            <h4 className="font-semibold text-sm text-orange-300 pr-24 font-heading">{existingEvent.title}</h4>
            <div className="mt-2 text-xs text-slate-300 space-y-1">
              <div className="flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5 text-orange-400" />
                <span>{existingEvent.event_date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-medium text-amber-300">{existingEvent.start_time} - {existingEvent.end_time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{existingEvent.location}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center -my-2 z-10">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-widest border border-amber-500/30">
              VS TIME OVERLAP
            </span>
          </div>

          {/* Target Event Card */}
          <div className="bg-orange-950/40 border border-orange-500/40 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Selected Event
            </div>
            <h4 className="font-semibold text-sm text-amber-300 pr-24 font-heading">{targetEvent.title}</h4>
            <div className="mt-2 text-xs text-slate-300 space-y-1">
              <div className="flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5 text-orange-400" />
                <span>{targetEvent.event_date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-medium text-amber-300">{targetEvent.start_time} - {targetEvent.end_time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{targetEvent.location}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            Go Back & Select Another
          </button>
          <button
            onClick={onProceed}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:brightness-110 text-xs font-bold shadow-lg transition-all cursor-pointer font-heading"
          >
            Proceed Anyway
          </button>
        </div>

      </div>
    </div>
  );
};
