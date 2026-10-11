import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../api";

const NO_VOTES_PHRASES = [
  "Tranqui! Capaz no te votaron porque todavía están tratando de entender qué sos...",
  "Bueno che, parece que te disfrazaste del hombre invisible.",
  "Que la sigan chupando viejo.",
  "Te juro que ni se dieron cuenta que estabas disfrazado.",
  "¿Estabas disfrazado de fantasma o qué?",
  "Capaz que te confundieron con la decoración...",
  "No te votó ni tu mamá, che.",
  "Capaz tu disfraz es tan avanzado que los demás no están listos para entenderlo.",
  "Capaz la gente tiene mal gusto, pero el tuyo es peor.",
  "Bueno, ya sabes de qué NO disfrazarte la próxima fiesta.",
];

const pickPhrase = () => NO_VOTES_PHRASES[Math.floor(Math.random() * NO_VOTES_PHRASES.length)];

const list = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 2.2 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

// Shows a (non admin) user the votes and messages their costume received.
export default function MyVotes({ session }) {
  const { passphrase, costumeID } = session;
  const [votes, setVotes] = useState(null);
  const [phrase] = useState(pickPhrase);

  useEffect(() => {
    api
      .messages(passphrase, costumeID)
      .then(setVotes)
      .catch((e) => {
        console.error(e);
        setVotes([]);
      });
  }, [passphrase, costumeID]);

  if (!costumeID) return null;
  if (votes === null) return null;

  if (!votes.length) {
    return (
      <motion.section className="panel stack" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 2.2 } }}>
        <h2>No recibiste votos</h2>
        <p className="muted">{phrase}</p>
      </motion.section>
    );
  }

  return (
    <section className="stack">
      <h2>
        Recibiste {votes.length} {votes.length === 1 ? "voto" : "votos"}
      </h2>
      <motion.ul className="bubble-list" variants={list} initial="hidden" animate="show">
        {votes.map((vote, i) => (
          <motion.li key={i} variants={item} className="panel bubble">
            <p className="bubble__from">{vote.user}</p>
            <p>{vote.message || <span className="muted">Te votó sin dejar mensaje.</span>}</p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
