import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CheckSquare,
  Users,
  ChevronRight,
  Send,
  History,
  Info,
} from 'lucide-react';
import {
  TeacherRecord,
  StudentRecord,
  CollegeClass,
  Subject,
  TeacherAssignment,
  AttendanceRecord,
  AttendanceSession,
  AttendanceStatus,
} from '../types';

interface TeacherDashboardProps {
  currentTeacher: TeacherRecord;
  assignments: TeacherAssignment[];
  classes: CollegeClass[];
  subjects: Subject[];
  students: StudentRecord[];
  sessions: AttendanceSession[];
  records: AttendanceRecord[];
  onSubmitAttendance: (
    classId: string,
    subjectId: string,
    date: string,
    period: number,
    topic: string,
    attendanceMap: Record<string, AttendanceStatus>
  ) => { success: boolean; message: string };
  onViewReports: () => void;
  defaultTab?: 'home' | 'mark' | 'history';
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  currentTeacher,
  assignments,
  classes,
  subjects,
  students,
  sessions,
  records,
  onSubmitAttendance,
  onViewReports,
  defaultTab = 'home',
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'mark' | 'history'>(defaultTab);

  // Filter only classes & subjects assigned to this teacher!
  const myAssignments = assignments.filter((a) => a.teacherId === currentTeacher.id);
  const myClassIds = Array.from(new Set(myAssignments.map((a) => a.classId)));
  const myClasses = classes.filter((c) => myClassIds.includes(c.id));

  // Attendance Marking Flow States
  const [selectedClassId, setSelectedClassId] = useState<string>(myClasses[0]?.id || '');
  
