import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

export function timeAgo(date, now = Date.now()) {
  const minutes = Math.floor((now - new Date(date).getTime()) / 60000);
  if (minutes < 1) return "recién";
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return hours === 1 ? "hace 1 hora" : `hace ${hours} horas`;
}

// The newest message, shown near the top. Tapping it jumps to the full board.
export function LatestMessage({ item }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {item && (
        <motion.a
          key={item.id}
          href="#mensajes"
          className="latest"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease } }}
          exit={{ opacity: 0, y: -14, transition: { duration: 0.3, ease } }}
        >
          <span className="latest__label">
            <span className="live-dot" aria-hidden="true" /> Último mensaje para {item.costume}
          </span>
          <span className="latest__text">“{item.message}”</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}

// Anonymous messages that show up as people vote during the night.
export default function LiveFeed({ items }) {
  return (
    <section id="mensajes" className="stack" aria-labelledby="feed-title">
      <div className="feed-header">
        <h2 id="feed-title">Mensajes en vivo</h2>
        <span className="muted feed-header__hint">Anónimos hasta el final</span>
      </div>
      {items.length === 0 ? (
        <p className="muted">Todavía no hay mensajes. El primer voto estrena el tablero.</p>
      ) : (
        <ul className="bubble-list" aria-live="polite">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.li
                key={item.id}
                layout
                className="panel bubble"
                initial={{ opacity: 0, scale: 0.94, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.45, ease } }}
                exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.25 } }}
              >
                <p className="bubble__from">
                  Para {item.costume} <span className="bubble__time">{timeAgo(item.created_at)}</span>
                </p>
                <p>{item.message}</p>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}
