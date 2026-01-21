// Social Media Dashboard with Charts
let charts = {};
let currentMetric = 'likes';

// Data
const platformData = {
    facebook: {
        name: 'Facebook',
        followers: 15200,
        growth: 2.3,
        color: '#1877F2',
        data: [12800, 13200, 13800, 14200, 14600, 15000, 15200]
    },
    twitter: {
        name: 'Twitter',
        followers: 12800,
        growth: 5.1,
        color: '#1DA1F2',
        data: [10500, 11000, 11500, 11900, 12200, 12500, 12800]
    },
    instagram: {
        name: 'Instagram',
        followers: 24600,
        growth: 7.8,
        color: '#E4405F',
        data: [20000, 21000, 22000, 23000, 23800, 24200, 24600]
    },
    youtube: {
        name: 'YouTube',
        followers: 8500,
        growth: 12.4,
        color: '#FF0000',
        data: [6000, 6500, 7000, 7500, 7900, 8200, 8500]
    },
    linkedin: {
        name: 'LinkedIn',
        followers: 6300,
        growth: 3.9,
        color: '#0A66C2',
        data: [5500, 5700, 5900, 6000, 6100, 6200, 6300]
    }
};

const engagementData = {
    likes: [1200, 1500, 1800, 2100, 2400, 2700, 3000],
    comments: [350, 420, 480, 550, 620, 680, 750],
    shares: [180, 220, 260, 310, 350, 390, 430]
};

const topPosts = [
    {
        platform: 'Instagram',
        content: 'New product launch announcement! 🚀',
        likes: 3245,
        comments: 428,
        shares: 256,
        time: '2 hours ago'
    },
    {
        platform: 'Facebook',
        content: 'Behind the scenes of our latest project',
        likes: 2876,
        comments: 312,
        shares: 189,
        time: '5 hours ago'
    },
    {
        platform: 'Twitter',
        content: 'Exciting news coming next week! Stay tuned 👀',
        likes: 2543,
        comments: 287,
        shares: 412,
        time: '1 day ago'
    },
    {
        platform: 'YouTube',
        content: 'Tutorial: Getting Started Guide',
        likes: 1987,
        comments: 156,
        shares: 98,
        time: '2 days ago'
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    renderTopPosts();
    animateNumbers();
    startAutoRefresh();
});

function initializeCharts() {
    createMiniCharts();
    createFollowersChart();
    createDistributionChart();
    createEngagementChart();
}

// Mini Charts for Platform Cards
function createMiniCharts() {
    Object.keys(platformData).forEach(platform => {
        const ctx = document.getElementById(`${platform === 'facebook' ? 'fb' : platform === 'twitter' ? 'tw' : platform === 'instagram' ? 'ig' : platform === 'youtube' ? 'yt' : 'li'}Chart`);
        if (!ctx) return;
        
        charts[`mini_${platform}`] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['', '', '', '', '', '', ''],
                datasets: [{
                    data: platformData[platform].data,
                    borderColor: platformData[platform].color,
                    backgroundColor: platformData[platform].color + '20',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                scales: {
                    x: { display: false },
                    y: { display: false }
                }
            }
        });
    });
}

// Main Followers Growth Chart
function createFollowersChart() {
    const ctx = document.getElementById('followersChart');
    if (!ctx) return;
    
    const datasets = Object.keys(platformData).map(platform => ({
        label: platformData[platform].name,
        data: platformData[platform].data,
        borderColor: platformData[platform].color,
        backgroundColor: platformData[platform].color + '20',
        borderWidth: 3,
        fill: true,
        tension: 0.4
    }));
    
    charts.followers = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#F1F5F9',
                        font: { size: 12, weight: 'bold' },
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#3B82F6',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#94A3B8', font: { weight: 'bold' } }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: {
                        color: '#94A3B8',
                        font: { weight: 'bold' },
                        callback: function(value) {
                            return value >= 1000 ? (value/1000).toFixed(1) + 'K' : value;
                        }
                    }
                }
            }
        }
    });
}

// Platform Distribution Pie Chart
function createDistributionChart() {
    const ctx = document.getElementById('distributionChart');
    if (!ctx) return;
    
    const platforms = Object.keys(platformData);
    const data = platforms.map(p => platformData[p].followers);
    const colors = platforms.map(p => platformData[p].color);
    
    charts.distribution = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: platforms.map(p => platformData[p].name),
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 3,
                borderColor: '#1E293B'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#F1F5F9',
                        font: { size: 14, weight: 'bold' },
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return context.label + ': ' + context.parsed.toLocaleString() + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

// Engagement Metrics Chart
function createEngagementChart() {
    const ctx = document.getElementById('engagementChart');
    if (!ctx) return;
    
    charts.engagement = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Likes',
                data: engagementData.likes,
                backgroundColor: '#3B82F6',
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    displayColors: false
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#94A3B8', font: { weight: 'bold' } }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#94A3B8', font: { weight: 'bold' } }
                }
            }
        }
    });
}

