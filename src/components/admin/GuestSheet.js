import React, { useEffect, useState } from "react";
import Sheet from "../pixel/Sheet";

const EMPTY = { name: "", costume: "", pending_votes: 2, is_admin: false };

// Form to add a guest or edit one. Deleting is offered when editing someone
// other than yourself.
export default function GuestSheet({ guest, isSelf, onSave, onDelete, onClose }) {
  const editing = Boolean(guest?.id);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(guest ? { ...EMPTY, ...guest } : EMPTY);
    setError("");
    setSaving(false);
  }, [guest]);

  const set = (field) => (e) =>
    setForm((f) => ({
      ...f,
      [field]: e.target.type === "checkbox" ? e.target.checked : e.target.type === "number" ? Number(e.target.value) : e.target.value,
    }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Falta el nombre.");
      return;
    }
    setSaving(true);
    const ok = await onSave({ ...form, pending_votes: Math.max(0, form.pending_votes || 0) });
    if (!ok) setSaving(false);
  };

  return (
    <Sheet open={Boolean(guest)} onClose={onClose} labelledBy="guest-title">
      {guest && (
        <form className="stack" onSubmit={submit} noValidate>
          <h2 id="guest-title">{editing ? `Editar a ${guest.name}` : "Agregar invitado"}</h2>
          <label className="field">
            <span>Nombre</span>
            <input className={`input ${error ? "input--error" : ""}`} value={form.name} onChange={set("name")} autoFocus={!editing} />
          </label>
          <label className="field">
            <span>Disfraz</span>
            <input className="input" value={form.costume} onChange={set("costume")} placeholder="Se puede completar después" />
          </label>
          <label className="field">
            <span>{editing ? "Votos que le quedan" : "Votos"}</span>
            <input className="input input--short" type="number" min={0} max={20} value={form.pending_votes} onChange={set("pending_votes")} />
          </label>
          <label className="check">
            <input type="checkbox" checked={form.is_admin} onChange={set("is_admin")} disabled={isSelf} />
            <span>Es admin {isSelf && <span className="muted">(no te podés sacar a vos)</span>}</span>
          </label>
          {!editing && <p className="muted">La contraseña se crea sola con el nombre y dos números.</p>}
          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}
          <div className="sheet__actions" style={{ justifyContent: "space-between" }}>
            {editing && !isSelf ? (
              <button type="button" className="btn btn--danger" onClick={() => onDelete(guest)}>
                Sacar de la fiesta
              </button>
            ) : (
              <span />
            )}
            <div className="sheet__actions">
              <button type="button" className="btn btn--quiet" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn" disabled={saving}>
                {editing ? "Guardar" : "Agregar"}
              </button>
            </div>
          </div>
        </form>
      )}
    </Sheet>
  );
}
