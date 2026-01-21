// Fitness Tracker with Workout Animations
let workoutTimer = null;
let timerSeconds = 0;
let isWorkoutActive = false;

const exercises = [
    { name: 'Push-ups', icon: 'fa-hands', reps: 15 },
    { name: 'Squats', icon: 'fa-person-running', reps: 20 },
    { name: 'Jumping Jacks', icon: 'fa-person-running', reps: 30 },
    { name: 'Plank', icon: 'fa-person-harassing', duration: 30 },
    { name: 'Lunges', icon: 'fa-walking', reps: 12 },
    { name: 'Mountain Climbers', icon: 'fa-mountain', reps: 20 }
];

let currentExerciseIndex = 0;
let goals = {
    steps: { current: 8547, target: 10000 },
    calories: { current: 1500, target: 2000 },
    water: { current: 6, target: 10 },
    sleep: { current: 7.2, target: 8 }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeGoals();
    animateCircularProgress();
    animateChartBars();
    loadActivities();
});

function initializeGoals() {
    updateGoalProgress('steps');
    updateGoalProgress('calories');
    updateGoalProgress('water');
    updateGoalProgress('sleep');
}

function updateGoalProgress(type) {
    const goal = goals[type];
    const percentage = Math.min((goal.current / goal.target) * 100, 100);
    
    // Update circular progress
    const card = document.querySelector(`.goal-card.${type}`);
    if (card) {
        const progressBar = card.querySelector('.progress-bar');
        const circumference = 283; // 2 * PI * r (r=45)
        const offset = circumference - (percentage / 100) * circumference;
        progressBar.style.strokeDashoffset = offset;
        
        // Update value
        const value = card.querySelector('.progress-value');
        if (type === 'sleep') {
            value.textContent = goal.current.toFixed(1) + 'h';
        } else if (type === 'steps' || type === 'calories') {
            value.textContent = goal.current.toLocaleString();
        } else {
            value.textContent = goal.current;
        }
    }
}

function incrementGoal(type) {
    const goal = goals[type];
    
    switch(type) {
        case 'steps':
            goal.current = Math.min(goal.current + 100, goal.target);
            break;
        case 'calories':
            goal.current = Math.min(goal.current + 50, goal.target);
            break;
        case 'water':
            goal.current = Math.min(goal.current + 1, goal.target);
            break;
        case 'sleep':
            goal.current = Math.min(goal.current + 0.5, goal.target);
            break;
    }
    
    updateGoalProgress(type);
    
    if (goal.current >= goal.target) {
        showNotification(`🎉 ${type.charAt(0).toUpperCase() + type.slice(1)} goal completed!`, 'success');
        celebrateGoalCompletion(type);
    }
}

function celebrateGoalCompletion(type) {
    const card = document.querySelector(`.goal-card.${type}`);
    if (card) {
        card.style.animation = 'goalCelebration 0.6s ease';
        setTimeout(() => {
            card.style.animation = '';
        }, 600);
    }
}

// Add celebration animation
const celebrationStyle = document.createElement('style');
celebrationStyle.textContent = `
    @keyframes goalCelebration {
        0%, 100% { transform: translateY(0) scale(1); }
        25% { transform: translateY(-20px) scale(1.05); }
        50% { transform: translateY(-10px) scale(1.1); }
        75% { transform: translateY(-15px) scale(1.05); }
    }
`;
document.head.appendChild(celebrationStyle);

function animateCircularProgress() {
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach((bar, index) => {
        setTimeout(() => {
            const card = bar.closest('.goal-card');
            let type = '';
            if (card.classList.contains('steps')) type = 'steps';
            else if (card.classList.contains('calories')) type = 'calories';
            else if (card.classList.contains('water')) type = 'water';
            else if (card.classList.contains('sleep')) type = 'sleep';
            
            if (type) {
                updateGoalProgress(type);
            }
        }, index * 200);
    });
}

// Workout Timer Functions
function startWorkout() {
    if (isWorkoutActive) return;
    
    isWorkoutActive = true;
    timerSeconds = 0;
    currentExerciseIndex = 0;
    
    document.querySelector('.btn-start').innerHTML = '<i class="fas fa-pause"></i> Pause Workout';
    document.querySelector('.btn-start').onclick = pauseWorkout;
    
    updateExercise();
    workoutTimer = setInterval(() => {
        timerSeconds++;
        updateTimerDisplay();
        
        // Change exercise every 45 seconds
        if (timerSeconds % 45 === 0) {
            currentExerciseIndex = (currentExerciseIndex + 1) % exercises.length;
            updateExercise();
        }
    }, 1000);
    
    showNotification('Workout started! 💪', 'success');
}

function pauseWorkout() {
    if (!isWorkoutActive) {
        startWorkout();
        return;
    }
    
    if (workoutTimer) {
        clearInterval(workoutTimer);
        workoutTimer = null;
        document.querySelector('.btn-start').innerHTML = '<i class="fas fa-play"></i> Resume Workout';
        showNotification('Workout paused', 'info');
    }
}

