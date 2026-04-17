/**
 * Backend Entry Point
 *
 * Starts the Express server, initialises the LangChain agent (async),
 * and mounts routes. The agent init is intentionally async — the server
 * starts listening immediately and returns 503 for /chat until ready,
 * so Docker health checks pass quickly.
 */

require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const { createWeatherAgent } = require("./agent/weatherAgent");
const { router: chatRouter, setAgentExecutor } = require("./routes/chat");

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173" }));
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/chat", chatRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "weather-agent-backend", timestamp: new Date().toISOString() });
});

// ── Start server, then init agent ─────────────────────────────────────────────
app.listen(PORT, async () => {
  console.log(`✅  Backend running on http://localhost:${PORT}`);
  console.log("⏳  Initialising LangChain agent...");
  try {
    const executor = await createWeatherAgent();
    setAgentExecutor(executor);
    console.log("🤖  WeatherAgent ready.");
  } catch (err) {
    console.error("❌  Failed to initialise agent:", err.message);
    // Server keeps running — /chat will return 503 until agent is available
  }
});

module.exports = app;
