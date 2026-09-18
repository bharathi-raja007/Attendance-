import {
  Department,
  CollegeClass,
  Subject,
  TeacherRecord,
  StudentRecord,
  TeacherAssignment,
  AttendanceSession,
  AttendanceRecord,
  UserProfile,
} from '../types';

export const initialDepartments: Department[] = [
  { id: 'dept-1', name: 'Master of Computer Applications (MCA)', code: 'MCA' },
  { id: 'dept-2', name: 'Computer Science & Engineering', code: 'CSE' },
  { id: 'dept-3', name: 'Information Technology', code: 'IT' },
];

export const initialClasses: CollegeClass[] = [
  { id: 'class-mca-1a', className: 'MCA I Year - Sec A', departmentId: 'dept-1', year: 1, section: 'A', semester: 1 },
  { id: 'class-mca-1b', className: 'MCA I Year - Sec B', departmentId: 'dept-1', year: 1, section: 'B', semester: 1 },
  { id: 'class-mca-2a', className: 'MCA II Year - Sec A', departmentId: 'dept-1', year: 2, section: 'A', semester: 3 },
];

export const initialSubjects: Subject[] = [
  { id: 'sub-java', subjectName: 'Advanced Java Programming', subjectCode: 'MCA101', departmentId: 'dept-1', semester: 1, credits: 4 },
  { id: 'sub-dbms', subjectName: 'Database Management Systems & NoSQL', subjectCode: 'MCA102', departmentId: 'dept-1', semester: 1, credits: 4 },
  { id: 'sub-python', subjectName: 'Python Programming & Data Science', subjectCode: 'MCA103', departmentId: 'dept-1', semester: 1, credits: 3 },
  { id: 'sub-web', subjectName: 'Full Stack Web Technologies', subjectCode: 'MCA104', departmentId: 'dept-1', semester: 1, credits: 3 },
  { id: 'sub-networks', subjectName: 'Computer Networks & Security', subjectCode: 'MCA105', departmentId: 'dept-1', semester: 1, credits: 3 },
];

export const initialTeachers: TeacherRecord[] = [
  {
    id: 'teacher-1',
    userId: 'u-teacher-1',
    name: 'Prof. Ramesh Sharma',
    email: 'prof.sharma@mca.college.edu',
    employeeId: 'EMP-MCA-001',
    departmentId: 'dept-1',
    active: true,
    phone: '+91 98765 43210',
    designation: 'Associate Professor & HOD',
  },
  {
    id: 'teacher-2',
    userId: 'u-teacher-2',
    name: 'Dr. Ananya Sen',
    email: 'dr.ananya@mca.college.edu',
    employeeId: 'EMP-MCA-002',
    departmentId: 'dept-1',
    active: true,
    phone: '+91 98765 43211',
    designation: 'Assistant Professor',
  },
  {
    id: 'teacher-3',
    userId: 'u-teacher-3',
    name: 'Prof. Vikram Joshi',
    email: 'prof.vikram@mca.college.edu',
    employeeId: 'EMP-MCA-003',
    departmentId: 'dept-1',
    active: true,
    phone: '+91 98765 43212',
    designation: 'Assistant Professor',
  },
];

export const initialStudents: StudentRecord[] = [
  {
    id: 'student-1',
    userId: 'u-student-1',
    name: 'Arun Kumar',
    registerNumber: '24MCA101',
    email: 'arun.mca24@mca.college.edu',
    departmentId: 'dept-1',
    classId: 'class-mca-1a',
    year: 1,
    semester: 1,
    active: true,
    phone: '+91 98450 11223',
  },
  {
    id: 'student-2',
    userId: 'u-student-2',
    name: 'Ravi Kumar',
    registerNumber: '24MCA102',
    email: 'ravi.mca24@mca.college.edu',
    departmentId: 'dept-1',
    classId: 'class-mca-1a',
    year: 1,
    semester: 1,
    active: true,
    phone: '+91 98450 11224',
  },
  {
    id: 'student-3',
    userId: 'u-student-3',
    name: 'Priya Sundaram',
    registerNumber: '24MCA103',
    email: 'priya.mca24@mca.college.edu',
    departmentId: 'dept-1',
    classId: 'class-mca-1a',
    year: 1,
    semester: 1,
    active: true,
    phone: '+91 98450 11225',
  },
  {
    id: 'student-4',
    userId: 'u-student-4',
    name: 'Deepak Verma',
    registerNumber: '24MCA104',
    email: 'deepak.mca24@mca.college.edu',
    departmentId: 'dept-1',
    classId: 'class-mca-1a',
    year: 1,
    semester: 1,
    active: true,
    phone: '+91 98450 11226',
  },
  {
    id: 'student-5',
    userId: 'u-student-5',
    name: 'Sneha Patel',
    registerNumber: '24MCA105',
    email: 'sneha.mca24@mca.college.edu',
    departmentId: 'dept-1',
    classId: 'class-mca-1a',
    year: 1,
    semester: 1,
    active: true,
    phone: '+91 98450 11227',
  },
  {
    id: 'student-6',
    userId: 'u-student-6',
    name: 'Karthik Raja',
    registerNumber: '24MCA106',
    email: 'karthik.mca24@mca.college.edu',
    departmentId: 'dept-1',
    classId: 'class-mca-1a',
    year: 1,
    semester: 1,
    active: true,
    phone: '+91 98450 11228',
  },
  {
    id: 'student-7',
    userId: 'u-student-7',
    name: 'Meera Nambiar',
    registerNumber: '24MCA107',
    email: 'meera.mca24@mca.college.edu',
    departmentId: 'dept-1',
    classId: 'class-mca-1a',
    year: 1,
    semester: 1,
    active: true,
    phone: '+91 98450 11229',
  },
  {
    id: 'student-8',
    userId: 'u-student-8',
    name: 'Mohammed Farhan',
    registerNumber: '24MCA108',
    email: 'farhan.mca24@mca.college.edu',
    departmentId: 'dept-1',
    classId: 'class-mca-1a',
    year: 1,
    semester: 1,
    active: true,
    phone: '+91 98450 11230',
  },
];

