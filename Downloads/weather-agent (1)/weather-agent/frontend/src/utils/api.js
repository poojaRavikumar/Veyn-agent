/**
 * utils/api.js
 *
 * Thin wrapper around the backend /chat endpoint.
 * Keeping fetch logic here means components never touch raw fetch calls,
 * and swapping the backend URL or adding auth headers happens in one place.
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

/**
 * Send a chat message to the WeatherAgent backend.
 *
 * @param {string} message - The user's message
 * @param {Array<{role: string, content: string}>} history - Conversation history
 * @returns {Promise<{answer: string, toolsUsed: string[]}>}
 */
export async function sendMessage(message, history = []) {
  const res = await fetch(`${BACKEND_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Server error: ${res.status}`);
  }

  return res.json();
}
