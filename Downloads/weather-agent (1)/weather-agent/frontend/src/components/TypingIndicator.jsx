/**
 * TypingIndicator.jsx
 * Animated "agent is thinking" indicator shown while awaiting a response.
 */

import React from "react";

export default function TypingIndicator() {
  return (
    <div className="flex items-start mb-4 fade-up">
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm"
        style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)" }}
      >
        🌦️
      </div>
      <div
        className="px-4 py-3 rounded-2xl"
        style={{
          background: "rgba(7,30,61,0.85)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderBottomLeftRadius: "4px",
        }}
      >
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                background: "#fbbf24",
                opacity: 0.5,
                animation: `pulseSoft 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
          <span className="ml-2 text-xs font-mono" style={{ color: "#4a6a8a" }}>
            WeatherAgent thinking…
          </span>
        </div>
      </div>
    </div>
  );
}
