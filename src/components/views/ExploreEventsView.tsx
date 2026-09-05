import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Calendar, 
  MapPin, 
  Bookmark, 
  CheckCircle2, 
  Users
} from 'lucide-react';
import type { EventItem, EventCategory, User } from '../../types';
import { db } from '../../services/db';

interface ExploreEventsViewProps {
  events: EventItem[];
  currentUser: User;
  onSelectEvent: (eventId: string) => void;
  onRefresh: () => void;
}

export const ExploreEventsView: React.FC<ExploreEventsViewProps> = ({
  events,
  currentUser,
  onSelectEvent,
  onRefresh
}) => {
  const [searchTermInput, setSearchTermInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [selectedFee, setSelectedFee] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Debounce search input for performance (200ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTermInput);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTermInput]);

  const categories: EventCategory[] = [
    'Technical', 'Coding', 'AI/ML', 'Web Dev', 'Cybersecurity', 'Management', 'Cultural', 'Sports', 'Workshop', 'Hackathon'
  ];

  const departments = Array.from(new Set(events.map(e => e.department)));

  const handleToggleBookmark = (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    db.toggleSaveEvent(currentUser.id, eventId);
    onRefresh();
  };

  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      const q = debouncedSearch.toLowerCase();
      const matchesSearch = 
        !q ||
        evt.title.toLowerCase().includes(q) ||
        evt.description.toLowerCase().includes(q) ||
        evt.organizer_name.toLowerCase().includes(q) ||
        evt.department.toLowerCase().includes(q) ||
        evt.category.toLowerCase().includes(q);

      const matchesCategory = selectedCategory === 'all' || evt.category === selectedCategory;
      const matchesDept = selectedDepartment === 'all' || evt.department === selectedDepartment;
      const matchesMode = selectedMode === 'all' || evt.mode === selectedMode;
      const matchesFee = 
        selectedFee === 'all' ||
        (selectedFee === 'free' && evt.registration_fee === 0) ||
        (selectedFee === 'paid' && evt.registration_fee > 0);

      const matchesStatus = 
        selectedStatus === 'all' ||
        (selectedStatus === 'open' && evt.status === 'published') ||
        (selectedStatus === 'closed' && (evt.status === 'registration_closed' || evt.status === 'completed'));

      return matchesSearch && matchesCategory && matchesDept && matchesMode && matchesFee && matchesStatus;
    });
  }, [events, debouncedSearch, selectedCategory, selectedDepartment, selectedMode, selectedFee, selectedStatus]);

  const hasActiveFilters = 
    searchTermInput !== '' || 
    selectedCategory !== 'all' || 
    selectedDepartment !== 'all' || 
    selectedMode !== 'all' || 
    selectedFee !== 'all' || 
    selectedStatus !== 'all';

  const clearAllFilters = () => {
    setSearchTermInput('');
    setDebouncedSearch('');
    setSelectedCategory('all');
    setSelectedDepartment('all');
    setSelectedMode('all');
    setSelectedFee('all');
    setSelectedStatus('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Search Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-heading tracking-tight">Explore Campus Events</h1>
          <p className="text-xs text-slate-400 mt-1">Discover upcoming workshops, hackathons, seminars, and campus activities.</p>
        </div>

        <div className="w-full md:w-80 relative">
          <input
            type="text"
            value={searchTermInput}
            onChange={(e) => setSearchTermInput(e.target.value)}
            placeholder="Search by event title, organizer, keyword..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-orange-500 shadow-inner"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          {searchTermInput && (
            <button onClick={() => { setSearchTermInput(''); setDebouncedSearch(''); }} className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Multi-Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
            <Filter className="w-4 h-4 text-orange-400" />
            <span>Filter Events</span>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Clear All Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          
          {/* Category Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Event Mode */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Mode</label>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Modes</option>
              <option value="offline">Offline / On-Campus</option>
              <option value="online">Online</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          {/* Fee Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Fee</label>
            <select
              value={selectedFee}
              onChange={(e) => setSelectedFee(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-orange-500"
            >
              <option value="all">Free & Paid</option>
              <option value="free">Free Events Only</option>
              <option value="paid">Paid Events Only</option>
            </select>
          </div>

          {/* Registration Status */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Registration Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Statuses</option>
              <option value="open">Registration Open</option>
              <option value="closed">Closed / Completed</option>
            </select>
          </div>

        </div>
      </div>

      {/* Events Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Showing <strong className="text-white">{filteredEvents.length}</strong> event(s)</span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-3">
            <Search className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-200 font-heading">No events found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">No campus events match your selected filters. Try clearing your search query or filters.</p>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold cursor-pointer font-heading"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt, idx) => {
              const regCount = db.getEventConfirmedRegistrationCount(evt.id);
              const remainingSeats = Math.max(0, evt.max_participants - regCount);
              const pctFilled = Math.min(100, Math.round((regCount / evt.max_participants) * 100));
              const isSaved = db.isEventSaved(currentUser.id, evt.id);
              const isRegistered = db.isStudentRegistered(currentUser.id, evt.id);
              const isWaitlisted = db.isStudentWaitlisted(currentUser.id, evt.id);

              let capacityBadgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
              let capacityBadgeText = 'Seats Available';
              if (pctFilled >= 100) {
                capacityBadgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
                capacityBadgeText = 'Event Full';
              } else if (pctFilled >= 80) {
                capacityBadgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
                capacityBadgeText = 'Almost Full 🔥';
              } else if (pctFilled >= 50) {
                capacityBadgeColor = 'bg-orange-500/20 text-orange-300 border-orange-500/30';
                capacityBadgeText = 'Filling Fast';
              }

              return (
                <div
                  key={evt.id}
                  onClick={() => onSelectEvent(evt.id)}
                  className="glass-card rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    {/* Banner Image with Explicit Aspect Ratio & Lazy Loading */}
                    <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                      <img
                        src={evt.banner_url}
                        alt={evt.title}
                        loading={idx < 3 ? 'eager' : 'lazy'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center space-x-2">
                        <span className="px-2.5 py-1 bg-[#08080a]/85 backdrop-blur-md border border-orange-500/30 rounded-lg text-[10px] font-bold text-amber-300 uppercase">
                          {evt.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${capacityBadgeColor}`}>
                          {capacityBadgeText}
                        </span>
                      </div>

                      {/* Bookmark Button */}
                      <button
                        onClick={(e) => handleToggleBookmark(e, evt.id)}
                        className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                          isSaved
                            ? 'bg-amber-500 text-slate-950 font-bold shadow-glow-gold'
                            : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-900'
                        }`}
                        title={isSaved ? 'Remove Bookmark' : 'Save Event'}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    {/* Content Body */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{evt.department}</span>
                        <span className="font-semibold text-emerald-400">
                          {evt.registration_fee === 0 ? 'FREE' : `$${evt.registration_fee}`}
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-slate-100 group-hover:text-orange-300 transition-colors line-clamp-1 font-heading">
                        {evt.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>

                      <div className="space-y-1.5 text-xs text-slate-300 pt-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-3.5 h-3.5 text-orange-400" />
                          <span>{evt.event_date} ({evt.start_time} - {evt.end_time})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          <span className="truncate">{evt.location}</span>
                        </div>
                      </div>

                      {/* Live Event Capacity Bar */}
                      <div className="pt-2 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-semibold">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Users className="w-3 h-3 text-orange-400" />
                            {regCount} / {evt.max_participants} Seats Filled
                          </span>
                          <span className="text-slate-300">{remainingSeats} left</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`h-full transition-all duration-500 ${
                              pctFilled >= 100 ? 'bg-rose-500' : pctFilled >= 80 ? 'bg-amber-500' : 'bg-gradient-to-r from-orange-500 to-amber-400'
                            }`}
                            style={{ width: `${pctFilled}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-5 pt-0 flex items-center justify-between">
                    <span className="text-xs text-slate-400 truncate">By {evt.organizer_name}</span>

                    {isRegistered ? (
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold rounded-lg flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Registered
                      </span>
                    ) : isWaitlisted ? (
                      <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-lg">
                        Waitlisted
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEvent(evt.id);
                        }}
                        className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow-orange cursor-pointer font-heading"
                      >
                        View & Register
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
