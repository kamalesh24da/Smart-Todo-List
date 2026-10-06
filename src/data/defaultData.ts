import { User, Task, TestCase } from '../types/todo';

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    fullName: 'Kamalesh R',
    email: 'kamalesh@example.com',
    passwordHash: 'pbkdf2:sha256:600000$hashedpasswordtoken1',
    createdAt: '2026-10-01 09:30:00'
  },
  {
    id: 2,
    fullName: 'Ramya K',
    email: 'ramya@example.com',
    passwordHash: 'pbkdf2:sha256:600000$hashedpasswordtoken2',
    createdAt: '2026-10-02 11:15:00'
  }
];

export const INITIAL_TASKS: Task[] = [
  // User 1 (Kamalesh R) - Exactly matching Figure 8.4: Total 6, Completed 2, Pending 4, High 2
  {
    id: 1,
    userId: 1,
    title: 'Complete final year report',
    description: 'Finish documentation and testing',
    priority: 'High',
    dueDate: '2026-10-10',
    status: 'Pending',
    createdAt: '2026-10-03T10:00:00.000Z',
    updatedAt: '2026-10-03T10:00:00.000Z'
  },
  {
    id: 2,
    userId: 1,
    title: 'Review project modules',
    description: 'Check authentication and CRUD operations',
    priority: 'Medium',
    dueDate: '2026-10-06',
    status: 'Completed',
    createdAt: '2026-10-03T11:30:00.000Z',
    updatedAt: '2026-10-04T14:20:00.000Z'
  },
  {
    id: 3,
    userId: 1,
    title: 'Database schema verification',
    description: 'Verify SQLite tables and foreign key constraints',
    priority: 'High',
    dueDate: '2026-10-08',
    status: 'Pending',
    createdAt: '2026-10-04T08:15:00.000Z',
    updatedAt: '2026-10-04T08:15:00.000Z'
  },
  {
    id: 4,
    userId: 1,
    title: 'Prepare viva presentation',
    description: 'Prepare slides for external examiner demonstration',
    priority: 'Low',
    dueDate: '2026-10-15',
    status: 'Pending',
    createdAt: '2026-10-04T09:45:00.000Z',
    updatedAt: '2026-10-04T09:45:00.000Z'
  },
  {
    id: 5,
    userId: 1,
    title: 'Automated test suite run',
    description: 'Verify pytest test cases TC01 through TC12',
    priority: 'Medium',
    dueDate: '2026-10-04',
    status: 'Completed',
    createdAt: '2026-10-02T13:00:00.000Z',
    updatedAt: '2026-10-04T16:00:00.000Z'
  },
  {
    id: 6,
    userId: 1,
    title: 'Final project submission',
    description: 'Submit spiral bound copy to department library',
    priority: 'Low',
    dueDate: '2026-10-20',
    status: 'Pending',
    createdAt: '2026-10-05T07:10:00.000Z',
    updatedAt: '2026-10-05T07:10:00.000Z'
  },

  // User 2 (Ramya K) - Isolated tasks (demonstrating user isolation F10 / TC07)
  {
    id: 7,
    userId: 2,
    title: 'Data Science literature survey',
    description: 'Review Big Data Analytics publications 2024-2026',
    priority: 'High',
    dueDate: '2026-10-12',
    status: 'Pending',
    createdAt: '2026-10-02T12:00:00.000Z',
    updatedAt: '2026-10-02T12:00:00.000Z'
  },
  {
    id: 8,
    userId: 2,
    title: 'Flask API route benchmarks',
    description: 'Measure response latency with SQLite vs PostgreSQL',
    priority: 'Medium',
    dueDate: '2026-10-14',
    status: 'Completed',
    createdAt: '2026-10-02T14:30:00.000Z',
    updatedAt: '2026-10-03T10:10:00.000Z'
  }
];

