import type { 
  User, 
  EventItem, 
  Registration, 
  WaitlistEntry, 
  AttendanceRecord, 
  SavedEvent, 
  EventFeedback, 
  Certificate, 
  NotificationItem, 
  ActivityFeedItem,
  ScheduleConflict
} from '../types';

const STORAGE_KEYS = {
  USERS: 'cem_users',
  EVENTS: 'cem_events',
  REGISTRATIONS: 'cem_registrations',
  WAITLIST: 'cem_waitlist',
  ATTENDANCE: 'cem_attendance',
  SAVED_EVENTS: 'cem_saved_events',
  FEEDBACK: 'cem_feedback',
  CERTIFICATES: 'cem_certificates',
  NOTIFICATIONS: 'cem_notifications',
  ACTIVITY_FEED: 'cem_activity_feed',
  CURRENT_USER: 'cem_current_user_id',
};

// Initial Sample Users
const INITIAL_USERS: User[] = [
  {
    id: 'user_student_1',
    full_name: 'Alex Chen',
    email: 'alex.chen@campus.edu',
    role: 'student',
    college: 'School of Engineering & Tech',
    department: 'Computer Science',
    academic_year: '3rd Year',
    profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z'
  },
  {
    id: 'user_student_2',
    full_name: 'Priya Sharma',
    email: 'priya.sharma@campus.edu',
    role: 'student',
    college: 'School of Engineering & Tech',
    department: 'Information Technology',
    academic_year: '2nd Year',
    profile_image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    created_at: '2026-01-12T11:00:00Z',
    updated_at: '2026-01-12T11:00:00Z'
  },
  {
    id: 'user_organizer_1',
    full_name: 'Dr. Sarah Jenkins',
    email: 's.jenkins@campus.edu',
    role: 'organizer',
    college: 'School of Computer Science',
    department: 'Computer Science & AI',
    academic_year: 'Faculty Lead',
    profile_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    created_at: '2026-01-01T09:00:00Z',
    updated_at: '2026-01-01T09:00:00Z'
  },
  {
    id: 'user_organizer_2',
    full_name: 'Prof. Robert Vance',
    email: 'r.vance@campus.edu',
    role: 'organizer',
    college: 'School of Innovation & Robotics',
    department: 'Robotics & Automation',
    academic_year: 'Faculty Lead',
    profile_image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    created_at: '2026-01-05T09:00:00Z',
    updated_at: '2026-01-05T09:00:00Z'
  },
  {
    id: 'user_admin_1',
    full_name: 'Campus Admin Office',
    email: 'admin@campus.edu',
    role: 'admin',
    college: 'Central University Administration',
    department: 'Student Affairs',
    academic_year: 'Administration',
    profile_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  }
];

