/**
 * MessageBubble.jsx
 * Renders a single chat turn — either user or agent.
 * Agent messages render markdown-ish content (bold, bullets) via dangerouslySetInnerHTML
 * after a lightweight sanitisation so the LLM's formatted output looks polished.
 */

import React from "react";
import ToolBadge from "./ToolBadge";

/**
 * Very lightweight markdown-to-HTML converter for the subset the agent uses:
 * **bold**, bullet lists, and line breaks.
 * We avoid a full markdown library to keep the bundle small.
 *
 * @param {string} text
 * @returns {string} HTML string
 */
function simpleMarkdown(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^[-•]\s(.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>(\n|$))+/g, (m) => `<ul>${m}</ul>`)
    .replace(/\n/g, "<br/>");
}

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex fade-up ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {/* Agent avatar */}
      {!isUser && (
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1 text-sm"
          style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)" }}
        >
          🌦️
        </div>
      )}

      <div className={`max-w-[78%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-2`}>
        {/* Bubble */}
        <div
          className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
          style={
            isUser
              ? {
                  background: "rgba(251,191,36,0.15)",
                  border: "1px solid rgba(251,191,36,0.25)",
                  color: "#f0f4ff",
                  borderBottomRightRadius: "4px",
                }
              : {
                  background: "rgba(7,30,61,0.85)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#d8e8f8",
                  borderBottomLeftRadius: "4px",
                }
          }
        >
          {isUser ? (
            <span>{message.content}</span>
          ) : (
            <div
              className="agent-prose"
              dangerouslySetInnerHTML={{ __html: simpleMarkdown(message.content) }}
            />
          )}
        </div>

        {/* Tool badges */}
        {!isUser && message.toolsUsed && message.toolsUsed.length > 0 && (
          <div className="flex flex-wrap gap-1 px-1">
            <span className="text-xs" style={{ color: "#4a6a8a" }}>
              Tools used:
            </span>
            {message.toolsUsed.map((t) => (
              <ToolBadge key={t} tool={t} />
            ))}
          </div>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ml-3 mt-1 text-sm font-semibold"
          style={{ background: "rgba(255,255,255,0.08)", color: "#7a9bbf" }}
        >
          U
        </div>
      )}
    </div>
  );
}
