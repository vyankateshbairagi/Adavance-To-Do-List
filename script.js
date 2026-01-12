// ========================
// ADVANCED TO-DO LIST APP
// ========================

class TodoApp {
    constructor() {
        this.tasks = [];
        this.filteredTasks = [];
        this.currentFilter = 'all';
        this.currentCategory = 'all';
        this.currentPriority = 'all';
        this.editingTaskId = null;
        this.searchTerm = '';
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        
        this.init();
    }

    init() {
        this.loadTasks();
        this.setupEventListeners();
        this.applyDarkMode();
        this.updateClock();
        this.renderTasks();
        this.updateCategoryCounts();
        setInterval(() => this.updateClock(), 1000);
    }

    // ========================
    // CLOCK UPDATE
    // ========================
    updateClock() {
        const now = new Date();
        
        // Format time
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeString = `${hours}:${minutes}:${seconds}`;
        
        // Format date
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        const dateString = now.toLocaleDateString('en-US', options);
        
        // Update DOM
        const timeElement = document.getElementById('currentTime');
        const dateElement = document.getElementById('currentDate');
        
        if (timeElement) timeElement.textContent = timeString;
        if (dateElement) dateElement.textContent = dateString;
    }

    // ========================
    // EVENT LISTENERS
    // ========================
    setupEventListeners() {
        // Buttons
        document.querySelector('.btn-add-task').addEventListener('click', () => this.openTaskModal());
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleDarkMode());
        document.getElementById('statsBtn').addEventListener('click', () => this.showStatsModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeTaskModal());

