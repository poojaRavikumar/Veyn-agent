# MCP Server — Weather API Wrapper

This microservice wraps the [OpenWeatherMap REST API](https://openweathermap.org/api) and exposes three clean endpoints consumed by the LLM Agent backend as "tools".

## Why a separate MCP Server?

- **Security**: The OpenWeatherMap API key never leaves this service.
- **Separation of concerns**: The agent backend contains LLM logic; this service contains HTTP/integration logic.
- **Replaceability**: Swap OpenWeatherMap for another provider by only editing `src/services/weatherService.js`.
- **Rate limiting**: Applied once here, not duplicated across callers.

## Endpoints

| Method | Path | Params | Description |
|--------|------|--------|-------------|
| GET | `/weather/current` | `city`, `units` | Current conditions |
| GET | `/weather/forecast` | `city`, `days`, `units` | Up to 5-day forecast |
| GET | `/weather/air-quality` | `city` | AQI + pollutants |
| GET | `/health` | — | Health check |

## Setup

```bash
cp .env.example .env   # add your OPENWEATHER_API_KEY
npm install
npm start              # http://localhost:3000
```

## Tests

```bash
npm test
```