// Initial Sample Events with Curated Category Banners
const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt_1',
    organizer_id: 'user_organizer_1',
    organizer_name: 'Dr. Sarah Jenkins',
    title: 'AI & Machine Learning Workshop 2026',
    description: 'Deep dive into practical Neural Networks, Large Language Models fine-tuning, and PyTorch deployment. Hands-on coding exercises included.',
    category: 'AI/ML',
    department: 'Computer Science',
    event_type: 'workshop',
    mode: 'offline',
    banner_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1000&q=80',
    event_date: '2026-08-28',
    start_time: '10:00',
    end_time: '13:00',
    location: 'Auditorium Hall A, Tech Block',
    max_participants: 50,
    registration_deadline: '2026-08-27T23:59',
    registration_fee: 0,
    eligibility: 'All CS & IT Engineering Students',
    contact_name: 'Dr. Sarah Jenkins',
    contact_email: 's.jenkins@campus.edu',
    contact_phone: '+1 (555) 019-2831',
    allow_waitlist: true,
    status: 'published',
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z'
  },
  {
    id: 'evt_2',
    organizer_id: 'user_organizer_1',
    organizer_name: 'Dr. Sarah Jenkins',
    title: 'Campus Hackathon 2026: NextGen Solutions',
    description: '36-hour non-stop building sprint! Create innovative projects solving real-world sustainability, healthcare, and education problems. $5,000 in prizes.',
    category: 'Hackathon',
    department: 'Computer Science',
    event_type: 'hackathon',
    mode: 'hybrid',
    banner_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1000&q=80',
    event_date: '2026-09-05',
    start_time: '09:00',
    end_time: '21:00',
    location: 'Innovation Hub & Virtual Discord',
    meeting_link: 'https://discord.gg/campus-hackathon-2026',
    max_participants: 120,
    registration_deadline: '2026-09-03T23:59',
    registration_fee: 0,
    eligibility: 'Open to all departments & year groups',
    contact_name: 'Coding Club Team',
    contact_email: 'hackathon@campus.edu',
    contact_phone: '+1 (555) 019-8822',
    allow_waitlist: true,
    status: 'published',
    created_at: '2026-08-05T12:00:00Z',
    updated_at: '2026-08-05T12:00:00Z'
  },
  {
    id: 'evt_3',
    organizer_id: 'user_organizer_1',
    organizer_name: 'Dr. Sarah Jenkins',
    title: 'Web Development Bootcamp: Full-Stack React & Node',
    description: 'Learn modern Web Architecture, React 19, TypeScript, and Serverless API deployment in a intensive weekend crash course.',
    category: 'Web Dev',
    department: 'Computer Science',
    event_type: 'workshop',
    mode: 'online',
    banner_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
    event_date: '2026-08-28',
    start_time: '14:00',
    end_time: '17:00',
    location: 'Online via Zoom',
    meeting_link: 'https://campus.zoom.us/j/992817263',
    max_participants: 2,
    registration_deadline: '2026-08-27T18:00',
    registration_fee: 0,
    eligibility: 'Beginners & Intermediates',
    contact_name: 'Web Dev Society',
    contact_email: 'webdev@campus.edu',
    contact_phone: '+1 (555) 019-3344',
    allow_waitlist: true,
    status: 'published',
    created_at: '2026-08-10T09:00:00Z',
    updated_at: '2026-08-10T09:00:00Z'
  },
  {
    id: 'evt_4',
    organizer_id: 'user_organizer_1',
    organizer_name: 'Dr. Sarah Jenkins',
    title: 'National Level Coding Competition (AlgoSprint)',
    description: 'Algorithmic problem solving contest featuring Competitive Programming challenges on Data Structures, Graphs, and Dynamic Programming.',
    category: 'Coding',
    department: 'Computer Science',
    event_type: 'competition',
    mode: 'online',
    banner_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80',
    event_date: '2026-09-12',
    start_time: '11:00',
    end_time: '15:00',
    location: 'Online Platform (CodeChef / HackerRank)',
    meeting_link: 'https://algosprint.campus.edu',
    max_participants: 200,
    registration_deadline: '2026-09-10T23:59',
    registration_fee: 10,
    eligibility: 'Undergraduate & Postgraduate Students',
    contact_name: 'AlgoSprint Desk',
    contact_email: 'algosprint@campus.edu',
    contact_phone: '+1 (555) 019-4411',
    allow_waitlist: false,
    status: 'published',
    created_at: '2026-08-12T14:00:00Z',
    updated_at: '2026-08-12T14:00:00Z'
  },
  {
    id: 'evt_5',
    organizer_id: 'user_organizer_2',
    organizer_name: 'Prof. Robert Vance',
    title: 'Entrepreneurship & Startup Pitch Seminar',
    description: 'Venture Capitalists and successful alumni entrepreneurs share insights on pitching investors, building minimum viable products, and fundraising.',
    category: 'Management',
    department: 'School of Management',
    event_type: 'seminar',
    mode: 'offline',
    banner_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80',
    event_date: '2026-09-18',
    start_time: '15:00',
    end_time: '18:00',
    location: 'Main University Amphitheater',
    max_participants: 80,
    registration_deadline: '2026-09-16T23:59',
    registration_fee: 0,
    eligibility: 'All students interested in startups',
    contact_name: 'Prof. Robert Vance',
    contact_email: 'r.vance@campus.edu',
    contact_phone: '+1 (555) 019-9900',
    allow_waitlist: true,
    status: 'published',
    created_at: '2026-08-14T11:00:00Z',
    updated_at: '2026-08-14T11:00:00Z'
  },
  {
    id: 'evt_6',
    organizer_id: 'user_organizer_2',
    organizer_name: 'Prof. Robert Vance',
    title: 'Annual Campus Cultural Fest: Rhythm & Beats',
    description: 'Music performances, dance battles, drama acts, and food stalls across the campus square. Celebrate university spirit!',
    category: 'Cultural',
    department: 'Student Affairs & Cultural Club',
    event_type: 'cultural',
    mode: 'offline',
    banner_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80',
    event_date: '2026-09-25',
    start_time: '16:00',
    end_time: '22:00',
    location: 'Central Campus Grounds',
    max_participants: 500,
    registration_deadline: '2026-09-24T12:00',
    registration_fee: 0,
    eligibility: 'Campus Students, Faculty, & Guests',
    contact_name: 'Cultural Committee',
    contact_email: 'cultural@campus.edu',
    contact_phone: '+1 (555) 019-7733',
    allow_waitlist: false,
    status: 'published',
    created_at: '2026-08-15T15:00:00Z',
    updated_at: '2026-08-15T15:00:00Z'
  },
  {
    id: 'evt_7',
    organizer_id: 'user_organizer_2',
    organizer_name: 'Prof. Robert Vance',
    title: 'Autonomous Robotics & IoT Drone Workshop',
    description: 'Assemble and program micro-drones using Arduino, ESP32, and ROS2 navigation. Hardware kits provided during the workshop.',
    category: 'Workshop',
    department: 'Robotics & Automation',
    event_type: 'workshop',
    mode: 'offline',
    banner_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=80',
    event_date: '2026-08-20',
    start_time: '09:00',
    end_time: '12:00',
    location: 'Robotics Lab 3, Mechanical Block',
    max_participants: 30,
    registration_deadline: '2026-08-19T23:59',
    registration_fee: 15,
    eligibility: 'Engineering undergraduates',
    contact_name: 'Prof. Robert Vance',
    contact_email: 'r.vance@campus.edu',
    contact_phone: '+1 (555) 019-9900',
    allow_waitlist: true,
    status: 'completed',
    created_at: '2026-08-01T08:00:00Z',
    updated_at: '2026-08-20T12:00:00Z'
  },
  {
    id: 'evt_8',
    organizer_id: 'user_organizer_2',
    organizer_name: 'Prof. Robert Vance',
    title: 'Inter-College Badminton & Table Tennis Tournament',
    description: 'Singles and doubles knockout tournament with trophies and certificates for winners and runners-up.',
    category: 'Sports',
    department: 'Sports Association',
    event_type: 'sports',
    mode: 'offline',
    banner_url: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=1000&q=80',
    event_date: '2026-10-02',
    start_time: '08:30',
    end_time: '17:00',
    location: 'Campus Indoor Sports Complex',
    max_participants: 64,
    registration_deadline: '2026-09-30T23:59',
    registration_fee: 5,
    eligibility: 'Student athletes',
    contact_name: 'Sports Officer',
    contact_email: 'sports@campus.edu',
    contact_phone: '+1 (555) 019-5566',
    allow_waitlist: true,
    status: 'published',
    created_at: '2026-08-16T10:00:00Z',
    updated_at: '2026-08-16T10:00:00Z'
  }
];

