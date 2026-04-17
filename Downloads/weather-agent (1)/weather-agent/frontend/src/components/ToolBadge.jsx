/**
 * ToolBadge.jsx
 * Small pill showing which MCP tool the agent called.
 * Helps users understand what happened "under the hood".
 */

import React from "react";

const TOOL_LABELS = {
  get_current_weather: { label: "Current Weather", icon: "🌡️" },
  get_weather_forecast: { label: "Forecast", icon: "📅" },
  get_air_quality: { label: "Air Quality", icon: "💨" },
};

export default function ToolBadge({ tool }) {
  const info = TOOL_LABELS[tool] || { label: tool, icon: "🔧" };
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono"
      style={{
        background: "rgba(251,191,36,0.12)",
        border: "1px solid rgba(251,191,36,0.3)",
        color: "#fcd34d",
      }}
    >
      <span>{info.icon}</span>
      {info.label}
    </span>
  );
}
