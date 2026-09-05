import React, { useState } from 'react';
import { X, Sparkles, Send, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { db } from '../../services/db';
import type { User, EventItem } from '../../types';

interface AiAssistantModalProps {
  currentUser: User;
  onClose: () => void;
  onSelectEvent: (eventId: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  matchedEvents?: EventItem[];
  timestamp: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  currentUser,
  onClose,
  onSelectEvent
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_1',
      sender: 'ai',
      text: `Hello ${currentUser.full_name}! I'm your AI Campus Event Assistant 🤖. I can check live events, filter by categories or fees, check your schedule, and answer questions about campus activities. What would you like to know?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    if (!textToSend) setInput('');

    setTimeout(() => {
      const qLower = query.toLowerCase();
      const allEvents = db.getAllEvents();
      const userRegs = db.getStudentRegistrations(currentUser.id);

      let aiText = '';
      let matchedEvents: EventItem[] = [];

      if (qLower.includes('registered') || qLower.includes('my events') || qLower.includes('my schedule')) {
        const myEvtIds = userRegs.filter(r => r.status === 'Confirmed').map(r => r.event_id);
        matchedEvents = allEvents.filter(e => myEvtIds.includes(e.id));

        if (matchedEvents.length === 0) {
          aiText = "You haven't registered for any upcoming campus events yet. Explore events to get started!";
        } else {
          aiText = `You are currently registered for ${matchedEvents.length} upcoming campus event(s):`;
        }
      } else if (qLower.includes('hackathon')) {
        matchedEvents = allEvents.filter(e => e.category === 'Hackathon' || e.event_type === 'hackathon');
        aiText = `Here are the upcoming hackathons on campus:`;
      } else if (qLower.includes('free')) {
        matchedEvents = allEvents.filter(e => e.registration_fee === 0 && e.status === 'published');
        aiText = `Found ${matchedEvents.length} free campus events open for registration:`;
      } else if (qLower.includes('this week') || qLower.includes('upcoming') || qLower.includes('tomorrow')) {
        matchedEvents = allEvents.filter(e => e.status === 'published');
        aiText = `Here are the upcoming published campus events available right now:`;
      } else if (qLower.includes('technical') || qLower.includes('coding') || qLower.includes('ai') || qLower.includes('workshop')) {
        matchedEvents = allEvents.filter(e => ['AI/ML', 'Web Dev', 'Coding', 'Workshop'].includes(e.category));
        aiText = `Here are technical & workshop events happening on campus:`;
      } else {
        matchedEvents = allEvents.filter(e => 
          e.title.toLowerCase().includes(qLower) || 
          e.description.toLowerCase().includes(qLower) || 
          e.category.toLowerCase().includes(qLower)
        );

        if (matchedEvents.length > 0) {
          aiText = `I found ${matchedEvents.length} event(s) matching "${query}":`;
        } else {
          matchedEvents = allEvents.slice(0, 3);
          aiText = `I couldn't find an exact match for "${query}", but here are popular upcoming campus events you might enjoy:`;
        }
      }

      const aiMsg: Message = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text: aiText,
        matchedEvents,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 400);
  };

  const samplePrompts = [
    "What events are happening this week?",
    "Show upcoming hackathons",
    "What free events are available?",
    "What events have I registered for?",
    "Show technical workshops"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08080a]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-orange-500/40 shadow-2xl flex flex-col h-[620px] relative overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 p-0.5 shadow-glow-orange">
              <div className="w-full h-full bg-[#08080a] rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 font-heading flex items-center gap-1.5">
                AI Campus Event Assistant
                <span className="px-2 py-0.5 bg-orange-500/10 text-orange-300 text-[10px] rounded-full border border-orange-500/20 font-semibold">
                  Live DB Synced
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Ask questions about schedules, workshops, hackathons & registration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-br-none shadow-lg font-sans'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md font-sans'
                }`}
              >
                <p>{msg.text}</p>

                {msg.matchedEvents && msg.matchedEvents.length > 0 && (
                  <div className="mt-3 space-y-2 pt-2 border-t border-slate-800/80">
                    {msg.matchedEvents.map((evt) => (
                      <div
                        key={evt.id}
                        onClick={() => {
                          onSelectEvent(evt.id);
                          onClose();
                        }}
                        className="bg-[#08080a]/80 hover:bg-[#08080a] p-3 rounded-xl border border-slate-800 hover:border-orange-500/50 cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="space-y-1 pr-2">
                          <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-500/20 text-amber-300 rounded-md uppercase">
                            {evt.category}
                          </span>
                          <h5 className="font-semibold text-xs text-slate-100 group-hover:text-orange-300 transition-colors font-heading">
                            {evt.title}
                          </h5>
                          <div className="flex items-center space-x-3 text-[10px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {evt.event_date}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {evt.mode}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-[#08080a]/60 overflow-x-auto flex items-center space-x-2 no-scrollbar">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-orange-500/40 text-[11px] text-orange-300 rounded-full whitespace-nowrap transition-all cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/90 flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI Assistant about events, hackathons, or your schedule..."
            className="flex-1 px-4 py-2.5 bg-[#08080a] border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-orange-500"
          />
          <button
            onClick={() => handleSend()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 text-white hover:brightness-110 shadow-glow-orange transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
