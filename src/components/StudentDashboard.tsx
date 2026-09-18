import React, { useState } from 'react';
import {
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  BookOpen,
  PieChart,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  StudentRecord,
  Subject,
  AttendanceRecord,
  CollegeClass,
} from '../types';

interface StudentDashboardProps {
  student: StudentRecord;
  subjects: Subject[];
  records: AttendanceRecord[];
  classes: CollegeClass[];
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  subjects,
  records,
  classes,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'history' | 'calendar'>('summary');
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  const studentClass = classes.find((c) => c.id === student.classId);
  const myRecords = records.filter((r) => r.studentId === student.id);

  // Dynamic Calculation of Subject-wise Attendance
  const subjectSummaries = subjects.map((sub) => {
    const subRecords = myRecords.filter((r) => r.subjectId === sub.id);
    const totalClasses = subRecords.length;
    const presentClasses = subRecords.filter((r) => r.status === 'Present' || r.status === 'OD').length;
    const percentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 100;

    return {
      subjectId: sub.id,
      subjectName: sub.subjectName,
      subjectCode: sub.subjectCode,
      presentClasses,
      totalClasses,
      percentage,
    };
  });

  // Overall Attendance Calculation
  const totalConducted = myRecords.length;
  const totalAttended = myRecords.filter((r) => r.status === 'Present' || r.status === 'OD').length;
  const overallPercentage = totalConducted > 0 ? Math.round((totalAttended / totalConducted) * 100) : 100;

  // Low attendance check (< 75%)
  const lowAttendanceSubjects = subjectSummaries.filter((s) => s.totalClasses > 0 && s.percentage < 75);

  const getStatusBadge = (pct: number) => {
    if (pct >= 85) return { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300', label: 'Excellent' };
    if (pct >= 75) return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', label: 'Good' };
    if (pct >= 65) return { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300', label: 'Moderate' };
    return { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300', label: 'Low (<75%)' };
  };

  const overallBadge = getStatusBadge(overallPercentage);

  return (
    <div className="p-4 space-y-4 text-slate-800">
      {/* Greeting Card */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 text-white rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] text-blue-200 uppercase font-semibold tracking-wider">
              Student Portal
            </span>
            <h2 className="text-lg font-bold mt-0.5">Hello, {student.name}</h2>
            <p className="text-xs text-blue-200">
              Reg No: <span className="font-mono font-bold text-white">{student.registerNumber}</span> &bull; {studentClass?.className}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center font-bold text-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Overall Percentage Card */}
        <div className="mt-4 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 flex items-center justify-between">
          <div>
            <span className="text-xs text-blue-100 block">Overall Cumulative Attendance</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-black">{overallPercentage}%</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${overallBadge.bg} ${overallBadge.text} ${overallBadge.border}`}>
                {overallBadge.label}
              </span>
            </div>
            <p className="text-[10px] text-blue-200 mt-1">
              {totalAttended} attended out of {totalConducted} total periods
            </p>
          </div>

          {/* Circular Visual Indicator */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/20"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={overallPercentage >= 75 ? 'text-emerald-400' : 'text-rose-400'}
                strokeDasharray={`${overallPercentage}, 100`}
                strokeWidth="4"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold">{overallPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Low Attendance Warning Alert */}
      {lowAttendanceSubjects.length > 0 && (
        <div className="bg-rose-50 border border-rose-300 rounded-xl p-3.5 text-xs text-rose-900 shadow-sm flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-rose-950">
              Low Attendance Warning (Below 75% Threshold)
            </span>
            <p className="mt-0.5 text-[11px] leading-relaxed">
              Your attendance in <strong>{lowAttendanceSubjects.map((s) => s.subjectName).join(', ')}</strong> is below the mandatory university 75% requirement. Attend upcoming periods to remain eligible for semester examinations.
            </p>
          </div>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="grid grid-cols-2 gap-1 bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
        <button
          onClick={() => setActiveTab('summary')}
          className={`py-1.5 rounded-lg transition-all ${
            activeTab === 'summary' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Subject-wise Roll
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-1.5 rounded-lg transition-all ${
            activeTab === 'history' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Period History ({myRecords.length})
        </button>
      </div>

      {/* SUBJECT-WISE TAB */}
      {activeTab === 'summary' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              MCA Semester I Subjects
            </h3>
            <span className="text-[10px] text-slate-500 font-medium">Dynamic Calculation</span>
          </div>

          <div className="space-y-2.5">
            {subjectSummaries.map((sub) => {
              const badge = getStatusBadge(sub.percentage);
              const isExpanded = expandedSubject === sub.subjectId;
              const subRecords = myRecords.filter((r) => r.subjectId === sub.subjectId);

              return (
                <div
                  key={sub.subjectId}
                  className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm space-y-2 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="pr-2">
                      <span className="font-bold text-xs text-slate-900 block">{sub.subjectName}</span>
                      <span className="text-[10px] font-mono text-indigo-600 font-semibold">{sub.subjectCode}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-base font-extrabold text-slate-900">{sub.percentage}%</span>
                      <span className={`block text-[9px] font-bold px-1.5 py-0.5 rounded border mt-0.5 ${badge.bg} ${badge.text} ${badge.border}`}>
                        {sub.presentClasses} / {sub.totalClasses} Conducted
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        sub.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${sub.percentage}%` }}
                    />
                  </div>

                  {/* Collapsible toggle for subject periods */}
                  <button
                    onClick={() => setExpandedSubject(isExpanded ? null : sub.subjectId)}
                    className="w-full flex items-center justify-between text-[11px] text-slate-500 pt-1 hover:text-slate-800"
                  >
                    <span>View {subRecords.length} recorded period logs</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {isExpanded && (
                    <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                      {subRecords.length === 0 ? (
                        <p className="text-[10px] text-slate-400">No sessions recorded yet.</p>
                      ) : (
                        subRecords.map((r) => (
                          <div key={r.id} className="flex items-center justify-between text-[11px] p-1.5 bg-slate-50 rounded">
                            <div>
                              <span className="font-medium text-slate-800">{r.date} &bull; Period {r.period}</span>
                              <span className="block text-[10px] text-slate-500 truncate max-w-[200px]">{r.topic}</span>
                            </div>
                            <span
                              className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                                r.status === 'Present'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : r.status === 'OD'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {r.status}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Chronological Period Records
            </h3>
            <span className="text-[10px] text-slate-500">ReadOnly</span>
          </div>

          <div className="space-y-2">
            {myRecords
              .slice()
              .reverse()
              .map((r) => {
                const sub = subjects.find((s) => s.id === r.subjectId);
                return (
                  <div key={r.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px]">
                          P{r.period}
                        </span>
                        {sub?.subjectName}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {r.date} &bull; Topic: {r.topic}
                      </p>
                    </div>

                    <span
                      className={`font-bold px-2 py-1 rounded text-xs shrink-0 ${
                        r.status === 'Present'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.status === 'OD'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
