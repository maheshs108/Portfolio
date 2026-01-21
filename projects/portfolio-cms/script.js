// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('data-section');
        
        // Update active states
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        document.getElementById(section).classList.add('active');
        
        // Update page title
        const titles = {
            'dashboard': 'Dashboard',
            'projects': 'Projects',
            'blog': 'Blog Posts',
            'settings': 'Settings'
        };
        document.getElementById('pageTitle').textContent = titles[section];
    });
});

// Load sample data
function loadDashboard() {
    const activities = [
        { icon: 'fa-folder', text: 'New project "Weather App" added', time: '2 hours ago' },
        { icon: 'fa-blog', text: 'Blog post "React Hooks" published', time: '5 hours ago' },
        { icon: 'fa-heart', text: '10 new likes on "Portfolio CMS"', time: '1 day ago' },
        { icon: 'fa-eye', text: 'Your portfolio got 50 new views', time: '2 days ago' }
    ];
    
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div style="flex: 1;">
                <p style="color: #1e293b; font-weight: 500;">${activity.text}</p>
                <small style="color: #94a3b8;">${activity.time}</small>
            </div>
        </div>
    `).join('');
}

function loadProjects() {
    const projects = [
        { title: 'E-Commerce Platform', desc: 'Full-stack shopping website', views: 234, likes: 45 },
        { title: 'Task Manager', desc: 'Productivity app with real-time sync', views: 189, likes: 32 },
        { title: 'Weather Dashboard', desc: 'Beautiful weather forecast app', views: 156, likes: 28 },
        { title: 'Portfolio CMS', desc: 'Content management system', views: 298, likes: 67 }
    ];
    
    const projectsGrid = document.getElementById('projectsGrid');
    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card">
            <h3>${project.title}</h3>
            <p>${project.desc}</p>
            <div class="project-meta">
                <span><i class="fas fa-eye"></i> ${project.views}</span>
                <span><i class="fas fa-heart"></i> ${project.likes}</span>
            </div>
        </div>
    `).join('');
}

function loadBlog() {
    const posts = [
        { title: 'Getting Started with React Hooks', excerpt: 'Learn how to use React Hooks effectively...', date: 'Jan 15, 2026', views: 423 },
        { title: 'CSS Grid Layout Guide', excerpt: 'Master CSS Grid with this comprehensive guide...', date: 'Jan 10, 2026', views: 389 },
        { title: 'JavaScript ES6 Features', excerpt: 'Explore the latest JavaScript features...', date: 'Jan 5, 2026', views: 512 }
    ];
    
    const blogList = document.getElementById('blogList');
    blogList.innerHTML = posts.map(post => `
        <div class="blog-item">
            <h3>${post.title}</h3>
            <p>${post.excerpt}</p>
            <div class="blog-meta">
                <span><i class="fas fa-calendar"></i> ${post.date}</span>
                <span><i class="fas fa-eye"></i> ${post.views} views</span>
            </div>
        </div>
    `).join('');
}

// Modal functions (simplified)
function showAddProjectModal() {
    alert('Add Project Modal would open here. This is a demo CMS.');
}

function showAddBlogModal() {
    alert('Create Blog Post Modal would open here. This is a demo CMS.');
}

// Settings form
document.getElementById('settingsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Settings saved successfully!');
});

// Initialize
loadDashboard();
loadProjects();
loadBlog();
