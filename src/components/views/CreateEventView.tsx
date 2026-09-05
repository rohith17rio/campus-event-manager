import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import type { User, EventCategory, EventType, EventMode, EventStatus } from '../../types';
import { db } from '../../services/db';
import { useToast } from '../common/Toast';

interface CreateEventViewProps {
  currentUser: User;
  editEventId?: string;
  onBack: () => void;
  onSuccess: () => void;
}

const PRESET_BANNERS = [
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=800&q=80'
];

export const CreateEventView: React.FC<CreateEventViewProps> = ({
  currentUser,
  editEventId,
  onBack,
  onSuccess
}) => {
  const { showToast } = useToast();
  const existingEvt = editEventId ? db.getEventById(editEventId) : undefined;

  const [title, setTitle] = useState(existingEvt?.title || '');
  const [description, setDescription] = useState(existingEvt?.description || '');
  const [category, setCategory] = useState<EventCategory>(existingEvt?.category || 'AI/ML');
  const [department, setDepartment] = useState(existingEvt?.department || currentUser.department || 'Computer Science');
  const [eventType] = useState<EventType>(existingEvt?.event_type || 'workshop');
  const [mode, setMode] = useState<EventMode>(existingEvt?.mode || 'offline');
  const [bannerUrl, setBannerUrl] = useState(existingEvt?.banner_url || PRESET_BANNERS[0]);
  const [eventDate, setEventDate] = useState(existingEvt?.event_date || '2026-09-01');
  const [startTime, setStartTime] = useState(existingEvt?.start_time || '10:00');
  const [endTime, setEndTime] = useState(existingEvt?.end_time || '13:00');
  const [location, setLocation] = useState(existingEvt?.location || 'Auditorium Hall A');
  const [meetingLink] = useState(existingEvt?.meeting_link || '');
  const [maxParticipants, setMaxParticipants] = useState(existingEvt?.max_participants || 50);
  const [registrationDeadline] = useState(existingEvt?.registration_deadline || '2026-08-31T23:59');
  const [registrationFee, setRegistrationFee] = useState(existingEvt?.registration_fee || 0);
  const [eligibility] = useState(existingEvt?.eligibility || 'Open to all students');
  const [contactName] = useState(existingEvt?.contact_name || currentUser.full_name);
  const [contactEmail] = useState(existingEvt?.contact_email || currentUser.email);
  const [contactPhone] = useState(existingEvt?.contact_phone || '+1 (555) 019-2831');
  const [allowWaitlist, setAllowWaitlist] = useState(existingEvt?.allow_waitlist ?? true);
  const [status] = useState<EventStatus>(existingEvt?.status || 'published');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Validation Error', 'Please fill out event title and description.', 'error');
      return;
    }

    if (editEventId) {
      db.updateEvent(editEventId, {
        title,
        description,
        category,
        department,
        event_type: eventType,
        mode,
        banner_url: bannerUrl,
        event_date: eventDate,
        start_time: startTime,
        end_time: endTime,
        location,
        meeting_link: meetingLink,
        max_participants: Number(maxParticipants),
        registration_deadline: registrationDeadline,
        registration_fee: Number(registrationFee),
        eligibility,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        allow_waitlist: allowWaitlist,
        status
      });
      showToast('Event Updated', `"${title}" has been updated successfully.`, 'success');
    } else {
      db.createEvent({
        organizer_id: currentUser.id,
        organizer_name: currentUser.full_name,
        title,
        description,
        category,
        department,
        event_type: eventType,
        mode,
        banner_url: bannerUrl,
        event_date: eventDate,
        start_time: startTime,
        end_time: endTime,
        location,
        meeting_link: meetingLink,
        max_participants: Number(maxParticipants),
        registration_deadline: registrationDeadline,
        registration_fee: Number(registrationFee),
        eligibility,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        allow_waitlist: allowWaitlist,
        status
      });
      showToast('Event Created 🎉', `"${title}" is now live and published!`, 'success');
    }

    onSuccess();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <h1 className="text-xl font-bold text-white font-heading">
          {editEventId ? 'Edit Campus Event' : 'Create New Campus Event'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Information */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider font-heading">1. Basic Information</h3>
          
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Event Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AI & Machine Learning Workshop 2026"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EventCategory)}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:border-orange-500"
                >
                  <option value="AI/ML">AI/ML</option>
                  <option value="Web Dev">Web Dev</option>
                  <option value="Coding">Coding</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Management">Management</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Detailed Description *</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe key takeaways, agenda, speakers, and requirements..."
                className="w-full p-4 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Schedule & Location */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-heading">2. Schedule & Venue</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Event Date</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Event Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as EventMode)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
              >
                <option value="offline">Offline / On-Campus</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Location / Venue</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Auditorium Hall A"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100"
              />
            </div>
          </div>
        </div>

        {/* Capacity & Waitlist Settings */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider font-heading">3. Capacity & Waitlist Settings</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Max Capacity (Seats)</label>
              <input
                type="number"
                min={1}
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Registration Fee ($)</label>
              <input
                type="number"
                min={0}
                value={registrationFee}
                onChange={(e) => setRegistrationFee(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100"
              />
            </div>

            <div className="flex items-center space-x-3 pt-5">
              <input
                type="checkbox"
                id="waitlistToggle"
                checked={allowWaitlist}
                onChange={(e) => setAllowWaitlist(e.target.checked)}
                className="w-4 h-4 text-orange-600 rounded bg-slate-900 border-slate-700"
              />
              <label htmlFor="waitlistToggle" className="text-xs font-semibold text-slate-200 cursor-pointer">
                Enable Smart Waitlist Queue
              </label>
            </div>
          </div>
        </div>

        {/* Banner Preset Selector with Lazy Loading */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-heading">4. Select Event Banner</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PRESET_BANNERS.map((url, idx) => (
              <div
                key={idx}
                onClick={() => setBannerUrl(url)}
                className={`aspect-[16/9] rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                  bannerUrl === url ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={url} alt="" loading="lazy" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 bg-slate-900 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-800 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 text-white font-bold text-xs rounded-xl shadow-glow-orange hover:brightness-110 flex items-center space-x-2 cursor-pointer font-heading"
          >
            <Save className="w-4 h-4" />
            <span>{editEventId ? 'Save Changes' : 'Publish Event'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
