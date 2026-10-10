import React, { useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import api from "../api";

function Splash({ onLogin }) {
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const shake = useAnimationControls();

  async function submit(e) {
    e.preventDefault();
    if (!passphrase.trim()) {
      setError("Escribí tu contraseña para entrar.");
      shake.start({ x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.4 } });
      return;
    }
    setLoading(true);
    try {
      const user = await api.login(passphrase.trim());
      onLogin({ passphrase: passphrase.trim(), userID: user.id, isAdmin: user.is_admin });
    } catch (err) {
      console.error(err);
      setError("Esa contraseña no existe. Revisá la que te pasaron.");
      shake.start({ x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.4 } });
      setLoading(false);
    }
  }

  return (
    <main className="screen screen--center" style={{ paddingTop: "calc(14vh + 140px)", justifyContent: "flex-start" }}>
      <div className="stack" style={{ gap: 8 }}>
        <h1 style={{ fontSize: "var(--text-xxl)" }}>Noche de disfraces</h1>
        <p className="muted">Entrá con tu contraseña para votar el mejor disfraz.</p>
      </div>
      <motion.form animate={shake} onSubmit={submit} className="panel stack" style={{ width: "100%", textAlign: "left" }} noValidate>
        <label htmlFor="passphrase">Contraseña</label>
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
        <button type="submit" className="btn btn--block" disabled={loading}>
          {loading ? <span className="loading-dots">Entrando</span> : "Entrar"}
        </button>
      </motion.form>
    </main>
  );
}

export default Splash;
