import React, { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { play } from "../../sound";

const CHAR_MS = 28;

// Pixel asterisk that starts every line (the font's own "*" is too small).
const Star = () => (
  <svg viewBox="0 0 5 5" width="10" height="10" shapeRendering="crispEdges">
    <path d="M0 0h1v1H0zM2 0h1v1H2zM4 0h1v1H4zM1 1h3v1H1zM0 2h5v1H0zM1 3h3v1H1zM0 4h1v1H0zM2 4h1v1H2zM4 4h1v1H4z" fill="currentColor" />
  </svg>
);

// RPG style dialog box: each line starts with "*" and the text types itself
// out with a soft blip. Tapping the box shows the whole text at once.
// `children` (buttons, inputs) fade in once the text is done.
export default function DialogBox({ lines, className = "", children, bare = false }) {
  const reduce = useReducedMotion();
  const text = useMemo(() => lines.filter(Boolean), [lines]);
  const total = text.reduce((acc, line) => acc + line.length, 0);
  const [shown, setShown] = useState(reduce ? total : 0);

  // Start typing again when the text changes.
  const key = text.join("\n");
  useEffect(() => {
    setShown(reduce ? total : 0);
  }, [key, reduce, total]);

  useEffect(() => {
    if (shown >= total) return;
    const id = setTimeout(() => {
      setShown((n) => n + 1);
      if (shown % 3 === 0) play("blip");
    }, CHAR_MS);
    return () => clearTimeout(id);
  }, [shown, total]);

  const done = shown >= total;
  let remaining = shown;

  return (
    <div className={`${bare ? "" : "panel "}dialog ${className}`} onClick={() => setShown(total)}>
      <p className="visually-hidden">{text.join(" ")}</p>
      <div aria-hidden="true">
        {text.map((line, i) => {
          // The hidden rest of the line keeps the box from growing while typing.
          const visible = line.slice(0, Math.max(0, remaining));
          remaining -= line.length;
          return (
            <p key={i} className="dialog__line">
              <span className="dialog__star" style={{ visibility: visible ? "visible" : "hidden" }}>
                <Star />
              </span>
              <span>
                {visible}
                <span style={{ visibility: "hidden" }}>{line.slice(visible.length)}</span>
              </span>
            </p>
          );
        })}
      </div>
      {children && <div className={`dialog__extra ${done ? "dialog__extra--shown" : ""}`}>{children}</div>}
    </div>
  );
}
