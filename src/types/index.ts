export type UserRole = 'student' | 'organizer' | 'admin';

export type EventCategory = 
  | 'Technical' 
  | 'Coding' 
  | 'AI/ML' 
  | 'Web Dev' 
  | 'Cybersecurity'
  | 'Management' 
  | 'Cultural' 
  | 'Sports' 
  | 'Workshop'
  | 'Hackathon';

export type EventType = 
  | 'workshop' 
  | 'hackathon' 
  | 'seminar' 
  | 'competition' 
  | 'cultural' 
  | 'sports' 
  | 'other';

export type EventMode = 'online' | 'offline' | 'hybrid';

export type EventStatus = 
  | 'draft' 
  | 'published' 
  | 'registration_closed' 
  | 'completed' 
  | 'cancelled';

export type RegistrationStatus = 
  | 'Confirmed' 
  | 'Pending' 
  | 'Cancelled' 
  | 'Waitlisted' 
  | 'Rejected';

export type CertificateStatus = 'Processing' | 'Available' | 'Not Available';

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  college: string;
  department: string;
  academic_year: string;
  profile_image?: string;
  created_at: string;
  updated_at: string;
}

export interface EventItem {
  id: string;
  organizer_id: string;
  organizer_name: string;
  title: string;
  description: string;
  category: EventCategory;
  department: string;
  event_type: EventType;
  mode: EventMode;
  banner_url: string;
  event_date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string;   // HH:mm
  location: string;
  meeting_link?: string;
  max_participants: number;
  registration_deadline: string; // YYYY-MM-DDTHH:mm
  registration_fee: number;
  eligibility: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  allow_waitlist: boolean;
  status: EventStatus;
  created_at: string;
  updated_at: string;
}

export interface Registration {
  id: string;
  event_id: string;
  student_id: string;
  registration_id: string; // unique e.g., REG-8941
  qr_token: string;        // token for QR code
  status: RegistrationStatus;
  registered_at: string;
  checked_in_at?: string | null;
}

export interface WaitlistEntry {
  id: string;
  event_id: string;
  student_id: string;
  position: number;
  status: 'active' | 'promoted' | 'cancelled';
  created_at: string;
  promoted_at?: string | null;
}

export interface AttendanceRecord {
  id: string;
  event_id: string;
  student_id: string;
  registration_id: string;
  status: 'present' | 'absent';
  check_in_time: string;
  verified_by: string;
}

export interface SavedEvent {
  id: string;
  student_id: string;
  event_id: string;
  created_at: string;
}

export interface EventFeedback {
  id: string;
  event_id: string;
  student_id: string;
  rating: number; // 1-5
  comment: string;
  created_at: string;
  student_name?: string;
}

export interface Certificate {
  id: string;
  event_id: string;
  student_id: string;
  certificate_url?: string;
  status: CertificateStatus;
  issued_at?: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  is_read: boolean;
  created_at: string;
}

export interface ActivityFeedItem {
  id: string;
  type: 'new_event' | 'event_almost_full' | 'deadline_approaching' | 'venue_updated' | 'event_cancelled' | 'certificate_issued';
  title: string;
  description: string;
  related_event_id?: string;
  visibility: 'public' | 'student' | 'organizer';
  created_at: string;
}

export interface ScheduleConflict {
  existingEvent: EventItem;
  targetEvent: EventItem;
}
