import React, { useEffect, useState } from "react";
import Sheet from "./pixel/Sheet";

// Asks for a short message and confirms the vote for one candidate.
export default function VoteSheet({ candidate, onClose, onVote }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setMessage("");
    setError("");
    setSending(false);
  }, [candidate]);

  const submit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError(`Escribile algo a ${candidate.name} antes de votar.`);
      return;
    }
    setSending(true);
    const ok = await onVote(candidate, message.trim());
    if (!ok) setSending(false);
  };

  return (
    <Sheet open={Boolean(candidate)} onClose={onClose} labelledBy="vote-title">
      {candidate && (
        <form className="stack" onSubmit={submit} noValidate>
          <div>
            <h2 id="vote-title">Votar a {candidate.costume}</h2>
            <p className="muted">Disfraz de {candidate.name}</p>
          </div>
          <label htmlFor="vote-message">Dejale un mensajito</label>
          <textarea
            id="vote-message"
            className={`input ${error ? "input--error" : ""}`}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setError("");
            }}
            maxLength={280}
            autoFocus
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "vote-error" : undefined}
          />
          {error && (
            <p id="vote-error" className="field-error" role="alert">
              {error}
            </p>
          )}
          <div className="sheet__actions">
            <button type="button" className="btn btn--quiet" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn" disabled={sending}>
              {sending ? <span className="loading-dots">Votando</span> : "Votar"}
            </button>
          </div>
        </form>
      )}
    </Sheet>
  );
}
