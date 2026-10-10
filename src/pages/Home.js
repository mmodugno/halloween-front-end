import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

import api from "../api";
import { loadVotedIds, saveVotedIds } from "../session";
import PixelSprite from "../components/pixel/PixelSprite";
import { heart } from "../components/pixel/sprites";
import Toast, { useToast } from "../components/pixel/Toast";
import CandidateRow from "../components/CandidateRow";
import VoteSheet from "../components/VoteSheet";
import Admin from "../components/Admin";
import LiveFeed, { LatestMessage } from "../components/LiveFeed";

const FEED_POLL_MS = 5000;

const list = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } };

function VoteMeter({ left, used }) {
  const slots = [...Array(left + used)].map((_, i) => i < left);
  return (
    <div className="vote-meter" aria-hidden="true">
      {slots.map((available, i) => (
        <span key={i} className={`vote-meter__slot ${available ? "" : "vote-meter__slot--used"}`}>
          <PixelSprite sprite={heart} scale={4} />
        </span>
      ))}
    </div>
  );
}

const Home = ({ session, onLogout, onFinished }) => {
  const { passphrase, userID, isAdmin } = session;
  const [candidates, setCandidates] = useState([]);
  const [votedIds, setVotedIds] = useState(() => loadVotedIds(userID));
  const [pendingVotes, setPendingVotes] = useState(null);
  const [voting, setVoting] = useState(null);
  const [feed, setFeed] = useState([]);
  const [toast, showToast, hideToast] = useToast();

  const loadFeed = useCallback(() => api.feed().then(setFeed).catch(console.error), []);

  useEffect(() => {
    loadFeed();
    const id = setInterval(loadFeed, FEED_POLL_MS);
    return () => clearInterval(id);
  }, [loadFeed]);

  useEffect(() => {
    api.users().then(setCandidates).catch(console.error);
    // The backend is the source of truth for how many votes are left.
    api
      .login(passphrase)
      .then((user) => setPendingVotes(user.pending_votes))
      .catch(console.error);
  }, [passphrase]);

  const updateVotedIds = (change) =>
    setVotedIds((ids) => {
      const updated = change(ids);
      saveVotedIds(userID, updated);
      return updated;
    });

  const undo = async (candidate) => {
    hideToast();
    try {
      await api.undoVote(passphrase, candidate.id);
    } catch (e) {
      showToast(e.message.includes("too late") ? "Ya pasó el tiempo para deshacer ese voto." : "No se pudo deshacer el voto.");
      return;
    }
    updateVotedIds((ids) => ids.filter((id) => id !== candidate.id));
    setPendingVotes((n) => n + 1);
    loadFeed();
    showToast(`Deshiciste el voto a ${candidate.costume}`);
  };

  // Returns true when the vote went through, so the sheet knows to close.
  const vote = async (candidate, message) => {
    try {
      await api.vote(passphrase, candidate.id, message);
    } catch (e) {
      let text = "No se pudo votar. Probá de nuevo en un ratito.";
      if (e.message.includes("has already voted")) text = "Ese voto ya estaba hecho.";
      if (e.message.includes("voting is closed")) text = "La votación está cerrada.";
      showToast(text);
      return false;
    }
    updateVotedIds((ids) => [...ids, candidate.id]);
    setPendingVotes((n) => Math.max(n - 1, 0));
    setVoting(null);
    loadFeed();
    showToast(`Votaste a ${candidate.costume}`, {
      tone: "success",
      action: { label: "Deshacer", onClick: () => undo(candidate) },
    });
    return true;
  };

  const loaded = pendingVotes !== null;
  const done = loaded && pendingVotes === 0;

  return (
    <main className="screen stack">
      <header className="home-header">
        <h1>Mejor disfraz</h1>
      </header>

      {loaded && (
        <div className="vote-status">
          <span>{done ? "Sin votos" : pendingVotes === 1 ? "Te queda 1 voto" : `Te quedan ${pendingVotes} votos`}</span>
          <VoteMeter left={pendingVotes} used={votedIds.length} />
        </div>
      )}

      <LatestMessage item={feed[0]} />

      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div key="done" className="panel panel--mint" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <p>Listo, ya usaste tus votos.</p>
            <p className="muted">Los ganadores aparecen acá cuando se cierre la votación.</p>
          </motion.div>
        ) : (
          <motion.p key="intro" className="muted" exit={{ opacity: 0 }}>
            {loaded
              ? `Elegí ${pendingVotes === 1 ? "1 disfraz más" : `hasta ${pendingVotes} disfraces`} y dejales un mensajito.`
              : "Cargando disfraces…"}
          </motion.p>
        )}
      </AnimatePresence>

      {candidates.length > 0 && (
        <motion.ul className="candidate-list" variants={list} initial="hidden" animate="show">
          {candidates.map((candidate, index) => (
            <CandidateRow
              key={candidate.id}
              candidate={candidate}
              index={index}
              isSelf={candidate.id === userID}
              voted={votedIds.includes(candidate.id)}
              canVote={loaded && pendingVotes > 0}
              onVote={setVoting}
            />
          ))}
        </motion.ul>
      )}

      <LiveFeed items={feed} />

      {isAdmin && <Admin onFinished={onFinished} />}

      <div style={{ textAlign: "center" }}>
        <button type="button" className="link" onClick={onLogout}>
          Salir
        </button>
      </div>

      <VoteSheet candidate={voting} onClose={() => setVoting(null)} onVote={vote} />
      <Toast toast={toast} />
    </main>
  );
};

export default Home;
