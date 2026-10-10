import React from "react";
import Sheet from "./pixel/Sheet";

export default function EasterEgg({ open, onClose }) {
  return (
    <Sheet open={open} onClose={onClose} labelledBy="easter-egg-title">
      <h2 id="easter-egg-title" className="visually-hidden">
        Sorpresa
      </h2>
      <img src={require("../assets/paraaa.gif")} alt="" style={{ width: "100%", imageRendering: "pixelated" }} />
      <div className="sheet__actions">
        <button type="button" className="btn btn--quiet" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </Sheet>
  );
}
