from datetime import datetime
from flask import Blueprint, render_template, request, redirect, url_for, session, flash, abort
from app import db
from app.models.task import Task
from app.routes.auth import login_required

tasks_bp = Blueprint('tasks', __name__)

def get_user_task(task_id):
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

    # All user tasks for statistics
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

    # Sorting
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
    return redirect(url_for('tasks.dashboard'))
