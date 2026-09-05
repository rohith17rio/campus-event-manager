import React from 'react';
import { Bookmark, Calendar, MapPin } from 'lucide-react';
import type { User } from '../../types';
import { db } from '../../services/db';

interface SavedEventsViewProps {
  currentUser: User;
  onSelectEvent: (eventId: string) => void;
  onRefresh: () => void;
}

export const SavedEventsView: React.FC<SavedEventsViewProps> = ({
  currentUser,
  onSelectEvent,
  onRefresh
}) => {
  const savedList = db.getSavedEvents(currentUser.id);
  const allEvents = db.getAllEvents();

  const savedEventItems = savedList
    .map(s => allEvents.find(e => e.id === s.event_id))
    .filter((e): e is NonNullable<typeof e> => e !== undefined);

  const handleRemoveBookmark = (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    db.toggleSaveEvent(currentUser.id, eventId);
    onRefresh();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white font-heading tracking-tight">Saved Events</h1>
        <p className="text-xs text-slate-400 mt-1">Your bookmarked campus workshops, hackathons, and activities.</p>
      </div>

      {savedEventItems.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 space-y-3">
          <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200 font-heading">No saved events</h3>
          <p className="text-xs text-slate-400">Click the bookmark icon on any event card to save it here for quick access.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedEventItems.map((evt) => (
            <div
              key={evt.id}
              onClick={() => onSelectEvent(evt.id)}
              className="glass-card rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                  <img src={evt.banner_url} alt={evt.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <button
                    onClick={(e) => handleRemoveBookmark(e, evt.id)}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-amber-500 text-slate-950 font-bold shadow-glow-gold hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                    title="Remove Bookmark"
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <div className="p-5 space-y-3">
                  <span className="px-2.5 py-0.5 bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[10px] font-bold rounded uppercase">
                    {evt.category}
                  </span>
                  <h3 className="font-bold text-base text-slate-100 font-heading group-hover:text-orange-300 transition-colors line-clamp-1">{evt.title}</h3>
                  <div className="space-y-1 text-xs text-slate-300">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3.5 h-3.5 text-orange-400" />
                      <span>{evt.event_date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectEvent(evt.id);
                  }}
                  className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-glow-orange transition-all cursor-pointer font-heading"
                >
                  View Details & Register
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
