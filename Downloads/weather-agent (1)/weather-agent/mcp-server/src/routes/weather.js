/**
 * routes/weather.js
 *
 * Express router exposing the three core weather capabilities as HTTP endpoints.
 * Each handler validates inputs, delegates to the service layer, and returns
 * a consistent JSON shape so the agent tools have a predictable contract.
 */

const express = require("express");
const router = express.Router();
const { getCurrentWeather, getForecast, getAirQuality } = require("../services/weatherService");

/**
 * GET /weather/current
 * Query params:
 *   city  (required) — city name, e.g. "Phoenix" or "Phoenix,US"
 *   units (optional) — "metric" | "imperial" | "standard" (default: metric)
 */
router.get("/current", async (req, res, next) => {
  try {
    const { city, units } = req.query;
    if (!city) {
      return res.status(400).json({ error: 'Query parameter "city" is required.' });
    }
    const data = await getCurrentWeather(city, units);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /weather/forecast
 * Query params:
 *   city  (required)
 *   days  (optional, 1–5, default: 5)
 *   units (optional, default: metric)
 */
router.get("/forecast", async (req, res, next) => {
  try {
    const { city, units } = req.query;
    const days = Math.min(parseInt(req.query.days, 10) || 5, 5);
    if (!city) {
      return res.status(400).json({ error: 'Query parameter "city" is required.' });
    }
    const data = await getForecast(city, days, units);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /weather/air-quality
 * Query params:
 *   city (required)
 */
router.get("/air-quality", async (req, res, next) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ error: 'Query parameter "city" is required.' });
    }
    const data = await getAirQuality(city);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
