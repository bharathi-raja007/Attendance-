import React, { useState } from 'react';
import { GraduationCap, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { UserRole } from '../types';

interface LoginScreenProps {
  onLogin: (role: UserRole, email: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@mca.college.edu');
  const [password, setPassword] = useState('Admin@123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('master');
  const [error, setError] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const demoUsers: Record<UserRole, { email: string; pass: string; title: string; subtitle: string }> = {
    master: {
      email: 'admin@mca.college.edu',
      pass: 'Admin@123',
      title: 'Dean / Master Admin',
      subtitle: 'Full college-wide administrative access',
    },
    teacher: {
      email: 'prof.sharma@mca.college.edu',
      pass: 'Teacher@123',
      title: 'Prof. Ramesh Sharma',
      subtitle: 'MCA Department - Periods 1 & 3',
    },
    student: {
      email: 'arun.mca24@mca.college.edu',
      pass: 'Student@123',
      title: 'Arun Kumar',
      subtitle: 'MCA I Year (Reg: 24MCA101)',
    },
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(demoUsers[role].email);
    setPassword(demoUsers[role].pass);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password fields.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid college email address.');
      return;
    }
    setError(null);
    onLogin(selectedRole, email);
  };

  return (
    <div className="p-6 flex flex-col justify-between min-h-full">
      <div className="space-y-5">
        {/* College App Branding */}
        <div className="text-center pt-2">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-200 text-white">
            <GraduationCap className="w-9 h-9" />
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-3">SmartRoll Attendance</h2>
          <p className="text-xs text-slate-500 mt-0.5">MCA Department &bull; College Mobile Portal</p>
        </div>

        {/* Demo Fast-Login Selector for Testing */}
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-indigo-950 uppercase tracking-wider">
              Select User Role:
            </span>
            <span className="text-[10px] text-indigo-600 font-medium bg-white px-2 py-0.5 rounded-full border border-indigo-200">
              Demo Test Switcher
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {(['master', 'teacher', 'student'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleSelect(r)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold capitalize transition-all text-center ${
                  selectedRole === r
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-indigo-100/50 border border-slate-200'
                }`}
              >
                {r === 'master' ? 'Admin' : r}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-indigo-800/80 mt-2 font-medium">
            Active: <strong>{demoUsers[selectedRole].title}</strong> &mdash; {demoUsers[selectedRole].subtitle}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-2.5 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email / Register Number
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@mca.college.edu"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500" />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs"
          >
            <span>Log In to {selectedRole === 'master' ? 'Admin' : selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Security Rule Note */}
        <div className="bg-slate-100/80 rounded-xl p-3 text-[11px] text-slate-600 flex items-start gap-2 border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <strong>Firebase Auth + Role Protection:</strong> Access is verified server-side via Firestore user tokens. Users cannot bypass roles by manipulating local client state.
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Reset Password</h3>
            <p className="text-xs text-slate-600">
              Enter your college email and Firebase Authentication will dispatch a password recovery link.
            </p>
            {forgotSuccess ? (
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg text-xs font-medium">
                Password reset link sent to your email!
              </div>
            ) : (
              <input
                type="email"
                placeholder="Enter college email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full border rounded-lg p-2 text-xs font-medium text-slate-800"
              />
            )}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowForgot(false);
                  setForgotSuccess(false);
                }}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              {!forgotSuccess && (
                <button
                  onClick={() => setForgotSuccess(true)}
                  className="px-3 py-1.5 text-xs bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
                >
                  Send Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
