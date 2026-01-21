let tasks = [];
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromStorage();
    setupEventListeners();
    renderTasks();
    updateStats();
});

// Event Listeners
function setupEventListeners() {
    document.getElementById('taskForm').addEventListener('submit', addTask);
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            renderTasks();
        });
    });
}

// Add Task
function addTask(e) {
    e.preventDefault();
    
    const task = {
        id: Date.now(),
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        priority: document.getElementById('taskPriority').value,
        dueDate: document.getElementById('taskDueDate').value,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.unshift(task);
    saveTasksToStorage();
    renderTasks();
    updateStats();
    
    document.getElementById('taskForm').reset();
    showNotification('Task added successfully!', 'success');
}

// Render Tasks
function renderTasks() {
    const tasksList = document.getElementById('tasksList');
    let filteredTasks = tasks;
    
    // Apply filters
    if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);
    } else if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'high') {
        filteredTasks = tasks.filter(t => t.priority === 'high');
    }
    
    if (filteredTasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <h3>No tasks found</h3>
                <p>Add your first task to get started!</p>
            </div>
        `;
        return;
    }
    
    tasksList.innerHTML = filteredTasks.map(task => `
        <div class="task-card ${task.completed ? 'completed' : ''} priority-${task.priority}">
            <div class="task-header">
                <h3 class="task-title">${task.title}</h3>
                <div class="task-actions">
                    <button class="task-btn btn-complete" onclick="toggleTask(${task.id})" title="${task.completed ? 'Mark as pending' : 'Mark as complete'}">
                        <i class="fas ${task.completed ? 'fa-rotate-left' : 'fa-check'}"></i>
                    </button>
                    <button class="task-btn btn-delete" onclick="deleteTask(${task.id})" title="Delete task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
            <div class="task-meta">
                <div class="task-meta-item">
                    <i class="fas fa-flag"></i>
                    <span class="priority-badge priority-${task.priority}">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                </div>
                ${task.dueDate ? `
                    <div class="task-meta-item">
                        <i class="fas fa-calendar"></i>
                        <span>Due: ${formatDate(task.dueDate)}</span>
                    </div>
                ` : ''}
                <div class="task-meta-item">
                    <i class="fas fa-clock"></i>
                    <span>Created: ${formatDate(task.createdAt.split('T')[0])}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Toggle Task
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasksToStorage();
        renderTasks();
        updateStats();
        showNotification(task.completed ? 'Task completed!' : 'Task marked as pending', 'success');
    }
}

// Delete Task
function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasksToStorage();
        renderTasks();
        updateStats();
        showNotification('Task deleted', 'danger');
    }
}

// Update Stats
function updateStats() {
    document.getElementById('totalTasks').textContent = tasks.length;
    document.getElementById('completedTasks').textContent = tasks.filter(t => t.completed).length;
    document.getElementById('pendingTasks').textContent = tasks.filter(t => !t.completed).length;
    document.getElementById('urgentTasks').textContent = tasks.filter(t => t.priority === 'high' && !t.completed).length;
}

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Local Storage
function saveTasksToStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromStorage() {
    const saved = localStorage.getItem('tasks');
    if (saved) {
        tasks = JSON.parse(saved);
    } else {
        // Add demo tasks
        tasks = [
            {
                id: 1,
                title: 'Complete project documentation',
                description: 'Write comprehensive documentation for the new project',
                priority: 'high',
                dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                completed: false,
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                title: 'Team meeting at 3 PM',
                description: 'Discuss Q1 goals and objectives',
                priority: 'medium',
                dueDate: new Date().toISOString().split('T')[0],
                completed: false,
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                title: 'Code review',
                description: 'Review pull requests from team members',
                priority: 'low',
                dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
                completed: true,
                createdAt: new Date(Date.now() - 86400000).toISOString()
            }
        ];
        saveTasksToStorage();
    }
}

// Notification
function showNotification(message, type = 'success') {
    const colors = {
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
