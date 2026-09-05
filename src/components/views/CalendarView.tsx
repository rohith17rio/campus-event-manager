import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { EventItem, User } from '../../types';
import { db } from '../../services/db';

interface CalendarViewProps {
  events: EventItem[];
  currentUser: User;
  onSelectEvent: (eventId: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  currentUser,
  onSelectEvent
}) => {
  const [currentMonth] = useState('August 2026');

  // Days in August 2026 (starting Saturday)
  const daysInAug = Array.from({ length: 31 }, (_, i) => i + 1);

  const getEventsForDay = (dayNum: number) => {
    const dayStr = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    const targetDate = `2026-08-${dayStr}`;
    return events.filter(e => e.event_date === targetDate);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-heading tracking-tight">Interactive Campus Calendar</h1>
          <p className="text-xs text-slate-400 mt-1">View campus schedule, workshops, hackathons, and deadlines.</p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl text-xs">
          <button className="p-2 hover:bg-slate-800 text-slate-300 rounded-xl transition-colors cursor-pointer">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-slate-100 font-heading px-2">{currentMonth}</span>
          <button className="p-2 hover:bg-slate-800 text-slate-300 rounded-xl transition-colors cursor-pointer">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl">
        
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Calendar Matrix */}
        <div className="grid grid-cols-7 gap-2">
          {/* Offset for Aug 1 2026 (Starts Saturday, so 6 blank cells) */}
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={`blank_${idx}`} className="h-28 bg-[#08080a]/30 rounded-2xl border border-slate-900/60" />
          ))}

          {daysInAug.map((dayNum) => {
            const dayEvts = getEventsForDay(dayNum);
            const isToday = dayNum === 24;

            return (
              <div
                key={`day_${dayNum}`}
                className={`h-28 p-2 rounded-2xl border flex flex-col justify-between transition-all ${
                  isToday
                    ? 'bg-orange-950/40 border-orange-500/60 ring-2 ring-orange-500/30'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-orange-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-extrabold ${isToday ? 'text-amber-400' : 'text-slate-300'}`}>
                    {dayNum}
                  </span>
                  {dayEvts.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </div>

                <div className="space-y-1 overflow-y-auto max-h-16 pr-0.5 no-scrollbar">
                  {dayEvts.map((evt) => {
                    const isReg = db.isStudentRegistered(currentUser.id, evt.id);
                    return (
                      <div
                        key={evt.id}
                        onClick={() => onSelectEvent(evt.id)}
                        className={`p-1 rounded text-[10px] truncate cursor-pointer transition-all ${
                          isReg
                            ? 'bg-orange-600 text-white font-bold shadow'
                            : 'bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                        title={evt.title}
                      >
                        {evt.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
