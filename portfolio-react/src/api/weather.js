/**
 * Weather API - Open-Meteo (free, no API key) for "Based in Maharashtra" widget.
 * Coordinates for Yavatmal area.
 */

const LAT = 20.4;
const LON = 78.13;
const OPEN_METEO = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true`;

export async function fetchCurrentWeather() {
  try {
    const res = await fetch(OPEN_METEO);
    if (!res.ok) throw new Error('Weather fetch failed');
    const data = await res.json();
    const w = data.current_weather;
    return {
      temperature: w.temperature,
      unit: w.temperature_unit,
      description: codeToDescription(w.weathercode),
      code: w.weathercode,
    };
  } catch (err) {
    console.warn('Weather:', err.message);
    return null;
  }
}

function codeToDescription(code) {
  const map = {
    0: 'Clear',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Foggy',
    51: 'Drizzle',
    61: 'Rain',
    80: 'Rain showers',
    95: 'Thunderstorm',
  };
  return map[code] || 'Unknown';
}
