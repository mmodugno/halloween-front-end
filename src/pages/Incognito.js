import React from "react";

export default function Incognito() {
  return (
    <main className="screen screen--center">
      <div className="panel stack" style={{ maxWidth: 420 }}>
        <img src={require("../assets/not-pass.gif")} alt="" style={{ width: "100%" }} />
        <h1>No podés pasar</h1>
        <p className="muted">Abrí esta página en una ventana normal para votar.</p>
      </div>
    </main>
  );
}
