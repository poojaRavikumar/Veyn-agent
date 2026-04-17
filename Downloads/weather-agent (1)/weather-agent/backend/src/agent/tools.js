/**
 * agent/tools.js
 *
 * LangChain DynamicStructuredTool definitions — these are the "tools" the LLM
 * can choose to call during reasoning. Each tool maps directly to one MCP Server
 * endpoint. Zod schemas give LangChain the structured type information it uses
 * to generate the function-call payload for the model.
 *
 * Design principle: tools are thin wrappers. All the real logic lives in the
 * MCP Server. Tools just know how to call it and shape the response.
 */

const { DynamicStructuredTool } = require("@langchain/core/tools");
const { z } = require("zod");
const axios = require("axios");

const MCP_URL = process.env.MCP_SERVER_URL || "http://localhost:3000";

/**
 * Helper — call the MCP Server and return data, or throw a descriptive error.
 * @param {string} path - URL path relative to MCP_URL
 * @param {object} params - Query parameters
 */
async function callMCP(path, params) {
  try {
    const { data } = await axios.get(`${MCP_URL}${path}`, { params });
    return data.data;
  } catch (err) {
    const message = err.response?.data?.error || err.message || "MCP Server error";
    throw new Error(`MCP call to ${path} failed: ${message}`);
  }
}

// ── Tool 1: Current Weather ───────────────────────────────────────────────────
const getCurrentWeatherTool = new DynamicStructuredTool({
  name: "get_current_weather",
  description:
    "Fetches the current weather conditions for a given city. " +
    "Returns temperature, humidity, wind speed, and a short description. " +
    "Use this when the user asks about right-now conditions.",
  schema: z.object({
    city: z.string().describe("City name, e.g. 'London' or 'New York'"),
    units: z
      .enum(["metric", "imperial"])
      .default("metric")
      .describe("Temperature units: 'metric' (Celsius) or 'imperial' (Fahrenheit)"),
  }),
  func: async ({ city, units }) => {
    const data = await callMCP("/weather/current", { city, units });
    return JSON.stringify(data);
  },
});

// ── Tool 2: Weather Forecast ──────────────────────────────────────────────────
const getForecastTool = new DynamicStructuredTool({
  name: "get_weather_forecast",
  description:
    "Fetches a multi-day weather forecast (up to 5 days) for a city. " +
    "Returns daily min/max temps, conditions, humidity, and wind speed. " +
    "Use this when the user asks about upcoming or future weather.",
  schema: z.object({
    city: z.string().describe("City name"),
    days: z
      .number()
      .int()
      .min(1)
      .max(5)
      .default(5)
      .describe("Number of forecast days (1–5)"),
    units: z.enum(["metric", "imperial"]).default("metric"),
  }),
  func: async ({ city, days, units }) => {
    const data = await callMCP("/weather/forecast", { city, days, units });
    return JSON.stringify(data);
  },
});

// ── Tool 3: Air Quality ───────────────────────────────────────────────────────
const getAirQualityTool = new DynamicStructuredTool({
  name: "get_air_quality",
  description:
    "Fetches the current Air Quality Index (AQI) and key pollutant levels (PM2.5, PM10, NO2, O3) for a city. " +
    "Use when the user asks about air quality, pollution, or whether conditions are safe for outdoor activities.",
  schema: z.object({
    city: z.string().describe("City name"),
  }),
  func: async ({ city }) => {
    const data = await callMCP("/weather/air-quality", { city });
    return JSON.stringify(data);
  },
});

module.exports = { getCurrentWeatherTool, getForecastTool, getAirQualityTool };
