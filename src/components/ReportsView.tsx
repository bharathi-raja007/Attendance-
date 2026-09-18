import React, { useState } from 'react';
import {
  FileText,
  Filter,
  Download,
  Printer,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  Search,
} from 'lucide-react';
import {
  StudentRecord,
  Subject,
  CollegeClass,
  AttendanceRecord,
  AttendanceSession,
} from '../types';

interface ReportsViewProps {
  students: StudentRecord[];
  subjects: Subject[];
  classes: CollegeClass[];
  records: AttendanceRecord[];
  sessions: AttendanceSession[];
  onBack: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  students,
  subjects,
  classes,
  records,
  sessions,
  onBack,
}) => {
  const [reportType, setReportType] = useState<'student' | 'subject' | 'class'>('student');
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Student Attendance Calculations for selected class
  const classStudents = students.filter((s) => s.classId === selectedClassId);

  const studentReportData = classStudents.map((stu) => {
    const studentRecords = records.filter((r) => r.studentId === stu.id);
    const total = studentRecords.length;
    const present = studentRecords.filter((r) => r.status === 'Present' || r.status === 'OD').length;
    const pct = total > 0 ? Math.round((present / total) * 100) : 100;

    return {
      id: stu.id,
      name: stu.name,
      regNo: stu.registerNumber,
      total,
      present,
      absent: total - present,
      pct,
    };
  });

  return (
    <div className="p-4 space-y-4 text-slate-800">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <button
          onClick={() => setShowPrintModal(true)}
          className="bg-indigo-600 text-white hover:bg-indigo-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Export / Print</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900">Attendance Report Filters</span>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
            MCA Dept
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 mb-1">Class Filter</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full border rounded-lg p-1.5 text-xs text-slate-800 bg-white"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.className}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 mb-1">Report View</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full border rounded-lg p-1.5 text-xs text-slate-800 bg-white"
            >
              <option value="student">Student-wise Report</option>
              <option value="subject">Subject-wise Report</option>
            </select>
          </div>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student name or register no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border rounded-lg text-slate-800"
          />
        </div>
      </div>

      {/* STUDENT REPORT TABLE */}
      {reportType === 'student' && (
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Class Attendance Sheet</span>
            <span className="text-[10px] text-slate-500">Min 75% Criteria</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {studentReportData
              .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.regNo.includes(searchQuery))
              .map((row) => (
                <div key={row.id} className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{row.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {row.regNo} &bull; {row.present}/{row.total} Periods
                    </span>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                        row.pct >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {row.pct}%
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SUBJECT REPORT TABLE */}
      {reportType === 'subject' && (
        <div className="space-y-2">
          {subjects.map((sub) => {
            const subRecords = records.filter((r) => r.subjectId === sub.id && r.classId === selectedClassId);
            const totalConducted = new Set(subRecords.map((r) => `${r.date}-P${r.period}`)).size;
            const totalPresents = subRecords.filter((r) => r.status === 'Present' || r.status === 'OD').length;
            const avgRate = subRecords.length > 0 ? Math.round((totalPresents / subRecords.length) * 100) : 0;

            return (
              <div key={sub.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-xs space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-slate-900">{sub.subjectName}</span>
                    <span className="block text-[10px] font-mono text-slate-500">{sub.subjectCode}</span>
                  </div>
                  <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {avgRate}% Avg Roll
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">
                  {totalConducted} periods conducted for this semester.
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Printable Report Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <div className="border-b pb-2 text-center">
              <h3 className="font-bold text-slate-900 text-sm">MCA College Official Attendance Report</h3>
              <p className="text-[10px] text-slate-500">Generated for Academic Audit &bull; MCA I Year</p>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-[10px] text-slate-400">
                    <th className="pb-1">Reg No</th>
                    <th className="pb-1">Student</th>
                    <th className="pb-1 text-right">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentReportData.map((s) => (
                    <tr key={s.id} className="py-1">
                      <td className="py-1 font-mono text-[10px]">{s.regNo}</td>
                      <td className="py-1">{s.name}</td>
                      <td className={`py-1 text-right font-bold ${s.pct >= 75 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {s.pct}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-3 py-1.5 text-xs bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
