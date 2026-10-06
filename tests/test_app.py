import pytest
import os
import tempfile
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
    response = client.post('/register', data={
        'full_name': 'Kamalesh R',
        'email': 'kamalesh@example.com',
        'password': 'password123',
        'confirm_password': 'password123'
    }, follow_redirects=True)
    assert response.status_code == 200
    assert b'Registration successful' in response.data or b'Login' in response.data

    with client.application.app_context():
        user = User.query.filter_by(email='kamalesh@example.com').first()
        assert user is not None
        assert user.full_name == 'Kamalesh R'
        assert user.check_password('password123') is True

def test_tc02_duplicate_email(client):
    """TC02: Duplicate email registration is rejected"""
    client.post('/register', data={
        'full_name': 'User One',
        'email': 'test@example.com',
        'password': 'password123',
        'confirm_password': 'password123'
    })
    response = client.post('/register', data={
        'full_name': 'User Two',
        'email': 'test@example.com',
        'password': 'password456',
        'confirm_password': 'password456'
    }, follow_redirects=True)
    assert b'already registered' in response.data or response.status_code == 200

def test_tc03_invalid_registration(client):
    """TC03: Password mismatch or missing fields rejected"""
    response = client.post('/register', data={
        'full_name': 'Mismatch Test',
        'email': 'mismatch@example.com',
        'password': 'password123',
        'confirm_password': 'different_password'
    }, follow_redirects=True)
    assert b'do not match' in response.data or response.status_code == 200

def test_tc04_valid_login(client):
    """TC04: Valid login redirects to dashboard"""
    client.post('/register', data={
        'full_name': 'Valid User',
        'email': 'valid@example.com',
        'password': 'password123',
        'confirm_password': 'password123'
    })
    response = client.post('/login', data={
        'email': 'valid@example.com',
        'password': 'password123'
    }, follow_redirects=True)
    assert response.status_code == 200
    assert b'dashboard' in response.request.path or b'Dashboard' in response.data or b'My Tasks' in response.data

def test_tc05_protected_dashboard(client):
    """TC05: Unauthenticated access to dashboard redirects to login"""
    response = client.get('/dashboard', follow_redirects=False)
    assert response.status_code == 302
    assert '/login' in response.headers.get('Location', '')

def test_tc06_create_task(client):
    """TC06: Authenticated user can create a task"""
    # Register & Login
    client.post('/register', data={'full_name': 'A', 'email': 'a@a.com', 'password': 'pass', 'confirm_password': 'pass'})
    client.post('/login', data={'email': 'a@a.com', 'password': 'pass'})

    response = client.post('/tasks', data={
        'title': 'Complete final year report',
        'description': 'Finish documentation and testing',
        'priority': 'High',
        'due_date': '2026-10-10'
    }, follow_redirects=True)
    assert response.status_code == 200
    assert b'Complete final year report' in response.data

def test_tc07_user_isolation(client):
    """TC07: Tasks created by User A cannot be accessed or seen by User B"""
    # User A creates a task
    client.post('/register', data={'full_name': 'User A', 'email': 'usera@example.com', 'password': 'passA', 'confirm_password': 'passA'})
    client.post('/login', data={'email': 'usera@example.com', 'password': 'passA'})
    client.post('/tasks', data={'title': 'User A Secret Task', 'priority': 'High'})

    # Logout
    client.get('/logout')

    # User B registers & logs in
    client.post('/register', data={'full_name': 'User B', 'email': 'userb@example.com', 'password': 'passB', 'confirm_password': 'passB'})
    client.post('/login', data={'email': 'userb@example.com', 'password': 'passB'})
    response = client.get('/dashboard')

    assert b'User A Secret Task' not in response.data

def test_tc08_toggle_status(client):
    """TC08: Toggle pending to completed status"""
    client.post('/register', data={'full_name': 'Toggle', 'email': 'toggle@example.com', 'password': 'pass', 'confirm_password': 'pass'})
    client.post('/login', data={'email': 'toggle@example.com', 'password': 'pass'})
    client.post('/tasks', data={'title': 'Task to Toggle', 'priority': 'Medium'})

    with client.application.app_context():
        task = Task.query.filter_by(title='Task to Toggle').first()
        task_id = task.id
        assert task.status == 'Pending'

    client.post(f'/tasks/{task_id}/toggle', follow_redirects=True)

    with client.application.app_context():
        task = Task.query.get(task_id)
        assert task.status == 'Completed'

def test_tc09_edit_task(client):
    """TC09: Edit owned task details"""
    client.post('/register', data={'full_name': 'Editor', 'email': 'edit@example.com', 'password': 'pass', 'confirm_password': 'pass'})
    client.post('/login', data={'email': 'edit@example.com', 'password': 'pass'})
    client.post('/tasks', data={'title': 'Original Title', 'priority': 'Low'})

    with client.application.app_context():
        task = Task.query.filter_by(title='Original Title').first()
        task_id = task.id

    client.post(f'/tasks/{task_id}/edit', data={
        'title': 'Updated Title',
        'description': 'Updated Description',
        'priority': 'High',
        'due_date': '2026-12-31'
    }, follow_redirects=True)

    with client.application.app_context():
        task = Task.query.get(task_id)
        assert task.title == 'Updated Title'
        assert task.priority == 'High'

def test_tc10_delete_task(client):
    """TC10: Delete owned task"""
    client.post('/register', data={'full_name': 'Deleter', 'email': 'delete@example.com', 'password': 'pass', 'confirm_password': 'pass'})
    client.post('/login', data={'email': 'delete@example.com', 'password': 'pass'})
    client.post('/tasks', data={'title': 'To be deleted', 'priority': 'Low'})

    with client.application.app_context():
        task = Task.query.filter_by(title='To be deleted').first()
        task_id = task.id

    client.post(f'/tasks/{task_id}/delete', follow_redirects=True)

    with client.application.app_context():
        task = Task.query.get(task_id)
        assert task is None

def test_tc11_search_and_filter(client):
    """TC11: Search and filter tasks by query and priority"""
    client.post('/register', data={'full_name': 'Searcher', 'email': 'search@example.com', 'password': 'pass', 'confirm_password': 'pass'})
    client.post('/login', data={'email': 'search@example.com', 'password': 'pass'})
    client.post('/tasks', data={'title': 'Python documentation', 'priority': 'High'})
    client.post('/tasks', data={'title': 'Chemistry assignment', 'priority': 'Low'})

    response = client.get('/dashboard?search=Python')
    assert b'Python documentation' in response.data
    assert b'Chemistry assignment' not in response.data

def test_tc12_logout(client):
    """TC12: Logout clears session and redirects to login"""
    client.post('/register', data={'full_name': 'SessionUser', 'email': 'session@example.com', 'password': 'pass', 'confirm_password': 'pass'})
    client.post('/login', data={'email': 'session@example.com', 'password': 'pass'})
    response = client.get('/logout', follow_redirects=True)
    assert response.status_code == 200
    assert b'logged out' in response.data or b'Login' in response.data

    # Protected dashboard should now redirect
    dash_resp = client.get('/dashboard', follow_redirects=False)
    assert dash_resp.status_code == 302
