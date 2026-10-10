import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import PixelSprite from "./pixel/PixelSprite";
import { candidateSprites, heart } from "./pixel/sprites";

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const pop = {
  initial: { scale: 0.4, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 400, damping: 18 } },
};

export default function CandidateRow({ candidate, index, isSelf, voted, canVote, onVote }) {
  const sprite = candidateSprites[index % candidateSprites.length];

  let action;
  if (isSelf) {
    action = <span className="candidate__badge candidate__badge--self">Sos vos</span>;
  } else if (voted) {
    action = (
      <motion.span className="candidate__badge" {...pop}>
        <PixelSprite sprite={heart} scale={3} />
        Votado
      </motion.span>
    );
  } else {
    action = (
      <motion.button type="button" className="btn" disabled={!canVote} onClick={() => onVote(candidate)} exit={{ opacity: 0 }}>
        Votar
      </motion.button>
    );
  }

  return (
    <motion.li variants={item} className={`candidate ${voted ? "candidate--voted" : ""}`}>
      <div className="candidate__sprite">
        <PixelSprite sprite={sprite} scale={3} />
      </div>
      <div style={{ minWidth: 0 }}>
        <p className="candidate__costume">{candidate.costume}</p>
        <p className="candidate__name">{candidate.name}</p>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <React.Fragment key={voted ? "voted" : "vote"}>{action}</React.Fragment>
      </AnimatePresence>
    </motion.li>
  );
}
