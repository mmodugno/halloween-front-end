import React, { useState } from "react";
import { adminApi } from "../api";
import { loadSignup } from "../session";
import { copy } from "../clipboard";
import DialogBox from "../components/pixel/DialogBox";
import PixelSprite from "../components/pixel/PixelSprite";
import { pumpkin } from "../components/pixel/sprites";

const WAITING = ["La votación todavía no abrió.", "Cuando arranque, esta pantalla cambia sola."];

// The passwords from your sign-up (yours and whoever you signed up), so they
// are still at hand if you need to send them again.
function MyGroup({ passphrase }) {
  const [signup] = useState(loadSignup);
  const [copied, setCopied] = useState("");
  if (!signup?.users?.some((u) => u.pw_code === passphrase)) return null;

  return (
    <section className="panel stack" style={{ width: "100%", textAlign: "left" }}>
      <h2 className="admin__subtitle">{signup.costume.name}</h2>
      <ul className="guest-list">
        {signup.users.map((u) => (
          <li key={u.id} className="guest">
            <div className="guest__info">
              <p className="candidate__costume">{u.pw_code === passphrase ? `${u.name} (vos)` : u.name}</p>
            </div>
            <button
              type="button"
              className="guest__code"
              onClick={async () => setCopied((await copy(u.pw_code)) ? u.pw_code : "")}
              aria-label={`Copiar la contraseña de ${u.name}`}
            >
              {copied === u.pw_code ? "¡Copiada!" : u.pw_code}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

const Lobby = ({ session, onGameChange, onOpenAdmin }) => {
  const [starting, setStarting] = useState(false);

  const start = async () => {
    setStarting(true);
    try {
      onGameChange(await adminApi(session.passphrase).setGame({ started: true, finished: false }));
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
      <MyGroup passphrase={session.passphrase} />
      {onOpenAdmin && (
        <div className="admin__actions" style={{ justifyContent: "center" }}>
          <button type="button" className="btn" onClick={start} disabled={starting}>
            {starting ? "Abriendo…" : "Abrir votación"}
          </button>
          <button type="button" className="btn btn--quiet" onClick={onOpenAdmin}>
            Panel de admin
          </button>
        </div>
      )}
    </main>
  );
};

export default Lobby;
