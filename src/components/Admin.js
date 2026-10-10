import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

import api from "../api";
import Sheet from "./pixel/Sheet";

const PHASES = [
  { id: "waiting", label: "En espera", state: { started: false, finished: false } },
  { id: "open", label: "Votación abierta", state: { started: true, finished: false } },
  { id: "results", label: "Ganadores", state: { started: true, finished: true } },
];

const phaseOf = (game) => (game.finished ? "results" : game.started ? "open" : "waiting");

// What each move does, phrased for the confirmation sheet.
function transition(from, to) {
  if (to === "results")
    return {
      action: "Cerrar y mostrar ganadores",
      detail: "Nadie más va a poder votar y todos van a ver los ganadores.",
      danger: true,
    };
  if (to === "open")
    return from === "results"
      ? { action: "Reabrir votación", detail: "Todos vuelven a la pantalla para votar. Los votos que ya hay se mantienen." }
      : { action: "Abrir votación", detail: "Todos pasan a la pantalla para votar." };
  return {
    action: "Volver a la espera",
    detail: "Todos vuelven a la pantalla de espera y nadie puede votar. Los votos que ya hay se mantienen.",
  };
}

// Admin tools: move the game between phases, live vote count and results.
const Admin = ({ game, onGameChange }) => {
  const [open, setOpen] = useState(true);
  const [results, setResults] = useState([]);
  const [cast, setCast] = useState(0);
  const [possible, setPossible] = useState(0);
  const [target, setTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const current = phaseOf(game);

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

  const confirm = async () => {
    setSaving(true);
    try {
      const state = await api.setGame(PHASES.find((p) => p.id === target).state);
      setTarget(null);
      onGameChange(state);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const percent = possible ? Math.round((cast / possible) * 100) : 0;
  const move = target && transition(current, target);

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
            <div className="stack" style={{ gap: 10 }}>
              <h3 className="admin__subtitle">Qué ven todos ahora</h3>
              <ol className="phases">
                {PHASES.map((phase) => (
                  <li key={phase.id} className={`phases__step ${phase.id === current ? "phases__step--current" : ""}`}>
                    {phase.label}
                  </li>
                ))}
              </ol>
              <div className="admin__actions">
                {PHASES.filter((p) => p.id !== current).map((phase) => {
                  const t = transition(current, phase.id);
                  return (
                    <button
                      key={phase.id}
                      type="button"
                      className={`btn ${t.danger ? "btn--danger" : "btn--quiet"}`}
                      onClick={() => setTarget(phase.id)}
                    >
                      {t.action}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="stack" style={{ gap: 10 }}>
              <h3 className="admin__subtitle">Votos</h3>
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

            <div>
              <button type="button" className="btn btn--quiet" onClick={load}>
                Actualizar votos
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Sheet open={Boolean(target)} onClose={() => setTarget(null)} labelledBy="phase-title">
        {move && (
          <>
            <h2 id="phase-title">¿{move.action}?</h2>
            <p className="muted">{move.detail}</p>
            <div className="sheet__actions">
              <button type="button" className="btn btn--quiet" onClick={() => setTarget(null)}>
                Cancelar
              </button>
              <button type="button" className={`btn ${move.danger ? "btn--danger" : ""}`} onClick={confirm} disabled={saving}>
                {move.action}
              </button>
            </div>
          </>
        )}
      </Sheet>
    </section>
  );
};

export default Admin;
