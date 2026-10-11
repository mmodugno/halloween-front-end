import React from "react";

// Shown in the admin tabs when the backend can't be reached or says no.
export default function LoadError({ error, onRetry }) {
  return (
    <section className="panel stack" role="alert">
      <p>No se pudo cargar esta sección.</p>
      <p className="muted">{error}</p>
      <div>
        <button type="button" className="btn btn--quiet" onClick={onRetry}>
          Reintentar
        </button>
      </div>
    </section>
  );
}

// Turns a failed request into a sentence for the admin.
export function describe(error) {
  const msg = error?.message || "";
  if (msg.includes("does not exist") || msg.includes("passphrase")) return "Tu sesión ya no es válida. Salí y volvé a entrar.";
  if (msg.includes("only admins")) return "Tu usuario no es admin.";
  if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) return "No hay conexión con el backend. ¿Está levantado?";
  return msg;
}
