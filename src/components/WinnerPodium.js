import React from "react";
import { motion } from "framer-motion";
import PixelSprite from "./pixel/PixelSprite";
import { crown } from "./pixel/sprites";

// Sorts by votes and assigns podium positions; ties share the same position.
export function rankWinners(winners) {
  const sorted = [...winners].sort((a, b) => b.votes_count - a.votes_count);
  let position = 0;
  return sorted.map((winner, i) => {
    if (i === 0 || winner.votes_count !== sorted[i - 1].votes_count) position += 1;
    return { ...winner, position };
  });
}

const HEIGHT = { 1: 170, 2: 120, 3: 86 };
const COLOR = { 1: "var(--pumpkin)", 2: "var(--candle-dim)", 3: "var(--rose)" };
// Blocks rise one after another: third, then second, then first.
const DELAY = { 1: 1.0, 2: 0.6, 3: 0.2 };
const ease = [0.22, 1, 0.36, 1];

function Place({ winner, slot }) {
  if (!winner) return <div />;
  const { position } = winner;
  const delay = DELAY[slot];
  return (
    <div className="podium__place">
      {slot === 1 && (
        <motion.div
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.7, type: "spring", stiffness: 260, damping: 14 }}
        >
          <PixelSprite sprite={crown} scale={5} title="Corona" />
        </motion.div>
      )}
      <motion.div
        className="podium__who"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.5, duration: 0.5, ease }}
      >
        <p className="podium__costume">{winner.costume}</p>
        <p className="podium__name">{winner.name}</p>
      </motion.div>
      <motion.div
        className="podium__block"
        style={{ height: HEIGHT[position] ?? HEIGHT[3], background: COLOR[position] ?? COLOR[3] }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay, duration: 0.8, ease }}
      >
        <span className="podium__rank">{position}</span>
        <span className="podium__votes">
          {winner.votes_count} {winner.votes_count === 1 ? "voto" : "votos"}
        </span>
      </motion.div>
    </div>
  );
}

export default function WinnerPodium({ winners }) {
  const [first, second, third] = rankWinners(winners);
  return (
    <div className="podium">
      <Place winner={second} slot={2} />
      <Place winner={first} slot={1} />
      <Place winner={third} slot={3} />
    </div>
  );
}
