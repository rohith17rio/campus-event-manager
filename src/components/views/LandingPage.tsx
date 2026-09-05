import React from 'react';
import { 
  Sparkles, 
  Calendar, 
  Search, 
  AlertTriangle, 
  QrCode, 
  ArrowRight,
  MapPin
} from 'lucide-react';
import type { EventItem } from '../../types';

interface LandingPageProps {
  events: EventItem[];
  onExplore: () => void;
  onGetStarted: () => void;
  onSelectEvent: (eventId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  events,
  onExplore,
  onGetStarted,
  onSelectEvent
}) => {
  const featuredEvents = events.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#08080a] text-slate-100 flex flex-col font-sans">
      
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-slate-800/80">
        
        {/* Ambient Glowing Background Orbs in Burnt Orange & Amber */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-orange-950/40 via-amber-900/25 to-yellow-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-orange-600/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-orange-500/30 shadow-glow-orange mb-8">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold bg-clip-text text-transparent bg-gradient-to-r from-orange-300 via-amber-200 to-yellow-300">
              The Next-Gen Centralized Campus Event Platform
            </span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15] font-heading">
            Never Miss What <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-orange-200 to-orange-500">
              Matters on Campus.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover workshops, hackathons, seminars, competitions, cultural events, and more — all from one smart, connected platform.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onExplore}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 text-white font-bold text-sm hover:brightness-110 transition-all shadow-glow-orange flex items-center justify-center space-x-2 group cursor-pointer font-heading"
            >
              <Search className="w-4 h-4" />
              <span>Explore Campus Events</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-bold text-sm transition-all cursor-pointer font-heading"
            >
              Get Started Free
            </button>
          </div>

          {/* Live Platform Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <p className="text-2xl font-extrabold text-orange-400 font-heading">100%</p>
              <p className="text-xs text-slate-400 mt-1">Centralized Information</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <p className="text-2xl font-extrabold text-amber-400 font-heading">0</p>
              <p className="text-xs text-slate-400 mt-1">Schedule Clashes</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <p className="text-2xl font-extrabold text-orange-400 font-heading">Instant</p>
              <p className="text-xs text-slate-400 mt-1">QR Attendance</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <p className="text-2xl font-extrabold text-emerald-400 font-heading">Smart</p>
              <p className="text-xs text-slate-400 mt-1">Auto-Promote Waitlists</p>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURED UPCOMING EVENTS SECTION */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 font-heading">Featured Campus Events</h2>
            <p className="text-xs text-slate-400 mt-1">Handpicked workshops, hackathons & competitions happening soon</p>
          </div>
          <button
            onClick={onExplore}
            className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer"
          >
            View all events <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => onSelectEvent(event.id)}
              className="glass-card rounded-2xl overflow-hidden cursor-pointer group flex flex-col h-full"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                <img
                  src={event.banner_url}
                  alt={event.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#08080a]/85 backdrop-blur-md border border-orange-500/30 rounded-lg text-[10px] font-bold text-amber-300 uppercase">
                  {event.category}
                </div>
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-slate-900/80 rounded-md text-[10px] font-semibold text-slate-300">
                  {event.mode}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-base text-slate-100 group-hover:text-orange-300 transition-colors line-clamp-1 font-heading">
                    {event.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-orange-400" />
                    <span>{event.event_date} • {event.start_time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold pt-2">
                  <span className="text-orange-400">By {event.organizer_name}</span>
                  <span className="px-3 py-1 bg-orange-600/20 text-orange-300 rounded-lg border border-orange-500/30 group-hover:bg-orange-600 group-hover:text-white transition-all font-heading">
                    Register Now
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS LIFECYCLE SECTION */}
      <section className="py-16 bg-[#08080a]/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-white font-heading">The Complete Campus Lifecycle</h2>
            <p className="text-xs text-slate-400 mt-2">Discover → Register → Organize → Attend → Evaluate → Achieve</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center">
              <div className="w-12 h-12 rounded-2xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="font-bold text-sm text-slate-100 mb-2 font-heading">1. Smart Discovery & Filters</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter by department, category, online/offline mode, date, and fee. Never miss deadlines with automatic activity feeds.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="font-bold text-sm text-slate-100 mb-2 font-heading">2. Clash Detection & Waitlist</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Schedule clash engine prevents double-booking. If an event is full, join a smart queue that auto-promotes you when seats open up.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center">
              <div className="w-12 h-12 rounded-2xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="font-bold text-sm text-slate-100 mb-2 font-heading">3. QR Check-in & Certificates</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Show unique QR passes at venue. Organizers verify attendance in seconds and issue official digital certificates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto py-8 border-t border-slate-800/80 bg-[#08080a] text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-orange-400" />
            <span className="font-bold text-slate-200">Campus Event Manager</span>
            <span>© 2026 Higher Ed SaaS. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={onExplore} className="hover:text-white transition-colors cursor-pointer">Explore Events</button>
            <button onClick={onGetStarted} className="hover:text-white transition-colors cursor-pointer">Login / Signup</button>
          </div>
        </div>
      </footer>

    </div>
  );
};
