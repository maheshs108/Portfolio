// Enhanced Weather Dashboard with Advanced Interactivity
let currentCity = 'Mumbai';
let favorites = [];
let autoRefreshInterval = null;
let temperatureUnit = 'C';
let windSpeedUnit = 'kmh';

// Enhanced weather data with more cities
const weatherData = {
    'Mumbai': {
        temp: 28, tempHigh: 32, tempLow: 24,
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
        pm25: 12, pm10: 24, o3: 38, no2: 15
    },
    'Delhi': {
        temp: 22, tempHigh: 26, tempLow: 18,
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
        pm25: 55, pm10: 78, o3: 45, no2: 32
    },
    'Bangalore': {
        temp: 24, tempHigh: 27, tempLow: 20,
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
        pm25: 10, pm10: 20, o3: 30, no2: 12
    },
    'Kolkata': {
        temp: 30, tempHigh: 34, tempLow: 27,
        feelsLike: 34,
        condition: 'Hot & Humid',
        icon: 'fa-temperature-high',
        humidity: 75,
        windSpeed: 10,
        pressure: 1008,
        visibility: 9,
        uvIndex: 9,
        sunrise: '5:45 AM',
        sunset: '5:30 PM',
        aqi: 98,
        pm25: 35, pm10: 52, o3: 40, no2: 25
    },
    'Chennai': {
        temp: 32, tempHigh: 35, tempLow: 28,
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
        pm25: 18, pm10: 30, o3: 35, no2: 18
    },
    'Hyderabad': {
        temp: 26, tempHigh: 29, tempLow: 22,
        feelsLike: 27,
        condition: 'Partly Cloudy',
        icon: 'fa-cloud-sun',
        humidity: 60,
        windSpeed: 14,
        pressure: 1011,
        visibility: 10,
        uvIndex: 7,
        sunrise: '6:20 AM',
        sunset: '6:10 PM',
        aqi: 48,
        pm25: 15, pm10: 28, o3: 33, no2: 16
    },
    'Pune': {
        temp: 25, tempHigh: 28, tempLow: 21,
        feelsLike: 26,
        condition: 'Pleasant',
        icon: 'fa-cloud-sun',
        humidity: 55,
        windSpeed: 13,
        pressure: 1012,
        visibility: 11,
        uvIndex: 6,
        sunrise: '6:35 AM',
        sunset: '6:18 PM',
        aqi: 40,
        pm25: 13, pm10: 22, o3: 31, no2: 14
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    loadFavorites();
    loadSettings();
    updateWeather('Mumbai');
    generateHourlyForecast();
    generateWeeklyForecast();
    setupSearchSuggestions();
    animateOnLoad();
    
    // Auto-refresh if enabled
    if (document.getElementById('autoRefresh').checked) {
        startAutoRefresh();
    }
});

function animateOnLoad() {
    // Stagger animations for smooth entrance
    const elements = document.querySelectorAll('.hero-weather, .forecast-section, .air-quality-section, .favorites-section');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        setTimeout(() => {
            el.style.transition = 'all 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);
    document.getElementById('currentTime').textContent = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
    });
}

// Search functionality with suggestions
function setupSearchSuggestions() {
    const input = document.getElementById('citySearch');
    const dropdown = document.getElementById('suggestionsDropdown');
    const cities = Object.keys(weatherData);
    
    input.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        if (value.length === 0) {
            dropdown.style.display = 'none';
            return;
        }
        
        const matches = cities.filter(city => 
            city.toLowerCase().includes(value)
        );
        
        if (matches.length > 0) {
            dropdown.innerHTML = matches.map(city => `
                <div class="suggestion-item" onclick="selectCity('${city}')">
                    <i class="fas fa-map-marker-alt"></i> ${city}, India
                </div>
            `).join('');
            dropdown.style.display = 'block';
        } else {
            dropdown.style.display = 'none';
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-wrapper')) {
            dropdown.style.display = 'none';
        }
    });
}

function selectCity(city) {
    document.getElementById('citySearch').value = '';
    document.getElementById('suggestionsDropdown').style.display = 'none';
    updateWeather(city);
}

