import React, { useState, useEffect } from 'react';
import type { User, UserRole, EventItem, NotificationItem } from './types';
import { db } from './services/db';
import { ToastProvider } from './components/common/Toast';
import { Header } from './components/common/Header';

// Views
import { LandingPage } from './components/views/LandingPage';
import { ExploreEventsView } from './components/views/ExploreEventsView';
import { EventDetailView } from './components/views/EventDetailView';
import { StudentDashboard } from './components/views/StudentDashboard';
import { MyEventsView } from './components/views/MyEventsView';
import { CalendarView } from './components/views/CalendarView';
import { SavedEventsView } from './components/views/SavedEventsView';
import { AchievementsView } from './components/views/AchievementsView';
import { OrganizerDashboard } from './components/views/OrganizerDashboard';
import { CreateEventView } from './components/views/CreateEventView';
import { ParticipantManagementView } from './components/views/ParticipantManagementView';
import { AdminDashboard } from './components/views/AdminDashboard';
import { AuthModal } from './components/views/AuthModal';
import { AiAssistantModal } from './components/ai/AiAssistantModal';
import { QrModal } from './components/qr/QrModal';

const MainAppContent: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>(db.getCurrentUser());
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);

  // Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [selectedQrPassEvtId, setSelectedQrPassEvtId] = useState<string | null>(null);

  const refreshState = () => {
    setCurrentUser(db.getCurrentUser());
    setEvents(db.getAllEvents());
    setNotifications(db.getUserNotifications(currentUser.id));
  };

  useEffect(() => {
    refreshState();
  }, [currentUser.id]);

  const handleRoleSwitch = (role: UserRole) => {
    const allUsers = db.getAllUsers();
    const targetUser = allUsers.find(u => u.role === role);
    if (targetUser) {
      db.setCurrentUserId(targetUser.id);
      setCurrentUser(targetUser);
      setNotifications(db.getUserNotifications(targetUser.id));
      setActiveTab(role === 'student' ? 'dashboard' : role === 'organizer' ? 'dashboard' : 'dashboard');
    }
  };

  const handleSelectEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    setActiveTab('event_detail');
  };

  const qrPassEvt = selectedQrPassEvtId ? db.getEventById(selectedQrPassEvtId) : undefined;
  const qrPassReg = selectedQrPassEvtId
    ? db.getStudentRegistrations(currentUser.id).find(r => r.event_id === selectedQrPassEvtId && r.status === 'Confirmed')
    : undefined;

  return (
    <div className="min-h-screen bg-[#08080a] text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Top Header Navigation */}
      {activeTab !== 'landing' && (
        <Header
          currentUser={currentUser}
          onRoleSwitch={handleRoleSwitch}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSelectedEventId(undefined);
          }}
          onOpenAiAssistant={() => setShowAiAssistant(true)}
          notifications={notifications}
          onRefreshNotifications={() => setNotifications(db.getUserNotifications(currentUser.id))}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {/* PUBLIC LANDING PAGE */}
        {activeTab === 'landing' && (
          <LandingPage
            events={events}
            onExplore={() => setActiveTab('explore')}
            onGetStarted={() => setShowAuthModal(true)}
            onSelectEvent={handleSelectEvent}
          />
        )}

        {/* EXPLORE EVENTS */}
        {activeTab === 'explore' && (
          <ExploreEventsView
            events={events}
            currentUser={currentUser}
            onSelectEvent={handleSelectEvent}
            onRefresh={refreshState}
          />
        )}

        {/* EVENT DETAIL VIEW */}
        {activeTab === 'event_detail' && selectedEventId && (
          <EventDetailView
            eventId={selectedEventId}
            currentUser={currentUser}
            onBack={() => setActiveTab('explore')}
            onRefresh={refreshState}
          />
        )}

        {/* STUDENT DASHBOARD */}
        {activeTab === 'dashboard' && currentUser.role === 'student' && (
          <StudentDashboard
            currentUser={currentUser}
            onSelectEvent={handleSelectEvent}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenQr={(eventId) => setSelectedQrPassEvtId(eventId)}
          />
        )}

        {/* STUDENT MY EVENTS */}
        {activeTab === 'my_events' && currentUser.role === 'student' && (
          <MyEventsView
            currentUser={currentUser}
            onSelectEvent={handleSelectEvent}
            onRefresh={refreshState}
          />
        )}

        {/* INTERACTIVE EVENT CALENDAR */}
        {activeTab === 'calendar' && (
          <CalendarView
            events={events}
            currentUser={currentUser}
            onSelectEvent={handleSelectEvent}
          />
        )}

        {/* SAVED EVENTS */}
        {activeTab === 'saved' && currentUser.role === 'student' && (
          <SavedEventsView
            currentUser={currentUser}
            onSelectEvent={handleSelectEvent}
            onRefresh={refreshState}
          />
        )}

        {/* ACHIEVEMENTS & CERTIFICATES */}
        {activeTab === 'achievements' && currentUser.role === 'student' && (
          <AchievementsView currentUser={currentUser} />
        )}

        {/* ORGANIZER DASHBOARD */}
        {activeTab === 'dashboard' && currentUser.role === 'organizer' && (
          <OrganizerDashboard
            currentUser={currentUser}
            onNavigate={(tab, evtId) => {
              if (evtId) setSelectedEventId(evtId);
              setActiveTab(tab);
            }}
            onRefresh={refreshState}
          />
        )}

        {/* ORGANIZER MY EVENTS TABLE */}
        {activeTab === 'manage_events' && currentUser.role === 'organizer' && (
          <OrganizerDashboard
            currentUser={currentUser}
            onNavigate={(tab, evtId) => {
              if (evtId) setSelectedEventId(evtId);
              setActiveTab(tab);
            }}
            onRefresh={refreshState}
          />
        )}

        {/* CREATE / EDIT EVENT FORM */}
        {(activeTab === 'create_event' || activeTab === 'edit_event') && currentUser.role === 'organizer' && (
          <CreateEventView
            currentUser={currentUser}
            editEventId={activeTab === 'edit_event' ? selectedEventId : undefined}
            onBack={() => setActiveTab('dashboard')}
            onSuccess={() => {
              refreshState();
              setActiveTab('dashboard');
            }}
          />
        )}

        {/* PARTICIPANT & WAITLIST MANAGEMENT */}
        {activeTab === 'participants' && currentUser.role === 'organizer' && (
          <ParticipantManagementView
            currentUser={currentUser}
            selectedEventId={selectedEventId}
            onBack={() => setActiveTab('dashboard')}
            onRefresh={refreshState}
          />
        )}

        {/* QR CHECKIN SCANNER FOR ORGANIZER */}
        {activeTab === 'checkin' && currentUser.role === 'organizer' && (
          <ParticipantManagementView
            currentUser={currentUser}
            selectedEventId={selectedEventId}
            onBack={() => setActiveTab('dashboard')}
            onRefresh={refreshState}
          />
        )}

        {/* ADMIN DASHBOARD */}
        {activeTab === 'dashboard' && currentUser.role === 'admin' && (
          <AdminDashboard currentUser={currentUser} onRefresh={refreshState} />
        )}
        {activeTab === 'users' && currentUser.role === 'admin' && (
          <AdminDashboard currentUser={currentUser} onRefresh={refreshState} />
        )}
        {activeTab === 'all_events' && currentUser.role === 'admin' && (
          <AdminDashboard currentUser={currentUser} onRefresh={refreshState} />
        )}

        {/* USER PROFILE */}
        {activeTab === 'profile' && (
          <div className="max-w-xl mx-auto px-4 py-12">
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4 text-center">
              <img
                src={currentUser.profile_image}
                alt={currentUser.full_name}
                className="w-20 h-20 rounded-full mx-auto object-cover ring-4 ring-orange-500/40"
              />
              <h2 className="text-xl font-bold text-white font-heading">{currentUser.full_name}</h2>
              <p className="text-xs text-slate-400">{currentUser.email}</p>
              <div className="pt-4 border-t border-slate-800 text-xs text-slate-300 space-y-1">
                <p>Role: <span className="font-bold text-orange-400 uppercase">{currentUser.role}</span></p>
                <p>Department: <span className="font-semibold">{currentUser.department}</span></p>
                <p>College: <span className="font-semibold">{currentUser.college}</span></p>
                <p>Academic Year: <span className="font-semibold">{currentUser.academic_year}</span></p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating AI Assistant Trigger Button (Bottom Left) */}
      <button
        onClick={() => setShowAiAssistant(true)}
        className="fixed bottom-6 left-6 z-40 p-3.5 rounded-full bg-gradient-to-tr from-orange-600 via-amber-600 to-yellow-500 text-white shadow-glow-orange hover:scale-110 transition-transform flex items-center gap-2 group cursor-pointer"
        title="Open AI Campus Assistant"
      >
        <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
        <span className="text-xs font-bold font-heading hidden sm:inline group-hover:inline">AI Assistant</span>
      </button>

      {/* AI Assistant Modal */}
      {showAiAssistant && (
        <AiAssistantModal
          currentUser={currentUser}
          onClose={() => setShowAiAssistant(false)}
          onSelectEvent={handleSelectEvent}
        />
      )}

      {/* Auth Login / Signup Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={(u) => {
            setCurrentUser(u);
            setShowAuthModal(false);
            setActiveTab(u.role === 'student' ? 'explore' : 'dashboard');
          }}
        />
      )}

      {/* QR Pass Modal */}
      {selectedQrPassEvtId && qrPassEvt && qrPassReg && (
        <QrModal
          registration={qrPassReg}
          event={qrPassEvt}
          student={currentUser}
          onClose={() => setSelectedQrPassEvtId(null)}
        />
      )}

    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <MainAppContent />
    </ToastProvider>
  );
}
