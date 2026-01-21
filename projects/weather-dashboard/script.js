// Weather data (Demo data - in production, you'd use a real API like OpenWeatherMap)
const weatherData = {
    'Pusad': { temp: 32, desc: 'Sunny', wind: 12, humidity: 65, pressure: 1013, visibility: 10, icon: 'fa-sun' },
    'Mumbai': { temp: 30, desc: 'Partly Cloudy', wind: 15, humidity: 75, pressure: 1010, visibility: 8, icon: 'fa-cloud-sun' },
    'Delhi': { temp: 28, desc: 'Clear Sky', wind: 10, humidity: 45, pressure: 1015, visibility: 12, icon: 'fa-sun' },
    'Bangalore': { temp: 25, desc: 'Cloudy', wind: 8, humidity: 70, pressure: 1012, visibility: 9, icon: 'fa-cloud' },
    'Pune': { temp: 29, desc: 'Sunny', wind: 11, humidity: 60, pressure: 1014, visibility: 10, icon: 'fa-sun' },
    'Hyderabad': { temp: 31, desc: 'Hot', wind: 14, humidity: 55, pressure: 1011, visibility: 11, icon: 'fa-sun' },
    'Chennai': { temp: 33, desc: 'Humid', wind: 16, humidity: 80, pressure: 1009, visibility: 7, icon: 'fa-cloud-sun' }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    setInterval(updateDateTime, 60000);
    loadWeather('Pusad');
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    document.getElementById('searchBtn').addEventListener('click', () => {
        const city = document.getElementById('cityInput').value.trim();
        if (city) {
            searchCity(city);
        }
    });
    
    document.getElementById('cityInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = document.getElementById('cityInput').value.trim();
            if (city) {
                searchCity(city);
            }
        }
    });
}

// Search City
function searchCity(city) {
    const cityFormatted = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
    
    if (weatherData[cityFormatted]) {
        loadWeather(cityFormatted);
        document.getElementById('cityInput').value = '';
    } else {
        showNotification(`Weather data for "${city}" not available. Try: Mumbai, Delhi, Bangalore, etc.`);
    }
}

// Load Weather
function loadWeather(city) {
    const data = weatherData[city];
    
    document.getElementById('cityName').textContent = city;
    document.getElementById('temperature').textContent = `${data.temp}°C`;
    document.getElementById('weatherDesc').textContent = data.desc;
    document.getElementById('windSpeed').textContent = `${data.wind} km/h`;
    document.getElementById('humidity').textContent = `${data.humidity}%`;
    document.getElementById('pressure').textContent = `${data.pressure} hPa`;
    document.getElementById('visibility').textContent = `${data.visibility} km`;
    
    // Update icon
    document.querySelector('.temp-icon i').className = `fas ${data.icon}`;
    
    // Update icon color based on temperature
    const tempIcon = document.querySelector('.temp-icon');
    if (data.temp > 30) {
        tempIcon.style.color = '#ef4444';
    } else if (data.temp > 25) {
        tempIcon.style.color = '#f59e0b';
    } else {
        tempIcon.style.color = '#3b82f6';
    }
    
    loadForecast();
}

// Load Forecast
function loadForecast() {
    const forecastGrid = document.getElementById('forecastGrid');
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weatherIcons = ['fa-sun', 'fa-cloud-sun', 'fa-cloud', 'fa-cloud-rain', 'fa-sun', 'fa-cloud-sun', 'fa-sun'];
    const descriptions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Clear', 'Partly Cloudy', 'Sunny'];
    
    const today = new Date().getDay();
    const baseTemp = parseInt(document.getElementById('temperature').textContent);
    
    forecastGrid.innerHTML = days.map((day, index) => {
        const temp = baseTemp + Math.floor(Math.random() * 6) - 3;
        const dayIndex = (today + index) % 7;
        
        return `
            <div class="forecast-card">
                <div class="day">${day}</div>
                <i class="fas ${weatherIcons[index]}"></i>
                <div class="temp">${temp}°C</div>
                <div class="desc">${descriptions[index]}</div>
            </div>
        `;
    }).join('');
}

// Update Date Time
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    document.getElementById('weatherDate').textContent = now.toLocaleDateString('en-IN', options);
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s;
        max-width: 400px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
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

// Console message
console.log('%c🌤️ Weather Dashboard', 'font-size: 20px; color: #3b82f6; font-weight: bold;');
console.log('%cNote: This is a demo with simulated data. In production, integrate with OpenWeatherMap API.', 'color: #64748b;');
