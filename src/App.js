import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { detectIncognito } from "detectincognitojs";

import api from "./api";
import { clearSession, loadSession, saveSession } from "./session";
import Scene from "./components/pixel/Scene";
import Mascot from "./components/pixel/Mascot";
import EasterEgg from "./components/EasterEgg";
import Home from "./pages/Home";
import Splash from "./pages/Splash";
import Winner from "./pages/Winner";
import Lobby from "./pages/Lobby";
import Incognito from "./pages/Incognito";

const POLL_MS = 5000;

const MASCOT_PLACE = {
  incognito: "hidden",
  splash: "hero",
  lobby: "hero",
  home: "header",
  winner: "header",
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

  const login = (newSession) => {
    saveSession(newSession);
    setSession(newSession);
  };

  const logout = () => {
    clearSession();
    setSession(null);
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
  else if (game.finished) screen = "winner";
  else if (!game.started) screen = "lobby";
  else screen = "home";

  const pages = {
    incognito: <Incognito />,
    splash: <Splash onLogin={login} />,
    lobby: <Lobby isAdmin={session?.isAdmin} onGameChange={setGame} />,
    home: <Home session={session} onLogout={logout} game={game} onGameChange={setGame} />,
    winner: <Winner session={session} game={game} onGameChange={setGame} />,
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="app">
        <Scene />
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
