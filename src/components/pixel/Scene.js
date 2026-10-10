import React from "react";
import PixelSprite from "./PixelSprite";
import { moon } from "./sprites";

// Fixed positions so the sky looks the same on every screen and render.
const STARS = [
  [8, 12], [22, 6], [35, 18], [48, 9], [63, 4], [71, 22], [84, 14], [93, 30],
  [15, 34], [41, 38], [57, 28], [78, 44], [5, 52], [30, 58], [66, 60], [90, 56],
];

// Stepped hill silhouette: heights quantized to 6px so it reads as pixel art.
function hillPath(width, height, base, amp, freq, phase, step = 8) {
  let d = `M0 ${height}`;
  for (let x = 0; x <= width; x += step) {
    const y = base - amp * Math.sin(x * freq + phase);
    const snapped = Math.round(y / 6) * 6;
    d += ` L${x} ${snapped} L${x + step} ${snapped}`;
  }
  return `${d} L${width} ${height} Z`;
}

const BACK_HILLS = hillPath(400, 120, 60, 22, 0.018, 1.2);
const FRONT_HILLS = hillPath(400, 120, 88, 14, 0.026, 4.1);

export default function Scene() {
  return (
    <div className="scene" aria-hidden="true">
      <PixelSprite sprite={moon} scale={5} className="scene__moon" />
      {STARS.map(([left, top]) => (
        <span key={`${left}-${top}`} className="scene__star" style={{ left: `${left}%`, top: `${top}%` }} />
      ))}
      <svg className="scene__hills" viewBox="0 0 400 120" preserveAspectRatio="none" shapeRendering="crispEdges">
        <path d={BACK_HILLS} fill="#30254a" />
        <path d={FRONT_HILLS} fill="#1b1428" />
      </svg>
    </div>
  );
}
