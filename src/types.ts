export type UserRole = 'master' | 'teacher' | 'student';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  active: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface CollegeClass {
  id: string;
  className: string;
  departmentId: string;
  year: number;
  section: string;
  semester: number;
}

export interface Subject {
  id: string;
  subjectName: string;
  subjectCode: string;
  departmentId: string;
  semester: number;
  credits?: number;
}

export interface TeacherAssignment {
  id: string;
  teacherId: string;
  classId: string;
  subjectId: string;
  academicYear: string;
}

export interface StudentRecord {
  id: string;
  userId: string;
  name: string;
  registerNumber: string;
  email: string;
  departmentId: string;
  classId: string;
  year: number;
  semester: number;
  active: boolean;
  phone?: string;
}

export interface TeacherRecord {
  id: string;
  userId: string;
  name: string;
  email: string;
  employeeId: string;
  departmentId: string;
  active: boolean;
  phone?: string;
  designation?: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'OD' | 'Leave';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  date: string; // YYYY-MM-DD
  period: number; // 1 to 5
  topic: string;
  status: AttendanceStatus;
  timestamp: string;
}

export interface AttendanceSession {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  date: string;
  period: number;
  topic: string;
  submittedAt: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
}

export interface SubjectAttendanceSummary {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  presentClasses: number;
  totalClasses: number;
  percentage: number;
}
