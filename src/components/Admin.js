import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

import api from "../api";
import Sheet from "./pixel/Sheet";

// Admin tools: live vote count, results with messages, and closing the vote.
// Without `onFinished` the vote is already closed and only results are shown.
const Admin = ({ onFinished }) => {
  const [open, setOpen] = useState(true);
  const [results, setResults] = useState([]);
  const [cast, setCast] = useState(0);
  const [possible, setPossible] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [closing, setClosing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [res, users] = await Promise.all([api.results(), api.users()]);
      const votes = res.reduce((acc, row) => acc + row.votes_count, 0);
      setResults(res);
      setCast(votes);
      setPossible(votes + users.reduce((acc, u) => acc + u.pending_votes, 0));
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const closeVote = async () => {
    setClosing(true);
    try {
      await api.finish();
      setConfirming(false);
      onFinished();
    } catch (e) {
      console.error(e);
      setClosing(false);
    }
  };

  const percent = possible ? Math.round((cast / possible) * 100) : 0;

  return (
    <section className="panel stack" aria-labelledby="admin-title">
      <button type="button" className="admin__toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <h2 id="admin-title">Panel de admin</h2>
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="stack"
            style={{ overflow: "hidden" }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <p>
                {cast} de {possible} votos
              </p>
              <div className="progress" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress__fill" style={{ width: `${percent}%` }} />
              </div>
            </div>

            {results.length === 0 ? (
              <p className="muted">Todavía nadie votó.</p>
            ) : (
              <div>
                {results.map((row) => (
                  <div key={row.id} className="result">
                    <div>
                      <p className="candidate__costume">{row.costume}</p>
                      <p className="candidate__name">{row.name}</p>
                    </div>
                    <p className="result__count">{row.votes_count}</p>
                    {row.data?.length > 0 && (
                      <ul className="result__messages">
                        {row.data.map((m, i) => (
                          <li key={i}>
                            {m.user}
                            {m.message ? `: ${m.message}` : ""}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="sheet__actions" style={{ justifyContent: "space-between" }}>
              <button type="button" className="btn btn--quiet" onClick={load}>
                Actualizar
              </button>
              {onFinished && (
                <button type="button" className="btn btn--danger" onClick={() => setConfirming(true)}>
                  Cerrar votación
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Sheet open={confirming} onClose={() => setConfirming(false)} labelledBy="close-vote-title">
        <h2 id="close-vote-title">¿Cerrar la votación?</h2>
        <p className="muted">Nadie más va a poder votar y todos van a ver los ganadores.</p>
        <div className="sheet__actions">
          <button type="button" className="btn btn--quiet" onClick={() => setConfirming(false)}>
            Seguir votando
          </button>
          <button type="button" className="btn btn--danger" onClick={closeVote} disabled={closing}>
            Cerrar votación
          </button>
        </div>
      </Sheet>
    </section>
  );
};

export default Admin;
