import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { adminApi } from "../api";
import Toast, { useToast } from "../components/pixel/Toast";
import GameTab from "../components/admin/GameTab";
import GuestsTab from "../components/admin/GuestsTab";
import ResultsTab from "../components/admin/ResultsTab";
import MessagesTab from "../components/admin/MessagesTab";

const TABS = [
  { id: "game", label: "Juego" },
  { id: "guests", label: "Invitados" },
  { id: "messages", label: "Mensajes" },
  { id: "results", label: "Resultados" },
];

// Everything the admin needs to run the party: game state, guests, results.
export default function AdminPage({ session, game, onGameChange, onClose }) {
  const [tab, setTab] = useState("game");
  const [toast, showToast] = useToast();
  const admin = useMemo(() => adminApi(session.passphrase), [session.passphrase]);

  const props = { admin, session, game, onGameChange, toast: showToast };

  return (
    <main className="screen stack">
      <header className="home-header">
        <h1>Panel de admin</h1>
      </header>
      <div>
        <button type="button" className="link" onClick={onClose}>
          ← Volver a la fiesta
        </button>
      </div>

      <div className="tabs" role="tablist" aria-label="Secciones del panel">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            className={`tabs__tab ${tab === t.id ? "tabs__tab--active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
        >
          {tab === "game" && <GameTab {...props} />}
          {tab === "guests" && <GuestsTab {...props} />}
          {tab === "messages" && <MessagesTab {...props} />}
          {tab === "results" && <ResultsTab {...props} />}
        </motion.div>
      </AnimatePresence>

      <Toast toast={toast} />
    </main>
  );
}
