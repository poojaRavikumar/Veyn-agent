/**
 * weatherService.js
 *
 * All direct communication with the OpenWeatherMap API lives here.
 * Keeping it in a dedicated service means routes stay thin and this
 * logic is easy to swap (e.g. different provider) without touching routes.
 */

const axios = require("axios");

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";
const AQI_URL = "https://api.openweathermap.org/data/2.5/air_pollution";

/**
 * Resolve a city name to lat/lon using the OpenWeatherMap Geocoding API.
 * This is required before calling forecast or air quality endpoints.
 *
 * @param {string} city - City name (e.g. "London" or "London,GB")
 * @returns {Promise<{lat: number, lon: number, name: string, country: string}>}
 */
async function geocodeCity(city) {
  const { data } = await axios.get(`${GEO_URL}/direct`, {
    params: { q: city, limit: 1, appid: process.env.OPENWEATHER_API_KEY },
  });

  if (!data || data.length === 0) {
    const err = new Error(`City not found: "${city}"`);
    err.statusCode = 404;
    throw err;
  }

  const { lat, lon, name, country } = data[0];
  return { lat, lon, name, country };
}

/**
 * Fetch current weather conditions for a city.
 *
 * @param {string} city
 * @param {string} [units="metric"] - "metric" | "imperial" | "standard"
 * @returns {Promise<object>} Normalised current weather object
 */
async function getCurrentWeather(city, units = "metric") {
  const { data } = await axios.get(`${BASE_URL}/weather`, {
    params: {
      q: city,
      units,
      appid: process.env.OPENWEATHER_API_KEY,
    },
  });

  // Normalise response to a stable shape
  return {
    city: data.name,
    country: data.sys.country,
    temperature: data.main.temp,
    feels_like: data.main.feels_like,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    visibility: data.visibility,
    wind_speed: data.wind.speed,
    wind_direction: data.wind.deg,
    weather: data.weather[0].main,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    units,
    timestamp: new Date(data.dt * 1000).toISOString(),
  };
}

/**
 * Fetch a multi-day weather forecast for a city (OpenWeatherMap returns
 * 3-hour intervals for 5 days — we group them by day for cleaner output).
 *
 * @param {string} city
 * @param {number} [days=5] - Number of days (1–5)
 * @param {string} [units="metric"]
 * @returns {Promise<object>} Daily forecast array
 */
async function getForecast(city, days = 5, units = "metric") {
  const { lat, lon, name, country } = await geocodeCity(city);

  const { data } = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      lat,
      lon,
      units,
      cnt: Math.min(days, 5) * 8, // 8 slots per day (3-hour intervals)
      appid: process.env.OPENWEATHER_API_KEY,
    },
  });

  // Group 3-hourly slots by calendar date
  const byDay = {};
  for (const slot of data.list) {
    const date = slot.dt_txt.split(" ")[0];
    if (!byDay[date]) byDay[date] = [];
    byDay[date].push(slot);
  }

  const forecast = Object.entries(byDay)
    .slice(0, days)
    .map(([date, slots]) => {
      const temps = slots.map((s) => s.main.temp);
      const descriptions = slots.map((s) => s.weather[0].description);
      return {
        date,
        temp_min: Math.min(...temps),
        temp_max: Math.max(...temps),
        description: descriptions[Math.floor(descriptions.length / 2)], // midday
        humidity: Math.round(slots.reduce((a, s) => a + s.main.humidity, 0) / slots.length),
        wind_speed: Math.round(slots.reduce((a, s) => a + s.wind.speed, 0) / slots.length),
        icon: slots[Math.floor(slots.length / 2)].weather[0].icon,
      };
    });

  return { city: name, country, units, forecast };
}

/**
 * Fetch the current Air Quality Index for a city.
 *
 * @param {string} city
 * @returns {Promise<object>} AQI data with pollutant breakdown
 */
async function getAirQuality(city) {
  const { lat, lon, name, country } = await geocodeCity(city);

  const { data } = await axios.get(AQI_URL, {
    params: { lat, lon, appid: process.env.OPENWEATHER_API_KEY },
  });

  const item = data.list[0];
  const aqiLabels = { 1: "Good", 2: "Fair", 3: "Moderate", 4: "Poor", 5: "Very Poor" };

  return {
    city: name,
    country,
    aqi: item.main.aqi,
    aqi_label: aqiLabels[item.main.aqi] || "Unknown",
    components: {
      co: item.components.co,
      no2: item.components.no2,
      o3: item.components.o3,
      pm2_5: item.components.pm2_5,
      pm10: item.components.pm10,
    },
    timestamp: new Date(item.dt * 1000).toISOString(),
  };
}

module.exports = { getCurrentWeather, getForecast, getAirQuality };