// Initial Registrations
const INITIAL_REGISTRATIONS: Registration[] = [
  {
    id: 'reg_101',
    event_id: 'evt_1',
    student_id: 'user_student_1',
    registration_id: 'REG-2026-8941',
    qr_token: 'QR-EVT1-STUDENT1-8941',
    status: 'Confirmed',
    registered_at: '2026-08-15T14:30:00Z',
    checked_in_at: null
  },
  {
    id: 'reg_102',
    event_id: 'evt_7',
    student_id: 'user_student_1',
    registration_id: 'REG-2026-4432',
    qr_token: 'QR-EVT7-STUDENT1-4432',
    status: 'Confirmed',
    registered_at: '2026-08-10T11:00:00Z',
    checked_in_at: '2026-08-20T08:55:00Z'
  },
  {
    id: 'reg_103',
    event_id: 'evt_3',
    student_id: 'user_student_2',
    registration_id: 'REG-2026-1122',
    qr_token: 'QR-EVT3-STUDENT2-1122',
    status: 'Confirmed',
    registered_at: '2026-08-11T12:00:00Z',
    checked_in_at: null
  },
  {
    id: 'reg_104',
    event_id: 'evt_3',
    student_id: 'user_organizer_1',
    registration_id: 'REG-2026-1123',
    qr_token: 'QR-EVT3-ORG1-1123',
    status: 'Confirmed',
    registered_at: '2026-08-11T12:05:00Z',
    checked_in_at: null
  }
];

