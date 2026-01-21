// Toggle workout completion
document.querySelectorAll('.btn-complete').forEach((btn, index) => {
    btn.addEventListener('click', function() {
        const workoutItem = this.closest('.workout-item');
        workoutItem.classList.toggle('completed');
        
        // Show notification
        const isCompleted = workoutItem.classList.contains('completed');
        showNotification(isCompleted ? 'Workout completed! 🎉' : 'Workout marked as incomplete');
    });
});

// Animate progress bars on load
window.addEventListener('load', () => {
    document.querySelectorAll('.progress').forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
});

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
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

console.log('%c💪 Fitness Tracker', 'font-size: 20px; color: #667eea; font-weight: bold;');
console.log('%cStay consistent and achieve your fitness goals!', 'color: #64748b;');
