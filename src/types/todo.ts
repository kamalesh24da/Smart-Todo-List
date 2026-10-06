export type Priority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'Completed';
export type SortOption = 'Due Date' | 'Priority' | 'Newest';

export interface User {
  id: number;
  fullName: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface Task {
  id: number;
  userId: number;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string; // YYYY-MM-DD
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TestCase {
  id: string; // e.g. TC01
  name: string;
  module: string;
  expectedResult: string;
  status: 'passed' | 'failed' | 'pending' | 'running';
  executionTimeMs: number;
  logs: string[];
}

export interface ProjectFile {
  path: string;
  name: string;
  category: 'Entry' | 'Config' | 'Model' | 'Route' | 'Template' | 'Style' | 'Test' | 'Docs';
  purpose: string;
  language: 'python' | 'html' | 'css' | 'markdown' | 'text';
  content: string;
  sizeBytes: number;
}
