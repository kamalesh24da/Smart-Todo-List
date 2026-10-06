import React from 'react';
import { Play, FolderTree, CheckCircle2, Database, ShieldCheck, GraduationCap } from 'lucide-react';

export type ActiveTab = 'live-app' | 'file-structure' | 'test-runner' | 'architecture';

interface HeaderNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currentUser: { fullName: string; email: string } | null;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  onTabChange,
  currentUser
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      {/* Top Academic & Project Banner */}
      <div className="max-w-7xl mx-auto px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-200">Thiruvalluvar University</span>
          <span className="text-slate-600">|</span>
          <span>Dept. of Computer Science</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">Project: <strong>Smart Todo List</strong></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded text-[11px] font-medium border border-blue-700/50">
            Student: R Kamalesh (30024I05029)
          </span>
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Server Ready (Port 5000/3000)
          </span>
        </div>
      </div>

      {/* Main Navigation & Mode Selector */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm shadow-blue-500/30">
            ST
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">Smart Todo List</h1>
              <span className="bg-slate-800 text-slate-300 text-[10px] px-1.5 py-0.5 rounded font-mono">Flask + SQLite</span>
            </div>
            <p className="text-xs text-slate-400">Digital Evidence Intelligence & Analysis Platform</p>
          </div>
        </div>

        {/* Tab selection */}
        <div className="flex items-center bg-slate-800/90 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => onTabChange('live-app')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'live-app'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>1. Live Application</span>
          </button>

          <button
            onClick={() => onTabChange('file-structure')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'file-structure'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>2. Project File Structure</span>
          </button>

          <button
            onClick={() => onTabChange('test-runner')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'test-runner'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>3. Automated Tests (TC01-12)</span>
          </button>

          <button
            onClick={() => onTabChange('architecture')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'architecture'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>4. Schema & Routes</span>
          </button>
        </div>
      </div>
    </header>
  );
};
