/**
 * App.jsx
 * Root component — composes Starfield, chat window, suggestion chips,
 * message list, typing indicator, and input bar into a cohesive UI.
 */

import React, { useEffect, useRef } from "react";
import Starfield from "./components/Starfield";
import MessageBubble from "./components/MessageBubble";
import TypingIndicator from "./components/TypingIndicator";
import ChatInput from "./components/ChatInput";
import SuggestionChips from "./components/SuggestionChips";
import { useChat } from "./hooks/useChat";

export default function App() {
  const { messages, loading, error, send, clearChat } = useChat();
  const bottomRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const isEmpty = messages.length === 0;

  return (
    <div className="relative flex flex-col h-screen overflow-hidden" style={{ background: "var(--bg-deep)" }}>
      {/* Animated star background */}
      <Starfield />

      {/* Ambient gradient orb */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: "-20%",
          right: "-10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: "-15%",
          left: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(26,74,138,0.2) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header
        className="relative z-10 flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.25)" }}
          >
            🌦️
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide" style={{ fontFamily: "'Playfair Display', serif", color: "#f0f4ff" }}>
              Veyn Agent
            </h1>
            <p className="text-xs" style={{ color: "#4a6a8a" }}>
              OpenWeatherMap
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="text-xs px-3 py-1 rounded-lg transition-all duration-150"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#4a6a8a",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#f0f4ff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#4a6a8a"; }}
          >
            Clear chat
          </button>
        )}
      </header>

      {/* ── Chat body ──────────────────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 py-6">
        {isEmpty ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full gap-8 fade-up">
            <div className="text-center">
              <div className="text-5xl mb-4">🌍</div>
              <h2
                className="text-2xl font-semibold mb-2"
                style={{ fontFamily: "'Playfair Display', serif", color: "#f0f4ff" }}
              >
                Ask me about the weather
              </h2>
              <p className="text-sm" style={{ color: "#4a6a8a" }}>
                Current conditions, forecasts, air quality — anywhere in the world.
              </p>
            </div>
            <SuggestionChips onSelect={send} />
          </div>
        ) : (
          /* Message list */
          <div className="max-w-2xl mx-auto">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {loading && <TypingIndicator />}

            {/* Error banner */}
            {error && (
              <div
                className="mx-2 mb-4 px-4 py-3 rounded-xl text-sm fade-up"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  color: "#fca5a5",
                }}
              >
                ⚠️ {error}
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </main>

      {/* ── Input bar ─────────────────────────────────────────────────────── */}
      <footer
        className="relative z-10 px-4 pb-5 pt-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-2xl mx-auto">
          <ChatInput onSend={send} loading={loading} />
          <p className="text-center text-xs mt-2" style={{ color: "#2a4a6a" }}>
            WeatherAgent may make mistakes. Verify critical forecasts with official sources.
          </p>
        </div>
      </footer>
    </div>
  );
}
