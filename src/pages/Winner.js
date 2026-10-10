import React, { useEffect, useState } from "react";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

import api from "../api";
import WinnerPodium from "../components/WinnerPodium";
import MyVotes from "../components/MyVotes";
import DialogBox from "../components/pixel/DialogBox";
import { play } from "../sound";

const CONFETTI_COLORS = ["#f2a65a", "#ffe8c2", "#a8e0c8", "#e58fa0", "#8a78ab"];
const drawPixel = (ctx) => ctx.fillRect(-4, -4, 8, 8);

function Winner({ session, onOpenAdmin }) {
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
    const id = setTimeout(() => {
      setCelebrate(true);
      play("win");
    }, 1800);
    return () => clearTimeout(id);
  }, [winners]);

  return (
    <main className="screen stack" style={{ gap: 28 }}>
      <header className="home-header">
        <h1>Ganadores</h1>
      </header>

      {onOpenAdmin && (
        <div className="admin-link">
          <button type="button" className="btn btn--quiet" onClick={onOpenAdmin}>
            Abrir panel de admin
          </button>
        </div>
      )}

      {winners && (
        <DialogBox
          lines={winners.length ? ["La votación terminó.", "Y los mejores disfraces de la noche son..."] : ["La votación terminó.", "Nadie votó, así que no hay podio esta vez."]}
        />
      )}
      {winners?.length > 0 && <WinnerPodium winners={winners} />}

      <MyVotes session={session} />

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
