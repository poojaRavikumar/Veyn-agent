/**
 * routes/chat.js
 *
 * Single POST /chat endpoint. Receives the user's message and optional
 * conversation history, runs the LangChain agent, and returns the final
 * answer plus a summary of which tools were called (so the frontend can
 * display a "reasoning trail" to the user).
 */

const express = require("express");
const router = express.Router();

let agentExecutor = null; // Initialised once at server boot (set by index.js)

/**
 * Set the agent executor instance. Called from index.js after async init.
 * @param {import('langchain/agents').AgentExecutor} executor
 */
function setAgentExecutor(executor) {
  agentExecutor = executor;
}

/**
 * POST /chat
 * Body: { message: string, history?: Array<{role: "user"|"assistant", content: string}> }
 * Response: { answer: string, toolsUsed: string[] }
 */
router.post("/", async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({ error: "Field 'message' is required and must be a non-empty string." });
  }

  if (!agentExecutor) {
    return res.status(503).json({ error: "Agent is not ready yet. Please retry in a moment." });
  }

  try {
    // Convert history to LangChain HumanMessage / AIMessage format
    const { HumanMessage, AIMessage } = require("@langchain/core/messages");
    const chat_history = history.map((msg) =>
      msg.role === "user" ? new HumanMessage(msg.content) : new AIMessage(msg.content)
    );

    const result = await agentExecutor.invoke({
      input: message,
      chat_history,
    });

    // Extract which tools were called from the intermediate steps
    const toolsUsed = (result.intermediateSteps || [])
      .map((step) => step.action?.tool)
      .filter(Boolean);

    res.json({
      answer: result.output,
      toolsUsed: [...new Set(toolsUsed)], // deduplicate
    });
  } catch (err) {
    console.error("[Agent Error]", err.message);
    res.status(500).json({ error: "The agent encountered an error. Please try again." });
  }
});

module.exports = { router, setAgentExecutor };
