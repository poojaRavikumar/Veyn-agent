/**
 * SuggestionChips.jsx
 * Quick-start prompts shown in the empty state to guide new users.
 */

import React from "react";

const SUGGESTIONS = [
  "What's the weather in Tokyo right now?",
  "Give me a 5-day forecast for New York",
  "Is the air quality good in London today?",
  "Compare weather in Paris vs Rome",
  "Should I go hiking in Denver this weekend?",
  "What's the humidity like in Miami?",
];

export default function SuggestionChips({ onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
      {SUGGESTIONS.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className="px-3 py-1.5 rounded-full text-xs transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#7a9bbf",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(251,191,36,0.1)";
            e.currentTarget.style.borderColor = "rgba(251,191,36,0.3)";
            e.currentTarget.style.color = "#fcd34d";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            e.currentTarget.style.color = "#7a9bbf";
          }}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
