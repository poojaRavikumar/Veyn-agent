/**
 * ChatInput.jsx
 * Message input bar with send button. Supports Enter to send,
 * Shift+Enter for newlines, and a disabled state while the agent is thinking.
 */

import React, { useState, useRef, useEffect } from "react";

export default function ChatInput({ onSend, loading }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  }, [value]);

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    <div
      className="flex items-end gap-3 p-3 rounded-2xl"
      style={{
        background: "rgba(7,30,61,0.8)",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(12px)",
      }}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about weather anywhere in the world…"
        rows={1}
        disabled={loading}
        className="flex-1 resize-none bg-transparent outline-none text-sm leading-relaxed placeholder-opacity-40"
        style={{
          color: "#f0f4ff",
          fontFamily: "'DM Sans', sans-serif",
          minHeight: "24px",
          maxHeight: "140px",
        }}
      />

      {/* Send button */}
      <button
        onClick={submit}
        disabled={loading || !value.trim()}
        className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
        style={{
          background:
            loading || !value.trim()
              ? "rgba(255,255,255,0.06)"
              : "rgba(251,191,36,0.85)",
          cursor: loading || !value.trim() ? "not-allowed" : "pointer",
          transform: "none",
        }}
        onMouseEnter={(e) => {
          if (!loading && value.trim()) e.currentTarget.style.transform = "scale(1.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {loading ? (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          </svg>
        ) : (
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            style={{ color: loading || !value.trim() ? "#4a6a8a" : "#03101f" }}
          >
            <path
              d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
