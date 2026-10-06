import React from 'react';
import { Database, Route, ShieldCheck, GraduationCap, Server, Layers, Cpu } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-600/30 text-indigo-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-500/40">
                Academic Project Documentation
              </span>
              <span className="text-slate-400 text-xs">Appendices A.1 & A.2</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">System Architecture & Database Specifications</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Complete specifications of relational models, foreign-key data ownership constraints, 
              Flask routing matrix, and security layers.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl text-xs space-y-1 shrink-0">
            <div className="font-bold text-slate-200">Degree: M.Sc (Integrated) Data Science</div>
            <div className="text-slate-400">Institution: Thiruvalluvar University, Vellore</div>
            <div className="text-slate-400">Student: R Kamalesh (30024I05029)</div>
            <div className="text-emerald-400 font-semibold mt-1">Academic Year: 2026</div>
          </div>
        </div>
      </div>

      {/* Layered System Architecture (Fig 5.1) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900">Figure 5.1: Layered System Architecture</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Layer 1 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Presentation Layer</span>
              <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Frontend</span>
            </div>
            <h4 className="text-sm font-bold text-slate-800">HTML5 + CSS3 + Jinja2</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Renders dynamic templates with flash alert messages, responsive layout cards, modal forms, 
              and client-side date handling.
            </p>
            <ul className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-200">
              <li>• templates/index.html (Landing)</li>
              <li>• templates/register.html (Register)</li>
              <li>• templates/login.html (Login)</li>
              <li>• templates/dashboard.html (Dashboard)</li>
            </ul>
          </div>

          {/* Layer 2 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Application Logic</span>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Flask 3.1</span>
            </div>
            <h4 className="text-sm font-bold text-slate-800">Blueprints & Route Guards</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Coordinates request validation, session creation, password hashing with Werkzeug, 
              and enforces the <code>@login_required</code> decorator.
            </p>
            <ul className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-200">
              <li>• app/routes/auth.py (Auth Blueprint)</li>
              <li>• app/routes/tasks.py (Task Blueprint)</li>
              <li>• Session isolation & helper get_user_task()</li>
            </ul>
          </div>

          {/* Layer 3 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">Persistence Layer</span>
              <span className="text-[10px] font-semibold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">ORM & DB</span>
            </div>
            <h4 className="text-sm font-bold text-slate-800">SQLAlchemy & SQLite</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provides object-relational mapping, user_id foreign key constraint, cascade deletion, 
              and parameterized querying preventing SQL injection.
            </p>
            <ul className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-200">
              <li>• app/models/user.py (User table)</li>
              <li>• app/models/task.py (Task table)</li>
              <li>• instance/smart_todo.db (Persistent file)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Appendix A.1: Database Schema */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800">Appendix A.1: Relational Database Schema</h3>
          </div>
          <span className="text-xs text-slate-500">From Page 79 of Report</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Table</th>
                <th className="px-4 py-3">Column</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Constraint / Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-2.5 font-bold text-slate-800">users</td>
                <td className="px-4 py-2.5 font-mono text-blue-600">id</td>
                <td className="px-4 py-2.5">Integer PK</td>
                <td className="px-4 py-2.5 text-slate-600">Unique user identifier (Primary Key)</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-2.5 font-bold text-slate-800">users</td>
                <td className="px-4 py-2.5 font-mono text-blue-600">full_name</td>
                <td className="px-4 py-2.5">String(120)</td>
                <td className="px-4 py-2.5 text-slate-600">User display name</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-2.5 font-bold text-slate-800">users</td>
                <td className="px-4 py-2.5 font-mono text-blue-600">email</td>
                <td className="px-4 py-2.5">String(255) UNIQUE</td>
                <td className="px-4 py-2.5 text-slate-600">Login identifier (Indexed & Unique)</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-2.5 font-bold text-slate-800">users</td>
                <td className="px-4 py-2.5 font-mono text-blue-600">password_hash</td>
                <td className="px-4 py-2.5">String(255)</td>
                <td className="px-4 py-2.5 text-slate-600">Werkzeug hashed credential (never plaintext)</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-2.5 font-bold text-slate-800">users</td>
                <td className="px-4 py-2.5 font-mono text-blue-600">created_at</td>
                <td className="px-4 py-2.5">DateTime</td>
                <td className="px-4 py-2.5 text-slate-600">User account registration timestamp</td>
              </tr>

              {/* Tasks table */}
              <tr className="hover:bg-slate-50 bg-slate-50/50">
                <td className="px-4 py-2.5 font-bold text-slate-800">tasks</td>
                <td className="px-4 py-2.5 font-mono text-purple-600">id</td>
                <td className="px-4 py-2.5">Integer PK</td>
                <td className="px-4 py-2.5 text-slate-600">Unique task identifier (Primary Key)</td>
              </tr>
              <tr className="hover:bg-slate-50 bg-slate-50/50">
                <td className="px-4 py-2.5 font-bold text-slate-800">tasks</td>
                <td className="px-4 py-2.5 font-mono text-purple-600">user_id</td>
                <td className="px-4 py-2.5 font-bold text-indigo-700">Integer FK</td>
                <td className="px-4 py-2.5 text-slate-600">Foreign key referencing users.id (Enforces User Isolation F10)</td>
              </tr>
              <tr className="hover:bg-slate-50 bg-slate-50/50">
                <td className="px-4 py-2.5 font-bold text-slate-800">tasks</td>
                <td className="px-4 py-2.5 font-mono text-purple-600">title</td>
                <td className="px-4 py-2.5">String(200)</td>
                <td className="px-4 py-2.5 text-slate-600">Task title (Required)</td>
              </tr>
              <tr className="hover:bg-slate-50 bg-slate-50/50">
                <td className="px-4 py-2.5 font-mono font-bold text-slate-800">tasks</td>
                <td className="px-4 py-2.5 font-mono text-purple-600">description</td>
                <td className="px-4 py-2.5">Text</td>
                <td className="px-4 py-2.5 text-slate-600">Optional detailed description</td>
              </tr>
              <tr className="hover:bg-slate-50 bg-slate-50/50">
                <td className="px-4 py-2.5 font-bold text-slate-800">tasks</td>
                <td className="px-4 py-2.5 font-mono text-purple-600">priority</td>
                <td className="px-4 py-2.5">String(20)</td>
                <td className="px-4 py-2.5 text-slate-600">Low / Medium / High (Default: Medium)</td>
              </tr>
              <tr className="hover:bg-slate-50 bg-slate-50/50">
                <td className="px-4 py-2.5 font-bold text-slate-800">tasks</td>
                <td className="px-4 py-2.5 font-mono text-purple-600">due_date</td>
                <td className="px-4 py-2.5">Date</td>
                <td className="px-4 py-2.5 text-slate-600">Optional deadline calendar date</td>
              </tr>
              <tr className="hover:bg-slate-50 bg-slate-50/50">
                <td className="px-4 py-2.5 font-bold text-slate-800">tasks</td>
                <td className="px-4 py-2.5 font-mono text-purple-600">status</td>
                <td className="px-4 py-2.5">String(20)</td>
                <td className="px-4 py-2.5 text-slate-600">Pending / Completed (Default: Pending)</td>
              </tr>
              <tr className="hover:bg-slate-50 bg-slate-50/50">
                <td className="px-4 py-2.5 font-bold text-slate-800">tasks</td>
                <td className="px-4 py-2.5 font-mono text-purple-600">created_at</td>
                <td className="px-4 py-2.5">DateTime</td>
                <td className="px-4 py-2.5 text-slate-600">Task creation timestamp</td>
              </tr>
              <tr className="hover:bg-slate-50 bg-slate-50/50">
                <td className="px-4 py-2.5 font-bold text-slate-800">tasks</td>
                <td className="px-4 py-2.5 font-mono text-purple-600">updated_at</td>
                <td className="px-4 py-2.5">DateTime</td>
                <td className="px-4 py-2.5 text-slate-600">Last updated timestamp</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Appendix A.2: Application Route Reference */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Route className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800">Appendix A.2: Application Route Reference</h3>
          </div>
          <span className="text-xs text-slate-500">From Page 80 of Report</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">HTTP Method</th>
                <th className="px-4 py-3">Endpoint Route</th>
                <th className="px-4 py-3">Purpose & Description</th>
                <th className="px-3 py-3">Access Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-2.5 font-mono font-bold text-emerald-600">GET</td>
                <td className="px-4 py-2.5 font-mono text-slate-800">/</td>
                <td className="px-4 py-2.5 text-slate-600">Landing page introducing task manager (Fig 8.1)</td>
                <td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">Public</span></td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-2.5 font-mono font-bold text-blue-600">GET / POST</td>
                <td className="px-4 py-2.5 font-mono text-slate-800">/register</td>
                <td className="px-4 py-2.5 text-slate-600">Renders registration form & creates new account</td>
                <td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">Public</span></td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-2.5 font-mono font-bold text-blue-600">GET / POST</td>
                <td className="px-4 py-2.5 font-mono text-slate-800">/login</td>
                <td className="px-4 py-2.5 text-slate-600">Authenticates credentials & creates Flask session</td>
                <td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">Public</span></td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-2.5 font-mono font-bold text-emerald-600">GET</td>
                <td className="px-4 py-2.5 font-mono text-slate-800">/logout</td>
                <td className="px-4 py-2.5 text-slate-600">Clears user session and redirects to login</td>
                <td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">Authenticated</span></td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-2.5 font-mono font-bold text-emerald-600">GET</td>
                <td className="px-4 py-2.5 font-mono text-slate-800">/dashboard</td>
                <td className="px-4 py-2.5 text-slate-600">Displays workload stats, search, filter and task list (Fig 8.4)</td>
                <td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">Authenticated</span></td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-2.5 font-mono font-bold text-purple-600">POST</td>
                <td className="px-4 py-2.5 font-mono text-slate-800">/tasks</td>
                <td className="px-4 py-2.5 text-slate-600">Creates new task assigned to current session user_id</td>
                <td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">Authenticated</span></td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-2.5 font-mono font-bold text-purple-600">POST</td>
                <td className="px-4 py-2.5 font-mono text-slate-800">/tasks/&lt;id&gt;/edit</td>
                <td className="px-4 py-2.5 text-slate-600">Updates title, description, priority or due date</td>
                <td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">Authenticated</span></td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-2.5 font-mono font-bold text-purple-600">POST</td>
                <td className="px-4 py-2.5 font-mono text-slate-800">/tasks/&lt;id&gt;/toggle</td>
                <td className="px-4 py-2.5 text-slate-600">Toggles status between Pending and Completed</td>
                <td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">Authenticated</span></td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-2.5 font-mono font-bold text-rose-600">POST</td>
                <td className="px-4 py-2.5 font-mono text-slate-800">/tasks/&lt;id&gt;/delete</td>
                <td className="px-4 py-2.5 text-slate-600">Deletes owned task after ownership check</td>
                <td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">Authenticated</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
