import React, { useState } from 'react';
import { Database, ShieldCheck, FileCode, CheckCircle2, Copy, Check, X } from 'lucide-react';

interface FirestoreSchemaModalProps {
  onClose: () => void;
}

export const FirestoreSchemaModal: React.FC<FirestoreSchemaModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'schema' | 'rules'>('schema');
  const [copied, setCopied] = useState(false);

  const collections = [
    {
      name: 'users/{userId}',
      purpose: 'Global authentication mapping with roles (master, teacher, student). Used to prevent client-side authorization bypass.',
      fields: ['name (string)', 'email (string)', 'role (string: "master" | "teacher" | "student")', 'phone (string)', 'active (bool)', 'createdAt (timestamp)'],
    },
    {
      name: 'teachers/{teacherId}',
      purpose: 'Academic faculty directory containing employee ID, department link, and active status.',
      fields: ['name (string)', 'email (string)', 'employeeId (string)', 'departmentId (string)', 'active (bool)'],
    },
    {
      name: 'students/{studentId}',
      purpose: 'Student academic records with unique registration number, semester, year, and class reference.',
      fields: ['name (string)', 'registerNumber (string)', 'email (string)', 'departmentId (string)', 'classId (string)', 'year (number)', 'semester (number)', 'active (bool)'],
    },
    {
      name: 'departments/{departmentId}',
      purpose: 'College organizational units (e.g., MCA, CSE, IT) providing top-level namespace.',
      fields: ['name (string)', 'code (string)'],
    },
    {
      name: 'classes/{classId}',
      purpose: 'Sections and batches (e.g. MCA I Year Sec A) linking students and timetables.',
      fields: ['className (string)', 'departmentId (string)', 'year (number)', 'section (string)', 'semester (number)'],
    },
    {
      name: 'subjects/{subjectId}',
      purpose: 'Curriculum catalog storing course codes, subject names, and credit counts.',
      fields: ['subjectName (string)', 'subjectCode (string)', 'departmentId (string)', 'semester (number)'],
    },
    {
      name: 'teacherAssignments/{assignmentId}',
      purpose: 'Crucial RBAC mapping table connecting faculty to specific subjects and classes. Teachers cannot take attendance for unassigned classes.',
      fields: ['teacherId (string)', 'classId (string)', 'subjectId (string)', 'academicYear (string)'],
    },
    {
      name: 'attendanceSessions/{sessionId}',
      purpose: 'Audit log of each conducted period (1-5) preventing duplicate submission for the same date/period.',
      fields: ['classId (string)', 'subjectId (string)', 'teacherId (string)', 'date (string)', 'period (1-5)', 'topic (string)', 'submittedAt (timestamp)'],
    },
    {
      name: 'attendance/{attendanceId}',
      purpose: 'Individual student attendance status per period. Enables high-speed dynamic percentage queries.',
      fields: ['studentId (string)', 'classId (string)', 'subjectId (string)', 'teacherId (string)', 'date (string)', 'period (1-5)', 'topic (string)', 'status ("Present" | "Absent" | "OD")', 'timestamp (timestamp)'],
    },
    {
      name: 'notifications/{notificationId}',
      purpose: 'Low attendance (<75%) automated push alerts and administrative notices.',
      fields: ['recipientId (string)', 'title (string)', 'message (string)', 'read (bool)', 'createdAt (timestamp)'],
    },
  ];

  const sampleRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    function isMaster() {
      return isAuthenticated() && getUserRole() == 'master';
    }
    
    function isTeacher() {
      return isAuthenticated() && getUserRole() == 'teacher';
    }

    // Master has full control
    match /{document=**} {
      allow read, write: if isMaster();
    }

    // Attendance records
    match /attendance/{attendanceId} {
      allow read: if isAuthenticated();
      // Teachers can only create if assigned to the class
      allow create, update: if isTeacher();
      // Students can NEVER write
      allow delete: if isMaster();
    }

    match /attendanceSessions/{sessionId} {
      allow read: if isAuthenticated();
      allow create: if isTeacher();
    }

    // Students can read their own profile
    match /students/{studentId} {
      allow read: if isAuthenticated();
      allow write: if isMaster();
    }
  }
}`;

  const copyRules = () => {
    navigator.clipboard.writeText(sampleRules);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-5 max-w-xl w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Firestore Database Design (MCA Spec)</h3>
              <p className="text-[11px] text-slate-500">10 Modular Collections + RBAC Security Rules</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              activeTab === 'schema' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Collections & Fields ({collections.length})
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
              activeTab === 'rules' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>firestore.rules</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 text-xs">
          {activeTab === 'schema' && (
            <div className="space-y-3">
              {collections.map((col) => (
                <div key={col.name} className="border border-slate-200 rounded-xl p-3 bg-slate-50/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <code className="font-bold text-indigo-700 font-mono bg-indigo-50 px-2 py-0.5 rounded text-xs">
                      {col.name}
                    </code>
                    <span className="text-[10px] text-slate-400 font-medium">Firestore Document</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{col.purpose}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {col.fields.map((f, i) => (
                      <span key={i} className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded font-mono text-slate-700">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">
                  Role-Based Authorization Rules preventing unauthorized attendance modification:
                </span>
                <button
                  onClick={copyRules}
                  className="px-2.5 py-1 bg-slate-900 text-white text-[11px] rounded-lg flex items-center gap-1 font-medium hover:bg-slate-800"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Rules'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed">
                <code>{sampleRules}</code>
              </pre>
            </div>
          )}
        </div>

        <div className="pt-2 border-t flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold"
          >
            Close Schema Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