function searchWeather() {
    const searchInput = document.getElementById('citySearch');
    const city = searchInput.value.trim();
    
    if (city) {
        const cityName = city.split(',')[0].trim();
        const matchedCity = Object.keys(weatherData).find(key => 
            key.toLowerCase() === cityName.toLowerCase()
        );
        
        if (matchedCity) {
            updateWeather(matchedCity);
            searchInput.value = '';
            showNotification(`Weather updated for ${matchedCity}`, 'success');
        } else {
            showNotification(`City not found. Available cities: ${Object.keys(weatherData).join(', ')}`, 'error');
        }
    }
}

function getCurrentLocation() {
    showNotification('Detecting your location...', 'info');
    
    // Add spinning animation to button
    const btn = document.querySelector('.location-btn');
    btn.style.animation = 'spin 1s linear infinite';
    
    setTimeout(() => {
        const randomCity = Object.keys(weatherData)[Math.floor(Math.random() * Object.keys(weatherData).length)];
        updateWeather(randomCity);
        btn.style.animation = '';
        showNotification(`Location detected: ${randomCity}`, 'success');
    }, 1500);
}

function updateWeather(city) {
    const data = weatherData[city];
    if (!data) return;
    
    currentCity = city;
    
    // Update location
    document.getElementById('cityName').textContent = city + ', India';
    
    // Update main weather display
    const tempDisplay = temperatureUnit === 'C' ? data.temp : toFahrenheit(data.temp);
    document.getElementById('temperature').textContent = Math.round(tempDisplay);
    document.getElementById('tempHigh').textContent = Math.round(temperatureUnit === 'C' ? data.tempHigh : toFahrenheit(data.tempHigh)) + '°';
    document.getElementById('tempLow').textContent = Math.round(temperatureUnit === 'C' ? data.tempLow : toFahrenheit(data.tempLow)) + '°';
    document.getElementById('feelsLike').textContent = Math.round(temperatureUnit === 'C' ? data.feelsLike : toFahrenheit(data.feelsLike)) + '°C';
    document.getElementById('weatherCondition').textContent = data.condition;
    
    // Update weather icon with animation
    const iconElement = document.querySelector('.weather-icon-animated i');
    iconElement.className = `fas ${data.icon}`;
    iconElement.style.animation = 'none';
    setTimeout(() => {
        iconElement.style.animation = 'iconPulse 3s ease-in-out infinite';
    }, 10);
    
    // Update stats
    document.getElementById('humidity').textContent = data.humidity + '%';
    const windSpeed = windSpeedUnit === 'kmh' ? data.windSpeed : toMph(data.windSpeed);
    document.getElementById('windSpeed').textContent = windSpeed + ' ' + windSpeedUnit;
    document.getElementById('pressure').textContent = data.pressure + ' hPa';
    document.getElementById('visibility').textContent = data.visibility + ' km';
    document.getElementById('uvIndex').textContent = data.uvIndex;
    
    // Update sun times
    document.getElementById('sunrise').textContent = data.sunrise;
    document.getElementById('sunset').textContent = data.sunset;
    
    // Update AQI
    updateAQI(data);
    
    // Update background based on temperature
    updateBackground(data.temp);
    updateWeatherEffects(data.condition);
    
    // Regenerate forecasts
    generateHourlyForecast(data.temp);
    generateWeeklyForecast(data.temp);
}

function updateBackground(temp) {
    const bg = document.getElementById('weatherBg');
    
    if (temp < 15) {
        bg.style.background = 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 50%, #93C5FD 100%)';
    } else if (temp < 25) {
        bg.style.background = 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 40%, #7DD3FC 100%)';
    } else {
        bg.style.background = 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #FCD34D 100%)';
    }
}

function updateWeatherEffects(condition) {
    const particlesContainer = document.getElementById('weatherParticles');
    particlesContainer.innerHTML = '';
    
    if (condition.includes('Rain') || condition.includes('rainy')) {
        createRainEffect();
    } else if (condition.includes('Snow')) {
        createSnowEffect();
    }
}

function createRainEffect() {
    const container = document.getElementById('weatherParticles');
    for (let i = 0; i < 50; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDelay = Math.random() * 2 + 's';
        drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
        container.appendChild(drop);
    }
}

