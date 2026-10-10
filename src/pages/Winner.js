import React, { useEffect, useState } from "react";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

import api from "../api";
import Admin from "../components/Admin";
import WinnerPodium from "../components/WinnerPodium";
import MyVotes from "../components/MyVotes";

const CONFETTI_COLORS = ["#f2a65a", "#ffe8c2", "#a8e0c8", "#e58fa0", "#8a78ab"];
const drawPixel = (ctx) => ctx.fillRect(-4, -4, 8, 8);

function Winner({ session, game, onGameChange }) {
  const { width, height } = useWindowSize();
  const [winners, setWinners] = useState(null);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    api
      .winners()
      .then(setWinners)
      .catch((e) => {
        console.error(e);
        setWinners([]);
      });
  }, []);

  // Confetti starts once the first place block has risen.
  useEffect(() => {
    if (!winners?.length) return;
    const id = setTimeout(() => setCelebrate(true), 1800);
    return () => clearTimeout(id);
  }, [winners]);

  return (
    <main className="screen stack" style={{ gap: 28 }}>
      <header className="home-header">
        <h1>Ganadores</h1>
      </header>

      {winners && winners.length === 0 && <p className="muted">Nadie votó, así que no hay podio esta vez.</p>}
      {winners?.length > 0 && <WinnerPodium winners={winners} />}

      {session.isAdmin ? <Admin game={game} onGameChange={onGameChange} /> : <MyVotes userID={session.userID} />}

      {celebrate && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={220}
          recycle={false}
          gravity={0.12}
          colors={CONFETTI_COLORS}
          drawShape={drawPixel}
          style={{ position: "fixed", zIndex: 10, pointerEvents: "none" }}
        />
      )}
    </main>
  );
}

export default Winner;
