import React, { useState } from "react";
import LoadError from "./LoadError";
import useAdminData from "../../hooks/useAdminData";

const POLL_MS = 5000;

// Every message as soon as it's written (before it reaches the public live
// board), so the admin can hide one in time. Hidden messages still count as votes.
export default function MessagesTab({ admin, toast }) {
  const { data: messages, error: loadError, load } = useAdminData(admin.messages, POLL_MS);
  const [busy, setBusy] = useState(null);

  const toggle = async (m) => {
    setBusy(m.id);
    try {
      await admin.setMessageHidden(m.id, !m.hidden);
      toast(m.hidden ? "El mensaje vuelve al tablero" : "Mensaje oculto del tablero", "success");
      await load();
    } catch (e) {
      toast(`No se pudo: ${e.message}`);
    }
    setBusy(null);
  };

  if (loadError && messages === null) return <LoadError error={loadError} onRetry={load} />;
  if (messages === null) return null;

  return (
    <div className="stack">
      <p className="muted">
        Acá ves cada mensaje apenas se escribe. En el tablero público aparecen unos minutos después, así que podés ocultar uno
        antes de que alguien lo vea. Ocultarlo no anula el voto.
      </p>
      <section className="panel">
        {messages.length === 0 ? (
          <p className="muted">Todavía no hay mensajes.</p>
        ) : (
          <ul className="guest-list">
            {messages.map((m) => (
              <li key={m.id} className={`guest ${m.hidden ? "message--hidden" : ""}`}>
                <div className="guest__info">
                  <p className="bubble__from">
                    Para {m.costume}, de {m.author || "alguien que ya no está"}
                  </p>
                  <p className="message__text">{m.message}</p>
                  <p className="guest__meta">
                    <span className={`tag ${m.hidden ? "tag--rose" : m.published ? "tag--mint" : ""}`}>
                      {m.hidden ? "Oculto" : m.published ? "En el tablero" : "Por publicarse"}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  className={`btn ${m.hidden ? "btn--quiet" : "btn--danger"}`}
                  onClick={() => toggle(m)}
                  disabled={busy === m.id}
                >
                  {m.hidden ? "Mostrar" : "Ocultar"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
