import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import api from "../api";
import { joinNames, saveSession, saveSignup, sessionFor } from "../session";
import { copy, share } from "../clipboard";
import { play } from "../sound";
import DialogBox from "../components/pixel/DialogBox";

const MAX_PARTNERS = 8;

// Lowercase, no accents, single spaces: "  Brujá  del Bosque" -> "bruja del bosque".
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim();

const ERRORS = [
  ["registration is closed", "La inscripción ya cerró. Pedile a quien organiza que te anote."],
  ["too many sign-ups", "Hubo muchas inscripciones seguidas desde esta conexión. Probá de nuevo en unos minutos."],
  ["already in this costume", "En ese grupo ya hay alguien con ese nombre. Si ya te anotaron, pediles tu contraseña."],
  ["listed twice", "Hay un nombre repetido."],
  ["too long", "Algún nombre es muy largo."],
  ["guest list is full", "La lista de invitados está llena."],
  ["costume not found", "Ese disfraz ya no existe. Anotate con uno nuevo."],
];
const friendly = (message) =>
  ERRORS.find(([key]) => message.includes(key))?.[1] || "No se pudo completar la inscripción. Probá de nuevo.";

const reveal = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

// Sign-up form: costume, your name and, if you share the costume, the names
// of the others. Everyone gets their own password; you see all of them at
// the end so you can pass them on.
export default function Register({ onLogin, onCancel }) {
  const [costumes, setCostumes] = useState([]);
  const [costume, setCostume] = useState("");
  const [joining, setJoining] = useState(null); // existing costume we're joining
  const [name, setName] = useState("");
  const [shared, setShared] = useState(false);
  const [partners, setPartners] = useState([""]);
  const [sameName, setSameName] = useState(null); // existing costume with the exact name typed
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const shake = useAnimationControls();

  useEffect(() => {
    api.costumes().then(setCostumes).catch(console.error);
  }, []);

  const typed = norm(costume);
  const suggestions = useMemo(
    () => (joining || typed.length < 3 ? [] : costumes.filter((c) => norm(c.name).includes(typed)).slice(0, 3)),
    [costumes, joining, typed],
  );

  const fail = (text) => {
    setError(text);
    play("error");
    shake.start({ x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.4 } });
  };

  const join = (c) => {
    setJoining(c);
    setSameName(null);
    setError("");
  };

  const send = async (joinTarget) => {
    const others = shared ? partners.map((p) => p.trim()).filter(Boolean) : [];
    setSending(true);
    setSameName(null);
    try {
      const res = await api.register({
        costume: costume.trim(),
        costume_id: joinTarget?.id || 0,
        name: name.trim(),
        partners: others,
      });
      const me = res.users[0];
      const session = sessionFor(me.pw_code, me);
      // Saved right away, so closing the page now doesn't lose the password.
      saveSession(session);
      saveSignup(res);
      play("confirm");
      setResult({ ...res, session });
    } catch (e) {
      console.error(e);
      fail(friendly(e.message));
    }
    setSending(false);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!joining && !costume.trim()) return fail("Contanos de qué te disfrazás.");
    if (!name.trim()) return fail("Falta tu nombre.");
    const twin = !joining && costumes.find((c) => norm(c.name) === typed);
    if (twin) {
      setSameName(twin);
      return;
    }
    joinAndSend(joining);
  };

  // You can't join a costume where someone already signed you up.
  const joinAndSend = (target) => {
    if (target) join(target);
    if (target?.members.some((m) => norm(m) === norm(name))) {
      return fail(`Ya te anotaron en ${target.name}. Pedile tu contraseña a quien te anotó.`);
    }
    send(target);
  };

  if (result) return <Done result={result} onLogin={onLogin} />;

  const setPartner = (i, value) => setPartners((list) => list.map((p, j) => (j === i ? value : p)));

  return (
    <main className="screen stack" style={{ paddingTop: "calc(14vh + 140px)" }}>
      <h1>Anotate</h1>
      <DialogBox lines={["Contanos de qué te disfrazás.", "Si van en grupo, anotá también a los demás."]} />

      <motion.form animate={shake} onSubmit={submit} className="panel stack" noValidate>
        {joining ? (
          <div className="join-pick">
            <p className="muted">Te sumás al disfraz</p>
            <p className="candidate__costume">{joining.name}</p>
            <p className="candidate__name">con {joinNames(joining.members)}</p>
            <button type="button" className="link" onClick={() => setJoining(null)}>
              No, es otro disfraz
            </button>
          </div>
        ) : (
          <label className="field">
            <span>¿De qué te disfrazás?</span>
            <input
              className="input"
              value={costume}
              onChange={(e) => {
                setCostume(e.target.value);
                setSameName(null);
                setError("");
              }}
              maxLength={60}
              placeholder="ej: Bruja del bosque"
              autoComplete="off"
            />
          </label>
        )}

        <AnimatePresence initial={false}>
          {suggestions.length > 0 && (
            <motion.div {...reveal} className="suggestions" aria-live="polite">
              <p className="muted">¿Es tu grupo?</p>
              {suggestions.map((c) => (
                <div key={c.id} className="suggestion">
                  <div style={{ minWidth: 0 }}>
                    <p className="candidate__costume">{c.name}</p>
                    <p className="candidate__name">{joinNames(c.members)}</p>
                  </div>
                  <button type="button" className="btn btn--quiet" onClick={() => join(c)}>
                    Sumarme
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <label className="field">
          <span>Tu nombre</span>
          <input
            className="input"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            maxLength={40}
            placeholder="Como te conocen en la fiesta"
            autoComplete="given-name"
          />
        </label>

        <label className="check">
          <input type="checkbox" checked={shared} onChange={(e) => setShared(e.target.checked)} />
          <span>{joining ? "Anoto a alguien más del grupo" : "Comparto el disfraz con otras personas"}</span>
        </label>

        <AnimatePresence initial={false}>
          {shared && (
            <motion.div {...reveal} className="stack partners">
              <p className="muted">
                Cada uno va a tener su contraseña para votar, pero no van a poder votar a su propio disfraz.
              </p>
              {partners.map((p, i) => (
                <div key={i} className="partner">
                  <input
                    className="input"
                    value={p}
                    onChange={(e) => setPartner(i, e.target.value)}
                    maxLength={40}
                    placeholder={`Nombre de la persona ${i + 1}`}
                    aria-label={`Nombre de la persona ${i + 1}`}
                    autoComplete="off"
                  />
                  {partners.length > 1 && (
                    <button
                      type="button"
                      className="btn btn--quiet partner__remove"
                      onClick={() => setPartners((list) => list.filter((_, j) => j !== i))}
                      aria-label={`Sacar a la persona ${i + 1}`}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              {partners.length < MAX_PARTNERS && (
                <div>
                  <button type="button" className="link" onClick={() => setPartners((list) => [...list, ""])}>
                    + Otra persona
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}

        {sameName ? (
          <div className="panel stack" role="alert">
            <p>
              Ya hay alguien disfrazado de <strong>{sameName.name}</strong> ({joinNames(sameName.members)}). ¿Son el mismo grupo?
            </p>
            <div className="admin__actions">
              <button type="button" className="btn" disabled={sending} onClick={() => joinAndSend(sameName)}>
                Sí, sumarme
              </button>
              <button type="button" className="btn btn--quiet" disabled={sending} onClick={() => send(null)}>
                No, es otro
              </button>
            </div>
          </div>
        ) : (
          <button type="submit" className="btn btn--block" disabled={sending}>
            {sending ? <span className="loading-dots">Anotando</span> : "Anotarme"}
          </button>
        )}
      </motion.form>

      <div style={{ textAlign: "center" }}>
        <button type="button" className="link" onClick={onCancel}>
          Ya tengo contraseña
        </button>
      </div>
    </main>
  );
}

// After signing up: your password, big, and the others' so you can send them.
function Done({ result, onLogin }) {
  const [me, ...others] = result.users;
  const [note, setNote] = useState("");
  const link = window.location.origin;

  const copyMine = async () => setNote((await copy(me.pw_code)) ? "Copiada" : "No se pudo copiar");
  const send = async (u) => {
    const text = `Hola ${u.name}! Te anoté en la Noche de disfraces como ${result.costume.name}. Tu contraseña para votar es ${u.pw_code} y se entra en ${link}`;
    const how = await share(text);
    if (how === "copied") setNote(`Copiaste el mensaje para ${u.name}`);
    if (how === "failed") setNote("No se pudo copiar");
  };

  return (
    <main className="screen stack" style={{ paddingTop: "calc(14vh + 140px)" }}>
      <h1>¡Listo, {me.name}!</h1>
      <DialogBox lines={[`Ya estás en la lista: ${result.costume.name}.`, "Guardá tu contraseña: la vas a usar para votar."]} />

      <section className="panel stack code-card">
        <p className="muted">Tu contraseña</p>
        <p className="code-card__code">{me.pw_code}</p>
        <div>
          <button type="button" className="btn btn--quiet" onClick={copyMine}>
            Copiar
          </button>
        </div>
      </section>

      {others.length > 0 && (
        <section className="panel stack">
          <h2 className="admin__subtitle">Pasales su contraseña</h2>
          <p className="muted">Cada uno entra con la suya. También las vas a ver en la pantalla de espera.</p>
          <ul className="guest-list">
            {others.map((u) => (
              <li key={u.id} className="guest">
                <div className="guest__info">
                  <p className="candidate__costume">{u.name}</p>
                  <p className="guest__code-text">{u.pw_code}</p>
                </div>
                <button type="button" className="btn btn--quiet" onClick={() => send(u)}>
                  Enviar
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="muted" aria-live="polite" style={{ textAlign: "center", minHeight: "1.5em" }}>
        {note}
      </p>

      <button type="button" className="btn btn--block" onClick={() => onLogin(result.session)}>
        Entrar
      </button>
    </main>
  );
}