// Switch Engagement Metric
function switchMetric(metric) {
    currentMetric = metric;
    
    // Update button states
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-metric="${metric}"]`).classList.add('active');
    
    // Update chart
    const colors = {
        likes: '#3B82F6',
        comments: '#10B981',
        shares: '#F59E0B'
    };
    
    charts.engagement.data.datasets[0] = {
        label: metric.charAt(0).toUpperCase() + metric.slice(1),
        data: engagementData[metric],
        backgroundColor: colors[metric],
        borderRadius: 8,
        borderSkipped: false
    };
    
    charts.engagement.update();
}

// Render Top Posts
function renderTopPosts() {
    const container = document.getElementById('topPosts');
    
    container.innerHTML = topPosts.map((post, index) => {
        const platformColors = {
            'Instagram': '#E4405F',
            'Facebook': '#1877F2',
            'Twitter': '#1DA1F2',
            'YouTube': '#FF0000'
        };
        
        return `
            <div class="post-card" style="animation-delay: ${index * 0.1}s">
                <div class="post-header">
                    <span class="post-platform" style="background: ${platformColors[post.platform]}">
                        ${post.platform}
                    </span>
                    <span class="post-time">${post.time}</span>
                </div>
                <p class="post-content">${post.content}</p>
                <div class="post-stats">
                    <span><i class="fas fa-heart"></i> ${post.likes.toLocaleString()}</span>
                    <span><i class="fas fa-comment"></i> ${post.comments}</span>
                    <span><i class="fas fa-share"></i> ${post.shares}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Animate Numbers
function animateNumbers() {
    const animateValue = (id, start, end, duration, suffix = '') => {
        const element = document.getElementById(id);
        if (!element) return;
        
        const range = end - start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (end >= 1000) {
                element.textContent = (current / 1000).toFixed(1) + 'K' + suffix;
            } else {
                element.textContent = current + suffix;
            }
            
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                clearInterval(timer);
                if (end >= 1000) {
                    element.textContent = (end / 1000).toFixed(1) + 'K' + suffix;
                } else {
                    element.textContent = end + suffix;
                }
            }
        }, stepTime);
    };
    
    // Animate overview stats (these are already formatted correctly in HTML)
    // Animate platform follower counts
    animateValue('fbFollowers', 10000, 15200, 1000);
    animateValue('twFollowers', 8000, 12800, 1000);
    animateValue('igFollowers', 18000, 24600, 1000);
    animateValue('ytSubscribers', 5000, 8500, 1000);
    animateValue('liConnections', 4000, 6300, 1000);
}

// Platform Details
function showPlatformDetails(platform) {
    const data = platformData[platform];
    const modal = document.getElementById('platformModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.innerHTML = `<i class="fab fa-${platform}"></i> ${data.name} Analytics`;
    
    modalBody.innerHTML = `
        <div class="platform-details">
            <div class="detail-stat">
                <h3>${(data.followers / 1000).toFixed(1)}K</h3>
                <p>Followers</p>
            </div>
            <div class="detail-stat">
                <h3>${data.growth}%</h3>
                <p>Growth Rate</p>
            </div>
            <div class="detail-stat">
                <h3>${Math.floor(Math.random() * 100)}K</h3>
                <p>Monthly Reach</p>
            </div>
            <div class="detail-stat">
                <h3>${(Math.random() * 10).toFixed(1)}%</h3>
                <p>Engagement</p>
            </div>
        </div>
        <div style="margin-top: 2rem;">
            <h3 style="margin-bottom: 1rem;">7-Day Trend</h3>
            <canvas id="modalChart"></canvas>
        </div>
    `;
    
    modal.classList.add('show');
    
    // Create modal chart
    setTimeout(() => {
        const ctx = document.getElementById('modalChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Followers',
                        data: data.data,
                        borderColor: data.color,
                        backgroundColor: data.color + '20',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#94A3B8' } },
                        y: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#94A3B8' } }
                    }
                }
            });
        }
    }, 100);
}

function closeModal() {
    document.getElementById('platformModal').classList.remove('show');
}

// Auto Refresh
function startAutoRefresh() {
    setInterval(() => {
        // Simulate live updates
        Object.keys(platformData).forEach(platform => {
            const change = Math.floor(Math.random() * 20) - 10;
            platformData[platform].followers += change;
        });
        updateCharts();
    }, 30000); // Update every 30 seconds
}

function refreshData() {
    const btn = document.querySelector('.btn-refresh i');
    btn.style.animation = 'spin 1s linear';
    
    setTimeout(() => {
        btn.style.animation = '';
        showNotification('Data refreshed!', 'success');
    }, 1000);
}

function updateData() {
    showNotification('Data updated for selected time range', 'info');
}

function updateCharts() {
    Object.keys(charts).forEach(key => {
        if (charts[key] && charts[key].update) {
            charts[key].update();
        }
    });
}

// Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : '#3B82F6'};
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
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Close modal on outside click
window.onclick = function(event) {
    if (event.target.id === 'platformModal') {
        closeModal();
    }
}
