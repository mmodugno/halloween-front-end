import React from "react";
import Sheet from "../pixel/Sheet";

// "Are you sure?" sheet used by the admin actions that affect everyone.
export default function ConfirmSheet({ open, title, detail, action, danger, busy, onConfirm, onClose }) {
  return (
    <Sheet open={open} onClose={onClose} labelledBy="confirm-title">
      <h2 id="confirm-title">{title}</h2>
      <p className="muted">{detail}</p>
      <div className="sheet__actions">
        <button type="button" className="btn btn--quiet" onClick={onClose}>
          Cancelar
        </button>
        <button type="button" className={`btn ${danger ? "btn--danger" : ""}`} onClick={onConfirm} disabled={busy}>
          {action}
        </button>
      </div>
    </Sheet>
  );
}
