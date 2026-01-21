// Weather Dashboard with Demo Data
let currentCity = 'Mumbai, India';
let favorites = [];

// Demo weather data
const weatherData = {
    'Mumbai': {
        temp: 28,
        feelsLike: 30,
        condition: 'Partly Cloudy',
        icon: 'fa-cloud-sun',
        humidity: 65,
        windSpeed: 15,
        pressure: 1013,
        visibility: 10,
        uvIndex: 7,
        sunrise: '6:45 AM',
        sunset: '6:15 PM',
        aqi: 42,
        pm25: 12,
        pm10: 24,
        o3: 38,
        no2: 15
    },
    'Delhi': {
        temp: 22,
        feelsLike: 20,
        condition: 'Clear Sky',
        icon: 'fa-sun',
        humidity: 45,
        windSpeed: 8,
        pressure: 1015,
        visibility: 12,
        uvIndex: 6,
        sunrise: '6:50 AM',
        sunset: '6:10 PM',
        aqi: 152,
        pm25: 55,
        pm10: 78,
        o3: 45,
        no2: 32
    },
    'Bangalore': {
        temp: 24,
        feelsLike: 23,
        condition: 'Cloudy',
        icon: 'fa-cloud',
        humidity: 70,
        windSpeed: 12,
        pressure: 1010,
        visibility: 8,
        uvIndex: 5,
        sunrise: '6:30 AM',
        sunset: '6:20 PM',
        aqi: 35,
        pm25: 10,
        pm10: 20,
        o3: 30,
        no2: 12
    },
    'Kolkata': {
        temp: 30,
        feelsLike: 34,
        condition: 'Hot',
        icon: 'fa-temperature-high',
        humidity: 75,
        windSpeed: 10,
        pressure: 1008,
        visibility: 9,
        uvIndex: 9,
        sunrise: '5:45 AM',
        sunset: '5:30 PM',
        aqi: 98,
        pm25: 35,
        pm10: 52,
        o3: 40,
        no2: 25
    },
    'Chennai': {
        temp: 32,
        feelsLike: 36,
        condition: 'Sunny',
        icon: 'fa-sun',
        humidity: 80,
        windSpeed: 18,
        pressure: 1012,
        visibility: 11,
        uvIndex: 10,
        sunrise: '6:15 AM',
        sunset: '6:00 PM',
        aqi: 55,
        pm25: 18,
        pm10: 30,
        o3: 35,
        no2: 18
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    loadFavorites();
    updateWeather('Mumbai');
    generateHourlyForecast();
    generateWeeklyForecast();
    
    // Enable enter key for search
    document.getElementById('citySearch').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchWeather();
        }
    });
});

function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);
    document.getElementById('currentTime').textContent = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
    });
}

function searchWeather() {
    const searchInput = document.getElementById('citySearch');
    const city = searchInput.value.trim();
    
    if (city) {
        // Extract city name (remove country if present)
        const cityName = city.split(',')[0].trim();
        
        // Find matching city in our data
        const matchedCity = Object.keys(weatherData).find(key => 
            key.toLowerCase().includes(cityName.toLowerCase())
        );
        
        if (matchedCity) {
            updateWeather(matchedCity);
            showNotification(`Weather updated for ${matchedCity}`, 'success');
        } else {
            showNotification(`City not found. Try: ${Object.keys(weatherData).join(', ')}`, 'info');
        }
        
        searchInput.value = '';
    }
}

function getCurrentLocation() {
    showNotification('Getting your location...', 'info');
    
    // Simulate geolocation
    setTimeout(() => {
        const randomCity = Object.keys(weatherData)[Math.floor(Math.random() * Object.keys(weatherData).length)];
        updateWeather(randomCity);
        showNotification(`Location detected: ${randomCity}`, 'success');
    }, 1000);
}

function updateWeather(city) {
    const data = weatherData[city];
    if (!data) return;
    
    currentCity = city + ', India';
    
    // Update current weather
    document.getElementById('cityName').textContent = currentCity;
    document.getElementById('temperature').textContent = data.temp;
    document.getElementById('feelsLike').textContent = data.feelsLike + '°C';
    document.getElementById('weatherCondition').textContent = data.condition;
    document.getElementById('weatherIcon').className = `fas ${data.icon} weather-icon-large`;
    
    // Update details
    document.getElementById('humidity').textContent = data.humidity + '%';
    document.getElementById('windSpeed').textContent = data.windSpeed + ' km/h';
    document.getElementById('pressure').textContent = data.pressure + ' hPa';
    document.getElementById('visibility').textContent = data.visibility + ' km';
    document.getElementById('uvIndex').textContent = data.uvIndex + ' (' + getUVLevel(data.uvIndex) + ')';
    
    // Update sun times
    document.getElementById('sunrise').textContent = data.sunrise;
    document.getElementById('sunset').textContent = data.sunset;
    
    // Update AQI
    updateAQI(data);
    
    // Update background based on temperature
    updateBackground(data.temp);
    
    // Regenerate forecasts based on current temp
    generateHourlyForecast(data.temp);
    generateWeeklyForecast(data.temp);
}

