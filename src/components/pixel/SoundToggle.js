import React, { useEffect, useState } from "react";
import { isSoundOn, onSoundChange, setSoundOn } from "../../sound";

// Small fixed button to mute or unmute the game sounds.
export default function SoundToggle() {
  const [on, setOn] = useState(isSoundOn);
  useEffect(() => onSoundChange(setOn), []);
  return (
    <button
      type="button"
      className="sound-toggle"
      onClick={() => setSoundOn(!on)}
      aria-pressed={on}
      aria-label={on ? "Silenciar sonidos" : "Activar sonidos"}
    >
      <svg viewBox="0 0 9 8" width="27" height="24" shapeRendering="crispEdges" aria-hidden="true">
        <path d="M0 3h2v2H0zM2 2h1v4H2zM3 1h1v6H3zM4 0h1v8H4z" fill="currentColor" />
        {on ? (
          <path d="M6 2h1v1H6zM6 5h1v1H6zM7 3h1v2H7zM8 1h1v1H8zM8 6h1v1H8z" fill="currentColor" />
        ) : (
          <path d="M6 2h1v1H6zM7 3h1v1H7zM8 4h1v1H8zM8 2h1v1H8zM6 5h1v1H6zM7 4h1v1H7z" fill="currentColor" opacity="0.6" />
        )}
      </svg>
    </button>
  );
}
