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
  const [isStarted, setIsStarted] = useState(false);
  const [voteFinished, setVoteFinished] = useState(false);
  const [easterEgg, setEasterEgg] = useState(false);
  const ghostClicks = useRef(0);

  useEffect(() => {
    detectIncognito()
      .then((result) => setIncognito(result.isPrivate))
      .catch(console.error);
  }, []);

  // Keep the game state fresh so everyone moves on when the admin opens or
  // closes the vote, without reloading.
  useEffect(() => {
    if (voteFinished) return;
    const refresh = () => {
      api.isStarted().then(setIsStarted).catch(console.error);
      api.isFinished().then(setVoteFinished).catch(console.error);
    };
    refresh();
    const id = setInterval(refresh, POLL_MS);
    return () => clearInterval(id);
  }, [voteFinished]);

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
  else if (!isStarted && !voteFinished) screen = "lobby";
  else if (voteFinished) screen = "winner";
  else screen = "home";

  const pages = {
    incognito: <Incognito />,
    splash: <Splash onLogin={login} />,
    lobby: <Lobby isAdmin={session?.isAdmin} onStarted={() => setIsStarted(true)} />,
    home: <Home session={session} onLogout={logout} onFinished={() => setVoteFinished(true)} />,
    winner: <Winner session={session} />,
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