        // Form
        document.getElementById('taskForm').addEventListener('submit', (e) => this.handleTaskSubmit(e));
        document.getElementById('addSubtaskBtn').addEventListener('click', () => this.addSubtaskField());

        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => this.handleSearch(e));

        // Sort
        document.getElementById('sortSelect').addEventListener('change', (e) => this.handleSort(e));

        // Categories
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', (e) => this.selectCategory(e));
        });

        // Filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectFilter(e));
        });

        // Priority Filter
        document.querySelectorAll('.priority-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectPriority(e));
        });

        // Modal Close
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
            });
        });

        // Modal Click Outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });

        // Drag and Drop
        this.setupDragAndDrop();
    }

    // ========================
    // TASK MANAGEMENT
    // ========================
    handleTaskSubmit(e) {
        e.preventDefault();

        const title = document.getElementById('taskTitle').value.trim();
        if (!title) {
            this.showToast('Please enter a task title', 'error');
            return;
        }

        const task = {
            id: this.editingTaskId || Date.now(),
            title,
            description: document.getElementById('taskDescription').value,
            category: document.getElementById('taskCategory').value,
            priority: document.getElementById('taskPriority').value,
            dueDate: document.getElementById('taskDueDate').value,
            time: document.getElementById('taskTime').value,
            tags: document.getElementById('taskTags').value.split(',').map(t => t.trim()).filter(t => t),
            reminder: document.getElementById('taskReminder').checked,
            completed: this.editingTaskId ? this.tasks.find(t => t.id === this.editingTaskId).completed : false,
            subtasks: this.getSubtasksFromForm(),
            createdAt: this.editingTaskId ? this.tasks.find(t => t.id === this.editingTaskId).createdAt : new Date().toISOString()
        };

        if (this.editingTaskId) {
            const index = this.tasks.findIndex(t => t.id === this.editingTaskId);
            this.tasks[index] = task;
            this.showToast('Task updated successfully!', 'success');
        } else {
            this.tasks.unshift(task);
            this.showToast('Task created successfully!', 'success');
        }

        this.saveTasks();
        this.closeTaskModal();
        this.renderTasks();
        this.updateCategoryCounts();
    }

    getSubtasksFromForm() {
        const subtasks = [];
        document.querySelectorAll('.subtask-item input').forEach(input => {
            if (input.value.trim()) {
                subtasks.push({
                    id: input.dataset.id || Date.now(),
                    title: input.value,
                    completed: input.dataset.completed === 'true'
                });
            }
        });
        return subtasks;
    }

    addSubtaskField() {
        const subtasksList = document.getElementById('subtasksList');
        const subtaskItem = document.createElement('div');
        subtaskItem.className = 'subtask-item';
        subtaskItem.innerHTML = `
            <input type="text" placeholder="Enter subtask..." data-id="${Date.now()}">
            <button type="button" class="subtask-remove" onclick="event.target.closest('.subtask-item').remove()">
                <i class="fas fa-trash"></i>
            </button>
        `;
        subtasksList.appendChild(subtaskItem);
    }

    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveTasks();
            this.renderTasks();
            this.updateCategoryCounts();
            this.showToast('Task deleted!', 'success');
        }
    }

    toggleTaskCompletion(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.updateCategoryCounts();
        }
    }

    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            this.editingTaskId = id;
            document.getElementById('modalTitle').textContent = 'Edit Task';
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description;
            document.getElementById('taskCategory').value = task.category;
            document.getElementById('taskPriority').value = task.priority;
            document.getElementById('taskDueDate').value = task.dueDate;
            document.getElementById('taskTime').value = task.time;
            document.getElementById('taskTags').value = task.tags.join(', ');
            document.getElementById('taskReminder').checked = task.reminder;

            // Load subtasks
            const subtasksList = document.getElementById('subtasksList');
            subtasksList.innerHTML = '';
            if (task.subtasks && task.subtasks.length > 0) {
                task.subtasks.forEach(subtask => {
                    const subtaskItem = document.createElement('div');
                    subtaskItem.className = 'subtask-item';
                    subtaskItem.innerHTML = `
                        <input type="text" value="${subtask.title}" placeholder="Enter subtask..." data-id="${subtask.id}" data-completed="${subtask.completed}">
                        <button type="button" class="subtask-remove" onclick="event.target.closest('.subtask-item').remove()">
                            <i class="fas fa-trash"></i>
                        </button>
                    `;
                    subtasksList.appendChild(subtaskItem);
                });
            }

            document.getElementById('taskModal').classList.add('active');
        }
    }

    // ========================
    // FILTERING & SEARCHING
    // ========================
    handleSearch(e) {
        this.searchTerm = e.target.value.toLowerCase();
        this.filterTasks();
    }

    selectFilter(e) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.closest('.filter-btn').classList.add('active');
        this.currentFilter = e.target.closest('.filter-btn').dataset.filter;
        this.filterTasks();
    }

    selectCategory(e) {
        document.querySelectorAll('.category-item').forEach(item => item.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentCategory = e.currentTarget.dataset.category;
        this.filterTasks();
    }

    selectPriority(e) {
        document.querySelectorAll('.priority-btn').forEach(btn => btn.classList.remove('active'));
        e.target.closest('.priority-btn').classList.add('active');
        this.currentPriority = e.target.closest('.priority-btn').dataset.priority;
        this.filterTasks();
    }

    filterTasks() {
        this.filteredTasks = this.tasks.filter(task => {
            // Search filter
            if (this.searchTerm) {
                const searchMatch = task.title.toLowerCase().includes(this.searchTerm) ||
                    task.description.toLowerCase().includes(this.searchTerm) ||
                    task.tags.some(tag => tag.toLowerCase().includes(this.searchTerm));
                if (!searchMatch) return false;
            }

            // Category filter
            if (this.currentCategory !== 'all' && task.category !== this.currentCategory) {
                return false;
            }

            // Priority filter
            if (this.currentPriority !== 'all' && task.priority !== this.currentPriority) {
                return false;
            }

            // Status filter
            switch (this.currentFilter) {
                case 'completed':
                    return task.completed;
                case 'pending':
                    return !task.completed;
                case 'overdue':
                    return !task.completed && this.isOverdue(task.dueDate);
                default:
                    return true;
            }
        });

        this.renderTasks();
    }

    isOverdue(dueDate) {
        if (!dueDate) return false;
        return new Date(dueDate) < new Date() && !this.isToday(dueDate);
    }

    isToday(dueDate) {
        if (!dueDate) return false;
        const today = new Date().toISOString().split('T')[0];
        return dueDate === today;
    }

    isTomorrow(dueDate) {
        if (!dueDate) return false;
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return dueDate === tomorrow.toISOString().split('T')[0];
    }

    handleSort(e) {
        const sortBy = e.target.value;
        const tasks = [...this.filteredTasks];

        switch (sortBy) {
            case 'date-new':
                tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'date-old':
                tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'priority':
                const priorityOrder = { high: 1, medium: 2, low: 3 };
                tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
                break;
            case 'due-date':
                tasks.sort((a, b) => {
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                });
                break;
            case 'name':
                tasks.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }

        this.filteredTasks = tasks;
        this.renderTasks();
    }

    // ========================
    // RENDERING
    // ========================
    renderTasks() {
        const container = document.getElementById('tasksContainer');
        const emptyState = document.getElementById('emptyState');

        if (this.filteredTasks.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        container.innerHTML = this.filteredTasks.map(task => this.createTaskElement(task)).join('');

        // Add event listeners to task elements
        document.querySelectorAll('.task-item').forEach(item => {
            const taskId = parseInt(item.dataset.id);
            
            item.querySelector('.task-checkbox').addEventListener('change', () => {
                this.toggleTaskCompletion(taskId);
            });

            item.querySelector('.edit-btn').addEventListener('click', () => {
                this.editTask(taskId);
            });

            item.querySelector('.delete-btn').addEventListener('click', () => {
                this.deleteTask(taskId);
            });

            // Subtask toggle
            item.querySelectorAll('.subtask-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    this.toggleSubtask(taskId, parseInt(e.target.dataset.subtaskId));
                });
            });
        });

        this.setupDragAndDrop();
    }

    createTaskElement(task) {
        const subtaskProgress = task.subtasks ? Math.round((task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100) : 0;
        
        let dueDateHtml = '';
        if (task.dueDate) {
            let statusClass = '';
            let statusText = '';
            
            if (this.isToday(task.dueDate)) {
                statusClass = 'today';
                statusText = 'Today';
            } else if (this.isTomorrow(task.dueDate)) {
                statusClass = 'upcoming';
                statusText = 'Tomorrow';
            } else if (this.isOverdue(task.dueDate)) {
                statusClass = 'overdue';
                statusText = 'Overdue';
            } else {
                statusClass = 'upcoming';
                statusText = new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }
            
            dueDateHtml = `<span class="due-date-indicator ${statusClass}"><i class="fas fa-calendar-alt"></i> ${statusText}</span>`;
        }

        const subtasksHtml = task.subtasks && task.subtasks.length > 0 ? `
            <div class="subtasks-info">
                <span>${task.subtasks.filter(s => s.completed).length}/${task.subtasks.length} subtasks</span>
                <div class="subtask-progress">
                    <div class="subtask-progress-bar" style="width: ${subtaskProgress}%"></div>
                </div>
            </div>
        ` : '';

        const tagsHtml = task.tags.length > 0 ? `
            <div class="task-tags">
                ${task.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
            </div>
        ` : '';

        return `
            <div class="task-item ${task.completed ? 'completed' : ''} ${task.priority}-priority" data-id="${task.id}" draggable="true">
                <div class="task-header">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <div class="task-info">
                        <div class="task-title">${this.escapeHtml(task.title)}</div>
                        <div class="task-meta">
                            <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                            <span class="task-meta-item">
                                <i class="fas fa-tag"></i>
                                ${task.category}
                            </span>
                            ${task.time ? `<span class="task-meta-item"><i class="fas fa-clock"></i> ${task.time}</span>` : ''}
                            ${task.reminder ? `<span class="task-meta-item"><i class="fas fa-bell"></i> Reminder</span>` : ''}
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="action-btn edit-btn" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn delete" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ''}
                
                ${dueDateHtml}
                ${tagsHtml}
                ${subtasksHtml}
            </div>
        `;
    }

    toggleSubtask(taskId, subtaskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task && task.subtasks) {
            const subtask = task.subtasks.find(s => s.id === subtaskId);
            if (subtask) {
                subtask.completed = !subtask.completed;
                this.saveTasks();
                this.renderTasks();
            }
        }
    }

    // ========================
    // MODAL MANAGEMENT
    // ========================
    openTaskModal() {
        this.editingTaskId = null;
        document.getElementById('modalTitle').textContent = 'Add New Task';
        document.getElementById('taskForm').reset();
        document.getElementById('subtasksList').innerHTML = '';
        document.getElementById('taskModal').classList.add('active');
    }

    closeTaskModal() {
        document.getElementById('taskModal').classList.remove('active');
        this.editingTaskId = null;
    }

    showStatsModal() {
        this.updateStats();
        document.getElementById('statsModal').classList.add('active');
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('pendingTasks').textContent = pending;
        document.getElementById('completionRate').textContent = completionRate + '%';
        document.getElementById('progressFill').style.width = completionRate + '%';
    }

    updateCategoryCounts() {
        const categories = ['work', 'personal', 'shopping', 'health'];
        const allCount = this.tasks.length;

        document.querySelector('[data-category="all"] .category-count').textContent = allCount;

        categories.forEach(category => {
            const count = this.tasks.filter(t => t.category === category).length;
            document.querySelector(`[data-category="${category}"] .category-count`).textContent = count;
        });
    }

    // ========================
    // DARK MODE
    // ========================
    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        this.applyDarkMode();
        localStorage.setItem('darkMode', this.isDarkMode);
    }

    applyDarkMode() {
        const icon = document.getElementById('themeToggle').querySelector('i');
        if (this.isDarkMode) {
            document.body.classList.add('dark-mode');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            document.body.classList.remove('dark-mode');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // ========================
    // STORAGE
    // ========================
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const stored = localStorage.getItem('tasks');
        this.tasks = stored ? JSON.parse(stored) : this.getSampleTasks();
    }

    getSampleTasks() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        return [
            {
                id: Date.now(),
                title: 'Complete Project Report',
                description: 'Finish the quarterly project report and send to stakeholders',
                category: 'work',
                priority: 'high',
                dueDate: tomorrowStr,
                time: '14:00',
                tags: ['work', 'urgent', 'report'],
                reminder: true,
                completed: false,
                subtasks: [
                    { id: 1, title: 'Gather data', completed: true },
                    { id: 2, title: 'Create charts', completed: false },
                    { id: 3, title: 'Write summary', completed: false }
                ],
                createdAt: new Date().toISOString()
            },
            {
                id: Date.now() + 1,
                title: 'Buy Groceries',
                description: 'Milk, bread, eggs, vegetables',
                category: 'shopping',
                priority: 'medium',
                dueDate: '',
                time: '',
                tags: ['shopping', 'grocery'],
                reminder: false,
                completed: false,
                subtasks: [],
                createdAt: new Date().toISOString()
            },
            {
                id: Date.now() + 2,
                title: 'Morning Workout',
                description: '30 minutes running + stretching',
                category: 'health',
                priority: 'medium',
                dueDate: new Date().toISOString().split('T')[0],
                time: '06:00',
                tags: ['health', 'fitness'],
                reminder: true,
                completed: true,
                subtasks: [],
                createdAt: new Date().toISOString()
            }
        ];
    }

    // ========================
    // DRAG AND DROP
    // ========================
    setupDragAndDrop() {
        const taskItems = document.querySelectorAll('.task-item');
        
        taskItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', e.target.innerHTML);
                item.classList.add('dragging');
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
            });

            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                item.classList.add('drag-over');
            });

            item.addEventListener('dragleave', () => {
                item.classList.remove('drag-over');
            });

            item.addEventListener('drop', (e) => {
                e.preventDefault();
                item.classList.remove('drag-over');
            });
        });
    }

    // ========================
    // UTILITIES
    // ========================
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        toast.innerHTML = `
            <i class="fas ${icons[type]}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
