import React, { Suspense, lazy, useState, useEffect, useRef } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { detectIncognito } from "detectincognitojs";

import api from "./api";
import { clearSession, loadSession, saveSession, sessionFor } from "./session";
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
// Only admins and the TV need these, so they load on demand.
const AdminPage = lazy(() => import("./pages/AdminPage"));
const BigScreen = lazy(() => import("./pages/BigScreen"));

// The public big screen lives at /pantalla (or /#pantalla).
const IS_SCREEN = /^\/pantalla\/?$/.test(window.location.pathname) || window.location.hash === "#pantalla";

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
  // the admin flag and costume up to date.
  useEffect(() => {
    if (!session) return;
    api
      .login(session.passphrase)
      .then((user) => {
        const updated = sessionFor(session.passphrase, user);
        if (Object.keys(updated).some((key) => updated[key] !== session[key])) {
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

  if (IS_SCREEN) {
    return (
      <MotionConfig reducedMotion="user">
        <div className="app">
          <Scene />
          <Suspense fallback={null}>
            <BigScreen game={game} />
          </Suspense>
        </div>
      </MotionConfig>
    );
  }

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
    splash: <Splash game={game} onLogin={login} />,
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
            <Suspense fallback={null}>{pages[screen]}</Suspense>
          </motion.div>
        </AnimatePresence>
        <EasterEgg open={easterEgg} onClose={() => setEasterEgg(false)} />
      </div>
    </MotionConfig>
  );
}

export default App;
