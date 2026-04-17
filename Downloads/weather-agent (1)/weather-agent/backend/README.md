# Agent Backend — LangChain WeatherAgent

LangChain.js ReAct agent that orchestrates calls to the MCP Server using Claude as the LLM.

## How it works

1. Frontend POSTs `{ message, history }` to `/chat`
2. The `AgentExecutor` passes the message + history to Claude
3. Claude reasons about which tools to call (`get_current_weather`, `get_weather_forecast`, `get_air_quality`)
4. Tool calls hit the MCP Server and return structured JSON
5. Claude synthesises the results into a natural language response
6. Backend returns `{ answer, toolsUsed }` to the frontend

## Tool Definitions

Defined in `src/agent/tools.js` using `DynamicStructuredTool` with Zod schemas.
Each tool maps to one MCP Server endpoint.

## Setup

```bash
cp .env.example .env   # add ANTHROPIC_API_KEY and MCP_SERVER_URL
npm install
npm start              # http://localhost:3001
```

## API

### POST /chat

**Body:**
```json
{
  "message": "What's the weather in Sydney?",
  "history": []
}
```

**Response:**
```json
{
  "answer": "Sydney is currently sunny at 22°C...",
  "toolsUsed": ["get_current_weather"]
}
```