function updateAQI(data) {
    const aqi = data.aqi;
    const aqiLevel = getAQILevel(aqi);
    
    // Update AQI display
    document.getElementById('aqiNumber').textContent = aqi;
    document.getElementById('aqiNumber').style.color = aqiLevel.color;
    document.getElementById('aqiLabel').textContent = aqiLevel.label;
    document.getElementById('aqiLabel').style.color = aqiLevel.color;
    document.getElementById('aqiTitle').textContent = aqiLevel.label + ' Air Quality';
    document.getElementById('aqiMessage').textContent = aqiLevel.message;
    
    // Update circular progress
    const circle = document.getElementById('aqiProgressCircle');
    const percentage = Math.min((aqi / 300) * 100, 100);
    const offset = 283 - (percentage / 100) * 283;
    circle.style.strokeDashoffset = offset;
    circle.style.stroke = aqiLevel.color;
    
    // Update components
    document.getElementById('pm25').textContent = data.pm25 + ' μg/m³';
    document.getElementById('pm10').textContent = data.pm10 + ' μg/m³';
    document.getElementById('o3').textContent = data.o3 + ' μg/m³';
    document.getElementById('no2').textContent = data.no2 + ' μg/m³';
    
    // Update component bars
    document.getElementById('pm25Bar').style.width = (data.pm25 / 100 * 100) + '%';
    document.getElementById('pm10Bar').style.width = (data.pm10 / 100 * 100) + '%';
    document.getElementById('o3Bar').style.width = (data.o3 / 100 * 100) + '%';
    document.getElementById('no2Bar').style.width = (data.no2 / 100 * 100) + '%';
}

function getAQILevel(aqi) {
    if (aqi <= 50) return { 
        label: 'Good', 
        color: '#10B981',
        message: 'Air quality is satisfactory, and air pollution poses little or no risk.'
    };
    if (aqi <= 100) return { 
        label: 'Moderate', 
        color: '#F59E0B',
        message: 'Air quality is acceptable. However, there may be a risk for some people.'
    };
    if (aqi <= 150) return { 
        label: 'Unhealthy for Sensitive', 
        color: '#F97316',
        message: 'Members of sensitive groups may experience health effects.'
    };
    if (aqi <= 200) return { 
        label: 'Unhealthy', 
        color: '#EF4444',
        message: 'Everyone may begin to experience health effects.'
    };
    if (aqi <= 300) return { 
        label: 'Very Unhealthy', 
        color: '#991B1B',
        message: 'Health alert: everyone may experience more serious health effects.'
    };
    return { 
        label: 'Hazardous', 
        color: '#7C2D12',
        message: 'Health warnings of emergency conditions. The entire population is affected.'
    };
}

function generateHourlyForecast(baseTemp = 28) {
    const container = document.getElementById('hourlySlider');
    const hours = [];
    const now = new Date();
    
    const weatherIcons = ['fa-sun', 'fa-cloud-sun', 'fa-cloud', 'fa-cloud-rain'];
    
    for (let i = 0; i < 24; i++) {
        const hour = new Date(now.getTime() + i * 3600000);
        const hourStr = hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const temp = baseTemp + Math.floor(Math.random() * 6) - 3;
        const displayTemp = temperatureUnit === 'C' ? temp : toFahrenheit(temp);
        const icon = weatherIcons[Math.floor(Math.random() * weatherIcons.length)];
        
        hours.push(`
            <div class="hourly-card">
                <div class="hour-time">${hourStr}</div>
                <i class="fas ${icon} hour-icon"></i>
                <div class="hour-temp">${Math.round(displayTemp)}°</div>
            </div>
        `);
    }
    
    container.innerHTML = hours.join('');
}

function scrollHourly(direction) {
    const container = document.getElementById('hourlySlider');
    const scrollAmount = 250;
    if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
    } else {
        container.scrollLeft += scrollAmount;
    }
}

