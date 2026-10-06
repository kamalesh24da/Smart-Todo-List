import React from 'react';
import { Check, Star, Search, Shield, ArrowRight } from 'lucide-react';

interface LandingViewProps {
  onNavigate: (view: 'login' | 'register') => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Left hero column matching Fig 8.1 */}
        <div className="md:col-span-7 space-y-6">
          <div className="inline-block">
            <span className="text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
              SMART TODO LIST
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Organize your work.<br />
            Complete your goals.
          </h1>

          <p className="text-base text-slate-600 max-w-lg leading-relaxed">
            A secure full-stack task manager with authentication, priorities, due dates, search and filters.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onNavigate('login')}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('register')}
              className="px-6 py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded-lg border border-slate-300 shadow-sm transition-all cursor-pointer"
            >
              Create Account
            </button>
          </div>

          <div className="pt-4 text-xs text-slate-400 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Figure 8.1 - Landing page view based on Smart Todo List Jinja templates</span>
          </div>
        </div>

        {/* Right feature card matching Fig 8.1 */}
        <div className="md:col-span-5">
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-lg shadow-slate-100 space-y-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Included Capabilities</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3.5 text-slate-700 font-medium text-sm">
                <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </span>
                <span>Manage personal tasks</span>
              </li>

              <li className="flex items-center gap-3.5 text-slate-700 font-medium text-sm">
                <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4 fill-current stroke-[1.5]" />
                </span>
                <span>Set priority & deadlines</span>
              </li>

              <li className="flex items-center gap-3.5 text-slate-700 font-medium text-sm">
                <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Search className="w-4 h-4 stroke-[2.5]" />
                </span>
                <span>Search and filter</span>
              </li>

              <li className="flex items-center gap-3.5 text-slate-700 font-medium text-sm">
                <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 stroke-[2.5]" />
                </span>
                <span>Secure user accounts</span>
              </li>
            </ul>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Project Workflow:</span> Register → Login → Dashboard → Task CRUD → Logout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
