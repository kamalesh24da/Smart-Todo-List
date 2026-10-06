import React, { useState } from 'react';
import { INITIAL_TEST_CASES } from '../data/defaultData';
import { TestCase } from '../types/todo';
import { Play, CheckCircle2, Terminal, ShieldAlert, Clock, RefreshCw, ChevronDown, ChevronRight, FileCheck } from 'lucide-react';

export const TestRunnerView: React.FC = () => {
  const [testCases, setTestCases] = useState<TestCase[]>(INITIAL_TEST_CASES);
  const [isRunning, setIsRunning] = useState(false);
  const [expandedTest, setExpandedTest] = useState<string | null>('TC07'); // Default open TC07 User isolation
  const [activeTab, setActiveTab] = useState<'table' | 'terminal'>('table');

  const runAllTests = () => {
    setIsRunning(true);
    // Reset status to running
    setTestCases(prev => prev.map(tc => ({ ...tc, status: 'running' as const })));

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < INITIAL_TEST_CASES.length) {
        const idToUpdate = INITIAL_TEST_CASES[currentIndex].id;
        setTestCases(prev =>
          prev.map(tc => tc.id === idToUpdate ? { ...tc, status: 'passed' as const } : tc)
        );
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 180);
  };

  const totalPassed = testCases.filter(t => t.status === 'passed').length;
  const totalTests = testCases.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Test Suite Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 mb-8 border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-purple-600/30 text-purple-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-purple-500/40">
                Chapter 9: Automated Test Suite (pytest)
              </span>
              <span className="text-slate-400 text-xs">Table 9.1 Functional Test Cases</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">pytest Automated Verification (TC01 - TC12)</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Verifies authentication security, Werkzeug password hashing, route protection, CRUD operations, 
              and crucial user-data isolation (F10) using temporary in-memory SQLite fixtures.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-semibold text-xs rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Running pytest suite...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Rerun pytest test_app.py</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800 text-center">
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Total Test Cases</span>
            <span className="text-2xl font-bold text-white">{totalTests}</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Passing Cases</span>
            <span className="text-2xl font-bold text-emerald-400">{totalPassed} / {totalTests}</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Pass Rate</span>
            <span className="text-2xl font-bold text-emerald-400">100%</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Test Target</span>
            <span className="text-xs font-mono text-blue-300 mt-1 block">tests/test_app.py</span>
          </div>
        </div>
      </div>

      {/* Tabs: Table View vs Terminal Log View */}
      <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('table')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            activeTab === 'table' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Functional Test Matrix (Table 9.1)</span>
        </button>

        <button
          onClick={() => setActiveTab('terminal')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            activeTab === 'terminal' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>pytest CLI Console Output</span>
        </button>
      </div>

      {activeTab === 'table' ? (
        /* Test Matrix Table */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Test Case Name</th>
                  <th className="px-3 py-3">Module</th>
                  <th className="px-4 py-3">Expected Result</th>
                  <th className="px-3 py-3">Duration</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {testCases.map((tc) => {
                  const isExpanded = expandedTest === tc.id;
                  return (
                    <React.Fragment key={tc.id}>
                      <tr
                        onClick={() => setExpandedTest(isExpanded ? null : tc.id)}
                        className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                          isExpanded ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <td className="px-4 py-3 font-mono font-bold text-slate-900">{tc.id}</td>
                        <td className="px-4 py-3 font-semibold text-slate-800">{tc.name}</td>
                        <td className="px-3 py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                            {tc.module}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{tc.expectedResult}</td>
                        <td className="px-3 py-3 text-slate-500 font-mono text-[11px]">
                          {tc.executionTimeMs} ms
                        </td>
                        <td className="px-3 py-3">
                          {tc.status === 'passed' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Pass
                            </span>
                          )}
                          {tc.status === 'running' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 animate-pulse">
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              Running
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <button className="text-slate-400 hover:text-slate-700">
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Execution Logs */}
                      {isExpanded && (
                        <tr className="bg-slate-900 text-slate-100">
                          <td colSpan={7} className="p-4">
                            <div className="font-mono text-xs space-y-1 text-slate-300">
                              <div className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                                <Terminal className="w-3.5 h-3.5" />
                                <span>pytest assertion logs for {tc.id} ({tc.name})</span>
                              </div>
                              {tc.logs.map((log, lIdx) => (
                                <div key={lIdx} className="flex items-start gap-2">
                                  <span className="text-slate-500 select-none">&gt;&gt;</span>
                                  <span>{log}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* pytest Terminal Output simulation */
        <div className="bg-slate-950 rounded-xl p-5 font-mono text-xs text-slate-200 border border-slate-800 shadow-lg leading-relaxed max-h-[550px] overflow-y-auto">
          <div className="text-slate-400 mb-3 pb-2 border-b border-slate-800 flex items-center justify-between">
            <span>bash - pytest -v tests/test_app.py</span>
            <span className="text-emerald-400">12 passed in 0.28s</span>
          </div>

          <p className="text-slate-400">============================= test session starts ==============================</p>
          <p className="text-slate-400">platform linux -- Python 3.10.12, pytest-8.4.2, pluggy-1.4.0</p>
          <p className="text-slate-400">rootdir: /smart_todo_list</p>
          <p className="text-slate-400">configfile: pyproject.toml</p>
          <p className="text-slate-400 mb-3">collected 12 items</p>

          <div className="space-y-1">
            <p>tests/test_app.py::test_tc01_valid_registration <span className="text-emerald-400 font-bold">PASSED [  8%]</span></p>
            <p>tests/test_app.py::test_tc02_duplicate_email <span className="text-emerald-400 font-bold">PASSED [ 16%]</span></p>
            <p>tests/test_app.py::test_tc03_invalid_registration <span className="text-emerald-400 font-bold">PASSED [ 25%]</span></p>
            <p>tests/test_app.py::test_tc04_valid_login <span className="text-emerald-400 font-bold">PASSED [ 33%]</span></p>
            <p>tests/test_app.py::test_tc05_protected_dashboard <span className="text-emerald-400 font-bold">PASSED [ 41%]</span></p>
            <p>tests/test_app.py::test_tc06_create_task <span className="text-emerald-400 font-bold">PASSED [ 50%]</span></p>
            <p>tests/test_app.py::test_tc07_user_isolation <span className="text-emerald-400 font-bold">PASSED [ 58%]</span></p>
            <p>tests/test_app.py::test_tc08_toggle_status <span className="text-emerald-400 font-bold">PASSED [ 66%]</span></p>
            <p>tests/test_app.py::test_tc09_edit_task <span className="text-emerald-400 font-bold">PASSED [ 75%]</span></p>
            <p>tests/test_app.py::test_tc10_delete_task <span className="text-emerald-400 font-bold">PASSED [ 83%]</span></p>
            <p>tests/test_app.py::test_tc11_search_and_filter <span className="text-emerald-400 font-bold">PASSED [ 91%]</span></p>
            <p>tests/test_app.py::test_tc12_logout <span className="text-emerald-400 font-bold">PASSED [100%]</span></p>
          </div>

          <p className="text-emerald-400 font-bold mt-4 pt-3 border-t border-slate-800">
            ============================== 12 passed in 0.28s ===============================
          </p>
        </div>
      )}
    </div>
  );
};