export const initialAssignments: TeacherAssignment[] = [
  { id: 'asgn-1', teacherId: 'teacher-1', classId: 'class-mca-1a', subjectId: 'sub-java', academicYear: '2025-2026' },
  { id: 'asgn-2', teacherId: 'teacher-1', classId: 'class-mca-1a', subjectId: 'sub-python', academicYear: '2025-2026' },
  { id: 'asgn-3', teacherId: 'teacher-2', classId: 'class-mca-1a', subjectId: 'sub-dbms', academicYear: '2025-2026' },
  { id: 'asgn-4', teacherId: 'teacher-3', classId: 'class-mca-1a', subjectId: 'sub-web', academicYear: '2025-2026' },
  { id: 'asgn-5', teacherId: 'teacher-2', classId: 'class-mca-1a', subjectId: 'sub-networks', academicYear: '2025-2026' },
];

export const initialUsers: UserProfile[] = [
  {
    id: 'u-master',
    name: 'Dr. S. K. Narayanan (Dean / Admin)',
    email: 'admin@mca.college.edu',
    role: 'master',
    active: true,
    createdAt: '2025-01-01',
  },
  {
    id: 'u-teacher-1',
    name: 'Prof. Ramesh Sharma',
    email: 'prof.sharma@mca.college.edu',
    role: 'teacher',
    active: true,
    createdAt: '2025-01-10',
  },
  {
    id: 'u-student-1',
    name: 'Arun Kumar',
    email: 'arun.mca24@mca.college.edu',
    role: 'student',
    active: true,
    createdAt: '2025-08-01',
  },
];

// Generate standard past attendance records for realistic statistics
export function generateInitialAttendance() {
  const sessions: AttendanceSession[] = [];
  const records: AttendanceRecord[] = [];

  const dates = [
    '2026-09-10',
    '2026-09-11',
    '2026-09-12',
    '2026-09-15',
    '2026-09-16',
    '2026-09-17',
    '2026-09-18',
  ];

  const classId = 'class-mca-1a';
  const subjects = [
    { sub: initialSubjects[0], period: 1, teacher: 'teacher-1', topic: 'Multithreading & Thread Synchronization' },
    { sub: initialSubjects[1], period: 2, teacher: 'teacher-2', topic: 'ACID Properties & Transaction Isolation' },
    { sub: initialSubjects[2], period: 3, teacher: 'teacher-1', topic: 'NumPy Arrays & Vectorization' },
    { sub: initialSubjects[3], period: 4, teacher: 'teacher-3', topic: 'RESTful APIs & Middleware Architecture' },
    { sub: initialSubjects[4], period: 5, teacher: 'teacher-2', topic: 'TCP 3-Way Handshake & Sliding Window' },
  ];

  let sessionIdCounter = 1;
  let recordIdCounter = 1;

  dates.forEach((date) => {
    subjects.forEach((item) => {
      // For the current date, only submit periods 1 and 2
      if (date === '2026-09-18' && item.period > 2) return;

      const sessionId = `sess-${sessionIdCounter++}`;
      let presentCount = 0;
      let absentCount = 0;

      initialStudents.forEach((student) => {
        // Create deterministic realistic attendance
        let isPresent = true;
        // Student 1 (Arun) is present in most
        if (student.id === 'student-1') {
          // Absent on 12th in web, 15th in DBMS
          if (date === '2026-09-12' && item.sub.id === 'sub-web') isPresent = false;
          if (date === '2026-09-15' && item.sub.id === 'sub-dbms') isPresent = false;
        } else if (student.id === 'student-2') {
          // Ravi has lower attendance
          if (item.period === 4 || item.period === 5) isPresent = Math.random() > 0.4;
        } else {
          isPresent = Math.random() > 0.15;
        }

        const status = isPresent ? 'Present' : 'Absent';
        if (isPresent) presentCount++;
        else absentCount++;

        records.push({
          id: `att-${recordIdCounter++}`,
          studentId: student.id,
          classId,
          subjectId: item.sub.id,
          teacherId: item.teacher,
          date,
          period: item.period,
          topic: item.topic,
          status,
          timestamp: `${date}T10:00:00Z`,
        });
      });

      sessions.push({
        id: sessionId,
        classId,
        subjectId: item.sub.id,
        teacherId: item.teacher,
        date,
        period: item.period,
        topic: item.topic,
        submittedAt: `${date} 10:45 AM`,
        totalStudents: initialStudents.length,
        presentCount,
        absentCount,
      });
    });
  });

  return { sessions, records };
}
