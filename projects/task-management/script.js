// Task Management System with Advanced Features
let tasks = [];
let currentCategory = 'all';
let currentFilter = 'all';
let currentSort = 'date';

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', function() {
    loadTasksFromStorage();
    renderTasks();
    updateStats();
    setupEventListeners();
    
    // Set default due date to today
    document.getElementById('taskDueDate').valueAsDate = new Date();
});

function setupEventListeners() {
    // Task Form
    document.getElementById('taskForm').addEventListener('submit', addTask);
    
    // Search
    document.getElementById('searchTasks').addEventListener('input', handleSearch);
    
    // Category Tabs
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            renderTasks();
        });
    });
    
    // Filter Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            renderTasks();
        });
    });
    
    // Sort Select
    document.getElementById('sortSelect').addEventListener('change', function() {
        currentSort = this.value;
        renderTasks();
    });
}

function addTask(e) {
    e.preventDefault();
    
    const task = {
        id: Date.now(),
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        category: document.getElementById('taskCategory').value,
        priority: document.getElementById('taskPriority').value,
        dueDate: document.getElementById('taskDueDate').value,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(task);
    saveTasksToStorage();
    renderTasks();
    updateStats();
    
    // Reset form with animation
    e.target.reset();
    document.getElementById('taskDueDate').valueAsDate = new Date();
    
    // Show success animation
    showNotification('Task created successfully!', 'success');
}

function renderTasks() {
    const tasksList = document.getElementById('tasksList');
    let filteredTasks = filterTasks();
    
    if (filteredTasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>No tasks found</h3>
                <p>Create a new task to get started!</p>
            </div>
        `;
        return;
    }
    
    // Sort tasks
    filteredTasks = sortTasks(filteredTasks);
    
    tasksList.innerHTML = filteredTasks.map(task => `
        <div class="task-card ${task.completed ? 'completed' : ''} priority-${task.priority}" draggable="true" data-task-id="${task.id}">
            <div class="task-header">
                <h3 class="task-title">${escapeHtml(task.title)}</h3>
                <div class="task-actions">
                    <button class="task-btn btn-edit" onclick="editTask(${task.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="task-btn btn-complete" onclick="toggleComplete(${task.id})" title="${task.completed ? 'Mark Pending' : 'Mark Complete'}">
                        <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                    </button>
                    <button class="task-btn btn-delete" onclick="deleteTask(${task.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
            <div class="task-meta">
                <span class="category-badge category-${task.category}">
                    ${getCategoryIcon(task.category)} ${task.category}
                </span>
                <span class="priority-badge priority-${task.priority}">
                    ${getPriorityIcon(task.priority)} ${task.priority}
                </span>
                <span class="task-meta-item">
                    <i class="fas fa-calendar"></i> ${formatDate(task.dueDate)}
                </span>
                <span class="task-meta-item">
                    <i class="fas fa-clock"></i> ${getTimeAgo(task.createdAt)}
                </span>
            </div>
        </div>
    `).join('');
    
    // Add drag and drop functionality
    addDragAndDrop();
}

function filterTasks() {
    let filtered = [...tasks];
    
    // Filter by category
    if (currentCategory !== 'all') {
        filtered = filtered.filter(task => task.category === currentCategory);
    }
    
    // Filter by status
    if (currentFilter === 'completed') {
        filtered = filtered.filter(task => task.completed);
    } else if (currentFilter === 'pending') {
        filtered = filtered.filter(task => !task.completed);
    } else if (currentFilter === 'high') {
        filtered = filtered.filter(task => task.priority === 'high');
    }
    
    // Search filter
    const searchTerm = document.getElementById('searchTasks').value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(task => 
            task.title.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm)
        );
    }
    
    return filtered;
}

function sortTasks(tasks) {
    const sortedTasks = [...tasks];
    
    switch(currentSort) {
        case 'priority':
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return sortedTasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        case 'dueDate':
            return sortedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        case 'title':
            return sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
        case 'date':
        default:
            return sortedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
}

function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasksToStorage();
        renderTasks();
        updateStats();
        showNotification(task.completed ? 'Task completed! 🎉' : 'Task marked as pending', 'success');
    }
}

function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasksToStorage();
        renderTasks();
        updateStats();
        showNotification('Task deleted successfully', 'info');
    }
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const modal = document.getElementById('editModal');
    const modalBody = document.getElementById('editModalBody');
    
    modalBody.innerHTML = `
        <form id="editTaskForm">
            <div class="form-grid">
                <input type="text" id="editTaskTitle" value="${escapeHtml(task.title)}" required>
                <select id="editTaskCategory" required>
                    <option value="work" ${task.category === 'work' ? 'selected' : ''}>👔 Work</option>
                    <option value="personal" ${task.category === 'personal' ? 'selected' : ''}>👤 Personal</option>
                    <option value="shopping" ${task.category === 'shopping' ? 'selected' : ''}>🛒 Shopping</option>
                    <option value="health" ${task.category === 'health' ? 'selected' : ''}>❤️ Health</option>
                </select>
            </div>
            <textarea id="editTaskDescription" rows="3">${escapeHtml(task.description)}</textarea>
            <div class="form-row">
                <select id="editTaskPriority">
                    <option value="low" ${task.priority === 'low' ? 'selected' : ''}>🟢 Low Priority</option>
                    <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>🟡 Medium Priority</option>
                    <option value="high" ${task.priority === 'high' ? 'selected' : ''}>🔴 High Priority</option>
                </select>
                <input type="date" id="editTaskDueDate" value="${task.dueDate}">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> Update Task
                </button>
            </div>
        </form>
    `;
    
    modal.classList.add('show');
    
    document.getElementById('editTaskForm').addEventListener('submit', function(e) {
        e.preventDefault();
        task.title = document.getElementById('editTaskTitle').value;
        task.description = document.getElementById('editTaskDescription').value;
        task.category = document.getElementById('editTaskCategory').value;
        task.priority = document.getElementById('editTaskPriority').value;
        task.dueDate = document.getElementById('editTaskDueDate').value;
        
        saveTasksToStorage();
        renderTasks();
        updateStats();
        closeEditModal();
        showNotification('Task updated successfully!', 'success');
    });
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('show');
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeEditModal();
    }
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const urgent = tasks.filter(t => t.priority === 'high' && !t.completed).length;
    
    // Update stat cards
    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;
    document.getElementById('urgentTasks').textContent = urgent;
    
    // Update progress bars with animation
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    document.getElementById('totalProgress').style.width = '100%';
    document.getElementById('completedProgress').style.width = completionRate + '%';
    document.getElementById('pendingProgress').style.width = ((pending / total) * 100 || 0) + '%';
    document.getElementById('urgentProgress').style.width = ((urgent / total) * 100 || 0) + '%';
    
    // Update category counts
    document.getElementById('allCount').textContent = total;
    document.getElementById('workCount').textContent = tasks.filter(t => t.category === 'work').length;
    document.getElementById('personalCount').textContent = tasks.filter(t => t.category === 'personal').length;
    document.getElementById('shoppingCount').textContent = tasks.filter(t => t.category === 'shopping').length;
    document.getElementById('healthCount').textContent = tasks.filter(t => t.category === 'health').length;
}

function handleSearch(e) {
    renderTasks();
}

function selectAllTasks() {
    const allCompleted = tasks.filter(filterTasks).every(t => t.completed);
    const visibleTasks = filterTasks();
    
    visibleTasks.forEach(task => {
        task.completed = !allCompleted;
    });
    
    saveTasksToStorage();
    renderTasks();
    updateStats();
    showNotification(allCompleted ? 'All tasks marked as pending' : 'All tasks completed! 🎉', 'success');
}

function deleteCompleted() {
    const completedCount = tasks.filter(t => t.completed).length;
    
    if (completedCount === 0) {
        showNotification('No completed tasks to delete', 'info');
        return;
    }
    
    if (confirm(`Delete ${completedCount} completed task(s)?`)) {
        tasks = tasks.filter(t => !t.completed);
        saveTasksToStorage();
        renderTasks();
        updateStats();
        showNotification(`${completedCount} completed task(s) deleted`, 'success');
    }
}

function exportTasks() {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showNotification('Tasks exported successfully!', 'success');
}

// Drag and Drop Functionality
function addDragAndDrop() {
    const taskCards = document.querySelectorAll('.task-card');
    
    taskCards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragover', handleDragOver);
        card.addEventListener('drop', handleDrop);
        card.addEventListener('dragend', handleDragEnd);
    });
}

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (draggedElement !== this) {
        const allTasks = document.querySelectorAll('.task-card');
        const draggedIndex = Array.from(allTasks).indexOf(draggedElement);
        const droppedIndex = Array.from(allTasks).indexOf(this);
        
        if (draggedIndex > droppedIndex) {
            this.parentNode.insertBefore(draggedElement, this);
        } else {
            this.parentNode.insertBefore(draggedElement, this.nextSibling);
        }
        
        showNotification('Task reordered!', 'info');
    }
    
    return false;
}

function handleDragEnd(e) {
    this.style.opacity = '1';
}

// Helper Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
}

function getTimeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getCategoryIcon(category) {
    const icons = {
        work: '👔',
        personal: '👤',
        shopping: '🛒',
        health: '❤️'
    };
    return icons[category] || '📋';
}

function getPriorityIcon(priority) {
    const icons = {
        high: '🔴',
        medium: '🟡',
        low: '🟢'
    };
    return icons[priority] || '⚪';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : type === 'info' ? '#3B82F6' : '#F59E0B'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'info' ? 'info-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations to the page
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Storage Functions
function saveTasksToStorage() {
    localStorage.setItem('taskmaster_tasks', JSON.stringify(tasks));
}

function loadTasksFromStorage() {
    const stored = localStorage.getItem('taskmaster_tasks');
    if (stored) {
        tasks = JSON.parse(stored);
    } else {
        // Add demo tasks
        tasks = [
            {
                id: 1,
                title: 'Complete Project Documentation',
                description: 'Write comprehensive documentation for the TaskMaster app including features and usage guide',
                category: 'work',
                priority: 'high',
                dueDate: new Date().toISOString().split('T')[0],
                completed: false,
                createdAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: 2,
                title: 'Buy Groceries',
                description: 'Milk, Eggs, Bread, Vegetables, Fruits',
                category: 'shopping',
                priority: 'medium',
                dueDate: new Date().toISOString().split('T')[0],
                completed: false,
                createdAt: new Date(Date.now() - 172800000).toISOString()
            },
            {
                id: 3,
                title: 'Morning Workout',
                description: '30 minutes cardio + strength training',
                category: 'health',
                priority: 'high',
                dueDate: new Date().toISOString().split('T')[0],
                completed: true,
                createdAt: new Date(Date.now() - 3600000).toISOString()
            },
            {
                id: 4,
                title: 'Read Book Chapter',
                description: 'Complete chapter 5 of "Atomic Habits"',
                category: 'personal',
                priority: 'low',
                dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                completed: false,
                createdAt: new Date(Date.now() - 7200000).toISOString()
            }
        ];
        saveTasksToStorage();
    }
}