function updateAQI(data) {
    const aqi = data.aqi;
    const aqiLevel = getAQILevel(aqi);
    
    document.getElementById('aqiValue').innerHTML = `
        <span class="aqi-number" style="color: ${aqiLevel.color}">${aqi}</span>
        <span class="aqi-label" style="color: ${aqiLevel.color}">${aqiLevel.label}</span>
    `;
    
    document.getElementById('pm25').textContent = data.pm25;
    document.getElementById('pm10').textContent = data.pm10;
    document.getElementById('o3').textContent = data.o3;
    document.getElementById('no2').textContent = data.no2;
    
    // Update indicator position
    const position = (aqi / 300) * 100; // Assuming max AQI of 300
    document.querySelector('.aqi-indicator').style.left = Math.min(position, 95) + '%';
    document.querySelector('.aqi-indicator').style.borderColor = aqiLevel.color;
}

function getAQILevel(aqi) {
    if (aqi <= 50) return { label: 'Good', color: '#10B981' };
    if (aqi <= 100) return { label: 'Moderate', color: '#F59E0B' };
    if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: '#F97316' };
    if (aqi <= 200) return { label: 'Unhealthy', color: '#EF4444' };
    if (aqi <= 300) return { label: 'Very Unhealthy', color: '#991B1B' };
    return { label: 'Hazardous', color: '#7C2D12' };
}

function getUVLevel(uv) {
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
}

function updateBackground(temp) {
    const bg = document.getElementById('weatherBg');
    
    if (temp < 15) {
        bg.style.background = 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 50%, #93C5FD 100%)';
    } else if (temp < 25) {
        bg.style.background = 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 50%, #7DD3FC 100%)';
    } else {
        bg.style.background = 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #FCD34D 100%)';
    }
}

function generateHourlyForecast(baseTemp = 28) {
    const hourlyContainer = document.getElementById('hourlyForecast');
    const hours = [];
    const now = new Date();
    
    const weatherIcons = ['fa-sun', 'fa-cloud-sun', 'fa-cloud', 'fa-cloud-rain'];
    
    for (let i = 0; i < 8; i++) {
        const hour = new Date(now.getTime() + i * 3600000);
        const hourStr = hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const temp = baseTemp + Math.floor(Math.random() * 6) - 3;
        const icon = weatherIcons[Math.floor(Math.random() * weatherIcons.length)];
        
        hours.push(`
            <div class="hourly-card">
                <div class="hour-time">${hourStr}</div>
                <i class="fas ${icon} hour-icon"></i>
                <div class="hour-temp">${temp}°</div>
            </div>
        `);
    }
    
    hourlyContainer.innerHTML = hours.join('');
}

function generateWeeklyForecast(baseTemp = 28) {
    const weeklyContainer = document.getElementById('weeklyForecast');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const conditions = [
        { text: 'Partly Cloudy', icon: 'fa-cloud-sun' },
        { text: 'Sunny', icon: 'fa-sun' },
        { text: 'Cloudy', icon: 'fa-cloud' },
        { text: 'Rainy', icon: 'fa-cloud-rain' },
        { text: 'Thunderstorm', icon: 'fa-cloud-bolt' }
    ];
    
    const forecast = days.map((day, i) => {
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        const high = baseTemp + Math.floor(Math.random() * 5);
        const low = baseTemp - Math.floor(Math.random() * 5) - 5;
        
        return `
            <div class="day-card">
                <div class="day-name">${day}</div>
                <i class="fas ${condition.icon} day-icon"></i>
                <div class="day-condition">${condition.text}</div>
                <div class="day-temps">
                    <span class="temp-high">${high}°</span>
                    <span>/</span>
                    <span class="temp-low">${low}°</span>
                </div>
            </div>
        `;
    });
    
    weeklyContainer.innerHTML = forecast.join('');
}

// Favorites Management
function loadFavorites() {
    const stored = localStorage.getItem('weather_favorites');
    favorites = stored ? JSON.parse(stored) : ['Delhi', 'Bangalore', 'Chennai'];
    renderFavorites();
}

function saveFavorites() {
    localStorage.setItem('weather_favorites', JSON.stringify(favorites));
}

function renderFavorites() {
    const container = document.getElementById('favoritesGrid');
    
    const cards = favorites.map(city => {
        const data = weatherData[city];
        if (!data) return '';
        
        return `
            <div class="favorite-card" onclick="updateWeather('${city}')">
                <button class="remove-fav" onclick="event.stopPropagation(); removeFavorite('${city}')">
                    <i class="fas fa-times"></i>
                </button>
                <h3>${city}</h3>
                <i class="fas ${data.icon}"></i>
                <div class="temp">${data.temp}°C</div>
                <p>${data.condition}</p>
            </div>
        `;
    });
    
    container.innerHTML = cards.join('');
}

function addToFavorites() {
    const city = currentCity.split(',')[0].trim();
    
    if (favorites.includes(city)) {
        showNotification('City already in favorites!', 'info');
        return;
    }
    
    if (!weatherData[city]) {
        showNotification('Cannot add this city to favorites', 'error');
        return;
    }
    
    favorites.push(city);
    saveFavorites();
    renderFavorites();
    showNotification(`${city} added to favorites!`, 'success');
}

function removeFavorite(city) {
    favorites = favorites.filter(c => c !== city);
    saveFavorites();
    renderFavorites();
    showNotification(`${city} removed from favorites`, 'info');
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#0EA5E9'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 350px;
    `;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animations
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
