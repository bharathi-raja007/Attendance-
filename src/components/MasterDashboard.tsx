import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  Layers,
  BookOpen,
  CalendarCheck,
  AlertTriangle,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  UserCheck,
  Building,
  Bell,
  Sliders,
  ChevronRight,
} from 'lucide-react';
import {
  TeacherRecord,
  StudentRecord,
  CollegeClass,
  Subject,
  Department,
  TeacherAssignment,
  AttendanceSession,
} from '../types';

interface MasterDashboardProps {
  teachers: TeacherRecord[];
  students: StudentRecord[];
  classes: CollegeClass[];
  subjects: Subject[];
  departments: Department[];
  assignments: TeacherAssignment[];
  sessions: AttendanceSession[];
  onAddTeacher: (teacher: Omit<TeacherRecord, 'id' | 'userId'>) => void;
  onToggleTeacherStatus: (id: string) => void;
  onAddStudent: (student: Omit<StudentRecord, 'id' | 'userId'>) => void;
  onViewReports: () => void;
}

export const MasterDashboard: React.FC<MasterDashboardProps> = ({
  teachers,
  students,
  classes,
  subjects,
  departments,
  assignments,
  sessions,
  onAddTeacher,
  onToggleTeacherStatus,
  onAddStudent,
  onViewReports,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'teachers' | 'students' | 'classes' | 'assignments'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  // New Teacher form state
  const [tName, setTName] = useState('');
  const [tEmail, setTEmail] = useState('');
  const [tEmpId, setTEmpId] = useState('');
  const [tPhone, setTPhone] = useState('');

  // New Student form state
  const [sName, setSName] = useState('');
  const [sReg, setSReg] = useState('');
  const [sEmail, setSEmail] = useState('');

  // Calculate high-level metrics
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalClasses = classes.length;
  const totalSubjects = subjects.length;

  // Today attendance metrics (date: 2026-09-18)
  const todaySessions = sessions.filter((s) => s.date === '2026-09-18');
  const todayTotalPresents = todaySessions.reduce((acc, s) => acc + s.presentCount, 0);
  const todayTotalRoster = todaySessions.reduce((acc, s) => acc + s.totalStudents, 0);
  const todayRate = todayTotalRoster > 0 ? Math.round((todayTotalPresents / todayTotalRoster) * 100) : 88;

  // Filter low attendance demo students (< 75%)
  const lowAttendanceCount = 1; // e.g. Ravi Kumar in demo data

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName || !tEmail || !tEmpId) return;
    onAddTeacher({
      name: tName,
      email: tEmail,
      employeeId: tEmpId,
      departmentId: departments[0].id,
      active: true,
      phone: tPhone || '+91 98000 00000',
      designation: 'Assistant Professor',
    });
    setTName('');
    setTEmail('');
    setTEmpId('');
    setTPhone('');
    setShowAddTeacherModal(false);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sName || !sReg || !sEmail) return;
    onAddStudent({
      name: sName,
      registerNumber: sReg,
      email: sEmail,
      departmentId: departments[0].id,
      classId: classes[0].id,
      year: 1,
      semester: 1,
      active: true,
    });
    setSName('');
    setSReg('');
    setSEmail('');
    setShowAddStudentModal(false);
  };

  return (
    <div className="p-4 space-y-4 text-slate-800">
      {/* Tab Navigation Pill Header */}
      <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'teachers', label: `Teachers (${teachers.length})` },
          { id: 'students', label: `Students (${students.length})` },
          { id: 'classes', label: 'Classes & Subs' },
          { id: 'assignments', label: 'Allocations' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-indigo-800 to-indigo-950 text-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-indigo-300 font-medium">MCA Central Administration</p>
                <h2 className="text-base font-bold mt-0.5">Admin Control Console</h2>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/40">
                Live Cloud Sync
              </span>
            </div>
            <p className="text-xs text-indigo-200 mt-2">
              Academic Session 2025-2026 &bull; Real-time Period Tracking
            </p>
          </div>

          {/* Metric KPI Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Total Students</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-xl font-extrabold text-slate-900 mt-1">{totalStudents}</div>
              <span className="text-[10px] text-emerald-600 font-medium">8 enrolled in MCA-1A</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Faculty Members</span>
                <UserCheck className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-xl font-extrabold text-slate-900 mt-1">{totalTeachers}</div>
              <span className="text-[10px] text-indigo-600 font-medium">{teachers.filter(t => t.active).length} Active</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Today&apos;s Attendance</span>
                <CalendarCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xl font-extrabold text-slate-900 mt-1">{todayRate}%</div>
              <span className="text-[10px] text-slate-500">Periods 1 & 2 Marked</span>
            </div>

            <div className="bg-white border border-rose-200 bg-rose-50/40 rounded-xl p-3 shadow-sm">
              <div className="flex items-center justify-between text-rose-700 text-xs">
                <span>Low Attendance</span>
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-xl font-extrabold text-rose-700 mt-1">{lowAttendanceCount} Student</div>
              <span className="text-[10px] text-rose-600 font-medium">&lt; 75% Warning</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2">
            <span className="text-xs font-bold text-slate-900">Admin Quick Actions</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowAddTeacherModal(true)}
                className="flex items-center justify-center gap-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 py-2 px-3 rounded-lg text-xs font-semibold border border-indigo-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Teacher</span>
              </button>
              <button
                onClick={() => setShowAddStudentModal(true)}
                className="flex items-center justify-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 py-2 px-3 rounded-lg text-xs font-semibold border border-blue-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Student</span>
              </button>
            </div>
            <button
              onClick={onViewReports}
              className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 p-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 transition-colors"
            >
              <span>View Comprehensive Attendance Reports</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Recent Attendance Sessions Log */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Today&apos;s Submitted Sessions</span>
              <span className="text-[10px] text-slate-500 font-medium">5 Periods / Day</span>
            </div>
            <div className="space-y-2">
              {todaySessions.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-2">No sessions submitted yet today.</p>
              ) : (
                todaySessions.map((s) => {
                  const sub = subjects.find((sb) => sb.id === s.subjectId);
                  const teacher = teachers.find((t) => t.id === s.teacherId);
                  return (
                    <div key={s.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                            P{s.period}
                          </span>
                          {sub?.subjectName || 'Subject'}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          By {teacher?.name.split(' ')[1] || 'Faculty'} &bull; {s.topic}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-700">
                          {s.presentCount}/{s.totalStudents} Present
                        </span>
                        <p className="text-[9px] text-slate-400">{s.submittedAt}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TEACHERS TAB */}
      {activeTab === 'teachers' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search teacher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
            <button
              onClick={() => setShowAddTeacherModal(true)}
              className="bg-indigo-600 text-white p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-2">
            {teachers
              .filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.employeeId.includes(searchQuery))
              .map((t) => (
                <div key={t.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{t.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                        t.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {t.active ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      ID: {t.employeeId} &bull; {t.email}
                    </p>
                    <p className="text-[10px] text-indigo-600 font-medium mt-0.5">
                      {t.designation || 'Faculty'}
                    </p>
                  </div>

                  <button
                    onClick={() => onToggleTeacherStatus(t.id)}
                    className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                      t.active
                        ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    {t.active ? 'Disable' : 'Enable'}
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* STUDENTS TAB */}
      {activeTab === 'students' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search register no or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
            <button
              onClick={() => setShowAddStudentModal(true)}
              className="bg-blue-600 text-white p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-2">
            {students
              .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.registerNumber.includes(searchQuery))
              .map((s) => (
                <div key={s.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{s.name}</span>
                      <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold">
                        {s.registerNumber}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      MCA Year {s.year} &bull; Sem {s.semester} &bull; {s.email}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Enrolled
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* CLASSES & SUBJECTS TAB */}
      {activeTab === 'classes' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-3.5">
            <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-indigo-600" />
              Registered Classes ({classes.length})
            </h4>
            <div className="space-y-1.5">
              {classes.map((c) => (
                <div key={c.id} className="p-2 bg-slate-50 rounded-lg border text-xs flex justify-between">
                  <span className="font-semibold text-slate-800">{c.className}</span>
                  <span className="text-slate-500 text-[11px]">Sem {c.semester} (Sec {c.section})</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3.5">
            <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              MCA Curriculum Subjects ({subjects.length})
            </h4>
            <div className="space-y-1.5">
              {subjects.map((s) => (
                <div key={s.id} className="p-2 bg-slate-50 rounded-lg border text-xs flex justify-between">
                  <div>
                    <span className="font-semibold text-slate-800">{s.subjectName}</span>
                    <p className="text-[10px] text-slate-500 font-mono">{s.subjectCode}</p>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded h-fit">
                    Sem {s.semester}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ALLOCATIONS TAB */}
      {activeTab === 'assignments' && (
        <div className="space-y-3">
          <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-3 text-xs text-indigo-900">
            <strong>Role-Based Access Rule:</strong> Teachers can only view and take attendance for subjects and classes assigned to them below.
          </div>
          <div className="space-y-2">
            {assignments.map((asgn) => {
              const teacher = teachers.find((t) => t.id === asgn.teacherId);
              const sub = subjects.find((s) => s.id === asgn.subjectId);
              const cls = classes.find((c) => c.id === asgn.classId);
              return (
                <div key={asgn.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{sub?.subjectName}</span>
                    <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                      {sub?.subjectCode}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 flex items-center justify-between">
                    <span>Faculty: <strong>{teacher?.name}</strong></span>
                    <span className="text-indigo-600 font-semibold">{cls?.className}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ADD TEACHER MODAL */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 max-w-xs w-full shadow-2xl space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Add New Faculty</h3>
            <form onSubmit={handleCreateTeacher} className="space-y-2 text-xs">
              <input
                type="text"
                placeholder="Full Name (e.g. Dr. K. Raman)"
                value={tName}
                onChange={(e) => setTName(e.target.value)}
                required
                className="w-full border rounded-lg p-2 text-slate-800"
              />
              <input
                type="text"
                placeholder="Employee ID (e.g. EMP-MCA-004)"
                value={tEmpId}
                onChange={(e) => setTEmpId(e.target.value)}
                required
                className="w-full border rounded-lg p-2 text-slate-800"
              />
              <input
                type="email"
                placeholder="College Email"
                value={tEmail}
                onChange={(e) => setTEmail(e.target.value)}
                required
                className="w-full border rounded-lg p-2 text-slate-800"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={tPhone}
                onChange={(e) => setTPhone(e.target.value)}
                className="w-full border rounded-lg p-2 text-slate-800"
              />
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTeacherModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
                >
                  Save Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD STUDENT MODAL */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 max-w-xs w-full shadow-2xl space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Add New Student</h3>
            <form onSubmit={handleCreateStudent} className="space-y-2 text-xs">
              <input
                type="text"
                placeholder="Student Name (e.g. Anbu Selvan)"
                value={sName}
                onChange={(e) => setSName(e.target.value)}
                required
                className="w-full border rounded-lg p-2 text-slate-800"
              />
              <input
                type="text"
                placeholder="Register Number (e.g. 24MCA109)"
                value={sReg}
                onChange={(e) => setSReg(e.target.value)}
                required
                className="w-full border rounded-lg p-2 text-slate-800"
              />
              <input
                type="email"
                placeholder="Student College Email"
                value={sEmail}
                onChange={(e) => setSEmail(e.target.value)}
                required
                className="w-full border rounded-lg p-2 text-slate-800"
              />
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
