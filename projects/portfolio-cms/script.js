// Portfolio CMS - Complete Management System
let portfolioData = {
    projects: [],
    skills: [],
    experience: [],
    education: [],
    activities: []
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    updateAllCounts();
    renderAll();
    setupForms();
});

// Section Navigation
function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
}

// Data Management
function loadData() {
    const stored = localStorage.getItem('portfolio_cms_data');
    if (stored) {
        portfolioData = JSON.parse(stored);
    }
}

function saveData() {
    localStorage.setItem('portfolio_cms_data', JSON.stringify(portfolioData));
    updateAllCounts();
}

function addActivity(text, icon = 'fa-info-circle') {
    const activity = {
        text,
        icon,
        timestamp: new Date().toLocaleString()
    };
    portfolioData.activities.unshift(activity);
    if (portfolioData.activities.length > 10) {
        portfolioData.activities.pop();
    }
    saveData();
    renderActivities();
}

// Update Counts
function updateAllCounts() {
    const projectCount = portfolioData.projects.length;
    const skillCount = portfolioData.skills.length;
    const expCount = portfolioData.experience.length;
    const eduCount = portfolioData.education.length;
    
    // Update sidebar badges
    document.getElementById('projectCount').textContent = projectCount;
    document.getElementById('skillCount').textContent = skillCount;
    document.getElementById('expCount').textContent = expCount;
    document.getElementById('eduCount').textContent = eduCount;
    
    // Update dashboard stats
    document.getElementById('dashProjectCount').textContent = projectCount;
    document.getElementById('dashSkillCount').textContent = skillCount;
    document.getElementById('dashExpCount').textContent = expCount;
    document.getElementById('dashEduCount').textContent = eduCount;
}

// Form Setup
function setupForms() {
    document.getElementById('projectForm').addEventListener('submit', handleProjectSubmit);
    document.getElementById('skillForm').addEventListener('submit', handleSkillSubmit);
    document.getElementById('experienceForm').addEventListener('submit', handleExperienceSubmit);
    document.getElementById('educationForm').addEventListener('submit', handleEducationSubmit);
}

// Project Management
function openProjectModal() {
    document.getElementById('projectModal').classList.add('show');
    document.getElementById('projectForm').reset();
}

function handleProjectSubmit(e) {
    e.preventDefault();
    
    const project = {
        id: Date.now(),
        name: document.getElementById('projectName').value,
        category: document.getElementById('projectCategory').value,
        description: document.getElementById('projectDescription').value,
        link: document.getElementById('projectLink').value,
        technologies: document.getElementById('projectTech').value.split(',').map(t => t.trim()),
        createdAt: new Date().toISOString()
    };
    
    portfolioData.projects.push(project);
    saveData();
    renderProjects();
    closeModal('projectModal');
    addActivity(`Added new project: ${project.name}`, 'fa-folder-plus');
    showNotification('Project added successfully!', 'success');
}