const INITIAL_WAITLIST: WaitlistEntry[] = [];

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att_1',
    event_id: 'evt_7',
    student_id: 'user_student_1',
    registration_id: 'REG-2026-4432',
    status: 'present',
    check_in_time: '2026-08-20T08:55:00Z',
    verified_by: 'user_organizer_2'
  }
];

const INITIAL_SAVED_EVENTS: SavedEvent[] = [
  {
    id: 'save_1',
    student_id: 'user_student_1',
    event_id: 'evt_2',
    created_at: '2026-08-16T10:00:00Z'
  }
];

const INITIAL_FEEDBACK: EventFeedback[] = [
  {
    id: 'fb_1',
    event_id: 'evt_7',
    student_id: 'user_student_1',
    rating: 5,
    comment: 'Outstanding robotics workshop! Building and flying the drone with ESP32 was super engaging and practical.',
    created_at: '2026-08-20T13:00:00Z',
    student_name: 'Alex Chen'
  }
];

const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert_1',
    event_id: 'evt_7',
    student_id: 'user_student_1',
    certificate_url: 'https://campus.edu/certificates/CERT-EVT7-STUDENT1.pdf',
    status: 'Available',
    issued_at: '2026-08-21T10:00:00Z'
  }
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    user_id: 'user_student_1',
    title: 'Registration Confirmed 🎉',
    message: 'You have successfully registered for "AI & Machine Learning Workshop 2026". Your QR token is ready.',
    type: 'success',
    is_read: false,
    created_at: '2026-08-15T14:30:00Z'
  },
  {
    id: 'notif_2',
    user_id: 'user_student_1',
    title: 'Certificate Available 🏆',
    message: 'Your Certificate of Completion for "Autonomous Robotics & IoT Drone Workshop" is now ready to download.',
    type: 'info',
    is_read: true,
    created_at: '2026-08-21T10:00:00Z'
  }
];

const INITIAL_ACTIVITY_FEED: ActivityFeedItem[] = [
  {
    id: 'act_1',
    type: 'new_event',
    title: 'New Event Published',
    description: 'Dr. Sarah Jenkins published "AI & Machine Learning Workshop 2026". Seats filling fast!',
    related_event_id: 'evt_1',
    visibility: 'public',
    created_at: '2026-08-01T10:00:00Z'
  },
  {
    id: 'act_2',
    type: 'event_almost_full',
    title: 'Event Almost Full 🔥',
    description: 'Web Development Bootcamp has reached maximum capacity! Waitlist is now active.',
    related_event_id: 'evt_3',
    visibility: 'public',
    created_at: '2026-08-11T12:06:00Z'
  },
  {
    id: 'act_3',
    type: 'certificate_issued',
    title: 'Certificates Distributed 🎓',
    description: 'Certificates of completion for Autonomous Robotics & IoT Drone Workshop have been issued to attendees.',
    related_event_id: 'evt_7',
    visibility: 'public',
    created_at: '2026-08-21T10:05:00Z'
  }
];

function loadStorage<T>(key: string, defaultData: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultData;
  }
}

function saveStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
  }
}

export class DatabaseService {
  private users: User[];
  private events: EventItem[];
  private registrations: Registration[];
  private waitlist: WaitlistEntry[];
  private attendance: AttendanceRecord[];
  private savedEvents: SavedEvent[];
  private feedback: EventFeedback[];
  private certificates: Certificate[];
  private notifications: NotificationItem[];
  private activityFeed: ActivityFeedItem[];
  private currentUserId: string;

