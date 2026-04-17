/**
 * hooks/useChat.js
 *
 * Manages conversation state: message list, loading flag, and error.
 * Encapsulating this in a hook keeps the App component clean and makes
 * the chat logic independently testable.
 */

import { useState, useCallback } from "react";
import { sendMessage } from "../utils/api";

/**
 * @typedef {Object} Message
 * @property {"user"|"agent"} role
 * @property {string} content
 * @property {string[]} [toolsUsed]
 * @property {string} id
 */

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Send a user message and append both the user turn and agent reply to state.
   * @param {string} text
   */
  const send = useCallback(
    async (text) => {
      if (!text.trim()) return;
      setError(null);

      const userMsg = { role: "user", content: text, id: crypto.randomUUID() };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      // Build history array for the backend (exclude the message we just added)
      const history = messages.map((m) => ({ role: m.role === "agent" ? "assistant" : "user", content: m.content }));

      try {
        const { answer, toolsUsed } = await sendMessage(text, history);
        const agentMsg = {
          role: "agent",
          content: answer,
          toolsUsed: toolsUsed || [],
          id: crypto.randomUUID(),
        };
        setMessages((prev) => [...prev, agentMsg]);
      } catch (err) {
        setError(err.message || "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [messages]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, error, send, clearChat };
}