  // Available subjects for the selected class assigned to this teacher
  const availableSubjectsForClass = myAssignments
    .filter((a) => a.classId === selectedClassId)
    .map((a) => subjects.find((s) => s.id === a.subjectId)!)
    .filter(Boolean);

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    availableSubjectsForClass[0]?.id || ''
  );
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-18');
  const [selectedPeriod, setSelectedPeriod] = useState<number>(3);
  const [topic, setTopic] = useState<string>('NumPy Vector Operations & Array Indexing');

  // Attendance Status Map: studentId -> 'Present' | 'Absent' | 'OD' | 'Leave'
  const classStudents = students.filter((s) => s.classId === selectedClassId);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>(() => {
    const initial: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      initial[s.id] = 'Present';
    });
    return initial;
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Quick mark actions
  const handleMarkAll = (status: AttendanceStatus) => {
    const updated = { ...attendanceMap };
    classStudents.forEach((s) => {
      updated[s.id] = status;
    });
    setAttendanceMap(updated);
  };

  const handleStudentStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // Check for duplicate attendance for this exact class + subject + date + period
  const existingSession = sessions.find(
    (s) =>
      s.classId === selectedClassId &&
      s.subjectId === selectedSubjectId &&
      s.date === selectedDate &&
      s.period === selectedPeriod
  );

  const handleInitiateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setSubmissionFeedback({ type: 'error', message: 'Please enter the topic covered in this period.' });
      return;
    }
    if (existingSession) {
      setSubmissionFeedback({
        type: 'error',
        message: `Duplicate Attendance Detected: Period ${selectedPeriod} attendance for this subject and date was already submitted at ${existingSession.submittedAt}.`,
      });
      return;
    }
    setSubmissionFeedback(null);
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    const result = onSubmitAttendance(
      selectedClassId,
      selectedSubjectId,
      selectedDate,
      selectedPeriod,
      topic,
      attendanceMap
    );

    if (result.success) {
      setSubmissionFeedback({ type: 'success', message: result.message });
      // Reset or advance to next period
      if (selectedPeriod < 5) {
        setSelectedPeriod(selectedPeriod + 1);
        setTopic('');
      }
    } else {
      setSubmissionFeedback({ type: 'error', message: result.message });
    }
  };

  // Recent sessions by this teacher
  const mySessions = sessions.filter((s) => s.teacherId === currentTeacher.id);

  return (
    <div className="p-4 space-y-4 text-slate-800">
      {/* Teacher Profile Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-blue-900 text-white rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-indigo-200 font-medium">Faculty Portal &bull; MCA Dept</p>
            <h2 className="text-base font-bold mt-0.5">{currentTeacher.name}</h2>
            <p className="text-xs text-indigo-300">Emp ID: {currentTeacher.employeeId}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center font-bold text-lg">
            {currentTeacher.name.split(' ')[1]?.[0] || 'T'}
          </div>
        </div>

        {/* Quick summary strip */}
        <div className="mt-3 pt-3 border-t border-indigo-600/40 grid grid-cols-2 gap-2 text-center text-xs">
          <div className="bg-white/10 rounded-lg py-1.5 px-2">
            <span className="text-[10px] text-indigo-200 block">Assigned Subjects</span>
            <span className="font-bold text-white">{myAssignments.length}</span>
          </div>
          <div className="bg-white/10 rounded-lg py-1.5 px-2">
            <span className="text-[10px] text-indigo-200 block">Sessions Logged</span>
            <span className="font-bold text-emerald-300">{mySessions.length}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
        <button
          onClick={() => setActiveTab('home')}
          className={`py-1.5 rounded-lg transition-all ${
            activeTab === 'home' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          My Classes
        </button>
        <button
          onClick={() => setActiveTab('mark')}
          className={`py-1.5 rounded-lg transition-all ${
            activeTab === 'mark' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Mark Roll (5P)
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-1.5 rounded-lg transition-all ${
            activeTab === 'history' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          History ({mySessions.length})
        </button>
      </div>

      {/* HOME TAB: My Classes & Subjects */}
      {activeTab === 'home' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              My Teaching Allocations
            </h3>
            <div className="space-y-2">
              {myAssignments.map((asgn) => {
                const cls = classes.find((c) => c.id === asgn.classId);
                const sub = subjects.find((s) => s.id === asgn.subjectId);
                return (
                  <div key={asgn.id} className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-xs text-slate-900">{sub?.subjectName}</span>
                        <p className="text-[10px] font-mono text-indigo-600 font-bold">{sub?.subjectCode}</p>
                      </div>
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold border border-indigo-200">
                        {cls?.className}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        Semester {sub?.semester} &bull; 5 Periods/Day
                      </span>
                      <button
                        onClick={() => {
                          setSelectedClassId(asgn.classId);
                          setSelectedSubjectId(asgn.subjectId);
                          setActiveTab('mark');
                        }}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <span>Take Roll</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2">
            <span className="text-xs font-bold text-slate-900">Attendance Guidelines for Faculty</span>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>Mark attendance within the scheduled period window.</li>
              <li>Always record the topic taught to ensure syllabus audit compliance.</li>
              <li>Students with &lt; 75% will automatically receive an in-app alert.</li>
            </ul>
          </div>
        </div>
      )}

      {/* MARK ATTENDANCE TAB: Step 1 -> Step 6 Workflow */}
      {activeTab === 'mark' && (
        <form onSubmit={handleInitiateSubmit} className="space-y-4">
          {submissionFeedback && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                submissionFeedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {submissionFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              )}
              <div className="font-medium">{submissionFeedback.message}</div>
            </div>
          )}

          {/* Workflow Step 1 & 2: Class & Subject */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm space-y-3">
            <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px]">1</span>
              Class & Subject Selection
            </div>

            <div className="grid grid-cols-1 gap-2 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Class</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => {
                    setSelectedClassId(e.target.value);
                    const subs = myAssignments
                      .filter((a) => a.classId === e.target.value)
                      .map((a) => subjects.find((s) => s.id === a.subjectId)!)
                      .filter(Boolean);
                    if (subs[0]) setSelectedSubjectId(subs[0].id);
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2 font-medium text-slate-800 bg-white"
                >
                  {myClasses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.className}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Assigned Subject</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 font-medium text-slate-800 bg-white"
                >
                  {availableSubjectsForClass.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.subjectName} ({s.subjectCode})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Workflow Step 3, 4, 5: Date, Period (1 to 5), Topic */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm space-y-3">
            <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px]">2</span>
              Schedule: Date & 5 Periods
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-1.5 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Period (1 to 5)</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((p) => {
                    const isTaken = sessions.some(
                      (s) =>
                        s.classId === selectedClassId &&
                        s.subjectId === selectedSubjectId &&
                        s.date === selectedDate &&
                        s.period === p
                    );
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setSelectedPeriod(p)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
                          selectedPeriod === p
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : isTaken
                            ? 'bg-slate-200 text-slate-400 border border-slate-300'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border'
                        }`}
                      >
                        {p}
                        {isTaken && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" title="Already Taken" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {existingSession && (
              <div className="bg-amber-50 border border-amber-300 text-amber-900 p-2 rounded-lg text-xs flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Period {selectedPeriod} attendance was already submitted ({existingSession.submittedAt}).</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Topic Covered</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Multithreading, NoSQL Schema Design..."
                className="w-full border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
                required
              />
            </div>
          </div>

          {/* Workflow Step 6: Student List with Present/Absent/OD */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900">Student Roster ({classStudents.length})</span>
                <p className="text-[10px] text-slate-500">Tap status to toggle</p>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => handleMarkAll('Present')}
                  className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px] font-bold rounded-md border border-emerald-200"
                >
                  All Present
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkAll('Absent')}
                  className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 text-[10px] font-bold rounded-md border border-rose-200"
                >
                  All Absent
                </button>
              </div>
            </div>

            {/* Student List */}
            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
              {classStudents.map((s) => {
                const currentStatus = attendanceMap[s.id] || 'Present';
                return (
                  <div key={s.id} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{s.name}</span>
                      <span className="text-[10px] font-mono text-slate-500">{s.registerNumber}</span>
                    </div>

                    <div className="flex gap-1">
                      {(['Present', 'Absent', 'OD'] as AttendanceStatus[]).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleStudentStatusChange(s.id, st)}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                            currentStatus === st
                              ? st === 'Present'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : st === 'Absent'
                                ? 'bg-rose-600 text-white shadow-sm'
                                : 'bg-amber-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {st === 'Present' ? 'P' : st === 'Absent' ? 'A' : 'OD'}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!!existingSession}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
              existingSession
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-98'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Submit Period {selectedPeriod} Attendance</span>
          </button>
        </form>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Submitted Attendance Sessions
            </h3>
            <button
              onClick={onViewReports}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              Export Reports
            </button>
          </div>

          <div className="space-y-2">
            {mySessions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No previous attendance records found.</p>
            ) : (
              mySessions.map((s) => {
                const sub = subjects.find((sb) => sb.id === s.subjectId);
                const cls = classes.find((c) => c.id === s.classId);
                return (
                  <div key={s.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm space-y-1 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-slate-900">{sub?.subjectName}</span>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {s.date} &bull; Period {s.period} &bull; {cls?.className}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {s.presentCount}/{s.totalStudents} P
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 italic bg-slate-50 p-1.5 rounded">
                      Topic: &quot;{s.topic}&quot;
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SUBMISSION CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 max-w-xs w-full shadow-2xl space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-indigo-600" />
              Confirm Attendance Submission
            </h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to submit attendance for:
            </p>
            <div className="bg-slate-50 border rounded-lg p-2.5 text-xs space-y-1 font-medium text-slate-800">
              <div>&bull; <strong>Period:</strong> {selectedPeriod}</div>
              <div>&bull; <strong>Date:</strong> {selectedDate}</div>
              <div>&bull; <strong>Subject:</strong> {subjects.find(s => s.id === selectedSubjectId)?.subjectName}</div>
              <div>&bull; <strong>Topic:</strong> {topic}</div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-3 py-1.5 text-xs bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
