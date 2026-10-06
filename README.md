# Smart Todo List: Digital Task Management Platform

An academic full-stack web project submitted by **R Kamalesh** (under supervision, Thiruvalluvar University, Department of Computer Science, Vellore - 632 115).

## 🚀 Overview
Smart Todo List is a secure, user-isolated task management system built using Flask, Flask-SQLAlchemy, SQLite, and modern UI design. It enforces strict user-data ownership via `user_id` foreign-key relationships and session authentication.

## 🛠️ Technology Stack
- **Backend**: Python 3.10+, Flask 3.1.2
- **ORM & Database**: Flask-SQLAlchemy 3.1.1, SQLite 3
- **Authentication**: Werkzeug 3.1.3 password hashing & Flask Sessions
- **Validation**: Server-side request & email validation
- **Testing**: pytest 8.4.2 (12 test cases TC01 to TC12)
- **Frontend**: HTML5, CSS3, Inter typography, Responsive Layout

## 📂 Project Structure (Table 7.1)
```text
├── run.py                 # Application entry point
├── config.py              # Application configuration
├── requirements.txt       # Dependencies
├── app/
│   ├── __init__.py        # App factory & database setup
│   ├── models/
│   │   ├── user.py        # User ORM model & hashing
│   │   └── task.py        # Task ORM model & relationships
│   └── routes/
│       ├── auth.py        # /register, /login, /logout
│       └── tasks.py       # /dashboard, CRUD, toggle, filters
├── templates/
│   ├── base.html          # Base layout & flash messages
│   ├── index.html         # Landing page (Fig 8.1)
│   ├── register.html      # Registration form (Fig 8.2)
│   ├── login.html         # Login form (Fig 8.3)
│   └── dashboard.html     # Tasks dashboard (Fig 8.4)
├── static/
│   └── style.css          # Application styles
└── tests/
    └── test_app.py        # Automated test suite (TC01-TC12)
```

## ⚙️ Setup and Execution
```bash
# 1. Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run application
python run.py

# 4. Run automated test suite
pytest -v tests/test_app.py
```
App runs at `http://127.0.0.1:5000/`.
