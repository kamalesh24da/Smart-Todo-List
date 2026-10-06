import React, { useState, useMemo } from 'react';
import { User, Task, Priority, TaskStatus, SortOption } from '../../types/todo';
import { Search, Plus, Calendar, Edit3, Trash2, CheckCircle2, Circle, AlertCircle, LogOut, X } from 'lucide-react';

interface DashboardViewProps {
  currentUser: User;
  tasks: Task[];
  onAddTask: (task: { title: string; description: string; priority: Priority; dueDate?: string }) => void;
  onUpdateTask: (id: number, task: { title: string; description: string; priority: Priority; dueDate?: string }) => void;
  onToggleStatus: (id: number) => void;
  onDeleteTask: (id: number) => void;
  onLogout: () => void;
  onSwitchUser: (userId: number) => void;
  allUsers: User[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  tasks,
  onAddTask,
  onUpdateTask,
  onToggleStatus,
  onDeleteTask,
  onLogout,
  onSwitchUser,
  allUsers
}) => {
  // New task form state
  const [newTitle, setNewTitle] = useState('Complete final year report');
  const [newDesc, setNewDesc] = useState('Finish documentation and testing');
  const [newPriority, setNewPriority] = useState<Priority>('High');
  const [newDueDate, setNewDueDate] = useState('2026-10-10');

  // Search, filter and sort state
  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | TaskStatus>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | Priority>('All');
  const [sortBy, setSortBy] = useState<SortOption>('Due Date');

  // Edit modal state
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPriority, setEditPriority] = useState<Priority>('Medium');
  const [editDueDate, setEditDueDate] = useState('');

  // Delete confirmation modal state
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);

  // Flash message state
  const [flashMessage, setFlashMessage] = useState<{ type: 'success' | 'info' | 'danger'; text: string } | null>(null);

  // Compute statistics strictly for current user
  const userTasks = useMemo(() => {
    return tasks.filter(t => t.userId === currentUser.id);
  }, [tasks, currentUser.id]);

  const totalCount = userTasks.length;
  const completedCount = userTasks.filter(t => t.status === 'Completed').length;
  const pendingCount = userTasks.filter(t => t.status === 'Pending').length;
  const highPriorityCount = userTasks.filter(t => t.priority === 'High').length;

  // Filter and sort tasks for display
  const displayedTasks = useMemo(() => {
    let filtered = [...userTasks];

    if (activeSearch.trim()) {
      const q = activeSearch.toLowerCase().trim();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    if (priorityFilter !== 'All') {
      filtered = filtered.filter(t => t.priority === priorityFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'Due Date') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      } else if (sortBy === 'Priority') {
        const priorityOrder: Record<Priority, number> = { High: 1, Medium: 2, Low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === 'Newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    return filtered;
  }, [userTasks, activeSearch, statusFilter, priorityFilter, sortBy]);

  const showFlash = (type: 'success' | 'info' | 'danger', text: string) => {
    setFlashMessage({ type, text });
    setTimeout(() => setFlashMessage(null), 3500);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showFlash('danger', 'Task title is required.');
      return;
    }

    onAddTask({
      title: newTitle.trim(),
      description: newDesc.trim(),
      priority: newPriority,
      dueDate: newDueDate || undefined
    });

    setNewTitle('');
    setNewDesc('');
    showFlash('success', 'Task created successfully!');
  };

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchInput);
    showFlash('info', 'Filters applied to current task list.');
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setActiveSearch('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setSortBy('Due Date');
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDesc(task.description || '');
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editTitle.trim()) return;

    onUpdateTask(editingTask.id, {
      title: editTitle.trim(),
      description: editDesc.trim(),
      priority: editPriority,
      dueDate: editDueDate || undefined
    });

    setEditingTask(null);
    showFlash('success', 'Task updated successfully!');
  };

  const confirmDelete = () => {
    if (deletingTaskId !== null) {
      onDeleteTask(deletingTaskId);
      setDeletingTaskId(null);
      showFlash('success', 'Task deleted successfully.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      {/* Top Navbar matching Figure 8.4 */}
      <nav className="bg-white border-b border-slate-200 sticky top-14 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-slate-900 tracking-tight">Smart Todo</span>
            <span className="text-xs text-slate-400 border-l border-slate-200 pl-3 hidden sm:inline">
              F10: User-Isolated Session
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-medium">Hello, {currentUser.fullName.split(' ')[0]}</span>
              
              {/* Quick User-Isolation Switcher */}
              <select
                aria-label="Switch logged in account"
                value={currentUser.id}
                onChange={(e) => onSwitchUser(Number(e.target.value))}
                className="text-xs bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded px-2 py-1 text-slate-700 font-medium cursor-pointer"
                title="Switch logged in account to demonstrate data ownership & isolation"
              >
                {allUsers.map(u => (
                  <option key={u.id} value={u.id}>
                    Switch to {u.fullName} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-1 text-slate-600 hover:text-red-600 font-semibold text-xs border border-slate-200 hover:border-red-200 rounded-md px-2.5 py-1 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        {/* Flash Message Banner */}
        {flashMessage && (
          <div
            className={`mb-5 p-3.5 rounded-xl border flex items-center justify-between shadow-sm transition-all ${
              flashMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : flashMessage.type === 'danger'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{flashMessage.text}</span>
            </div>
            <button
              onClick={() => setFlashMessage(null)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dashboard Title Section matching Figure 8.4 */}
        <div className="mb-6">
          <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
            DASHBOARD
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            My Tasks
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Plan, prioritize and complete your work.
          </p>
        </div>

        {/* 4 Statistics Cards matching Figure 8.4 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Total
            </span>
            <div className="text-3xl font-black text-slate-900">{totalCount}</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Completed
            </span>
            <div className="text-3xl font-black text-emerald-600">{completedCount}</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Pending
            </span>
            <div className="text-3xl font-black text-amber-500">{pendingCount}</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              High Priority
            </span>
            <div className="text-3xl font-black text-red-600">{highPriorityCount}</div>
          </div>
        </div>

        {/* Add New Task Panel matching Figure 8.4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs mb-6">
          <h3 className="text-sm font-bold text-slate-900 mb-3.5">Add New Task</h3>
          <form onSubmit={handleCreateTask} className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Complete final year report"
              required
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Finish documentation and testing"
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <select
              aria-label="Task priority"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as Priority)}
              className="w-full md:w-28 px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <input
              aria-label="Due date"
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="w-full md:w-36 px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </form>
        </div>

        {/* Filter and Search Bar matching Figure 8.4 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs mb-6">
          <form onSubmit={handleApplyFilter} className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            {/* Search Box */}
            <div className="flex-1 relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="project"
                className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Select */}
            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Priority Select */}
            <select
              aria-label="Filter by priority"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Sort Select */}
            <select
              aria-label="Sort tasks by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Due Date">Due Date</option>
              <option value="Priority">Priority</option>
              <option value="Newest">Newest</option>
            </select>

            <button
              type="submit"
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Apply
            </button>

            {(activeSearch || statusFilter !== 'All' || priorityFilter !== 'All' || sortBy !== 'Due Date') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Task Cards List matching Figure 8.4 */}
        <div className="space-y-3">
          {displayedTasks.length > 0 ? (
            displayedTasks.map((task) => {
              const isCompleted = task.status === 'Completed';

              return (
                <div
                  key={task.id}
                  className={`bg-white rounded-xl border p-4.5 transition-all shadow-xs flex items-center justify-between gap-4 ${
                    isCompleted ? 'border-slate-200 bg-slate-50/50 opacity-80' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Left: status toggle and task content */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => {
                        onToggleStatus(task.id);
                        showFlash('info', `Task marked as ${isCompleted ? 'pending' : 'completed'}!`);
                      }}
                      className="mt-0.5 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors shrink-0"
                      title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
                    >
                      {isCompleted ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[11px] font-bold">
                          ✓
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 hover:border-blue-500 transition-colors" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <h4
                        className={`text-sm font-bold text-slate-900 truncate ${
                          isCompleted ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {task.title}
                      </h4>

                      {task.description && (
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {/* Priority Badge */}
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            task.priority === 'High'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : task.priority === 'Medium'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-sky-50 text-sky-700 border border-sky-200'
                          }`}
                        >
                          {task.priority}
                        </span>

                        {/* Status Badge */}
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            task.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {task.status}
                        </span>

                        {/* Due Date */}
                        {task.dueDate && (
                          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>Due: {task.dueDate}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Edit & Delete buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEdit(task)}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 cursor-pointer transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeletingTaskId(task.id)}
                      className="px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded border border-red-200 cursor-pointer transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600">No tasks found matching your criteria</p>
              <p className="text-xs text-slate-400 mt-1">Try resetting filters or create a new task above.</p>
              <button
                onClick={handleResetFilters}
                className="mt-3 text-xs text-blue-600 font-semibold hover:underline"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-600" />
                <span>Edit Task</span>
              </h3>
              <button
                onClick={() => setEditingTask(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                  </input>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingTaskId !== null && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl border border-slate-200">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900">Confirm Deletion</h3>
            </div>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Are you sure you want to delete this task? This action cannot be undone and will remove the record from SQLite.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingTaskId(null)}
                className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
