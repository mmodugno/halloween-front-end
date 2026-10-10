import React, { useState } from "react";
import api from "../api";
import DialogBox from "../components/pixel/DialogBox";
import PixelSprite from "../components/pixel/PixelSprite";
import { pumpkin } from "../components/pixel/sprites";

const WAITING = ["La votación todavía no abrió.", "Cuando arranque, esta pantalla cambia sola."];

const Lobby = ({ isAdmin, onGameChange }) => {
  const [starting, setStarting] = useState(false);

  const start = async () => {
    setStarting(true);
    try {
      onGameChange(await api.setGame({ started: true, finished: false }));
    } catch (e) {
      console.error(e);
      setStarting(false);
    }
  };

  return (
    <main className="screen screen--center" style={{ paddingTop: "calc(14vh + 140px)", justifyContent: "flex-start" }}>
      <h1 className="visually-hidden">La votación todavía no abrió</h1>
      <DialogBox lines={WAITING} />
      <PixelSprite sprite={pumpkin} scale={8} classes={{ Y: "flicker" }} title="Calabaza" />
      {isAdmin && (
        <button type="button" className="btn" onClick={start} disabled={starting}>
          {starting ? "Abriendo…" : "Abrir votación"}
        </button>
      )}
    </main>
  );
};

export default Lobby;
