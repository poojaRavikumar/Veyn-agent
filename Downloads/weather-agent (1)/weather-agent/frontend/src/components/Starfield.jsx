/**
 * Starfield.jsx
 * Purely decorative animated star background.
 * Uses CSS custom properties per-star for varied twinkle speed/brightness.
 */

import React, { useMemo } from "react";

export default function Starfield() {
  const stars = useMemo(() => {
    return Array.from({ length: 120 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2.5 + 0.5,
      dur: `${Math.random() * 5 + 3}s`,
      delay: `${Math.random() * 6}s`,
      bright: (Math.random() * 0.5 + 0.2).toFixed(2),
    }));
  }, []);

  return (
    <div className="stars" aria-hidden="true">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            "--dur": s.dur,
            "--delay": s.delay,
            "--bright": s.bright,
          }}
        />
      ))}
    </div>
  );
}