function renderProjects() {
    const container = document.getElementById('projectsGrid');
    
    if (portfolioData.projects.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-plus"></i>
                <p>No projects yet. Add your first project!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = portfolioData.projects.map(project => `
        <div class="item-card">
            <div class="item-header">
                <h3>${escapeHtml(project.name)}</h3>
                <div class="item-actions">
                    <button class="icon-btn btn-delete" onclick="deleteProject(${project.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <span class="category-badge badge-${project.category}">${getCategoryName(project.category)}</span>
            <p>${escapeHtml(project.description)}</p>
            ${project.link ? `<p><a href="${escapeHtml(project.link)}" target="_blank" style="color: var(--primary);">View Project →</a></p>` : ''}
            <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                ${project.technologies.map(tech => `
                    <span style="background: var(--dark-bg); padding: 4px 10px; border-radius: 5px; font-size: 0.85rem;">${escapeHtml(tech)}</span>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function filterProjects() {
    const searchTerm = document.getElementById('projectSearch').value.toLowerCase();
    const category = document.getElementById('projectFilter').value;
    
    let filtered = portfolioData.projects;
    
    if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }
    
    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
    }
    
    renderFilteredProjects(filtered);
}

function renderFilteredProjects(projects) {
    const container = document.getElementById('projectsGrid');
    
    if (projects.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <p>No projects found matching your criteria</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = projects.map(project => `
        <div class="item-card">
            <div class="item-header">
                <h3>${escapeHtml(project.name)}</h3>
                <div class="item-actions">
                    <button class="icon-btn btn-delete" onclick="deleteProject(${project.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <span class="category-badge badge-${project.category}">${getCategoryName(project.category)}</span>
            <p>${escapeHtml(project.description)}</p>
            ${project.link ? `<p><a href="${escapeHtml(project.link)}" target="_blank" style="color: var(--primary);">View Project →</a></p>` : ''}
            <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                ${project.technologies.map(tech => `
                    <span style="background: var(--dark-bg); padding: 4px 10px; border-radius: 5px; font-size: 0.85rem;">${escapeHtml(tech)}</span>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function deleteProject(id) {
    if (confirm('Delete this project?')) {
        const project = portfolioData.projects.find(p => p.id === id);
        portfolioData.projects = portfolioData.projects.filter(p => p.id !== id);
        saveData();
        renderProjects();
        addActivity(`Deleted project: ${project.name}`, 'fa-trash');
        showNotification('Project deleted', 'info');
    }
}

// Skill Management
function openSkillModal() {
    document.getElementById('skillModal').classList.add('show');
    document.getElementById('skillForm').reset();
}

function handleSkillSubmit(e) {
    e.preventDefault();
    
    const skill = {
        id: Date.now(),
        name: document.getElementById('skillName').value,
        type: document.getElementById('skillType').value,
        proficiency: parseInt(document.getElementById('skillProficiency').value),
        createdAt: new Date().toISOString()
    };
    
    portfolioData.skills.push(skill);
    saveData();
    renderSkills();
    closeModal('skillModal');
    addActivity(`Added new skill: ${skill.name}`, 'fa-code');
    showNotification('Skill added successfully!', 'success');
}

function renderSkills() {
    const container = document.getElementById('skillsGrid');
    
    if (portfolioData.skills.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-code"></i>
                <p>No skills yet. Add your first skill!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = portfolioData.skills.map(skill => `
        <div class="skill-card">
            <div class="skill-header">
                <h4>${escapeHtml(skill.name)}</h4>
                <div style="display: flex; gap: 0.5rem;">
                    <span class="skill-type type-${skill.type}">${getTypeName(skill.type)}</span>
                    <button class="icon-btn btn-delete" onclick="deleteSkill(${skill.id})" style="width: 30px; height: 30px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${skill.proficiency}%"></div>
            </div>
            <div class="progress-text">${skill.proficiency}%</div>
        </div>
    `).join('');
}

function filterSkills() {
    const searchTerm = document.getElementById('skillSearch').value.toLowerCase();
    const type = document.getElementById('skillFilter').value;
    
    let filtered = portfolioData.skills;
    
    if (type !== 'all') {
        filtered = filtered.filter(s => s.type === type);
    }
    
    if (searchTerm) {
        filtered = filtered.filter(s => 
            s.name.toLowerCase().includes(searchTerm)
        );
    }
    
    renderFilteredSkills(filtered);
}

function renderFilteredSkills(skills) {
    const container = document.getElementById('skillsGrid');
    
    if (skills.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <p>No skills found matching your criteria</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = skills.map(skill => `
        <div class="skill-card">
            <div class="skill-header">
                <h4>${escapeHtml(skill.name)}</h4>
                <div style="display: flex; gap: 0.5rem;">
                    <span class="skill-type type-${skill.type}">${getTypeName(skill.type)}</span>
                    <button class="icon-btn btn-delete" onclick="deleteSkill(${skill.id})" style="width: 30px; height: 30px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${skill.proficiency}%"></div>
            </div>
            <div class="progress-text">${skill.proficiency}%</div>
        </div>
    `).join('');
}

function deleteSkill(id) {
    if (confirm('Delete this skill?')) {
        const skill = portfolioData.skills.find(s => s.id === id);
        portfolioData.skills = portfolioData.skills.filter(s => s.id !== id);
        saveData();
        renderSkills();
        addActivity(`Deleted skill: ${skill.name}`, 'fa-trash');
        showNotification('Skill deleted', 'info');
    }
}

// Experience Management
function openExperienceModal() {
    document.getElementById('experienceModal').classList.add('show');
    document.getElementById('experienceForm').reset();
}

function handleExperienceSubmit(e) {
    e.preventDefault();
    
    const exp = {
        id: Date.now(),
        position: document.getElementById('expPosition').value,
        company: document.getElementById('expCompany').value,
        duration: document.getElementById('expDuration').value,
        description: document.getElementById('expDescription').value,
        createdAt: new Date().toISOString()
    };
    
    portfolioData.experience.push(exp);
    saveData();
    renderExperience();
    closeModal('experienceModal');
    addActivity(`Added new experience: ${exp.position} at ${exp.company}`, 'fa-briefcase');
    showNotification('Experience added successfully!', 'success');
}

function renderExperience() {
    const container = document.getElementById('experienceTimeline');
    
    if (portfolioData.experience.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-briefcase"></i>
                <p>No experience yet. Add your first experience!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = portfolioData.experience.map(exp => `
        <div class="timeline-item">
            <div class="timeline-header">
                <div>
                    <h3>${escapeHtml(exp.position)}</h3>
                    <h4>${escapeHtml(exp.company)}</h4>
                    <span class="timeline-duration">${escapeHtml(exp.duration)}</span>
                </div>
                <button class="icon-btn btn-delete" onclick="deleteExperience(${exp.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <p style="margin-top: 1rem; line-height: 1.6;">${escapeHtml(exp.description)}</p>
        </div>
    `).join('');
}

function deleteExperience(id) {
    if (confirm('Delete this experience?')) {
        const exp = portfolioData.experience.find(e => e.id === id);
        portfolioData.experience = portfolioData.experience.filter(e => e.id !== id);
        saveData();
        renderExperience();
        addActivity(`Deleted experience: ${exp.position}`, 'fa-trash');
        showNotification('Experience deleted', 'info');
    }
}

// Education Management
function openEducationModal() {
    document.getElementById('educationModal').classList.add('show');
    document.getElementById('educationForm').reset();
}

function handleEducationSubmit(e) {
    e.preventDefault();
    
    const edu = {
        id: Date.now(),
        degree: document.getElementById('eduDegree').value,
        institution: document.getElementById('eduInstitution').value,
        year: document.getElementById('eduYear').value,
        description: document.getElementById('eduDescription').value,
        createdAt: new Date().toISOString()
    };
    
    portfolioData.education.push(edu);
    saveData();
    renderEducation();
    closeModal('educationModal');
    addActivity(`Added education: ${edu.degree}`, 'fa-graduation-cap');
    showNotification('Education added successfully!', 'success');
}

function renderEducation() {
    const container = document.getElementById('educationTimeline');
    
    if (portfolioData.education.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-graduation-cap"></i>
                <p>No education yet. Add your first education!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = portfolioData.education.map(edu => `
        <div class="timeline-item">
            <div class="timeline-header">
                <div>
                    <h3>${escapeHtml(edu.degree)}</h3>
                    <h4>${escapeHtml(edu.institution)}</h4>
                    <span class="timeline-duration">${escapeHtml(edu.year)}</span>
                </div>
                <button class="icon-btn btn-delete" onclick="deleteEducation(${edu.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            ${edu.description ? `<p style="margin-top: 1rem; line-height: 1.6;">${escapeHtml(edu.description)}</p>` : ''}
        </div>
    `).join('');
}

function deleteEducation(id) {
    if (confirm('Delete this education?')) {
        const edu = portfolioData.education.find(e => e.id === id);
        portfolioData.education = portfolioData.education.filter(e => e.id !== id);
        saveData();
        renderEducation();
        addActivity(`Deleted education: ${edu.degree}`, 'fa-trash');
        showNotification('Education deleted', 'info');
    }
}

// Activities
function renderActivities() {
    const container = document.getElementById('activityList');
    
    if (portfolioData.activities.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No recent activity</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = portfolioData.activities.map(activity => `
        <div class="activity-item">
            <i class="fas ${activity.icon}"></i>
            <div style="flex: 1;">
                <p>${activity.text}</p>
                <small style="color: var(--text-secondary);">${activity.timestamp}</small>
            </div>
        </div>
    `).join('');
}

// Preview Generation
function generatePreview() {
    const container = document.getElementById('previewContainer');
    
    container.innerHTML = `
        <h1 style="margin-bottom: 2rem;">Mahesh Suryawanshi - Portfolio</h1>
        
        <section style="margin-bottom: 3rem;">
            <h2 style="color: #3B82F6; margin-bottom: 1rem;">Projects</h2>
            ${portfolioData.projects.map(p => `
                <div style="background: #f8f9fa; padding: 1.5rem; margin-bottom: 1rem; border-radius: 10px;">
                    <h3>${p.name}</h3>
                    <p>${p.description}</p>
                    <p><strong>Technologies:</strong> ${p.technologies.join(', ')}</p>
                </div>
            `).join('') || '<p>No projects added yet</p>'}
        </section>
        
        <section style="margin-bottom: 3rem;">
            <h2 style="color: #3B82F6; margin-bottom: 1rem;">Skills</h2>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                ${portfolioData.skills.map(s => `
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <strong>${s.name}</strong>
                            <span>${s.proficiency}%</span>
                        </div>
                        <div style="height: 10px; background: #e5e7eb; border-radius: 5px;">
                            <div style="height: 100%; width: ${s.proficiency}%; background: #3B82F6; border-radius: 5px;"></div>
                        </div>
                    </div>
                `).join('') || '<p>No skills added yet</p>'}
            </div>
        </section>
    `;
}

// Utility Functions
function renderAll() {
    renderProjects();
    renderSkills();
    renderExperience();
    renderEducation();
    renderActivities();
}

function loadSampleData() {
    if (confirm('Load sample data? This will not delete your existing data.')) {
        portfolioData.projects.push({
            id: Date.now(),
            name: 'E-Commerce Platform',
            category: 'web',
            description: 'Full-featured online shopping platform with cart, wishlist, and search',
            link: '',
            technologies: ['HTML', 'CSS', 'JavaScript'],
            createdAt: new Date().toISOString()
        });
        
        portfolioData.skills.push({
            id: Date.now() + 1,
            name: 'JavaScript',
            type: 'frontend',
            proficiency: 75,
            createdAt: new Date().toISOString()
        });
        
        saveData();
        renderAll();
        addActivity('Loaded sample data', 'fa-magic');
        showNotification('Sample data loaded!', 'success');
    }
}

function clearAllData() {
    if (confirm('Delete ALL data? This cannot be undone!')) {
        portfolioData = { projects: [], skills: [], experience: [], education: [], activities: [] };
        saveData();
        renderAll();
        showNotification('All data cleared', 'info');
    }
}

function exportPortfolio() {
    const dataStr = JSON.stringify(portfolioData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    addActivity('Exported portfolio data', 'fa-download');
    showNotification('Portfolio exported successfully!', 'success');
}

function generateHTML() {
    generatePreview();
    showSection('preview');
}

function getCategoryName(cat) {
    const names = {
        web: 'Web Development',
        mobile: 'Mobile App',
        desktop: 'Desktop App',
        other: 'Other'
    };
    return names[cat] || cat;
}

function getTypeName(type) {
    const names = {
        frontend: 'Frontend',
        backend: 'Backend',
        database: 'Database',
        tools: 'Tools'
    };
    return names[type] || type;
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Close modals on outside click
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
}
