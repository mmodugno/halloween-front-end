import React, { useEffect, useState } from "react";
import Sheet from "../pixel/Sheet";

const EMPTY = { name: "", costume: "", costume_id: 0, pending_votes: 2, is_admin: false };

// Whether the guest shares their costume with someone else.
const sharesCostume = (guest, costumes) =>
  Boolean(guest?.costume_id) && (costumes.find((c) => c.id === guest.costume_id)?.members.length || 0) > 1;

// Form to add a guest or edit one. Deleting is offered when editing someone
// other than yourself. costumes: [{ id, name, members: [names] }].
export default function GuestSheet({ guest, costumes = [], isSelf, onSave, onDelete, onClose }) {
  const editing = Boolean(guest?.id);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // costume_id 0 means "their own costume, named by the text field". Someone
    // alone in a costume starts there, so editing the text renames it.
    const own = !sharesCostume(guest, costumes);
    setForm(guest ? { ...EMPTY, ...guest, costume_id: own ? 0 : guest.costume_id } : EMPTY);
    setError("");
    setSaving(false);
    // Only when another guest is opened, not when the list reloads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guest]);

  // Costumes they can join: any but the one they wear alone.
  const joinable = costumes.filter((c) => c.id !== guest?.costume_id || sharesCostume(guest, costumes));

  const set = (field) => (e) =>
    setForm((f) => ({
      ...f,
      [field]:
        e.target.type === "checkbox" ? e.target.checked : e.target.type === "number" ? Number(e.target.value) : e.target.value,
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
            <input
              className={`input ${error ? "input--error" : ""}`}
              value={form.name}
              onChange={set("name")}
              autoFocus={!editing}
            />
          </label>
          <label className="field">
            <span>Disfraz</span>
            <select
              className="input"
              value={form.costume_id}
              onChange={(e) => setForm((f) => ({ ...f, costume_id: Number(e.target.value) }))}
            >
              <option value={0}>Uno propio</option>
              {joinable.map((c) => (
                <option key={c.id} value={c.id}>
                  Con {c.members.join(", ")}: {c.name}
                </option>
              ))}
            </select>
          </label>
          {form.costume_id === 0 && (
            <label className="field">
              <span>¿De qué?</span>
              <input
                className="input"
                value={form.costume}
                onChange={set("costume")}
                placeholder="Se puede completar después"
                maxLength={60}
              />
              <span className="muted">Aunque se llame igual que otro, queda separado.</span>
            </label>
          )}
          <label className="field">
            <span>{editing ? "Votos que le quedan" : "Votos"}</span>
            <input
              className="input input--short"
              type="number"
              min={0}
              max={20}
              value={form.pending_votes}
              onChange={set("pending_votes")}
            />
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
