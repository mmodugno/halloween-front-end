import React, { useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import api from "../api";
import { sessionFor } from "../session";
import { play } from "../sound";
import DialogBox from "../components/pixel/DialogBox";
import Register from "./Register";

const WELCOME = ["Llegaste a la noche de disfraces.", "Escribí tu contraseña para votar el mejor disfraz."];
const WELCOME_OPEN = ["Llegaste a la noche de disfraces.", "Anotate con tu disfraz, o entrá si ya tenés contraseña."];

function Splash({ game = {}, onLogin }) {
  const [registering, setRegistering] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const shake = useAnimationControls();

  async function submit(e) {
    e.preventDefault();
    if (!passphrase.trim()) {
      setError("Escribí tu contraseña para entrar.");
      play("error");
      shake.start({ x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.4 } });
      return;
    }
    setLoading(true);
    try {
      const user = await api.login(passphrase.trim());
      play("confirm");
      onLogin(sessionFor(passphrase.trim(), user));
    } catch (err) {
      console.error(err);
      setError("Esa contraseña no existe. Revisá la que te pasaron.");
      play("error");
      shake.start({ x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.4 } });
      setLoading(false);
    }
  }

  // Sign-ups are open until the admin opens the vote (or closes them).
  const canRegister = game.registration_open && !game.started && !game.finished;
  if (registering && canRegister) return <Register onLogin={onLogin} onCancel={() => setRegistering(false)} />;

  return (
    <main className="screen screen--center" style={{ paddingTop: "calc(14vh + 140px)", justifyContent: "flex-start" }}>
      <h1 style={{ fontSize: "var(--text-xxl)" }}>Noche de disfraces</h1>
      <DialogBox lines={canRegister ? WELCOME_OPEN : WELCOME} />
      {canRegister && (
        <button type="button" className="btn btn--block" onClick={() => setRegistering(true)}>
          Anotarme con mi disfraz
        </button>
      )}
      <motion.form
        animate={shake}
        onSubmit={submit}
        className="panel stack"
        style={{ width: "100%", textAlign: "left" }}
        noValidate
      >
        <label htmlFor="passphrase">{canRegister ? "¿Ya tenés contraseña?" : "Contraseña"}</label>
        <input
          id="passphrase"
          className={`input ${error ? "input--error" : ""}`}
          value={passphrase}
          onChange={(e) => {
            setPassphrase(e.target.value.toLowerCase());
            setError("");
          }}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck="false"
          placeholder="ej: maga42"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "passphrase-error" : undefined}
        />
        {error && (
          <p id="passphrase-error" className="field-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className={`btn btn--block ${canRegister ? "btn--quiet" : ""}`} disabled={loading}>
          {loading ? <span className="loading-dots">Entrando</span> : "Entrar"}
        </button>
      </motion.form>
    </main>
  );
}

export default Splash;
