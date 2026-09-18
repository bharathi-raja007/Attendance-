import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Terminal,
  Download,
  FolderTree,
  Code2,
  Cpu,
  Layers,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  Smartphone,
  BookOpen,
} from 'lucide-react';

interface PhaseGuideProps {
  onOpenMobileDemo: () => void;
}

export const PhaseGuide: React.FC<PhaseGuideProps> = ({ onOpenMobileDemo }) => {
  const [activeOs, setActiveOs] = useState<'windows' | 'mac' | 'linux'>('windows');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [doctorChecks, setDoctorChecks] = useState({
    flutter: true,
    androidStudio: true,
    androidSdk: true,
    cmdlineTools: true,
    licenses: false, // beginner starts with license prompt
    chrome: true,
    device: true,
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const phases = [
    { num: 1, title: 'Install Flutter & Android Studio', status: 'current', desc: 'SDK setup, PATH variables, cmdline-tools, licenses, flutter doctor.' },
    { num: 2, title: 'Create Flutter Project', status: 'upcoming', desc: 'flutter create student_attendance, package naming, directory layout.' },
    { num: 3, title: 'Create Basic Material 3 UI', status: 'upcoming', desc: 'Theme, typography, colors, responsive layouts, custom widgets.' },
    { num: 4, title: 'Create Login Screen', status: 'upcoming', desc: 'Form validation, role selector, forgot password, animated UI.' },
    { num: 5, title: 'Connect Firebase Cloud', status: 'upcoming', desc: 'firebase-tools CLI, flutterfire configure, google-services.json.' },
    { num: 6, title: 'Implement Authentication', status: 'upcoming', desc: 'FirebaseAuth state changes, user role routing (Master/Teacher/Student).' },
    { num: 7, title: 'Master / Admin Dashboard', status: 'upcoming', desc: 'CRUD operations for teachers, classes, subjects, teacher assignments.' },
    { num: 8, title: 'Teacher Dashboard', status: 'upcoming', desc: 'Assigned classes filter, today schedule, pending/completed metrics.' },
    { num: 9, title: 'Student Dashboard', status: 'upcoming', desc: 'Subject percentages, overall gauge, low attendance warnings.' },
    { num: 10, title: 'Firestore Database Collections', status: 'upcoming', desc: '10 modular collections, indexing, relational keys.' },
    { num: 11, title: 'Attendance Marking (5 Periods)', status: 'upcoming', desc: 'Workflow: Class -> Subject -> Date -> Period -> Topic -> Roster -> Submit.' },
    { num: 12, title: 'Dynamic Attendance Calculation', status: 'upcoming', desc: 'Real-time (Present / Total) * 100 with color indicators.' },
    { num: 13, title: 'Attendance Reports & PDF', status: 'upcoming', desc: 'Student-wise, subject-wise, monthly filterable reports.' },
    { num: 14, title: 'Firestore Security Rules', status: 'upcoming', desc: 'Role-based access control (RBAC), prevent client tampering.' },
    { num: 15, title: 'Project Testing Checklist', status: 'upcoming', desc: '15 test cases across Emulator and physical Android phone.' },
    { num: 16, title: 'Git & GitHub Setup', status: 'upcoming', desc: 'Safe .gitignore for Firebase keys, branch management, commits.' },
    { num: 17, title: 'Generate Release APK', status: 'upcoming', desc: 'flutter build apk --release, app-release.apk, phone installation.' },
    { num: 18, title: 'MCA Final Documentation', status: 'upcoming', desc: 'Abstract, DFD, ER diagram, system architecture, viva voce prep.' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 text-slate-800">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-blue-500/30 border border-blue-400/40 text-blue-100 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5" /> MCA Project Guide &bull; Phase 1 of 18
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Student Attendance Management System
          </h1>
          <p className="mt-3 text-blue-100 text-base leading-relaxed">
            Welcome to your master guide for building an Android Mobile App with Flutter & Firebase. We will proceed strictly step-by-step starting with <strong>Phase 1: Installing & Verifying Flutter and Android Studio</strong>.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onOpenMobileDemo}
              className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
            >
              <Smartphone className="w-4 h-4 text-blue-700" />
              Launch Live Interactive App Simulator
            </button>
            <a
              href="#doctor-section"
              className="inline-flex items-center gap-2 bg-blue-600/40 hover:bg-blue-600/60 border border-blue-400/30 text-white font-medium px-4 py-2.5 rounded-xl transition-all"
            >
              <Terminal className="w-4 h-4" />
              Flutter Doctor Diagnostics
            </a>
          </div>
        </div>
      </div>

      {/* 18-Phase Roadmap Overview */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              MCA Project Roadmap (18 Structured Phases)
            </h2>
            <p className="text-sm text-slate-500">
              Designed specifically for I Year MCA beginners. We tackle one phase at a time to ensure zero compilation errors.
            </p>
          </div>
          <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300">
            Phase 1 Active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 pt-2">
          {phases.map((p) => (
            <div
              key={p.num}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                p.num === 1
                  ? 'bg-blue-50/80 border-blue-500 shadow-sm ring-1 ring-blue-500 text-blue-950 font-medium'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-bold ${p.num === 1 ? 'text-blue-700' : 'text-slate-400'}`}>
                  P{p.num < 10 ? `0${p.num}` : p.num}
                </span>
                {p.num === 1 ? (
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                )}
              </div>
              <p className="font-semibold line-clamp-1">{p.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PHASE 1 DETAILED GUIDE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
        <div>
          <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
            <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">1</span>
            PHASE 1 CORE TUTORIAL
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            Install and Verify Flutter & Android Studio
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Follow this guide on your local computer. We will explain <strong>what</strong> each tool does, <strong>why</strong> we need it, and <strong>how to verify</strong> it.
          </p>
        </div>

        {/* Conceptual Explanation for MCA Beginner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm mb-1">
              <Cpu className="w-4 h-4" /> What is Flutter & Dart?
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Flutter</strong> is Google&apos;s UI toolkit that compiles to native ARM code. <strong>Dart</strong> is the object-oriented programming language behind Flutter. It gives 60+ FPS smooth mobile performance.
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-sm mb-1">
              <Smartphone className="w-4 h-4" /> Why Android Studio?
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Android Studio gives us the <strong>Android SDK</strong>, the <strong>OpenJDK</strong> compiler, and the <strong>Android Virtual Device (AVD)</strong> emulator to test your app without needing a physical cable.
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-1">
              <Terminal className="w-4 h-4" /> What is flutter doctor?
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              It is an automated diagnostic tool that inspects your operating system, checks for missing SDKs, verifies developer tools, and tells you the exact command to fix any missing dependency.
            </p>
          </div>
        </div>

        {/* Operating System Selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-sm font-bold text-slate-800">Select Your Operating System:</span>
            <div className="inline-flex rounded-lg bg-slate-100 p-1">
              {(['windows', 'mac', 'linux'] as const).map((os) => (
                <button
                  key={os}
                  onClick={() => setActiveOs(os)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all ${
                    activeOs === os ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {os === 'mac' ? 'macOS' : os}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 1: Flutter SDK */}
          <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                Download & Extract the Flutter SDK
              </h3>
              <a
                href="https://docs.flutter.dev/get-started/install"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                flutter.dev/install <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {activeOs === 'windows' && (
              <div className="text-sm text-slate-600 space-y-2">
                <p>1. Download the Flutter Windows SDK zip (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-mono text-xs">flutter_windows_3.x.x-stable.zip</code>).</p>
                <p>2. Extract the zip to <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-900 font-mono text-xs">C:\src\flutter</code>. <em>(Important: Do not extract into Program Files because it requires elevated admin permissions).</em></p>
                <p>3. Add Flutter to your <strong>System Environment Variables</strong>:</p>
                <ul className="list-disc list-inside ml-2 text-xs space-y-1 text-slate-600">
                  <li>Press <kbd className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800">Windows + S</kbd>, search for <strong>&quot;env&quot;</strong>, and click <strong>&quot;Edit the system environment variables&quot;</strong>.</li>
                  <li>Click <strong>&quot;Environment Variables...&quot;</strong> at the bottom.</li>
                  <li>Under <strong>User variables</strong>, select <strong>Path</strong> and click <strong>Edit</strong>.</li>
                  <li>Click <strong>New</strong> and add: <code className="bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded font-mono text-xs">C:\src\flutter\bin</code></li>
                  <li>Click OK on all windows to save.</li>
                </ul>
              </div>
            )}

            {activeOs === 'mac' && (
              <div className="text-sm text-slate-600 space-y-2">
                <p>1. Download the Flutter macOS SDK for your processor (Apple Silicon M1/M2/M3 or Intel).</p>
                <p>2. Open Terminal and extract into your development folder:</p>
                <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs flex items-center justify-between">
                  <code>mkdir -p ~/development && cd ~/development && unzip ~/Downloads/flutter_macos_*.zip</code>
                  <button
                    onClick={() => handleCopy('mkdir -p ~/development && cd ~/development && unzip ~/Downloads/flutter_macos_*.zip', 'mac-extract')}
                    className="p-1 hover:bg-slate-800 rounded text-slate-300"
                  >
                    {copiedIndex === 'mac-extract' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p>3. Add to your <code className="text-xs font-mono bg-slate-100 px-1">~/.zshrc</code> file:</p>
                <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs flex items-center justify-between">
                  <code>export PATH=&quot;$PATH:$HOME/development/flutter/bin&quot;</code>
                  <button
                    onClick={() => handleCopy('export PATH="$PATH:$HOME/development/flutter/bin"', 'mac-path')}
                    className="p-1 hover:bg-slate-800 rounded text-slate-300"
                  >
                    {copiedIndex === 'mac-path' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {activeOs === 'linux' && (
              <div className="text-sm text-slate-600 space-y-2">
                <p>1. Download the Flutter Linux tar.xz and extract into <code className="text-xs font-mono bg-slate-100 px-1">~/development</code>.</p>
                <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs flex items-center justify-between">
                  <code>tar xf ~/Downloads/flutter_linux_*.tar.xz -C ~/development</code>
                  <button
                    onClick={() => handleCopy('tar xf ~/Downloads/flutter_linux_*.tar.xz -C ~/development', 'linux-extract')}
                    className="p-1 hover:bg-slate-800 rounded text-slate-300"
                  >
                    {copiedIndex === 'linux-extract' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p>2. Add to <code className="text-xs font-mono bg-slate-100 px-1">~/.bashrc</code>:</p>
                <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs flex items-center justify-between">
                  <code>export PATH=&quot;$PATH:$HOME/development/flutter/bin&quot;</code>
                  <button
                    onClick={() => handleCopy('export PATH="$PATH:$HOME/development/flutter/bin"', 'linux-path')}
                    className="p-1 hover:bg-slate-800 rounded text-slate-300"
                  >
                    {copiedIndex === 'linux-path' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: Android Studio & SDK Components */}
          <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                Install Android Studio & Essential SDK Tools
              </h3>
              <a
                href="https://developer.android.com/studio"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                developer.android.com <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="text-sm text-slate-600 space-y-2">
              <p>1. Download & run the Android Studio installer with standard settings.</p>
              <p>2. Open Android Studio, go to <strong>More Actions</strong> (or <strong>Tools</strong>) &rarr; <strong>SDK Manager</strong>.</p>
              <p>3. In the <strong>SDK Tools</strong> tab, ensure the following checkboxes are checked:</p>
              <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-lg text-xs space-y-1.5 text-amber-900">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Most Common Beginner Pitfall:
                </div>
                <div>&bull; <strong>Android SDK Command-line Tools (latest)</strong> &mdash; <em>(Unchecked by default! You must check this box or flutter doctor will fail).</em></div>
                <div>&bull; <strong>Android SDK Platform-Tools</strong></div>
                <div>&bull; <strong>Android SDK Build-Tools</strong></div>
                <div>&bull; <strong>Android Emulator</strong></div>
              </div>
              <p>4. Click <strong>Apply</strong> &rarr; <strong>OK</strong> to let Android Studio download these tools.</p>
            </div>
          </div>

          {/* STEP 3: Flutter & Dart Plugins in Android Studio */}
          <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">3</span>
              Install Flutter and Dart Plugins in Android Studio
            </h3>
            <div className="text-sm text-slate-600 space-y-1">
              <p>1. In Android Studio, click <strong>Plugins</strong> on the left panel.</p>
              <p>2. In the Marketplace search bar, type <code className="font-mono text-xs bg-slate-100 px-1">Flutter</code>.</p>
              <p>3. Click <strong>Install</strong>. (It will prompt you to also install the <strong>Dart</strong> plugin &mdash; click <strong>Yes</strong>).</p>
              <p>4. Click <strong>Restart IDE</strong> when finished.</p>
            </div>
          </div>

          {/* STEP 4: Accept Android Licenses */}
          <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">4</span>
              Accept Android Licenses via Terminal
            </h3>
            <p className="text-sm text-slate-600">
              Open a new Command Prompt / Terminal window and run this command:
            </p>
            <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs flex items-center justify-between">
              <code>flutter doctor --android-licenses</code>
              <button
                onClick={() => handleCopy('flutter doctor --android-licenses', 'cmd-licenses')}
                className="p-1 hover:bg-slate-800 rounded text-slate-300"
              >
                {copiedIndex === 'cmd-licenses' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-slate-500">
              When prompted with <em>&quot;Review licenses that have not been accepted (y/N)?&quot;</em>, press <kbd className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">y</kbd> and hit <kbd className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">Enter</kbd> for each prompt until all licenses are accepted.
            </p>
          </div>

          {/* STEP 5: Verification with flutter doctor */}
          <div id="doctor-section" className="border border-blue-200 bg-blue-50/40 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">5</span>
                Run flutter doctor to Verify
              </h3>
              <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2.5 py-1 rounded-full">
                Interactive Diagnostic Simulator
              </span>
            </div>
            <p className="text-sm text-slate-600">
              Type <code className="font-mono text-xs bg-white px-1.5 py-0.5 rounded border">flutter doctor</code> in your terminal. All primary checkmarks should turn green:
            </p>

            {/* Interactive flutter doctor check visualizer */}
            <div className="bg-slate-950 text-slate-100 rounded-xl p-4 font-mono text-xs space-y-2 border border-slate-800">
              <div className="text-slate-400">$ flutter doctor</div>
              
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>[✓] Flutter (Channel stable, 3.24.x, on Microsoft Windows [Version 10/11], locale en-US)</span>
              </div>

              <div className="flex items-center gap-2">
                {doctorChecks.licenses ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>
                  [{doctorChecks.licenses ? '✓' : '!'}] Android toolchain - develop for Android devices (Android SDK version 34.0.0)
                </span>
              </div>
              {!doctorChecks.licenses && (
                <div className="ml-6 text-amber-300 text-[11px] bg-amber-950/40 p-2 rounded border border-amber-800/40">
                  ! Some Android licenses not accepted. Run `flutter doctor --android-licenses` to accept them.
                  <button
                    onClick={() => setDoctorChecks({ ...doctorChecks, licenses: true })}
                    className="ml-3 text-white bg-blue-600 hover:bg-blue-500 px-2 py-0.5 rounded text-[10px]"
                  >
                    Simulate License Acceptance [y]
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>[✓] Chrome - develop for the web</span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>[✓] Android Studio (version 2024.1)</span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>[✓] Connected device (1 available)</span>
              </div>

              <div className="pt-2 text-emerald-400 font-bold border-t border-slate-800">
                • No issues found! You are ready for Phase 2.
              </div>
            </div>
          </div>
        </div>

        {/* Phase Completion Confirmation Box */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-emerald-950 text-base flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Phase 1 Checkpoint Ready
            </h4>
            <p className="text-xs text-emerald-800 mt-1">
              Once your terminal prints <code className="font-mono font-bold bg-emerald-100 px-1 rounded">&quot;No issues found!&quot;</code>, you can reply in the chat to proceed to <strong>Phase 2: Create Flutter Project & Architecture</strong>.
            </p>
          </div>
          <button
            onClick={onOpenMobileDemo}
            className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow transition-all flex items-center gap-1.5"
          >
            Explore Mobile App Simulator <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
