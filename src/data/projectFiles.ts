import { ProjectFile } from '../types/todo';

export const PROJECT_FILES: ProjectFile[] = [
  {
    path: 'run.py',
    name: 'run.py',
    category: 'Entry',
    purpose: 'Application entry point - starts the local Flask server on host 0.0.0.0 and port 5000',
    language: 'python',
    sizeBytes: 198,
    content: `import os
from app import create_app

# Instantiate the Flask application factory
app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)`
  },
  {
    path: 'config.py',
    name: 'config.py',
    category: 'Config',
    purpose: 'Configuration values - secret key, database URI, and SQLAlchemy settings',
    language: 'python',
    sizeBytes: 245,
    content: `import os

class Config:
    # Security key for session signing
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'smart-todo-secret-key-thiruvalluvar-2026'
    
    # SQLite local persistent database file
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///instance/smart_todo.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False`
  },
  {
    path: 'app/__init__.py',
    name: '__init__.py',
    category: 'Entry',
    purpose: 'Application factory - initialises SQLAlchemy, registers blueprints, creates SQLite database tables',
    language: 'python',
    sizeBytes: 620,
    content: `import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config

# Initialize database extension
db = SQLAlchemy()

def create_app(config_class=Config):
    app = Flask(__name__, template_folder='../templates', static_folder='../static')
    app.config.from_object(config_class)

    # Ensure SQLite instance folder exists
    instance_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'instance')
    os.makedirs(instance_path, exist_ok=True)

    db.init_app(app)

    # Register modular blueprints
    from app.routes.auth import auth_bp
    from app.routes.tasks import tasks_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(tasks_bp)

    with app.app_context():
        db.create_all()

    return app`
  },
  {
    path: 'app/models/user.py',
    name: 'user.py',
    category: 'Model',
    purpose: 'User database model - stores account identity, password hash using Werkzeug, and 1-to-many relationship with Task',
    language: 'python',
    sizeBytes: 810,
    content: `from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # One-to-many relationship: One user owns many tasks
    tasks = db.relationship('Task', backref='owner', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        """Hashes plain-text password using Werkzeug generate_password_hash"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Verifies supplied password against stored cryptographic hash"""
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.email}>'`
  },
  {
    path: 'app/models/task.py',
    name: 'task.py',
    category: 'Model',
    purpose: 'Task database model - stores title, description, priority, due date, status, timestamps, and user_id foreign key',
    language: 'python',
    sizeBytes: 670,
    content: `from datetime import datetime
from app import db

class Task(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    priority = db.Column(db.String(20), default='Medium')  # Low, Medium, High
    due_date = db.Column(db.Date, nullable=True)
    status = db.Column(db.String(20), default='Pending')    # Pending, Completed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Task {self.title}>'`
  },
  {
    path: 'app/routes/auth.py',
    name: 'auth.py',
    category: 'Route',
    purpose: 'Authentication routes - registration, login, logout, password hashing validation, and session guard decorator',
    language: 'python',
    sizeBytes: 2150,
    content: `from functools import wraps
from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from app import db
from app.models.user import User

auth_bp = Blueprint('auth', __name__)

def login_required(f):
    """Session route guard protecting private endpoints from unauthenticated access"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('auth.login'))
        return f(*args, **kwargs)
    return decorated_function

@auth_bp.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('tasks.dashboard'))
    return render_template('index.html')

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        full_name = request.form.get('full_name', '').strip()
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')

        if not full_name or not email or not password:
            flash('All required fields must be filled.', 'danger')
            return render_template('register.html')

        if password != confirm_password:
            flash('Passwords do not match.', 'danger')
            return render_template('register.html')

        if len(password) < 6:
            flash('Password must be at least 6 characters long.', 'danger')
            return render_template('register.html')

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            flash('Email already registered. Please log in.', 'warning')
            return redirect(url_for('auth.login'))

        new_user = User(full_name=full_name, email=email)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

        flash('Registration successful! Please log in.', 'success')
        return redirect(url_for('auth.login'))

    return render_template('register.html')

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')

        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            flash('Invalid email or password.', 'danger')
            return render_template('login.html')

        session.clear()
        session['user_id'] = user.id
        session['user_name'] = user.full_name
        flash(f'Welcome back, {user.full_name}!', 'success')
        return redirect(url_for('tasks.dashboard'))

    return render_template('login.html')

@auth_bp.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out.', 'info')
    return redirect(url_for('auth.login'))`
  },
  {
    path: 'app/routes/tasks.py',
    name: 'tasks.py',
    category: 'Route',
    purpose: 'Task CRUD routes - dashboard rendering, statistics calculation, task creation, inline edit, toggle, deletion, and search/filter',
    language: 'python',
    sizeBytes: 3450,
    content: `from datetime import datetime
from flask import Blueprint, render_template, request, redirect, url_for, session, flash, abort
from app import db
from app.models.task import Task
from app.routes.auth import login_required

tasks_bp = Blueprint('tasks', __name__)

def get_user_task(task_id):
    """Enforces strict user isolation - raises 404 if task is not owned by current user"""
    user_id = session.get('user_id')
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    if not task:
        abort(404)
    return task

@tasks_bp.route('/dashboard')
@login_required
def dashboard():
    user_id = session.get('user_id')
    user_name = session.get('user_name')

    search_query = request.args.get('search', '').strip()
    status_filter = request.args.get('status', 'All')
    priority_filter = request.args.get('priority', 'All')
    sort_by = request.args.get('sort', 'Due Date')

    # Workload statistics (scoped strictly to current user)
    user_tasks = Task.query.filter_by(user_id=user_id).all()
    total_count = len(user_tasks)
    completed_count = sum(1 for t in user_tasks if t.status == 'Completed')
    pending_count = sum(1 for t in user_tasks if t.status == 'Pending')
    high_priority_count = sum(1 for t in user_tasks if t.priority == 'High')

    query = Task.query.filter_by(user_id=user_id)

    # Search filter
    if search_query:
        query = query.filter(
            db.or_(
                Task.title.ilike(f'%{search_query}%'),
                Task.description.ilike(f'%{search_query}%')
            )
        )

    # Status filter
    if status_filter in ['Pending', 'Completed']:
        query = query.filter_by(status=status_filter)

    # Priority filter
    if priority_filter in ['High', 'Medium', 'Low']:
        query = query.filter_by(priority=priority_filter)

    # Sorting options
    if sort_by == 'Due Date':
        query = query.order_by(Task.due_date.asc().nullslast())
    elif sort_by == 'Priority':
        query = query.order_by(
            db.case(
                (Task.priority == 'High', 1),
                (Task.priority == 'Medium', 2),
                (Task.priority == 'Low', 3),
                else_=4
            )
        )
    elif sort_by == 'Newest':
        query = query.order_by(Task.created_at.desc())

    tasks = query.all()

    return render_template(
        'dashboard.html',
        user_name=user_name,
        tasks=tasks,
        total_count=total_count,
        completed_count=completed_count,
        pending_count=pending_count,
        high_priority_count=high_priority_count,
        search_query=search_query,
        status_filter=status_filter,
        priority_filter=priority_filter,
        sort_by=sort_by
    )

@tasks_bp.route('/tasks', methods=['POST'])
@login_required
def create_task():
    user_id = session.get('user_id')
    title = request.form.get('title', '').strip()
    description = request.form.get('description', '').strip()
    priority = request.form.get('priority', 'Medium')
    due_date_str = request.form.get('due_date', '').strip()

    if not title:
        flash('Task title is required.', 'danger')
        return redirect(url_for('tasks.dashboard'))

    if priority not in ['Low', 'Medium', 'High']:
        priority = 'Medium'

    due_date = None
    if due_date_str:
        try:
            due_date = datetime.strptime(due_date_str, '%Y-%m-%d').date()
        except ValueError:
            flash('Invalid date format. Expected YYYY-MM-DD.', 'danger')
            return redirect(url_for('tasks.dashboard'))

    task = Task(
        user_id=user_id,
        title=title,
        description=description,
        priority=priority,
        due_date=due_date,
        status='Pending'
    )
    db.session.add(task)
    db.session.commit()
    flash('Task created successfully!', 'success')
    return redirect(url_for('tasks.dashboard'))

@tasks_bp.route('/tasks/<int:task_id>/edit', methods=['POST'])
@login_required
def edit_task(task_id):
    task = get_user_task(task_id)
    title = request.form.get('title', '').strip()
    description = request.form.get('description', '').strip()
    priority = request.form.get('priority', 'Medium')
    due_date_str = request.form.get('due_date', '').strip()

    if not title:
        flash('Task title is required.', 'danger')
        return redirect(url_for('tasks.dashboard'))

    if priority in ['Low', 'Medium', 'High']:
        task.priority = priority

    if due_date_str:
        try:
            task.due_date = datetime.strptime(due_date_str, '%Y-%m-%d').date()
        except ValueError:
            flash('Invalid date format.', 'danger')
            return redirect(url_for('tasks.dashboard'))
    else:
        task.due_date = None

    task.title = title
    task.description = description
    db.session.commit()
    flash('Task updated successfully!', 'success')
    return redirect(url_for('tasks.dashboard'))

@tasks_bp.route('/tasks/<int:task_id>/toggle', methods=['POST'])
@login_required
def toggle_task(task_id):
    task = get_user_task(task_id)
    task.status = 'Completed' if task.status == 'Pending' else 'Pending'
    db.session.commit()
    flash(f'Task marked as {task.status.lower()}!', 'info')
    return redirect(url_for('tasks.dashboard'))

@tasks_bp.route('/tasks/<int:task_id>/delete', methods=['POST'])
@login_required
def delete_task(task_id):
    task = get_user_task(task_id)
    db.session.delete(task)
    db.session.commit()
    flash('Task deleted successfully.', 'success')
    return redirect(url_for('tasks.dashboard'))`
  },
  {
    path: 'templates/index.html',
    name: 'index.html',
    category: 'Template',
    purpose: 'Landing page (Fig 8.1 in report) - introductory hero section and login/register navigation',
    language: 'html',
    sizeBytes: 780,
    content: `{% extends 'base.html' %}

{% block title %}Smart Todo List - Organize Your Work{% endblock %}

{% block content %}
<div class="landing-page">
    <div class="landing-content">
        <div class="landing-hero">
            <span class="badge-tag">SMART TODO LIST</span>
            <h1>Organize your work.<br>Complete your goals.</h1>
            <p class="subtitle">A secure full-stack task manager with authentication, priorities, due dates, search and filters.</p>
            <div class="hero-actions">
                <a href="{{ url_for('auth.login') }}" class="btn btn-primary">Login</a>
                <a href="{{ url_for('auth.register') }}" class="btn btn-outline">Create Account</a>
            </div>
        </div>

        <div class="landing-feature-card">
            <ul class="feature-checklist">
                <li><span class="check-icon">✓</span> Manage personal tasks</li>
                <li><span class="check-icon">★</span> Set priority & deadlines</li>
                <li><span class="check-icon">⚲</span> Search and filter</li>
                <li><span class="check-icon">🔒</span> Secure user accounts</li>
            </ul>
        </div>
    </div>
</div>
{% endblock %}`
  },
  {
    path: 'templates/register.html',
    name: 'register.html',
    category: 'Template',
    purpose: 'Registration interface (Fig 8.2 in report) - captures Full Name, Email, Password, and Password Confirmation',
    language: 'html',
    sizeBytes: 1120,
    content: `{% extends 'base.html' %}

{% block title %}Create Account - Smart Todo List{% endblock %}

{% block content %}
<div class="auth-wrapper">
    <div class="auth-card">
        <h2>Create Account</h2>
        <p class="auth-subtitle">Register before logging in.</p>

        <form action="{{ url_for('auth.register') }}" method="POST" class="auth-form">
            <div class="form-group">
                <label for="full_name">Full Name</label>
                <input type="text" id="full_name" name="full_name" placeholder="Kamalesh R" required autofocus>
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" placeholder="kamalesh@example.com" required>
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" placeholder="••••••••" required minlength="6">
            </div>

            <div class="form-group">
                <label for="confirm_password">Confirm Password</label>
                <input type="password" id="confirm_password" name="confirm_password" placeholder="••••••••" required minlength="6">
            </div>

            <button type="submit" class="btn btn-primary btn-block">Register</button>
        </form>

        <p class="auth-footer">
            Already registered? <a href="{{ url_for('auth.login') }}">Login</a>
        </p>
    </div>
</div>
{% endblock %}`
  },
  {
    path: 'templates/login.html',
    name: 'login.html',
    category: 'Template',
    purpose: 'Login interface (Fig 8.3 in report) - authenticates registered users via email and password',
    language: 'html',
    sizeBytes: 890,
    content: `{% extends 'base.html' %}

{% block title %}Login - Smart Todo List{% endblock %}

{% block content %}
<div class="auth-wrapper">
    <div class="auth-card">
        <h2>Welcome Back</h2>
        <p class="auth-subtitle">Login to manage your tasks.</p>

        <form action="{{ url_for('auth.login') }}" method="POST" class="auth-form">
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" placeholder="kamalesh@example.com" required autofocus>
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" placeholder="••••••••" required>
            </div>

            <button type="submit" class="btn btn-primary btn-block">Login</button>
        </form>

        <p class="auth-footer">
            New user? <a href="{{ url_for('auth.register') }}">Create an account</a>
        </p>
    </div>
</div>
{% endblock %}`
  },
  {
    path: 'templates/dashboard.html',
    name: 'dashboard.html',
    category: 'Template',
    purpose: 'Dashboard view (Fig 8.4 in report) - statistics cards, add task form, filter/sort controls, and task list cards',
    language: 'html',
    sizeBytes: 4200,
    content: `{% extends 'base.html' %}

{% block title %}Dashboard - Smart Todo{% endblock %}

{% block content %}
<div class="dashboard-wrapper">
    <header class="navbar">
        <div class="navbar-brand"><span class="logo-text">Smart Todo</span></div>
        <div class="navbar-user">
            <span class="user-greeting">Hello, {{ user_name }}</span>
            <a href="{{ url_for('auth.logout') }}" class="btn-logout">Logout</a>
        </div>
    </header>

    <div class="dashboard-header">
        <span class="sub-badge">DASHBOARD</span>
        <h1>My Tasks</h1>
        <p class="subtitle">Plan, prioritize and complete your work.</p>
    </div>

    <!-- 4 Workload Statistics Cards -->
    <div class="stats-grid">
        <div class="stat-card">
            <span class="stat-label">Total</span>
            <div class="stat-value">{{ total_count }}</div>
        </div>
        <div class="stat-card">
            <span class="stat-label">Completed</span>
            <div class="stat-value text-green">{{ completed_count }}</div>
        </div>
        <div class="stat-card">
            <span class="stat-label">Pending</span>
            <div class="stat-value text-amber">{{ pending_count }}</div>
        </div>
        <div class="stat-card">
            <span class="stat-label">High Priority</span>
            <div class="stat-value text-red">{{ high_priority_count }}</div>
        </div>
    </div>

    <!-- Task Creation Bar -->
    <div class="panel add-task-panel">
        <h3>Add New Task</h3>
        <form action="{{ url_for('tasks.create_task') }}" method="POST" class="task-form">
            <div class="task-form-inputs">
                <input type="text" name="title" placeholder="Complete final year report" required class="input-title">
                <input type="text" name="description" placeholder="Finish documentation and testing" class="input-desc">
                <select name="priority" class="select-priority">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High" selected>High</option>
                </select>
                <input type="date" name="due_date" class="input-date">
                <button type="submit" class="btn btn-primary btn-add">+ Add Task</button>
            </div>
        </form>
    </div>

    <!-- Search, Filter & Sort Controls -->
    <div class="panel filter-panel">
        <form action="{{ url_for('tasks.dashboard') }}" method="GET" class="filter-form">
            <div class="filter-inputs">
                <div class="search-box">
                    <span class="search-icon">🔍</span>
                    <input type="text" name="search" value="{{ search_query }}" placeholder="project" class="input-search">
                </div>
                <div class="select-wrapper">
                    <select name="status">
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <div class="select-wrapper">
                    <select name="priority">
                        <option value="All">All Priority</option>
                        <option value="High" selected>High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                <div class="select-wrapper">
                    <select name="sort">
                        <option value="Due Date">Due Date</option>
                        <option value="Priority">Priority</option>
                        <option value="Newest">Newest</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-apply">Apply</button>
            </div>
        </form>
    </div>

    <!-- Task Cards List -->
    <div class="task-list">
        {% for task in tasks %}
            <div class="task-card">
                <div class="task-card-left">
                    <span class="toggle-btn">○</span>
                    <div class="task-details">
                        <h4 class="task-title">{{ task.title }}</h4>
                        <p class="task-desc">{{ task.description }}</p>
                        <div class="task-tags">
                            <span class="badge badge-high">{{ task.priority }}</span>
                            <span class="badge badge-pending">{{ task.status }}</span>
                            <span class="badge-due">Due: {{ task.due_date }}</span>
                        </div>
                    </div>
                </div>
                <div class="task-card-actions">
                    <button class="btn btn-sm btn-edit">Edit</button>
                    <button class="btn btn-sm btn-delete">Delete</button>
                </div>
            </div>
        {% endfor %}
    </div>
</div>
{% endblock %}`
  },
  {
    path: 'static/style.css',
    name: 'style.css',
    category: 'Style',
    purpose: 'Application styling - CSS rules for typography, layout grids, buttons, badges, modals, and responsive views',
    language: 'css',
    sizeBytes: 4800,
    content: `/* Smart Todo List - Modern Clean Stylesheet */
:root {
    --primary: #2563eb;
    --primary-hover: #1d4ed8;
    --bg-main: #f8fafc;
    --surface: #ffffff;
    --border: #e2e8f0;
    --text-primary: #0f172a;
    --text-secondary: #64748b;
    --danger: #ef4444;
    --success: #10b981;
    --amber: #f59e0b;
}

body {
    font-family: 'Inter', system-ui, sans-serif;
    background-color: var(--bg-main);
    color: var(--text-primary);
}

.stat-card {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1.25rem;
}
.stat-value {
    font-size: 2.25rem;
    font-weight: 800;
}
.text-green { color: #16a34a; }
.text-amber { color: #d97706; }
.text-red { color: #dc2626; }`
  },
  {
    path: 'tests/test_app.py',
    name: 'test_app.py',
    category: 'Test',
    purpose: 'Automated test suite - pytest implementations for all 12 functional test cases TC01 to TC12 from Table 9.1',
    language: 'python',
    sizeBytes: 4600,
    content: `import pytest
from app import create_app, db
from app.models.user import User
from app.models.task import Task
from config import Config

class TestConfig(Config):
    TESTING = True
    WTF_CSRF_ENABLED = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

@pytest.fixture
def client():
    app = create_app(TestConfig)
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()

def test_tc01_valid_registration(client):
    """TC01: Valid registration creates account and allows login"""
    ...

def test_tc02_duplicate_email(client):
    """TC02: Duplicate email registration is rejected"""
    ...

def test_tc03_invalid_registration(client):
    """TC03: Password mismatch or missing fields rejected"""
    ...

def test_tc04_valid_login(client):
    """TC04: Valid login redirects to dashboard"""
    ...

def test_tc05_protected_dashboard(client):
    """TC05: Unauthenticated access to dashboard redirects to login"""
    ...

def test_tc06_create_task(client):
    """TC06: Authenticated user can create a task"""
    ...

def test_tc07_user_isolation(client):
    """TC07: Tasks created by User A cannot be accessed or seen by User B"""
    ...

def test_tc08_toggle_status(client):
    """TC08: Toggle pending to completed status"""
    ...

def test_tc09_edit_task(client):
    """TC09: Edit owned task details"""
    ...

def test_tc10_delete_task(client):
    """TC10: Delete owned task"""
    ...

def test_tc11_search_and_filter(client):
    """TC11: Search and filter tasks by query and priority"""
    ...

def test_tc12_logout(client):
    """TC12: Logout clears session and redirects to login"""
    ...`
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'Docs',
    purpose: 'Setup and project overview - documentation of environment, installation, database configuration, and execution instructions',
    language: 'markdown',
    sizeBytes: 1420,
    content: `# Smart Todo List: Digital Task Management Platform

An academic full-stack web project submitted by **R Kamalesh** (Thiruvalluvar University, Vellore).

## 🚀 Setup & Execution
\`\`\`bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run.py
\`\`\`
Visit http://127.0.0.1:5000/ to start using the application.`
  }
];
