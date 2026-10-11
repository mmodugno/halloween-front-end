import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import QRCode from "qrcode";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

import api from "../api";
import DialogBox from "../components/pixel/DialogBox";
import PixelSprite from "../components/pixel/PixelSprite";
import { crown, ghost, pumpkin } from "../components/pixel/sprites";
import WinnerPodium, { rankWinners } from "../components/WinnerPodium";

const FEED_POLL_MS = 10000;
const MESSAGE_MS = 9000;
const ease = [0.22, 1, 0.36, 1];

const PLACE = { 1: "Primer puesto", 2: "Segundo puesto", 3: "Tercer puesto" };

// QR + address so guests can open the app from their phones.
function JoinBox({ big = false }) {
  const url = window.location.origin;
  const [qr, setQr] = useState("");
  useEffect(() => {
    QRCode.toDataURL(url, { margin: 1, scale: 10, color: { dark: "#150f22", light: "#f1ecff" } })
      .then(setQr)
      .catch(console.error);
  }, [url]);
  return (
    <div className={`join ${big ? "join--big" : ""}`}>
      {qr && <img className="join__qr" src={qr} alt={`Código QR para entrar a ${url}`} />}
      <div>
        <p className="join__label">Votá desde tu celu</p>
        <p className="join__url">{url.replace(/^https?:\/\//, "")}</p>
      </div>
    </div>
  );
}

function useFeed() {
  const [feed, setFeed] = useState([]);
  useEffect(() => {
    const load = () => api.feed().then(setFeed).catch(console.error);
    load();
    const id = setInterval(load, FEED_POLL_MS);
    return () => clearInterval(id);
  }, []);
  return feed;
}

function Waiting({ registrationOpen }) {
  const lines = registrationOpen
    ? ["La votación abre en un ratito.", "¿Todavía no te anotaste? Escaneá y anotate con tu disfraz."]
    : ["La votación abre en un ratito.", "Mientras tanto, entrá con tu contraseña."];
  return (
    <div className="big__center">
      <h1 className="big__title">Noche de disfraces</h1>
      <DialogBox lines={lines} className="big__dialog" />
      <PixelSprite sprite={pumpkin} scale={10} classes={{ Y: "flicker" }} />
      <JoinBox big />
    </div>
  );
}

// One message at a time, big, cycling through the latest ones.
function MessageCarousel({ feed }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (feed.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % feed.length), MESSAGE_MS);
    return () => clearInterval(id);
  }, [feed.length]);
  const item = feed[index % Math.max(feed.length, 1)];

  return (
    <section className="big__messages" aria-label="Mensajes en vivo">
      <p className="big__eyebrow">
        <span className="live-dot" aria-hidden="true" /> Mensajes en vivo
      </p>
      <AnimatePresence mode="wait">
        <motion.div
          key={item ? item.id : "empty"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease } }}
          exit={{ opacity: 0, y: -20, transition: { duration: 0.4, ease } }}
        >
          <DialogBox
            className="big__dialog big__dialog--message"
            lines={
              item
                ? [`Para ${item.costume}:`, `“${item.message}”`]
                : ["Todavía no llegó ningún mensaje.", "Van a ir apareciendo acá durante la noche."]
            }
          />
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function Voting({ feed, stats }) {
  const percent = stats.possible ? Math.round((stats.cast / stats.possible) * 100) : 0;
  return (
    <div className="big__grid">
      <div className="big__side">
        <h1 className="big__title">Mejor disfraz</h1>
        <p className="big__subtitle">La votación está abierta</p>
        <div className="big__progress">
          <p>
            {stats.cast} de {stats.possible} votos
          </p>
          <div className="progress" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
            <div className="progress__fill" style={{ width: `${percent}%` }} />
          </div>
        </div>
        <JoinBox />
      </div>
      <MessageCarousel feed={feed} />
    </div>
  );
}

// Reveals third, second and first place one after another, then the podium.
function Results() {
  const { width, height } = useWindowSize();
  const [winners, setWinners] = useState(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    api
      .winners()
      .then(setWinners)
      .catch(() => setWinners([]));
  }, []);

  // Reveal order: from the lowest of the top 3 up to first place.
  const reveal = useMemo(() => (winners ? rankWinners(winners).slice(0, 3).reverse() : []), [winners]);
  const last = reveal.length + 1; // intro + one step per winner + podium

  const next = useCallback(() => setStep((s) => Math.min(s + 1, last)), [last]);

  useEffect(() => {
    if (!winners || step >= last) return;
    const id = setTimeout(next, step === 0 ? 5000 : 6500);
    return () => clearTimeout(id);
  }, [step, last, winners, next]);

  // Space or → skips ahead, R starts the reveal again.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === " " || e.key === "ArrowRight") next();
      if (e.key === "r" || e.key === "R") setStep(0);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next]);

  if (winners === null) return null;
  if (winners.length === 0) {
    return (
      <div className="big__center">
        <h1 className="big__title">La votación terminó</h1>
        <DialogBox lines={["Nadie votó, así que no hay podio esta vez."]} className="big__dialog" />
      </div>
    );
  }

  const current = step >= 1 && step <= reveal.length ? reveal[step - 1] : null;

  return (
    <div className="big__center" onClick={next}>
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="intro" exit={{ opacity: 0 }}>
            <h1 className="big__title">La votación terminó</h1>
            <DialogBox lines={["Y los mejores disfraces de la noche son..."]} className="big__dialog" />
          </motion.div>
        )}
        {current && (
          <motion.div
            key={current.id ?? current.name}
            className="reveal"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1, transition: { type: "spring", stiffness: 140, damping: 14 } }}
            exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.4 } }}
          >
            <p className="reveal__place">{PLACE[current.position] || `Puesto ${current.position}`}</p>
            {current.position === 1 && (
              <motion.div
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
              >
                <PixelSprite sprite={crown} scale={12} title="Corona" />
              </motion.div>
            )}
            <p className="reveal__costume">{current.costume}</p>
            <p className="reveal__name">{current.name}</p>
            <p className="reveal__votes">
              {current.votes_count} {current.votes_count === 1 ? "voto" : "votos"}
            </p>
          </motion.div>
        )}
        {step === last && (
          <motion.div key="podium" className="reveal__podium" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="big__title">Ganadores</h1>
            <WinnerPodium winners={winners} />
          </motion.div>
        )}
      </AnimatePresence>
      {current?.position === 1 || step === last ? (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={350}
          gravity={0.1}
          colors={["#f2a65a", "#ffe8c2", "#a8e0c8", "#e58fa0", "#8a78ab"]}
          drawShape={(ctx) => ctx.fillRect(-6, -6, 12, 12)}
          style={{ position: "fixed", zIndex: 10, pointerEvents: "none" }}
        />
      ) : null}
    </div>
  );
}

// Public screen for a TV or projector: open /pantalla and leave it on all
// night. It follows the game by itself (waiting, voting, winners).
export default function BigScreen({ game }) {
  const phase = game.finished ? "results" : game.started ? "open" : "waiting";
  const feed = useFeed();
  const [stats, setStats] = useState({ cast: 0, possible: 0 });

  useEffect(() => {
    const load = () => api.stats().then(setStats).catch(console.error);
    load();
    const id = setInterval(load, FEED_POLL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="big">
      <div className="big__ghost" aria-hidden="true">
        <div className="mascot__float">
          <PixelSprite sprite={ghost} scale={5} />
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          className="big__phase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.8 } }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          {phase === "waiting" && <Waiting registrationOpen={game.registration_open} />}
          {phase === "open" && <Voting feed={feed} stats={stats} />}
          {phase === "results" && <Results />}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
