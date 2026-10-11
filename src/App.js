import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { detectIncognito } from "detectincognitojs";

import api from "./api";
import { clearSession, loadSession, saveSession } from "./session";
import { play } from "./sound";
import Scene from "./components/pixel/Scene";
import SoundToggle from "./components/pixel/SoundToggle";
import Mascot from "./components/pixel/Mascot";
import EasterEgg from "./components/EasterEgg";
import Home from "./pages/Home";
import Splash from "./pages/Splash";
import Winner from "./pages/Winner";
import Lobby from "./pages/Lobby";
import Incognito from "./pages/Incognito";
import AdminPage from "./pages/AdminPage";

const POLL_MS = 5000;

const MASCOT_PLACE = {
  incognito: "hidden",
  splash: "hero",
  lobby: "hero",
  home: "header",
  winner: "header",
  admin: "header",
};

const screenMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
};

function App() {
  const [session, setSession] = useState(loadSession);
  const [isIncognito, setIncognito] = useState(false);
  const [game, setGame] = useState({ started: false, finished: false });
  const [easterEgg, setEasterEgg] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const ghostClicks = useRef(0);

  useEffect(() => {
    detectIncognito()
      .then((result) => setIncognito(result.isPrivate))
      .catch(console.error);
  }, []);

  // Keep the game state fresh so every phone follows the admin (waiting,
  // voting open, winners) without reloading.
  useEffect(() => {
    const refresh = () => api.game().then(setGame).catch(console.error);
    refresh();
    const id = setInterval(refresh, POLL_MS);
    return () => clearInterval(id);
  }, []);

  // Check the saved session against the backend: if the user no longer exists
  // (e.g. the database was reset) go back to the login screen; otherwise keep
  // the admin flag up to date.
  useEffect(() => {
    if (!session) return;
    api
      .login(session.passphrase)
      .then((user) => {
        if (user.is_admin !== session.isAdmin || user.id !== session.userID) {
          const updated = { ...session, userID: user.id, isAdmin: user.is_admin };
          saveSession(updated);
          setSession(updated);
        }
      })
      .catch((e) => {
        if (e.message.includes("does not exist")) {
          clearSession();
          setSession(null);
          setAdminOpen(false);
        }
      });
  }, [session]);

  // Every RPG button makes a small "select" sound.
  useEffect(() => {
    const onClick = (e) => e.target.closest?.(".btn:not(:disabled)") && play("select");
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const login = (newSession) => {
    saveSession(newSession);
    setSession(newSession);
  };

  const logout = () => {
    clearSession();
    setSession(null);
    setAdminOpen(false);
  };

  const onGhostClick = () => {
    ghostClicks.current += 1;
    if (ghostClicks.current > 10) {
      ghostClicks.current = 0;
      setEasterEgg(true);
    }
  };

  let screen;
  if (isIncognito) screen = "incognito";
  else if (!session) screen = "splash";
  else if (adminOpen && session.isAdmin) screen = "admin";
  else if (game.finished) screen = "winner";
  else if (!game.started) screen = "lobby";
  else screen = "home";

  const openAdmin = session?.isAdmin ? () => setAdminOpen(true) : undefined;
  const pages = {
    incognito: <Incognito />,
    splash: <Splash onLogin={login} />,
    lobby: <Lobby session={session} onGameChange={setGame} onOpenAdmin={openAdmin} />,
    home: <Home session={session} onLogout={logout} onOpenAdmin={openAdmin} />,
    winner: <Winner session={session} onOpenAdmin={openAdmin} />,
    admin: <AdminPage session={session} game={game} onGameChange={setGame} onClose={() => setAdminOpen(false)} />,
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="app">
        <Scene />
        <SoundToggle />
        <Mascot place={MASCOT_PLACE[screen]} onClick={screen === "splash" ? onGhostClick : undefined} />
        <AnimatePresence mode="wait">
          <motion.div key={screen} {...screenMotion}>
            {pages[screen]}
          </motion.div>
        </AnimatePresence>
        <EasterEgg open={easterEgg} onClose={() => setEasterEgg(false)} />
      </div>
    </MotionConfig>
  );
}

export default App;
