# 🌦️ WeatherAgent — Agentic Full-Stack App

An end-to-end AI-powered weather assistant featuring:
- **MCP Server** (Express.js microservice wrapping OpenWeatherMap API)
- **LLM Agent Backend** (Node.js + LangChain.js with tool-calling)
- **React Frontend** (Vite + Tailwind CSS)

---

## Architecture Overview

```
┌─────────────┐       ┌──────────────────┐       ┌─────────────────────┐       ┌──────────────────┐
│   React UI  │──────▶│  Agent Backend   │──────▶│    MCP Server       │──────▶│ OpenWeatherMap   │
│  (port 5173)│◀──────│  (port 3001)     │◀──────│    (port 3000)      │◀──────│     API          │
└─────────────┘       └──────────────────┘       └─────────────────────┘       └──────────────────┘
                          LangChain + Claude           Tool/Wrapper
```

---

## Prerequisites

- Node.js >= 18
- npm >= 9
- API Keys:
  - [OpenWeatherMap](https://openweathermap.org/api) (free tier)
  - [Groq](https://console.groq.com/) (free, no credit card — uses Llama 3.3 70B)

---

## Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/weather-agent.git
cd weather-agent
```

### 2. Set up environment variables

**MCP Server:**
```bash
cd mcp-server
cp .env.example .env
# Fill in OPENWEATHER_API_KEY
```

**Backend:**
```bash
cd ../backend
cp .env.example .env
# Fill in GROQ_API_KEY
```

**Frontend:**
```bash
cd ../frontend
cp .env.example .env
# Fill in VITE_BACKEND_URL=http://localhost:3001
```

### 3. Install dependencies

```bash
# From project root
cd mcp-server && npm install
cd ../backend && npm install
cd ../frontend && npm install
```

### 4. Start all services

Open **3 terminal tabs**:

```bash
# Tab 1 — MCP Server
cd mcp-server && npm start

# Tab 2 — Agent Backend
cd backend && npm start

# Tab 3 — Frontend
cd frontend && npm run dev
```

Visit: **http://localhost:5173**

---

## Project Structure

```
weather-agent/
├── mcp-server/          # Microservice wrapping OpenWeatherMap API
│   ├── src/
│   │   ├── routes/      # Express route handlers
│   │   ├── services/    # OpenWeatherMap API logic
│   │   └── middleware/  # Auth, error handling
│   ├── .env.example
│   └── package.json
│
├── backend/             # LangChain agent with tool-calling
│   ├── src/
│   │   ├── agent/       # LangChain agent setup & tools
│   │   ├── routes/      # Express API for frontend
│   │   └── utils/       # Helpers
│   ├── .env.example
│   └── package.json
│
├── frontend/            # React + Vite web app
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── hooks/       # Custom React hooks
│   │   └── utils/       # API client
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml   # One-command Docker setup
└── README.md
```

---

## Docker Deployment (Recommended)

```bash
# Copy all .env.example files first, fill in keys
cp mcp-server/.env.example mcp-server/.env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Build and run all services
docker-compose up --build
```

---

## API Endpoints

### MCP Server (port 3000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/weather/current?city=London` | Current weather |
| GET | `/weather/forecast?city=London&days=5` | 5-day forecast |
| GET | `/weather/air-quality?city=London` | Air quality index |
| GET | `/health` | Service health check |

### Agent Backend (port 3001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/chat` | Send message to agent |
| GET | `/health` | Service health check |

---

## API Keys (Both 100% Free)

| Key | Cost | Signup |
|-----|------|--------|
| OpenWeatherMap | Free forever (1M calls/month) | https://openweathermap.org/register |
| Groq (Llama 3.3 70B) | Free, no credit card | https://console.groq.com |

---

## Documentation Philosophy

- **Inline comments** explain *why*, not *what*
- **JSDoc** on all public functions and tool definitions
- **README per service** for onboarding new developers
- **`.env.example`** with every required variable documented
- **`docker-compose.yml`** for reproducible environments
- Architecture diagram in root README for quick orientation

---

## Security Notes

- API keys are never committed — only `.env.example` files
- MCP Server validates all incoming requests
- CORS is restricted to known frontend origin
- Rate limiting on all public endpoints

---

## License

MIT
