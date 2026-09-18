import React, { useState } from 'react';
import {
  Smartphone,
  BookOpen,
  Database,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ListOrdered,
} from 'lucide-react';
import {
  UserProfile,
  UserRole,
  TeacherRecord,
  StudentRecord,
  CollegeClass,
  Subject,
  Department,
  TeacherAssignment,
  AttendanceSession,
  AttendanceRecord,
  AttendanceStatus,
} from './types';
import {
  initialDepartments,
  initialClasses,
  initialSubjects,
  initialTeachers,
  initialStudents,
  initialAssignments,
  initialUsers,
  generateInitialAttendance,
} from './data/mockData';
import { MobileFrame } from './components/MobileFrame';
import { LoginScreen } from './components/LoginScreen';
import { MasterDashboard } from './components/MasterDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { ReportsView } from './components/ReportsView';
import { PhaseGuide } from './components/PhaseGuide';
import { FirestoreSchemaModal } from './components/FirestoreSchemaModal';

export default function App() {
  // Main view mode: 'simulator' (Interactive Mobile App) or 'guide' (Phase 1 & MCA Roadmap)
  const [viewMode, setViewMode] = useState<'simulator' | 'guide'>('simulator');
  const [showSchemaModal, setShowSchemaModal] = useState(false);

  // Authentication State (default to Master for easy instant review, or logout to test login screen)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(initialUsers[0]); // Master Admin
  const [navTab, setNavTab] = useState<string>('home');
  const [isViewingReports, setIsViewingReports] = useState(false);

  // Master Data State
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [classes, setClasses] = useState<CollegeClass[]>(initialClasses);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [teachers, setTeachers] = useState<TeacherRecord[]>(initialTeachers);
  const [students, setStudents] = useState<StudentRecord[]>(initialStudents);
  const [assignments, setAssignments] = useState<TeacherAssignment[]>(initialAssignments);

  // Dynamic Attendance State
  const [attendanceData, setAttendanceData] = useState(() => generateInitialAttendance());

  // Handle Login
  const handleLogin = (role: UserRole, email: string) => {
    let matchedUser = initialUsers.find((u) => u.role === role);
    if (!matchedUser) {
      matchedUser = {
        id: `user-${Date.now()}`,
        name: role === 'master' ? 'Dean / Admin' : role === 'teacher' ? 'Faculty Member' : 'Student',
        email,
        role,
        active: true,
        createdAt: new Date().toISOString(),
      };
    }
    setCurrentUser(matchedUser);
    setNavTab('home');
    setIsViewingReports(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsViewingReports(false);
  };

  // Add Teacher
  const handleAddTeacher = (newT: Omit<TeacherRecord, 'id' | 'userId'>) => {
    const id = `teacher-${Date.now()}`;
    const teacherRecord: TeacherRecord = {
      ...newT,
      id,
      userId: `u-${id}`,
    };
    setTeachers((prev) => [teacherRecord, ...prev]);
  };

  // Toggle Teacher Status (Active / Disabled)
  const handleToggleTeacherStatus = (teacherId: string) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === teacherId ? { ...t, active: !t.active } : t))
    );
  };

  // Add Student
  const handleAddStudent = (newS: Omit<StudentRecord, 'id' | 'userId'>) => {
    const id = `student-${Date.now()}`;
    const studentRecord: StudentRecord = {
      ...newS,
      id,
      userId: `u-${id}`,
    };
    setStudents((prev) => [...prev, studentRecord]);
  };

  // Attendance Submission with Duplicate Detection
  const handleSubmitAttendance = (
    classId: string,
    subjectId: string,
    date: string,
    period: number,
    topic: string,
    attendanceMap: Record<string, AttendanceStatus>
  ) => {
    // 1. Prevent duplicate attendance for the same: class, subject, date, period
    const isDuplicate = attendanceData.sessions.some(
      (s) =>
        s.classId === classId &&
        s.subjectId === subjectId &&
        s.date === date &&
        s.period === period
    );

    if (isDuplicate) {
      return {
        success: false,
        message: `Duplicate Error: Attendance for Period ${period} on ${date} has already been registered!`,
      };
    }

    const sessionId = `sess-${Date.now()}`;
    const classStudents = students.filter((s) => s.classId === classId);
    let presentCount = 0;
    let absentCount = 0;

    const newRecords: AttendanceRecord[] = classStudents.map((stu) => {
      const status = attendanceMap[stu.id] || 'Present';
      if (status === 'Present' || status === 'OD') presentCount++;
      else absentCount++;

      return {
        id: `att-${Date.now()}-${stu.id}`,
        studentId: stu.id,
        classId,
        subjectId,
        teacherId: currentUser ? currentUser.id : 'teacher-1',
        date,
        period,
        topic,
        status,
        timestamp: new Date().toISOString(),
      };
    });

    const newSession: AttendanceSession = {
      id: sessionId,
      classId,
      subjectId,
      teacherId: currentUser ? currentUser.id : 'teacher-1',
      date,
      period,
      topic,
      submittedAt: `${date} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      totalStudents: classStudents.length,
      presentCount,
      absentCount,
    };

    setAttendanceData((prev) => ({
      sessions: [newSession, ...prev.sessions],
      records: [...prev.records, ...newRecords],
    }));

    return {
      success: true,
      message: `Attendance submitted successfully for Period ${period}! (${presentCount}/${classStudents.length} present)`,
    };
  };

  // Current Teacher record if logged in as teacher
  const currentTeacher =
    teachers.find((t) => t.userId === currentUser?.id || t.email === currentUser?.email) || teachers[0];

  // Current Student record if logged in as student
  const currentStudent =
    students.find((s) => s.userId === currentUser?.id || s.email === currentUser?.email) || students[0];

  // Compute Page Title for Mobile Frame
  const getScreenTitle = () => {
    if (!currentUser) return 'Sign In';
    if (isViewingReports) return 'Attendance Reports';
    if (currentUser.role === 'master') {
      if (navTab === 'management') return 'College Management';
      if (navTab === 'reports') return 'College Reports';
      return 'Master Dashboard';
    }
    if (currentUser.role === 'teacher') {
      if (navTab === 'mark') return 'Period Attendance (1-5)';
      if (navTab === 'reports') return 'Class Reports';
      return 'Teacher Dashboard';
    }
    if (currentUser.role === 'student') {
      if (navTab === 'reports') return 'Detailed History';
      return 'Student Portal';
    }
    return 'Attendance System';
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Application Header / Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                Student Attendance Management System
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                MCA Final Project &bull; Flutter Mobile Frontend + Firebase Cloud Firestore
              </p>
            </div>
          </div>

          {/* View Mode Toggle & Database Schema button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSchemaModal(true)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              title="View Firestore Database Schema"
            >
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Firestore Schema</span>
            </button>

            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
              <button
                onClick={() => setViewMode('simulator')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'simulator'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>App Simulator</span>
              </button>
              <button
                onClick={() => setViewMode('guide')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'guide'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Phase 1 Guide</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1">
        {viewMode === 'guide' ? (
          <PhaseGuide onOpenMobileDemo={() => setViewMode('simulator')} />
        ) : (
          <div className="max-w-6xl mx-auto px-4 py-6">
            {/* Quick Helper Banner for Beginner */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <span className="font-bold text-slate-900 block">
                    Interactive Material 3 Mobile Prototype
                  </span>
                  <span className="text-slate-500">
                    Switch roles below (Master / Teacher / Student) to test period-wise attendance, duplicate prevention, and dynamic percentage formulas.
                  </span>
                </div>
              </div>

              {currentUser && (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-slate-500 text-[11px]">Active Role:</span>
                  <span className="font-bold uppercase text-[10px] px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                    {currentUser.role}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-[11px] text-rose-600 hover:underline font-semibold"
                  >
                    Switch User
                  </button>
                </div>
              )}
            </div>

            {/* Android Mobile Frame Container */}
            <MobileFrame
              currentUser={currentUser}
              onLogout={handleLogout}
              title={getScreenTitle()}
              showBack={isViewingReports}
              onBack={() => setIsViewingReports(false)}
              activeNavTab={navTab}
              onNavTabChange={(tab) => {
                setNavTab(tab);
                if (tab === 'reports') {
                  setIsViewingReports(true);
                } else {
                  setIsViewingReports(false);
                }
              }}
              onOpenSchema={() => setShowSchemaModal(true)}
            >
              {!currentUser ? (
                <LoginScreen onLogin={handleLogin} />
              ) : isViewingReports ? (
                <ReportsView
                  students={students}
                  subjects={subjects}
                  classes={classes}
                  records={attendanceData.records}
                  sessions={attendanceData.sessions}
                  onBack={() => setIsViewingReports(false)}
                />
              ) : currentUser.role === 'master' ? (
                <MasterDashboard
                  teachers={teachers}
                  students={students}
                  classes={classes}
                  subjects={subjects}
                  departments={departments}
                  assignments={assignments}
                  sessions={attendanceData.sessions}
                  onAddTeacher={handleAddTeacher}
                  onToggleTeacherStatus={handleToggleTeacherStatus}
                  onAddStudent={handleAddStudent}
                  onViewReports={() => setIsViewingReports(true)}
                />
              ) : currentUser.role === 'teacher' ? (
                <TeacherDashboard
                  currentTeacher={currentTeacher}
                  assignments={assignments}
                  classes={classes}
                  subjects={subjects}
                  students={students}
                  sessions={attendanceData.sessions}
                  records={attendanceData.records}
                  onSubmitAttendance={handleSubmitAttendance}
                  onViewReports={() => setIsViewingReports(true)}
                  defaultTab={navTab === 'mark' ? 'mark' : 'home'}
                />
              ) : (
                <StudentDashboard
                  student={currentStudent}
                  subjects={subjects}
                  records={attendanceData.records}
                  classes={classes}
                />
              )}
            </MobileFrame>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500">
        MCA Final Project &bull; Student Attendance Management System &bull; Flutter Material 3 &amp; Cloud Firestore
      </footer>

      {/* Schema Modal */}
      {showSchemaModal && (
        <FirestoreSchemaModal onClose={() => setShowSchemaModal(false)} />
      )}
    </div>
  );
}
