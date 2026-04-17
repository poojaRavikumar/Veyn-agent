/**
 * agent/weatherAgent.js
 *
 * LangChain agent wired up with three weather tools.
 *
 * LLM: Groq — 100% free, no credit card required.
 * Model: llama-3.3-70b-versatile — supports native tool/function calling.
 * Get your free key at: https://console.groq.com
 *
 * Uses createToolCallingAgent (not createReactAgent) because Groq's Llama
 * models support OpenAI-style function calling natively — more reliable
 * and does NOT require {tools}/{tool_names} placeholders in the prompt.
 */

const { ChatGroq } = require("@langchain/groq");
const { AgentExecutor, createToolCallingAgent } = require("langchain/agents");
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
const { getCurrentWeatherTool, getForecastTool, getAirQualityTool } = require("./tools");

const SYSTEM_PROMPT = `You are WeatherAgent, a friendly and knowledgeable weather assistant.
You have access to real-time weather data and can answer questions about:
- Current weather conditions for any city worldwide
- Multi-day weather forecasts (up to 5 days)
- Air quality index and pollution levels

Guidelines:
- Always be conversational and helpful. Don't just dump raw data — interpret it.
- Mention if conditions are good or bad for outdoor activities.
- For temperatures, always state the unit (°C or °F).
- If asked about multiple cities, call the relevant tools for each city.
- If a city is ambiguous (e.g. "Springfield"), ask which state/country they mean.
- If a tool call fails, inform the user gracefully and suggest trying a different city name.
- Keep responses concise but informative. Use bullet points for multi-day forecasts.
- Add a short friendly tip at the end when relevant (e.g. "Bring an umbrella!").`;

const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0.3,
  apiKey: process.env.GROQ_API_KEY,
});

const tools = [getCurrentWeatherTool, getForecastTool, getAirQualityTool];

// createToolCallingAgent only needs these 4 placeholders — no {tools}/{tool_names}
const prompt = ChatPromptTemplate.fromMessages([
  ["system", SYSTEM_PROMPT],
  new MessagesPlaceholder("chat_history"),
  ["human", "{input}"],
  new MessagesPlaceholder("agent_scratchpad"),
]);

async function createWeatherAgent() {
  const agent = await createToolCallingAgent({ llm, tools, prompt });
  return new AgentExecutor({
    agent,
    tools,
    verbose: process.env.NODE_ENV !== "production",
    maxIterations: 5,
    returnIntermediateSteps: true,
  });
}

module.exports = { createWeatherAgent };