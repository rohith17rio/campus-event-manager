import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Bookmark, 
  CheckCircle2, 
  Mail, 
  Phone, 
  User as UserIcon, 
  QrCode, 
  Star, 
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import type { User, ScheduleConflict } from '../../types';
import { db } from '../../services/db';
import { useToast } from '../common/Toast';
import { ScheduleClashModal } from '../events/ScheduleClashModal';
import { QrModal } from '../qr/QrModal';

interface EventDetailViewProps {
  eventId: string;
  currentUser: User;
  onBack: () => void;
  onRefresh: () => void;
}

export const EventDetailView: React.FC<EventDetailViewProps> = ({
  eventId,
  currentUser,
  onBack,
  onRefresh
}) => {
  const { showToast } = useToast();
  const event = db.getEventById(eventId);

  const [clashData, setClashData] = useState<ScheduleConflict | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-100 font-heading">Event not found</h2>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-semibold">
          Back to Events
        </button>
      </div>
    );
  }

  const regCount = db.getEventConfirmedRegistrationCount(event.id);
  const remainingSeats = Math.max(0, event.max_participants - regCount);
  const pctFilled = Math.min(100, Math.round((regCount / event.max_participants) * 100));
  const isSaved = db.isEventSaved(currentUser.id, event.id);
  const isRegistered = db.isStudentRegistered(currentUser.id, event.id);
  const isWaitlisted = db.isStudentWaitlisted(currentUser.id, event.id);
  const waitlistPos = db.getWaitlistPosition(currentUser.id, event.id);
  const userRegistration = db.getStudentRegistrations(currentUser.id).find(r => r.event_id === event.id && r.status === 'Confirmed');

  const feedbackList = db.getEventFeedback(event.id);
  const ratingData = db.getEventAverageRating(event.id);
  const eligibilityInfo = db.isStudentEligibleForFeedback(currentUser.id, event.id);

  const handleRegisterClick = () => {
    const conflict = db.checkScheduleConflict(currentUser.id, event);
    if (conflict) {
      setClashData(conflict);
      return;
    }

    executeRegistration();
  };

  const executeRegistration = () => {
    const result = db.registerForEvent(currentUser.id, event.id);
    if (result.success) {
      if (result.waitlisted) {
        showToast('Joined Waitlist', result.message, 'warning');
      } else {
        showToast('Registration Successful 🎉', 'You are officially registered! QR code available.', 'success');
      }
      onRefresh();
    } else {
      showToast('Registration Error', result.message, 'error');
    }
  };

  const handleToggleSave = () => {
    const saved = db.toggleSaveEvent(currentUser.id, event.id);
    showToast(saved ? 'Saved to Bookmarks' : 'Removed from Bookmarks', undefined, 'info');
    onRefresh();
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackComment.trim()) return;

    db.submitFeedback(currentUser.id, event.id, feedbackRating, feedbackComment);
    showToast('Feedback Submitted', 'Thank you for rating this event!', 'success');
    setFeedbackComment('');
    onRefresh();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Back Button & Top Toolbar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </button>

        <button
          onClick={handleToggleSave}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            isSaved
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>{isSaved ? 'Saved Event' : 'Save Event'}</span>
        </button>
      </div>

      {/* Main Grid: Banner & Key Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Banner, Overview & Specs */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Banner Box with explicit aspect ratio */}
          <div className="relative aspect-[16/9] sm:h-96 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
            <img
              src={event.banner_url}
              alt={event.title}
              loading="eager"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-orange-600/90 backdrop-blur-md text-white text-xs font-bold rounded-lg uppercase">
                  {event.category}
                </span>
                <span className="px-3 py-1 bg-slate-900/80 backdrop-blur-md text-slate-200 text-xs font-medium rounded-lg border border-slate-800">
                  {event.department}
                </span>
                <span className="px-3 py-1 bg-amber-600/90 backdrop-blur-md text-white text-xs font-semibold rounded-lg uppercase">
                  {event.mode}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">{event.title}</h1>
            </div>
          </div>

          {/* Description Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-100 font-heading">About This Event</h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>

            <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
              <div>
                <span className="text-slate-400 font-medium block mb-1">Eligibility Criteria</span>
                <p className="font-semibold text-slate-200">{event.eligibility}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium block mb-1">Registration Fee</span>
                <p className="font-semibold text-emerald-400">{event.registration_fee === 0 ? 'Free Entry' : `$${event.registration_fee}`}</p>
              </div>
            </div>
          </div>

          {/* Event Feedback & Ratings Section */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-orange-400" />
                <h3 className="text-lg font-bold text-slate-100 font-heading">Feedback & Ratings</h3>
              </div>
              {ratingData.count > 0 && (
                <div className="flex items-center space-x-1.5 px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full text-xs font-bold">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{ratingData.average} / 5.0</span>
                  <span className="text-slate-400 font-normal">({ratingData.count})</span>
                </div>
              )}
            </div>

            {/* Eligible Feedback Form */}
            {eligibilityInfo.eligible ? (
              <form onSubmit={handleFeedbackSubmit} className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="font-semibold text-xs text-slate-200">Leave Your Event Rating & Feedback</h4>
                
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star className={`w-6 h-6 ${star <= feedbackRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-slate-300">{feedbackRating} Stars</span>
                </div>

                <textarea
                  rows={3}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Share your experience, takeaways, or suggestions..."
                  className="w-full p-3 bg-[#08080a] border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-orange-500"
                />

                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-semibold shadow-glow-orange cursor-pointer"
                >
                  Submit Feedback
                </button>
              </form>
            ) : (
              <p className="text-xs text-slate-400 italic bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                {eligibilityInfo.reason || 'Only verified attendees can submit feedback after event completion.'}
              </p>
            )}

            {/* Feedback Comments Roster */}
            <div className="space-y-3 pt-2">
              {feedbackList.length === 0 ? (
                <p className="text-xs text-slate-400">No feedback entries submitted yet.</p>
              ) : (
                feedbackList.map((fb) => (
                  <div key={fb.id} className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{fb.student_name || 'Student Participant'}</span>
                      <div className="flex items-center text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                        <span className="font-bold">{fb.rating}</span>
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{fb.comment}</p>
                    <span className="text-[10px] text-slate-500 block pt-1">{new Date(fb.created_at).toLocaleDateString()}</span>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

        {/* Right Column: Registration Card & Live Capacity Tracker */}
        <div className="space-y-6">

          {/* Registration Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 shadow-2xl sticky top-24">
            
            {/* Live Capacity Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-orange-400" />
                  Live Event Capacity
                </span>
                <span className="text-orange-400">{regCount} / {event.max_participants}</span>
              </div>

              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full transition-all duration-500 ${
                    pctFilled >= 100 ? 'bg-rose-500' : pctFilled >= 80 ? 'bg-amber-500' : 'bg-gradient-to-r from-orange-500 to-amber-400'
                  }`}
                  style={{ width: `${pctFilled}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>{remainingSeats} seats available</span>
                <span>{pctFilled}% filled</span>
              </div>
            </div>

            {/* Key Schedule Specs */}
            <div className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-200">
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-orange-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Date</span>
                  <span className="font-semibold">{event.event_date}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Time Schedule</span>
                  <span className="font-semibold">{event.start_time} - {event.end_time}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Venue / Location</span>
                  <span className="font-semibold">{event.location}</span>
                </div>
              </div>

              {event.meeting_link && (
                <div className="flex items-center space-x-3 text-orange-300">
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  <a href={event.meeting_link} target="_blank" rel="noreferrer" className="underline truncate">
                    Join Online Meeting Link
                  </a>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Registration Deadline</span>
                  <span className="font-semibold text-amber-300">
                    {new Date(event.registration_deadline).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Registration State Actions */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              
              {isRegistered ? (
                <div className="space-y-2">
                  <div className="w-full py-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Already Registered
                  </div>
                  {userRegistration && (
                    <button
                      onClick={() => setShowQrModal(true)}
                      className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-500 hover:brightness-110 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-glow-orange transition-all cursor-pointer"
                    >
                      <QrCode className="w-4 h-4" /> View Entry QR Pass
                    </button>
                  )}
                </div>
              ) : isWaitlisted ? (
                <div className="p-4 bg-amber-950/60 border border-amber-500/40 rounded-xl text-center text-xs space-y-1">
                  <span className="font-bold text-amber-300 block">Waitlist Queue Position #{waitlistPos || 1}</span>
                  <p className="text-amber-200/80 text-[11px]">You will be automatically promoted if a seat opens up.</p>
                </div>
              ) : remainingSeats === 0 ? (
                event.allow_waitlist ? (
                  <button
                    onClick={handleRegisterClick}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold text-xs rounded-xl hover:brightness-110 shadow-lg transition-all cursor-pointer"
                  >
                    Event Full → Join Waitlist Queue
                  </button>
                ) : (
                  <div className="w-full py-3 bg-slate-900 border border-slate-800 text-slate-400 text-center font-semibold text-xs rounded-xl">
                    Event Full (Registration Closed)
                  </div>
                )
              ) : (
                <button
                  onClick={handleRegisterClick}
                  className="w-full py-3.5 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 text-white font-bold text-sm rounded-xl hover:brightness-110 shadow-glow-orange transition-all cursor-pointer font-heading"
                >
                  Register Now 🎉
                </button>
              )}

            </div>

            {/* Organizer Contact Info Card */}
            <div className="pt-4 border-t border-slate-800 text-xs space-y-2">
              <span className="text-slate-400 font-semibold block">Organizer Contact Details</span>
              <div className="flex items-center space-x-2 text-slate-300">
                <UserIcon className="w-3.5 h-3.5 text-orange-400" />
                <span>{event.contact_name}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>{event.contact_email}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-orange-400" />
                <span>{event.contact_phone}</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Schedule Clash Warning Modal */}
      {clashData && (
        <ScheduleClashModal
          existingEvent={clashData.existingEvent}
          targetEvent={clashData.targetEvent}
          onClose={() => setClashData(null)}
          onProceed={() => {
            setClashData(null);
            executeRegistration();
          }}
        />
      )}

      {/* QR Code Pass Modal */}
      {showQrModal && userRegistration && (
        <QrModal
          registration={userRegistration}
          event={event}
          student={currentUser}
          onClose={() => setShowQrModal(false)}
        />
      )}

    </div>
  );
};
