import React, { useState } from 'react';
import { HeaderNav, ActiveTab } from './components/HeaderNav';
import { LandingView } from './components/LiveApp/LandingView';
import { RegisterView } from './components/LiveApp/RegisterView';
import { LoginView } from './components/LiveApp/LoginView';
import { DashboardView } from './components/LiveApp/DashboardView';
import { FileStructureView } from './components/FileStructureView';
import { TestRunnerView } from './components/TestRunnerView';
import { ArchitectureView } from './components/ArchitectureView';
import { INITIAL_USERS, INITIAL_TASKS } from './data/defaultData';
import { User, Task, Priority } from './types/todo';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('live-app');
  const [liveView, setLiveView] = useState<'landing' | 'register' | 'login' | 'dashboard'>('dashboard');

  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  // Default to User 1 (Kamalesh R) as logged-in user matching Figure 8.4
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  // Authentication Handlers
  const handleRegister = (fullName: string, email: string, password: string) => {
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, error: 'Email already registered. Please log in.' };
    }

    const newUser: User = {
      id: users.length + 1,
      fullName,
      email: email.toLowerCase(),
      passwordHash: `pbkdf2:sha256:600000$${Math.random().toString(36).substring(2)}`,
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, newUser]);
    setLiveView('login');
    return { success: true };
  };

  const handleLogin = (email: string, password: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, error: 'Invalid email or password.' };
    }
    setCurrentUser(user);
    setLiveView('dashboard');
    return { success: true };
  };

  const handleQuickDemoLogin = (email: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      setLiveView('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLiveView('login');
  };

  const handleSwitchUser = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  // Task CRUD Handlers
  const handleAddTask = (newTaskData: { title: string; description: string; priority: Priority; dueDate?: string }) => {
    if (!currentUser) return;

    const newTask: Task = {
      id: Date.now(),
      userId: currentUser.id,
      title: newTaskData.title,
      description: newTaskData.description || undefined,
      priority: newTaskData.priority,
      dueDate: newTaskData.dueDate || undefined,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTasks(prev => [newTask, ...prev]);
  };

  const handleUpdateTask = (id: number, updatedData: { title: string; description: string; priority: Priority; dueDate?: string }) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              title: updatedData.title,
              description: updatedData.description,
              priority: updatedData.priority,
              dueDate: updatedData.dueDate,
              updatedAt: new Date().toISOString()
            }
          : t
      )
    );
  };

  const handleToggleStatus = (id: number) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              status: t.status === 'Pending' ? 'Completed' : 'Pending',
              updatedAt: new Date().toISOString()
            }
          : t
      )
    );
  };

  const handleDeleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Academic & Navigation Bar */}
      <HeaderNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentUser={currentUser}
      />

      {/* Main Tab Views */}
      <div className="flex-1">
        {activeTab === 'live-app' && (
          <div>
            {liveView === 'landing' && (
              <LandingView onNavigate={(view) => setLiveView(view)} />
            )}

            {liveView === 'register' && (
              <RegisterView
                onRegister={handleRegister}
                onNavigate={(view) => setLiveView(view)}
              />
            )}

            {liveView === 'login' && (
              <LoginView
                onLogin={handleLogin}
                onNavigate={(view) => setLiveView(view)}
                onQuickDemoLogin={handleQuickDemoLogin}
              />
            )}

            {liveView === 'dashboard' && (
              currentUser ? (
                <DashboardView
                  currentUser={currentUser}
                  tasks={tasks}
                  onAddTask={handleAddTask}
                  onUpdateTask={handleUpdateTask}
                  onToggleStatus={handleToggleStatus}
                  onDeleteTask={handleDeleteTask}
                  onLogout={handleLogout}
                  onSwitchUser={handleSwitchUser}
                  allUsers={users}
                />
              ) : (
                <LoginView
                  onLogin={handleLogin}
                  onNavigate={(view) => setLiveView(view)}
                  onQuickDemoLogin={handleQuickDemoLogin}
                />
              )
            )}
          </div>
        )}

        {activeTab === 'file-structure' && (
          <FileStructureView />
        )}

        {activeTab === 'test-runner' && (
          <TestRunnerView />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureView />
        )}
      </div>

      {/* Global Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 px-4 text-xs text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-slate-300 font-semibold">Smart Todo List</span> &mdash; Academic Project Submission by{' '}
            <strong className="text-white">R Kamalesh</strong> (Reg. No.: 30024I05029)
          </div>
          <div className="text-slate-500">
            Thiruvalluvar University &bull; Vellore &bull; Python / Flask / SQLAlchemy / SQLite
          </div>
        </div>
      </footer>
    </div>
  );
}