function generateWeeklyForecast(baseTemp = 28) {
    const container = document.getElementById('weeklyForecast');
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
        const displayHigh = temperatureUnit === 'C' ? high : toFahrenheit(high);
        const displayLow = temperatureUnit === 'C' ? low : toFahrenheit(low);
        
        return `
            <div class="day-card">
                <div class="day-name">${day}</div>
                <i class="fas ${condition.icon} day-icon"></i>
                <div class="day-condition">${condition.text}</div>
                <div class="day-temps">
                    <span class="temp-high">${Math.round(displayHigh)}°</span>
                    <span>/</span>
                    <span class="temp-low">${Math.round(displayLow)}°</span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = forecast.join('');
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
        
        const temp = temperatureUnit === 'C' ? data.temp : toFahrenheit(data.temp);
        
        return `
            <div class="favorite-card" onclick="updateWeather('${city}')">
                <button class="remove-fav" onclick="event.stopPropagation(); removeFavorite('${city}')">
                    <i class="fas fa-times"></i>
                </button>
                <h3>${city}</h3>
                <i class="fas ${data.icon}"></i>
                <div class="temp">${Math.round(temp)}°</div>
                <p>${data.condition}</p>
            </div>
        `;
    });
    
    container.innerHTML = cards.join('');
}

function toggleFavorite() {
    const city = currentCity;
    const btn = document.querySelector('.favorite-btn i');
    
    if (favorites.includes(city)) {
        favorites = favorites.filter(c => c !== city);
        btn.classList.remove('fas');
        btn.classList.add('far');
        showNotification(`${city} removed from favorites`, 'info');
    } else {
        favorites.push(city);
        btn.classList.remove('far');
        btn.classList.add('fas');
        showNotification(`${city} added to favorites!`, 'success');
    }
    
    saveFavorites();
    renderFavorites();
}

function removeFavorite(city) {
    favorites = favorites.filter(c => c !== city);
    saveFavorites();
    renderFavorites();
    showNotification(`${city} removed from favorites`, 'info');
}

function showAddFavoriteModal() {
    const availableCities = Object.keys(weatherData).filter(city => !favorites.includes(city));
    if (availableCities.length === 0) {
        showNotification('All cities are already in favorites!', 'info');
        return;
    }
    
    const cityList = availableCities.join(', ');
    showNotification(`Available cities: ${cityList}`, 'info');
}

// Settings
function loadSettings() {
    const savedUnit = localStorage.getItem('temp_unit');
    const savedWindUnit = localStorage.getItem('wind_unit');
    
    if (savedUnit) {
        temperatureUnit = savedUnit;
        updateTempUnitButtons();
    }
    
    if (savedWindUnit) {
        windSpeedUnit = savedWindUnit;
        updateWindUnitButtons();
    }
}

function openSettings() {
    document.getElementById('settingsPanel').classList.add('active');
}

function closeSettings() {
    document.getElementById('settingsPanel').classList.remove('active');
}

// Temperature unit conversion
function toFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

function toMph(kmh) {
    return kmh * 0.621371;
}

// Setup toggle buttons
document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const parent = this.parentElement;
        parent.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const unit = this.dataset.unit;
        if (unit === 'C' || unit === 'F') {
            temperatureUnit = unit;
            localStorage.setItem('temp_unit', unit);
            updateWeather(currentCity);
        } else if (unit === 'kmh' || unit === 'mph') {
            windSpeedUnit = unit;
            localStorage.setItem('wind_unit', unit);
            updateWeather(currentCity);
        }
    });
});

// Auto-refresh
document.getElementById('autoRefresh').addEventListener('change', function() {
    if (this.checked) {
        startAutoRefresh();
    } else {
        stopAutoRefresh();
    }
});

function startAutoRefresh() {
    autoRefreshInterval = setInterval(() => {
        // Simulate data update
        updateWeather(currentCity);
        showNotification('Weather data refreshed', 'info');
    }, 300000); // 5 minutes
}

function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
}

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
        max-width: 350px;
    `;
    
    const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animations CSS
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
    .suggestion-item {
        padding: 1rem 1.5rem;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
        color: #0F172A;
    }
    .suggestion-item:hover {
        background: #F0F9FF;
    }
    .suggestion-item i {
        color: #3B82F6;
    }
`;
document.head.appendChild(style);

// Enter key support for search
document.getElementById('citySearch').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

// Update favorite button state
function updateFavoriteButton() {
    const btn = document.querySelector('.favorite-btn i');
    if (favorites.includes(currentCity)) {
        btn.classList.remove('far');
        btn.classList.add('fas');
    } else {
        btn.classList.remove('fas');
        btn.classList.add('far');
    }
}

// Call this when changing cities
setInterval(() => {
    updateFavoriteButton();
}, 500);