  constructor() {
    this.users = loadStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
    this.events = loadStorage(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    this.registrations = loadStorage(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    this.waitlist = loadStorage(STORAGE_KEYS.WAITLIST, INITIAL_WAITLIST);
    this.attendance = loadStorage(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    this.savedEvents = loadStorage(STORAGE_KEYS.SAVED_EVENTS, INITIAL_SAVED_EVENTS);
    this.feedback = loadStorage(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);
    this.certificates = loadStorage(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    this.notifications = loadStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    this.activityFeed = loadStorage(STORAGE_KEYS.ACTIVITY_FEED, INITIAL_ACTIVITY_FEED);
    this.currentUserId = loadStorage(STORAGE_KEYS.CURRENT_USER, 'user_student_1');
  }

  private persistAll() {
    saveStorage(STORAGE_KEYS.USERS, this.users);
    saveStorage(STORAGE_KEYS.EVENTS, this.events);
    saveStorage(STORAGE_KEYS.REGISTRATIONS, this.registrations);
    saveStorage(STORAGE_KEYS.WAITLIST, this.waitlist);
    saveStorage(STORAGE_KEYS.ATTENDANCE, this.attendance);
    saveStorage(STORAGE_KEYS.SAVED_EVENTS, this.savedEvents);
    saveStorage(STORAGE_KEYS.FEEDBACK, this.feedback);
    saveStorage(STORAGE_KEYS.CERTIFICATES, this.certificates);
    saveStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    saveStorage(STORAGE_KEYS.ACTIVITY_FEED, this.activityFeed);
    saveStorage(STORAGE_KEYS.CURRENT_USER, this.currentUserId);
  }

  public getCurrentUser(): User {
    return this.users.find(u => u.id === this.currentUserId) || this.users[0];
  }

  public setCurrentUserId(userId: string) {
    this.currentUserId = userId;
    saveStorage(STORAGE_KEYS.CURRENT_USER, userId);
  }

  public getAllUsers(): User[] {
    return [...this.users];
  }

  public createUser(newUser: Omit<User, 'id' | 'created_at' | 'updated_at'>): User {
    const user: User = {
      ...newUser,
      id: `user_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.users.push(user);
    this.currentUserId = user.id;
    this.persistAll();
    return user;
  }

  public getAllEvents(): EventItem[] {
    return [...this.events];
  }

  public getEventById(eventId: string): EventItem | undefined {
    return this.events.find(e => e.id === eventId);
  }

  public createEvent(eventData: Omit<EventItem, 'id' | 'created_at' | 'updated_at'>): EventItem {
    const newEvent: EventItem = {
      ...eventData,
      id: `evt_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.events.push(newEvent);

    this.addActivityItem({
      type: 'new_event',
      title: 'New Event Published 🎉',
      description: `${newEvent.organizer_name} created "${newEvent.title}". Registration is now open!`,
      related_event_id: newEvent.id,
      visibility: 'public'
    });

    this.persistAll();
    return newEvent;
  }

  public updateEvent(eventId: string, updates: Partial<EventItem>): EventItem | null {
    const idx = this.events.findIndex(e => e.id === eventId);
    if (idx === -1) return null;
    this.events[idx] = {
      ...this.events[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.persistAll();
    return this.events[idx];
  }

  public deleteEvent(eventId: string): boolean {
    this.events = this.events.filter(e => e.id !== eventId);
    this.registrations = this.registrations.filter(r => r.event_id !== eventId);
    this.waitlist = this.waitlist.filter(w => w.event_id !== eventId);
    this.persistAll();
    return true;
  }

  public getEventConfirmedRegistrationCount(eventId: string): number {
    return this.registrations.filter(r => r.event_id === eventId && r.status === 'Confirmed').length;
  }

  public getStudentRegistrations(studentId?: string): Registration[] {
    if (!studentId) return [...this.registrations];
    return this.registrations.filter(r => r.student_id === studentId);
  }

  public isStudentRegistered(studentId: string, eventId: string): boolean {
    return this.registrations.some(r => r.student_id === studentId && r.event_id === eventId && r.status === 'Confirmed');
  }

  public isStudentWaitlisted(studentId: string, eventId: string): boolean {
    return this.waitlist.some(w => w.student_id === studentId && w.event_id === eventId && w.status === 'active');
  }

  public getWaitlistPosition(studentId: string, eventId: string): number | null {
    const activeEntries = this.waitlist
      .filter(w => w.event_id === eventId && w.status === 'active')
      .sort((a, b) => a.position - b.position);
    const idx = activeEntries.findIndex(w => w.student_id === studentId);
    return idx !== -1 ? idx + 1 : null;
  }

  public checkScheduleConflict(studentId: string, targetEvent: EventItem): ScheduleConflict | null {
    const studentRegs = this.getStudentRegistrations(studentId).filter(r => r.status === 'Confirmed');
    
    for (const reg of studentRegs) {
      const existingEvt = this.getEventById(reg.event_id);
      if (!existingEvt || existingEvt.id === targetEvent.id || existingEvt.status === 'cancelled') continue;
      
      if (existingEvt.event_date === targetEvent.event_date) {
        const eStart = existingEvt.start_time;
        const eEnd = existingEvt.end_time;
        const tStart = targetEvent.start_time;
        const tEnd = targetEvent.end_time;

        if (tStart < eEnd && tEnd > eStart) {
          return {
            existingEvent: existingEvt,
            targetEvent: targetEvent
          };
        }
      }
    }

    return null;
  }

  public registerForEvent(studentId: string, eventId: string): { success: boolean; message: string; registration?: Registration; waitlisted?: boolean; waitlistPosition?: number } {
    const event = this.getEventById(eventId);
    if (!event) return { success: false, message: 'Event not found' };

    if (event.status !== 'published') {
      return { success: false, message: 'Event is not open for registration.' };
    }

    const now = new Date();
    const deadline = new Date(event.registration_deadline);
    if (now > deadline) {
      return { success: false, message: 'Registration deadline has passed.' };
    }

    if (this.isStudentRegistered(studentId, eventId)) {
      return { success: false, message: 'You are already registered for this event.' };
    }

    const currentCount = this.getEventConfirmedRegistrationCount(eventId);
    const isFull = currentCount >= event.max_participants;

    if (isFull) {
      if (!event.allow_waitlist) {
        return { success: false, message: 'Event has reached maximum capacity and waitlisting is disabled.' };
      }

      const existingActiveWaitlist = this.waitlist.filter(w => w.event_id === eventId && w.status === 'active');
      const position = existingActiveWaitlist.length + 1;

      const newWaitlistEntry: WaitlistEntry = {
        id: `wait_${Date.now()}`,
        event_id: eventId,
        student_id: studentId,
        position,
        status: 'active',
        created_at: new Date().toISOString()
      };
      this.waitlist.push(newWaitlistEntry);

      this.addNotification({
        user_id: studentId,
        title: 'Joined Waitlist ⏳',
        message: `You are #${position} on the waitlist for "${event.title}". You will be auto-promoted if a seat opens.`,
        type: 'warning'
      });

      this.persistAll();
      return {
        success: true,
        message: `Event full. You joined the waitlist at position #${position}!`,
        waitlisted: true,
        waitlistPosition: position
      };
    }

    const randId = Math.floor(1000 + Math.random() * 9000);
    const regIdStr = `REG-2026-${randId}`;
    const qrTokenStr = `QR-${eventId.toUpperCase()}-${studentId.toUpperCase()}-${randId}`;

    const newRegistration: Registration = {
      id: `reg_${Date.now()}`,
      event_id: eventId,
      student_id: studentId,
      registration_id: regIdStr,
      qr_token: qrTokenStr,
      status: 'Confirmed',
      registered_at: new Date().toISOString(),
      checked_in_at: null
    };

    this.registrations.push(newRegistration);

    this.addNotification({
      user_id: studentId,
      title: 'Registration Successful 🎉',
      message: `Registration confirmed for "${event.title}". Access your unique QR code in My Events.`,
      type: 'success'
    });

    const newCount = currentCount + 1;
    if (newCount >= event.max_participants) {
      this.addActivityItem({
        type: 'event_almost_full',
        title: 'Event Fully Booked 🔥',
        description: `"${event.title}" has filled all ${event.max_participants} seats!`,
        related_event_id: eventId,
        visibility: 'public'
      });
    }

    this.persistAll();
    return {
      success: true,
      message: 'Registration successful!',
      registration: newRegistration
    };
  }

  public cancelRegistration(studentId: string, eventId: string): { success: boolean; promotedStudentName?: string } {
    const regIdx = this.registrations.findIndex(r => r.student_id === studentId && r.event_id === eventId && r.status === 'Confirmed');
    if (regIdx === -1) return { success: false };

    this.registrations[regIdx].status = 'Cancelled';
    const event = this.getEventById(eventId);

    this.addNotification({
      user_id: studentId,
      title: 'Registration Cancelled',
      message: `Your registration for "${event?.title || 'Event'}" has been cancelled.`,
      type: 'info'
    });

    let promotedName: string | undefined;
    const activeWaitlist = this.waitlist
      .filter(w => w.event_id === eventId && w.status === 'active')
      .sort((a, b) => a.position - b.position);

    if (activeWaitlist.length > 0 && event) {
      const topWaitlist = activeWaitlist[0];
      
      topWaitlist.status = 'promoted';
      topWaitlist.promoted_at = new Date().toISOString();

      const randId = Math.floor(1000 + Math.random() * 9000);
      const newReg: Registration = {
        id: `reg_${Date.now()}`,
        event_id: eventId,
        student_id: topWaitlist.student_id,
        registration_id: `REG-2026-${randId}`,
        qr_token: `QR-${eventId.toUpperCase()}-${topWaitlist.student_id.toUpperCase()}-${randId}`,
        status: 'Confirmed',
        registered_at: new Date().toISOString(),
        checked_in_at: null
      };
      this.registrations.push(newReg);

      const promotedUser = this.users.find(u => u.id === topWaitlist.student_id);
      promotedName = promotedUser?.full_name;

      this.addNotification({
        user_id: topWaitlist.student_id,
        title: 'Waitlist Promoted! 🎉',
        message: `A seat opened up for "${event.title}". You have been automatically promoted from waitlist to Confirmed!`,
        type: 'success'
      });

      const remainingWaitlist = this.waitlist.filter(w => w.event_id === eventId && w.status === 'active');
      remainingWaitlist.forEach((w, idx) => {
        w.position = idx + 1;
      });
    }

    this.persistAll();
    return { success: true, promotedStudentName: promotedName };
  }

  public getSavedEvents(studentId: string): SavedEvent[] {
    return this.savedEvents.filter(s => s.student_id === studentId);
  }

  public isEventSaved(studentId: string, eventId: string): boolean {
    return this.savedEvents.some(s => s.student_id === studentId && s.event_id === eventId);
  }

  public toggleSaveEvent(studentId: string, eventId: string): boolean {
    const idx = this.savedEvents.findIndex(s => s.student_id === studentId && s.event_id === eventId);
    if (idx !== -1) {
      this.savedEvents.splice(idx, 1);
      this.persistAll();
      return false;
    } else {
      this.savedEvents.push({
        id: `save_${Date.now()}`,
        student_id: studentId,
        event_id: eventId,
        created_at: new Date().toISOString()
      });
      this.persistAll();
      return true;
    }
  }

  public getAttendanceByEvent(eventId: string): AttendanceRecord[] {
    return this.attendance.filter(a => a.event_id === eventId);
  }

  public checkInParticipant(qrTokenOrRegId: string, verifiedByUserId: string): { success: boolean; message: string; registration?: Registration; student?: User; event?: EventItem } {
    const tokenClean = qrTokenOrRegId.trim();

    const reg = this.registrations.find(r => 
      (r.qr_token.toUpperCase() === tokenClean.toUpperCase() || r.registration_id.toUpperCase() === tokenClean.toUpperCase()) &&
      r.status === 'Confirmed'
    );

    if (!reg) {
      return { success: false, message: 'Invalid or unconfirmed QR Token / Registration ID.' };
    }

    if (reg.checked_in_at) {
      const student = this.users.find(u => u.id === reg.student_id);
      return { 
        success: false, 
        message: `Already checked in at ${new Date(reg.checked_in_at).toLocaleTimeString()} by ${student?.full_name || 'Student'}.` 
      };
    }

    reg.checked_in_at = new Date().toISOString();

    const attRecord: AttendanceRecord = {
      id: `att_${Date.now()}`,
      event_id: reg.event_id,
      student_id: reg.student_id,
      registration_id: reg.registration_id,
      status: 'present',
      check_in_time: new Date().toISOString(),
      verified_by: verifiedByUserId
    };
    this.attendance.push(attRecord);

    const student = this.users.find(u => u.id === reg.student_id);
    const event = this.getEventById(reg.event_id);

    this.addNotification({
      user_id: reg.student_id,
      title: 'Check-in Confirmed ✓',
      message: `Your attendance for "${event?.title || 'Event'}" has been verified. Enjoy the session!`,
      type: 'success'
    });

    this.persistAll();
    return {
      success: true,
      message: 'Check-in Successful ✓',
      registration: reg,
      student,
      event
    };
  }

  public getEventFeedback(eventId: string): EventFeedback[] {
    return this.feedback.filter(f => f.event_id === eventId);
  }

  public isStudentEligibleForFeedback(studentId: string, eventId: string): { eligible: boolean; reason?: string } {
    const event = this.getEventById(eventId);
    if (!event) return { eligible: false, reason: 'Event not found' };

    const existing = this.feedback.find(f => f.event_id === eventId && f.student_id === studentId);
    if (existing) return { eligible: false, reason: 'You have already submitted feedback for this event.' };

    const reg = this.registrations.find(r => r.event_id === eventId && r.student_id === studentId && r.status === 'Confirmed');
    if (!reg) return { eligible: false, reason: 'You must be registered for this event to provide feedback.' };

    if (!reg.checked_in_at && event.status !== 'completed') {
      return { eligible: false, reason: 'Feedback opens after your attendance is verified or event completes.' };
    }

    return { eligible: true };
  }

  public submitFeedback(studentId: string, eventId: string, rating: number, comment: string): EventFeedback {
    const student = this.users.find(u => u.id === studentId);
    const newFb: EventFeedback = {
      id: `fb_${Date.now()}`,
      event_id: eventId,
      student_id: studentId,
      rating,
      comment,
      created_at: new Date().toISOString(),
      student_name: student?.full_name || 'Anonymous Student'
    };

    this.feedback.push(newFb);
    this.persistAll();
    return newFb;
  }

  public getEventAverageRating(eventId: string): { average: number; count: number } {
    const list = this.getEventFeedback(eventId);
    if (list.length === 0) return { average: 0, count: 0 };
    const sum = list.reduce((acc, curr) => acc + curr.rating, 0);
    return {
      average: Math.round((sum / list.length) * 10) / 10,
      count: list.length
    };
  }

  public getStudentCertificates(studentId: string): Certificate[] {
    return this.certificates.filter(c => c.student_id === studentId);
  }

  public getEventCertificates(eventId: string): Certificate[] {
    return this.certificates.filter(c => c.event_id === eventId);
  }

  public toggleCertificateAvailability(eventId: string, studentId: string, status: 'Available' | 'Not Available'): Certificate {
    let cert = this.certificates.find(c => c.event_id === eventId && c.student_id === studentId);
    if (cert) {
      cert.status = status;
      cert.issued_at = status === 'Available' ? new Date().toISOString() : cert.issued_at;
    } else {
      cert = {
        id: `cert_${Date.now()}`,
        event_id: eventId,
        student_id: studentId,
        certificate_url: `https://campus.edu/certificates/CERT-${eventId.toUpperCase()}-${studentId.toUpperCase()}.pdf`,
        status: status,
        issued_at: status === 'Available' ? new Date().toISOString() : undefined
      };
      this.certificates.push(cert);
    }

    if (status === 'Available') {
      const event = this.getEventById(eventId);
      this.addNotification({
        user_id: studentId,
        title: 'Certificate Available! 🏆',
        message: `Your certificate of completion for "${event?.title || 'Event'}" is ready in My Achievements.`,
        type: 'success'
      });
    }

    this.persistAll();
    return cert;
  }

  public getUserNotifications(userId: string): NotificationItem[] {
    return this.notifications
      .filter(n => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getUnreadNotificationCount(userId: string): number {
    return this.notifications.filter(n => n.user_id === userId && !n.is_read).length;
  }

  public markNotificationRead(notifId: string) {
    const n = this.notifications.find(item => item.id === notifId);
    if (n) n.is_read = true;
    this.persistAll();
  }

  public markAllNotificationsRead(userId: string) {
    this.notifications.filter(n => n.user_id === userId).forEach(n => n.is_read = true);
    this.persistAll();
  }

  public addNotification(item: Omit<NotificationItem, 'id' | 'is_read' | 'created_at'>) {
    const notif: NotificationItem = {
      ...item,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      is_read: false,
      created_at: new Date().toISOString()
    };
    this.notifications.unshift(notif);
    this.persistAll();
  }

  public getActivityFeed(): ActivityFeedItem[] {
    return [...this.activityFeed].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public addActivityItem(item: Omit<ActivityFeedItem, 'id' | 'created_at'>) {
    const feedItem: ActivityFeedItem = {
      ...item,
      id: `act_${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.activityFeed.unshift(feedItem);
    this.persistAll();
  }
}

export const db = new DatabaseService();
