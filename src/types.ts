export type UserRole = 'student' | 'teacher' | 'parent' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  school_id: string;
  createdAt: string;
}

export interface School {
  id: string;
  name: string;
  address?: string;
  admin_id: string;
  createdAt: string;
}

export interface Class {
  id: string;
  name: string;
  grade: string;
  teacher_id: string;
  school_id: string;
  createdAt: string;
}

export interface Attendance {
  id: string;
  student_id: string;
  class_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  marked_by: string;
  createdAt: string;
}

export interface Homework {
  id: string;
  title: string;
  description: string;
  subject: string;
  due_date: string;
  class_id: string;
  created_by: string;
  attachment_url?: string;
  createdAt: string;
}

export interface HomeworkSubmission {
  id: string;
  homework_id: string;
  student_id: string;
  file_url?: string;
  text_response?: string;
  submitted_at: string;
  reviewed: boolean;
  feedback?: string;
}

export interface Assessment {
  id: string;
  name: string;
  type: string;
  date: string;
  total_marks: number;
  subject: string;
  class_id: string;
  created_by: string;
  createdAt: string;
}

export interface AssessmentScore {
  id: string;
  assessment_id: string;
  student_id: string;
  score: number;
  feedback?: string;
  createdAt: string;
}

export interface Channel {
  id: string;
  name: string;
  class_id: string;
  type: 'group' | 'announcement' | 'dm';
  createdAt: string;
}

export interface Message {
  id: string;
  channel_id: string;
  sender_id: string;
  content: string;
  attachment_url?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}
