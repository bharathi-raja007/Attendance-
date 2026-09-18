import React from 'react';
import { Wifi, BatteryMedium, Signal, ChevronLeft, LogOut, Home, Users, CheckSquare, BarChart3, Database } from 'lucide-react';
import { UserProfile } from '../types';

interface MobileFrameProps {
  children: React.ReactNode;
  currentUser: UserProfile | null;
  onLogout: () => void;
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  activeNavTab?: string;
  onNavTabChange?: (tab: string) => void;
  onOpenSchema?: () => void;
  onOpenGuide?: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  currentUser,
  onLogout,
  title,
  showBack,
  onBack,
  activeNavTab,
  onNavTabChange,
  onOpenSchema,
  onOpenGuide,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] py-4">
      {/* Android Device Mockup */}
      <div className="w-full max-w-[420px] bg-slate-900 rounded-[44px] p-3.5 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50 flex flex-col relative">
        {/* Hardware Notch / Camera */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-30 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-700" />
          <div className="w-2 h-2 rounded-full bg-indigo-900/60 ml-2" />
        </div>

        {/* Screen Bezel */}
        <div className="w-full h-[760px] bg-slate-50 rounded-[34px] overflow-hidden flex flex-col relative shadow-inner">
          {/* Android Status Bar */}
          <div className="h-9 bg-slate-900 text-slate-200 text-[11px] font-medium px-5 flex items-center justify-between z-20 shrink-0 select-none">
            <span className="font-semibold">09:41</span>
            <div className="flex items-center gap-2">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px]">92%</span>
                <BatteryMedium className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* App Bar (Material Design Top Bar) */}
          <div className="bg-indigo-700 text-white px-4 py-3 shadow-md flex items-center justify-between shrink-0 z-10">
            <div className="flex items-center gap-2.5 min-w-0">
              {showBack && (
                <button
                  onClick={onBack}
                  className="p-1 -ml-1 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
                  aria-label="Back"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <div className="truncate">
                <h1 className="text-base font-bold truncate leading-tight">{title}</h1>
                {currentUser && (
                  <p className="text-[11px] text-indigo-200 truncate capitalize">
                    {currentUser.role} &bull; {currentUser.name.split(' ')[0]}
                  </p>
                )}
              </div>
            </div>

            {currentUser && (
              <div className="flex items-center gap-1">
                {onOpenSchema && (
                  <button
                    onClick={onOpenSchema}
                    title="Firestore Schema"
                    className="p-1.5 rounded-lg bg-indigo-800/80 hover:bg-indigo-800 text-indigo-200 hover:text-white transition-colors text-xs flex items-center gap-1"
                  >
                    <Database className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-1.5 rounded-lg bg-indigo-800/80 hover:bg-rose-900/60 text-indigo-200 hover:text-rose-200 transition-colors text-xs flex items-center gap-1 ml-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Scrollable Screen Content */}
          <div className="flex-1 overflow-y-auto bg-slate-50 overscroll-contain">
            {children}
          </div>

          {/* Bottom Navigation Bar (Material 3 Navigation for Authenticated users) */}
          {currentUser && onNavTabChange && activeNavTab && (
            <div className="bg-white border-t border-slate-200 px-2 py-1 flex items-center justify-around shrink-0 shadow-lg z-20 text-[11px]">
              <button
                onClick={() => onNavTabChange('home')}
                className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                  activeNavTab === 'home'
                    ? 'text-indigo-700 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="mt-0.5">Home</span>
              </button>

              {currentUser.role === 'teacher' && (
                <button
                  onClick={() => onNavTabChange('mark')}
                  className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                    activeNavTab === 'mark'
                      ? 'text-indigo-700 font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <CheckSquare className="w-5 h-5" />
                  <span className="mt-0.5">Attendance</span>
                </button>
              )}

              {currentUser.role === 'master' && (
                <button
                  onClick={() => onNavTabChange('management')}
                  className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                    activeNavTab === 'management'
                      ? 'text-indigo-700 font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span className="mt-0.5">Manage</span>
                </button>
              )}

              <button
                onClick={() => onNavTabChange('reports')}
                className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                  activeNavTab === 'reports'
                    ? 'text-indigo-700 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="mt-0.5">Reports</span>
              </button>
            </div>
          )}

          {/* Android Home Navigation Bar Pill */}
          <div className="h-4 bg-white flex items-center justify-center shrink-0">
            <div className="w-32 h-1 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
