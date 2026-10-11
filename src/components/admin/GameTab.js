import React, { useEffect, useState } from "react";
import { copy } from "../../clipboard";
import ConfirmSheet from "./ConfirmSheet";

const PHASES = [
  { id: "waiting", label: "En espera", state: { started: false, finished: false } },
  { id: "open", label: "Votación abierta", state: { started: true, finished: false } },
  { id: "results", label: "Ganadores", state: { started: true, finished: true } },
];

const phaseOf = (game) => (game.finished ? "results" : game.started ? "open" : "waiting");

// What each move does, phrased for the buttons and the confirmation.
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

// Who can sign up on their own, and how many votes they get.
function Registration({ admin, game, onGameChange, toast }) {
  const [votes, setVotes] = useState(game.votes_per_user ?? 2);
  const [busy, setBusy] = useState(false);
  useEffect(() => setVotes(game.votes_per_user ?? 2), [game.votes_per_user]);
  const closedByVote = game.started || game.finished;
  const open = game.registration_open && !closedByVote;

  const save = async (settings) => {
    setBusy(true);
    try {
      onGameChange(
        await admin.setRegistration({ registration_open: game.registration_open, votes_per_user: votes, ...settings }),
      );
      toast("Inscripción actualizada", "success");
    } catch (e) {
      toast(`No se pudo: ${e.message}`);
    }
    setBusy(false);
  };

  const link = window.location.origin;
  let status = "Cerrada: solo vos podés agregar invitados.";
  if (open) status = "Abierta: cualquiera con el link se puede anotar con su disfraz.";
  else if (closedByVote && game.registration_open)
    status = "Se cerró sola porque arrancó la votación. Si volvés a la espera, se reabre.";

  return (
    <section className="panel stack">
      <h2 className="admin__subtitle">Inscripción</h2>
      <p>
        <span className={`tag ${open ? "tag--mint" : "tag--rose"}`}>{open ? "Abierta" : "Cerrada"}</span>
      </p>
      <p className="muted">{status}</p>
      <p className="join__url">{window.location.host}</p>
      <div className="admin__actions">
        <button
          type="button"
          className="btn btn--quiet"
          onClick={async () => toast((await copy(link)) ? "Copiaste el link" : "No se pudo copiar")}
        >
          Copiar link para invitar
        </button>
        <button
          type="button"
          className="btn btn--quiet"
          disabled={busy}
          onClick={() => save({ registration_open: !game.registration_open })}
        >
          {game.registration_open ? "Cerrar inscripción" : "Abrir inscripción"}
        </button>
      </div>
      <label className="field">
        <span>Votos para cada persona que se anota</span>
        <span className="admin__actions">
          <input
            className="input input--short"
            type="number"
            min={0}
            max={20}
            value={votes}
            onChange={(e) => setVotes(Math.max(0, Number(e.target.value)))}
          />
          {votes !== game.votes_per_user && (
            <button type="button" className="btn" disabled={busy} onClick={() => save({})}>
              Guardar
            </button>
          )}
        </span>
      </label>
    </section>
  );
}

export default function GameTab({ admin, game, onGameChange, toast }) {
  const [target, setTarget] = useState(null);
  const [resetting, setResetting] = useState(false);
  const [votesPerUser, setVotesPerUser] = useState(2);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState({ cast: 0, possible: 0 });

  const current = phaseOf(game);

  useEffect(() => {
    const load = () =>
      Promise.all([admin.results(), admin.users()])
        .then(([results, users]) => {
          const cast = results.reduce((acc, row) => acc + row.votes_count, 0);
          setProgress({ cast, possible: cast + users.reduce((acc, u) => acc + u.pending_votes, 0) });
        })
        .catch(console.error);
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, [admin]);

  const run = async (fn, done) => {
    setBusy(true);
    try {
      await fn();
      done();
    } catch (e) {
      console.error(e);
      toast(`No se pudo: ${e.message}`);
    }
    setBusy(false);
  };

  const move = target && transition(current, target);
  const percent = progress.possible ? Math.round((progress.cast / progress.possible) * 100) : 0;

  return (
    <div className="stack">
      <section className="panel stack">
        <h2 className="admin__subtitle">Qué ven todos ahora</h2>
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
      </section>

      <Registration admin={admin} game={game} onGameChange={onGameChange} toast={toast} />

      <section className="panel stack">
        <h2 className="admin__subtitle">Pantalla grande</h2>
        <p className="muted">
          Para la tele o el proyector: muestra el QR para entrar, los mensajes en vivo y, al final, revela a los ganadores. Se
          actualiza sola toda la noche.
        </p>
        <p className="join__url">{window.location.host}/pantalla</p>
        <div>
          <a className="btn btn--quiet" href="/pantalla" target="_blank" rel="noreferrer">
            Abrir pantalla grande
          </a>
        </div>
      </section>

      <section className="panel stack">
        <h2 className="admin__subtitle">Votos</h2>
        <p>
          {progress.cast} de {progress.possible} votos usados
        </p>
        <div className="progress" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress__fill" style={{ width: `${percent}%` }} />
        </div>
      </section>

      <section className="panel stack">
        <h2 className="admin__subtitle">Empezar de cero</h2>
        <p className="muted">Borra todos los votos y mensajes, y le da a cada invitado la misma cantidad de votos.</p>
        <label className="field">
          <span>Votos por invitado</span>
          <input
            className="input input--short"
            type="number"
            min={0}
            max={20}
            value={votesPerUser}
            onChange={(e) => setVotesPerUser(Math.max(0, Number(e.target.value)))}
          />
        </label>
        <div>
          <button type="button" className="btn btn--danger" onClick={() => setResetting(true)}>
            Borrar todos los votos
          </button>
        </div>
      </section>

      <ConfirmSheet
        open={Boolean(target)}
        title={move ? `¿${move.action}?` : ""}
        detail={move?.detail}
        action={move?.action}
        danger={move?.danger}
        busy={busy}
        onClose={() => setTarget(null)}
        onConfirm={() =>
          run(
            async () => onGameChange(await admin.setGame(PHASES.find((p) => p.id === target).state)),
            () => setTarget(null),
          )
        }
      />
      <ConfirmSheet
        open={resetting}
        title="¿Borrar todos los votos?"
        detail={`Se borran todos los votos y mensajes, y cada invitado vuelve a tener ${votesPerUser} ${votesPerUser === 1 ? "voto" : "votos"}. No se puede deshacer.`}
        action="Borrar todos los votos"
        danger
        busy={busy}
        onClose={() => setResetting(false)}
        onConfirm={() =>
          run(
            () => admin.resetVotes(votesPerUser),
            () => {
              setResetting(false);
              toast("Votos borrados. Todos empiezan de cero.", "success");
            },
          )
        }
      />
    </div>
  );
}
