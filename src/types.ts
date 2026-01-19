// --- CHAT & USER TYPES ---
export interface User {
  id: string;
  name: string;
  avatar: string; // 'user' | 'bot' | 'zap' | 'atom' | 'hex'
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

// --- CLASSROOM & AUTH TYPES ---
export type UserRole = 'STUDENT' | 'TEACHER';

export interface Classroom {
  id: string;
  name: string;
  subject: string;
  teacherName: string;
  code: string;
  themeColor: string;
}

// --- STUDENT DASHBOARD TYPES ---
export type AssignmentStatus = 'PENDING' | 'SUBMITTED' | 'LATE' | 'GRADED';

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: AssignmentStatus;
  grade?: string;     // Optional: only exists if graded
  feedback?: string;  // Optional: teacher notes
}

export interface Notification {
  id: string;
  title: string;
  time: string;
  type: 'ALERT' | 'GRADE' | 'ASSIGNMENT';
  read: boolean;
}

export interface StudentStats {
  xp: number;
  streak: number;
  completionRate: number;
  upcomingDeadlines: number;
}
// Add to src/types.ts

export interface Submission {
  id: string;
  studentName: string;
  avatar: string;
  submittedDate: string;
  status: 'GRADED' | 'PENDING' | 'LATE';
  grade?: number;
  plagiarismScore: number; // 0-100%
  aiScore: number;         // 0-100%
  fileUrl?: string;
}

export interface TeacherStats {
  totalStudents: number;
  assignmentsActive: number;
  papersToGrade: number;
  classAverage: number;
}