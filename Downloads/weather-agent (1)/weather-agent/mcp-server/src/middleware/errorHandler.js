/**
 * middleware/errorHandler.js
 *
 * Central error handler. Normalises errors from axios (OpenWeatherMap failures),
 * custom service errors, and unexpected crashes into a consistent JSON response.
 * This prevents raw stack traces or axios internals leaking to consumers.
 */

/**
 * @param {Error} err
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 */
function errorHandler(err, _req, res, _next) {
  console.error("[MCP Server Error]", err.message);

  // Custom status codes set by our service layer
  if (err.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Axios errors from the OpenWeatherMap API
  if (err.response) {
    const status = err.response.status;
    const message =
      err.response.data?.message || "Upstream API error from OpenWeatherMap.";
    return res.status(status).json({ error: message });
  }

  // Network / timeout errors
  if (err.request) {
    return res.status(502).json({ error: "Could not reach OpenWeatherMap API. Check connectivity." });
  }

  // Fallback — unexpected server error
  res.status(500).json({ error: "Internal server error." });
}

module.exports = { errorHandler };
