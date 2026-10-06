import React, { useState } from 'react';
import { PROJECT_FILES } from '../data/projectFiles';
import { ProjectFile } from '../types/todo';
import { Folder, FileCode, Copy, Check, FileText, Code2, Server, Eye, Layers } from 'lucide-react';

export const FileStructureView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredFiles = PROJECT_FILES.filter(f =>
    f.path.toLowerCase().includes(searchFilter.toLowerCase()) ||
    f.purpose.toLowerCase().includes(searchFilter.toLowerCase()) ||
    f.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Overview Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 mb-8 border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-600/30 text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-500/40">
                Table 7.1 Architectural Blueprint
              </span>
              <span className="text-slate-400 text-xs">Section 7.1 Project Structure</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Smart Todo List - File & Directory Structure</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Organized into clean separation of concerns: Application factory, SQLAlchemy ORM models, 
              Flask authentication and task blueprints, Jinja2 templates, CSS styling, and automated pytest suite.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-xl text-xs space-y-1.5 shrink-0 min-w-56">
            <div className="flex justify-between text-slate-400">
              <span>Total Core Files:</span>
              <strong className="text-white">{PROJECT_FILES.length} files</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Backend Framework:</span>
              <strong className="text-emerald-400">Flask 3.1.2</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Database ORM:</span>
              <strong className="text-sky-400">Flask-SQLAlchemy</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Automated Tests:</span>
              <strong className="text-purple-400">pytest (12 cases)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Directory Table Summary matching Table 7.1 from the report */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs mb-8 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800">Table 7.1: Project Folder Structure & Module Roles</h3>
          </div>
          <span className="text-xs text-slate-500">From Page 50 of Academic Project Report</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Path</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-4 py-3">Purpose & Implementation Role</th>
                <th className="px-3 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PROJECT_FILES.map((file) => (
                <tr
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${
                    selectedFile.path === file.path ? 'bg-blue-50 font-medium' : ''
                  }`}
                >
                  <td className="px-4 py-2.5 font-mono text-blue-700 font-semibold flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5 text-slate-400" />
                    <span>{file.path}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {file.category}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">{file.purpose}</td>
                  <td className="px-3 py-2.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(file);
                      }}
                      className="px-2 py-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-white rounded border border-blue-200 hover:border-blue-300"
                    >
                      View Code
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Code Viewer and File Tree Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: File Tree list */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Folder className="w-4 h-4 text-amber-500" />
              <span>Project Files Explorer</span>
            </h4>
            <span className="text-[11px] text-slate-400">{filteredFiles.length} files</span>
          </div>

          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search file by name or role..."
            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="space-y-1 max-h-[520px] overflow-y-auto pr-1">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between group cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} />
                    <span className="truncate font-mono">{file.path}</span>
                  </div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold shrink-0 ${
                      isSelected ? 'bg-blue-800 text-blue-100' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {file.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code Viewer */}
        <div className="lg:col-span-8 bg-slate-900 rounded-xl border border-slate-800 shadow-md overflow-hidden text-slate-100">
          {/* Header of code viewer */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-blue-400">{selectedFile.path}</span>
              <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded font-mono">
                {selectedFile.language.toUpperCase()}
              </span>
            </div>

            <button
              onClick={() => handleCopy(selectedFile.content)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded border border-slate-700 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Description of current file */}
          <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 text-xs text-slate-300 flex items-start gap-2">
            <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider shrink-0 mt-0.5">Role:</span>
            <span>{selectedFile.purpose}</span>
          </div>

          {/* Code display with line numbers */}
          <div className="p-4 overflow-x-auto max-h-[500px] overflow-y-auto font-mono text-xs leading-relaxed text-slate-200">
            <pre className="grid grid-cols-[auto_1fr] gap-x-4">
              {selectedFile.content.split('\n').map((line, idx) => (
                <React.Fragment key={idx}>
                  <span className="text-slate-600 select-none text-right pr-2">{idx + 1}</span>
                  <span className="whitespace-pre">{line || ' '}</span>
                </React.Fragment>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
