/**
 * MCP Server — Entry Point
 *
 * This microservice acts as a structured wrapper (Model Context Protocol server)
 * around the OpenWeatherMap REST API. It exposes clean, validated endpoints that
 * the LLM Agent backend calls as "tools". Isolating the API integration here means:
 *   1. API keys never reach the frontend or the agent directly.
 *   2. Rate limiting and error normalisation happen in one place.
 *   3. The agent tools stay thin and focused on logic, not HTTP plumbing.
 */

require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const weatherRoutes = require("./routes/weather");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS — only allow the backend service ─────────────────────────────────────
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:3001",
    methods: ["GET"],
  })
);

// ── Request logging ───────────────────────────────────────────────────────────
app.use(morgan("dev"));

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json());

// ── Rate limiting — 100 requests per 15 minutes per IP ───────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});
app.use(limiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/weather", weatherRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "weather-mcp-server", timestamp: new Date().toISOString() });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Central error handler ─────────────────────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅  MCP Server running on http://localhost:${PORT}`);
});

module.exports = app; // exported for testing