function stopWorkout() {
    if (workoutTimer) {
        clearInterval(workoutTimer);
        workoutTimer = null;
    }
    
    isWorkoutActive = false;
    timerSeconds = 0;
    currentExerciseIndex = 0;
    
    updateTimerDisplay();
    document.getElementById('currentExercise').textContent = 'Ready to Start';
    document.querySelector('.btn-start').innerHTML = '<i class="fas fa-play"></i> Start Workout';
    document.querySelector('.btn-start').onclick = startWorkout;
    
    // Add completed workout to activity
    if (timerSeconds > 0) {
        const calories = Math.floor(timerSeconds / 60 * 8); // Approximate 8 cal/min
        addActivity('Quick Workout', timerSeconds, calories);
        goals.calories.current = Math.min(goals.calories.current + calories, goals.calories.target);
        updateGoalProgress('calories');
    }
    
    showNotification('Workout completed! Great job! 🎉', 'success');
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    document.getElementById('timerMinutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('timerSeconds').textContent = String(seconds).padStart(2, '0');
}

function updateExercise() {
    const exercise = exercises[currentExerciseIndex];
    document.getElementById('currentExercise').textContent = exercise.name;
    
    // Animate exercise icon
    const animation = document.getElementById('exerciseAnimation');
    const icon = animation.querySelector('i');
    icon.className = `fas ${exercise.icon}`;
    
    // Add pulse animation
    animation.style.animation = 'none';
    setTimeout(() => {
        animation.style.animation = 'exercisePulse 2s ease-in-out infinite';
    }, 10);
    
    showNotification(`Next: ${exercise.name}`, 'info');
}

function selectProgram(level) {
    const programs = {
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced'
    };
    
    showNotification(`${programs[level]} program selected! Starting workout...`, 'success');
    setTimeout(() => {
        startWorkout();
    }, 1500);
}

// Chart Animations
function animateChartBars() {
    const bars = document.querySelectorAll('.chart-bar');
    bars.forEach((bar, index) => {
        const finalHeight = bar.style.height;
        bar.style.height = '0%';
        bar.style.opacity = '0';
        
        setTimeout(() => {
            bar.style.transition = 'all 0.8s ease';
            bar.style.height = finalHeight;
            bar.style.opacity = '1';
        }, index * 100);
    });
}

// Activity Management
function loadActivities() {
    const activitiesList = document.getElementById('activitiesList');
    if (activitiesList) {
        animateActivities();
    }
}

function animateActivities() {
    const activities = document.querySelectorAll('.activity-item');
    activities.forEach((activity, index) => {
        activity.style.opacity = '0';
        activity.style.transform = 'translateX(-30px)';
        
        setTimeout(() => {
            activity.style.transition = 'all 0.5s ease';
            activity.style.opacity = '1';
            activity.style.transform = 'translateX(0)';
        }, index * 150);
    });
}

function addActivity(name, duration, calories) {
    const activitiesList = document.getElementById('activitiesList');
    const newActivity = document.createElement('div');
    newActivity.className = 'activity-item';
    newActivity.style.opacity = '0';
    newActivity.style.transform = 'translateX(-30px)';
    
    const minutes = Math.floor(duration / 60);
    
    newActivity.innerHTML = `
        <div class="activity-icon gym">
            <i class="fas fa-dumbbell"></i>
        </div>
        <div class="activity-details">
            <h4>${name}</h4>
            <p>${minutes} min • ${calories} cal</p>
            <span class="activity-time">Just now</span>
        </div>
        <div class="activity-badge">
            <i class="fas fa-fire"></i>
        </div>
    `;
    
    activitiesList.insertBefore(newActivity, activitiesList.firstChild);
    
    setTimeout(() => {
        newActivity.style.transition = 'all 0.5s ease';
        newActivity.style.opacity = '1';
        newActivity.style.transform = 'translateX(0)';
    }, 100);
}

// Streak Animation
function animateStreak() {
    const streakDays = document.getElementById('streakDays');
    let count = 0;
    const target = 7;
    const duration = 1000;
    const increment = target / (duration / 50);
    
    const counter = setInterval(() => {
        count += increment;
        if (count >= target) {
            count = target;
            clearInterval(counter);
        }
        streakDays.textContent = Math.floor(count);
    }, 50);
}

// Auto-save goals to localStorage
function saveGoals() {
    localStorage.setItem('fitness_goals', JSON.stringify(goals));
}

function loadGoals() {
    const stored = localStorage.getItem('fitness_goals');
    if (stored) {
        goals = JSON.parse(stored);
        initializeGoals();
    }
}

// Save goals every minute
setInterval(saveGoals, 60000);

// Load goals on page load
window.addEventListener('load', loadGoals);

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const notifStyle = document.createElement('style');
notifStyle.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(notifStyle);

// Random motivational quotes
const motivationalQuotes = [
    "Great work! Keep it up! 💪",
    "You're doing amazing! 🔥",
    "One step closer to your goal! 🎯",
    "Consistency is key! 🗝️",
    "You're stronger than you think! 💯"
];

function showRandomMotivation() {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    showNotification(randomQuote, 'success');
}

// Show random motivation every 5 minutes during workout
let motivationInterval = null;

function startMotivation() {
    motivationInterval = setInterval(showRandomMotivation, 300000); // 5 minutes
}

function stopMotivation() {
    if (motivationInterval) {
        clearInterval(motivationInterval);
        motivationInterval = null;
    }
}

// Interactive chart bars
document.querySelectorAll('.chart-bar').forEach(bar => {
    bar.addEventListener('click', function() {
        const value = this.dataset.value;
        const day = this.dataset.day;
        showNotification(`${day}: ${value} steps`, 'info');
    });
});

// Double-click on achievement badges
document.querySelectorAll('.achievement-badge.earned').forEach(badge => {
    badge.addEventListener('dblclick', function() {
        this.style.transform = 'scale(1.2) rotate(5deg)';
        setTimeout(() => {
            this.style.transform = '';
        }, 300);
        showNotification('Achievement unlocked! 🏆', 'success');
    });
});

// Initialize animations on load
window.addEventListener('load', function() {
    animateStreak();
    
    // Stagger animations for a smooth entrance
    setTimeout(animateCircularProgress, 300);
    setTimeout(animateChartBars, 800);
    setTimeout(animateActivities, 1200);
});