export const INITIAL_TEST_CASES: TestCase[] = [
  {
    id: 'TC01',
    name: 'Valid registration',
    module: 'Registration',
    expectedResult: 'Account created; login page shown with success message',
    status: 'passed',
    executionTimeMs: 42,
    logs: [
      'POST /register -> full_name="Kamalesh R", email="kamalesh@example.com"',
      'Werkzeug generate_password_hash("password123") -> hash generated (length 102)',
      'Database commit -> User ID #1 created in users table',
      'Redirect -> 302 to /login with flash message "Registration successful! Please log in."'
    ]
  },
  {
    id: 'TC02',
    name: 'Duplicate email',
    module: 'Registration',
    expectedResult: 'Registration rejected; flash warning shown',
    status: 'passed',
    executionTimeMs: 18,
    logs: [
      'POST /register -> email="kamalesh@example.com" (duplicate test)',
      'Query: User.query.filter_by(email="kamalesh@example.com").first() -> Found existing User #1',
      'Validation triggered: duplicate email blocked to prevent collision',
      'Redirect -> 302 with flash message "Email already registered. Please log in."'
    ]
  },
  {
    id: 'TC03',
    name: 'Invalid registration',
    module: 'Registration',
    expectedResult: 'Password mismatch or empty field caught by validation',
    status: 'passed',
    executionTimeMs: 12,
    logs: [
      'POST /register -> password="pass1", confirm_password="pass2"',
      'Validation check: password != confirm_password',
      'Flash message emitted: "Passwords do not match."',
      'Render 200 /register without persisting to database'
    ]
  },
  {
    id: 'TC04',
    name: 'Valid login',
    module: 'Login',
    expectedResult: 'Dashboard shown; user session initialized',
    status: 'passed',
    executionTimeMs: 35,
    logs: [
      'POST /login -> email="kamalesh@example.com", password="password123"',
      'Werkzeug check_password_hash verified against stored password_hash: TRUE',
      'Session initialized: session["user_id"] = 1, session["user_name"] = "Kamalesh R"',
      'Redirect -> 302 to /dashboard'
    ]
  },
  {
    id: 'TC05',
    name: 'Protected dashboard',
    module: 'Session / Route Guard',
    expectedResult: 'Unauthenticated GET /dashboard redirects to /login',
    status: 'passed',
    executionTimeMs: 9,
    logs: [
      'GET /dashboard with empty session',
      '@login_required decorator check: "user_id" not in session',
      'Flash warning: "Please log in to access this page."',
      'HTTP 302 redirect sent to /login'
    ]
  },
  {
    id: 'TC06',
    name: 'Create task',
    module: 'Task CRUD',
    expectedResult: 'Task stored with user_id foreign key and rendered',
    status: 'passed',
    executionTimeMs: 24,
    logs: [
      'POST /tasks -> title="Complete final year report", priority="High"',
      'Foreign key binding: task.user_id = session["user_id"] (1)',
      'Task status defaulted to "Pending", due_date parsed',
      'Database commit -> Task inserted; HTTP 302 redirect to /dashboard'
    ]
  },
  {
    id: 'TC07',
    name: 'User isolation',
    module: 'Security & Auth',
    expectedResult: 'User B cannot see or query User A tasks (user_id scoped)',
    status: 'passed',
    executionTimeMs: 29,
    logs: [
      'Login as User A (ID: 1) -> Created Task #1 "Complete final year report"',
      'Logout User A; Login as User B (ID: 2)',
      'Query executed: Task.query.filter_by(user_id=2).all()',
      'Assert: Task #1 NOT present in User B dashboard -> ISOLATION ENFORCED'
    ]
  },
  {
    id: 'TC08',
    name: 'Toggle status',
    module: 'Task Status',
    expectedResult: 'Task status toggles between Pending and Completed',
    status: 'passed',
    executionTimeMs: 16,
    logs: [
      'POST /tasks/1/toggle -> ownership verified via get_user_task(1)',
      'State transition: "Pending" -> "Completed"',
      'Database updated_at timestamp renewed',
      'Flash message: "Task marked as completed!"'
    ]
  },
  {
    id: 'TC09',
    name: 'Edit task',
    module: 'Task CRUD',
    expectedResult: 'Selected task details updated successfully',
    status: 'passed',
    executionTimeMs: 21,
    logs: [
      'POST /tasks/1/edit -> title="Complete final year report (Revised)"',
      'Ownership validated: task.user_id == session["user_id"]',
      'Database attributes updated: title, description, priority, due_date',
      'Flash message: "Task updated successfully!"'
    ]
  },
  {
    id: 'TC10',
    name: 'Delete task',
    module: 'Task CRUD',
    expectedResult: 'Selected task removed from database permanently',
    status: 'passed',
    executionTimeMs: 19,
    logs: [
      'POST /tasks/6/delete -> ownership verified',
      'db.session.delete(task) -> record purged from tasks table',
      'Database commit complete',
      'Flash message: "Task deleted successfully."'
    ]
  },
  {
    id: 'TC11',
    name: 'Search / filter',
    module: 'Task Discovery',
    expectedResult: 'Query filters tasks by search keyword and status/priority',
    status: 'passed',
    executionTimeMs: 22,
    logs: [
      'GET /dashboard?search=report&priority=High',
      'SQL query constructed: WHERE user_id=1 AND (title ILIKE "%report%" OR description ILIKE "%report%") AND priority="High"',
      'Only matching records returned to view',
      'Filter validation passed'
    ]
  },
  {
    id: 'TC12',
    name: 'Logout',
    module: 'Authentication',
    expectedResult: 'Session cleared; user redirected to login page',
    status: 'passed',
    executionTimeMs: 14,
    logs: [
      'GET /logout -> session.clear() called',
      'Session cookie invalidated',
      'Flash message: "You have been logged out."',
      'Redirect -> 302 to /login'
    ]
  }
];
