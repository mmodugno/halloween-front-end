import React, { useCallback, useEffect, useState } from "react";
import Sheet from "../pixel/Sheet";
import GuestSheet from "./GuestSheet";
import ConfirmSheet from "./ConfirmSheet";
import LoadError, { describe } from "./LoadError";

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

// "Lu, Bruja del bosque" / "Lu - Bruja" / "Lu<TAB>Bruja" / "Lu" per line.
export function parseGuestList(text, votes) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, ...rest] = line.split(/\s*[,;\t]\s*|\s+-\s+/);
      return { name: name.trim(), costume: rest.join(" ").trim(), pending_votes: votes, is_admin: false };
    })
    .filter((g) => g.name);
}

export default function GuestsTab({ admin, session, toast }) {
  const [guests, setGuests] = useState(null);
  const [editing, setEditing] = useState(null); // guest object, or {} to add one
  const [deleting, setDeleting] = useState(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [bulkVotes, setBulkVotes] = useState(2);
  const [busy, setBusy] = useState(false);
  const [fresh, setFresh] = useState([]); // ids just created, highlighted

  const [loadError, setLoadError] = useState("");
  const load = useCallback(
    () =>
      admin
        .users()
        .then((data) => {
          setGuests(data);
          setLoadError("");
        })
        .catch((e) => setLoadError(describe(e))),
    [admin]
  );

  useEffect(() => {
    load();
  }, [load]);

  const created = async (users) => {
    setFresh(users.map((u) => u.id));
    await load();
    toast(users.length === 1 ? `Listo, la contraseña de ${users[0].name} es ${users[0].pw_code}` : `Agregaste ${users.length} invitados`, "success");
  };

  const save = async (guest) => {
    try {
      if (guest.id) {
        await admin.updateUser(guest);
        await load();
        toast("Cambios guardados", "success");
      } else {
        await created(await admin.createUsers([guest]));
      }
      setEditing(null);
      return true;
    } catch (e) {
      toast(`No se pudo guardar: ${e.message}`);
      return false;
    }
  };

  const addBulk = async () => {
    const list = parseGuestList(bulkText, bulkVotes);
    if (!list.length) return;
    setBusy(true);
    try {
      await created(await admin.createUsers(list));
      setBulkOpen(false);
      setBulkText("");
    } catch (e) {
      toast(`No se pudo agregar: ${e.message}`);
    }
    setBusy(false);
  };

  const remove = async () => {
    setBusy(true);
    try {
      await admin.deleteUser(deleting.id);
      toast(`${deleting.name} ya no está en la lista`);
      setDeleting(null);
      setEditing(null);
      await load();
    } catch (e) {
      toast(`No se pudo sacar: ${e.message}`);
    }
    setBusy(false);
  };

  const copyAll = async () => {
    const text = guests.map((g) => `${g.name}: ${g.pw_code}`).join("\n");
    toast((await copy(text)) ? "Copiaste todas las contraseñas" : "No se pudo copiar");
  };

  if (loadError && guests === null) return <LoadError error={loadError} onRetry={load} />;
  if (guests === null) return null;
  const preview = parseGuestList(bulkText, bulkVotes);

  return (
    <div className="stack">
      <div className="admin__actions">
        <button type="button" className="btn" onClick={() => setEditing({})}>
          Agregar invitado
        </button>
        <button type="button" className="btn btn--quiet" onClick={() => setBulkOpen(true)}>
          Pegar una lista
        </button>
        {guests.length > 0 && (
          <button type="button" className="btn btn--quiet" onClick={copyAll}>
            Copiar contraseñas
          </button>
        )}
      </div>

      <section className="panel">
        {guests.length === 0 ? (
          <p className="muted">Todavía no hay invitados. Agregá uno o pegá una lista.</p>
        ) : (
          <ul className="guest-list">
            {guests.map((g) => (
              <li key={g.id} className={`guest ${fresh.includes(g.id) ? "guest--fresh" : ""}`}>
                <div className="guest__info">
                  <p className="candidate__costume">
                    {g.name} {g.is_admin && <span className="tag">admin</span>}
                  </p>
                  <p className="candidate__name">{g.costume || "Sin disfraz cargado"}</p>
                  <p className="guest__meta">
                    <button
                      type="button"
                      className="guest__code"
                      onClick={async () => toast((await copy(g.pw_code)) ? `Copiaste ${g.pw_code}` : "No se pudo copiar")}
                      aria-label={`Copiar la contraseña de ${g.name}`}
                    >
                      {g.pw_code}
                    </button>
                    <span className="muted">
                      {g.pending_votes} {g.pending_votes === 1 ? "voto" : "votos"}
                    </span>
                  </p>
                </div>
                <button type="button" className="btn btn--quiet" onClick={() => setEditing(g)}>
                  Editar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <GuestSheet
        guest={editing}
        isSelf={editing?.id === session.userID}
        onSave={save}
        onDelete={setDeleting}
        onClose={() => setEditing(null)}
      />

      <Sheet open={bulkOpen} onClose={() => setBulkOpen(false)} labelledBy="bulk-title">
        <h2 id="bulk-title">Pegar una lista</h2>
        <p className="muted">Un invitado por renglón: nombre y disfraz separados por una coma. El disfraz es opcional.</p>
        <textarea
          className="input"
          rows={6}
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          placeholder={"Lu, Bruja del bosque\nTomi, Zombie oficinista\nSai"}
          aria-label="Lista de invitados"
        />
        <label className="field">
          <span>Votos para cada uno</span>
          <input
            className="input input--short"
            type="number"
            min={0}
            max={20}
            value={bulkVotes}
            onChange={(e) => setBulkVotes(Math.max(0, Number(e.target.value)))}
          />
        </label>
        <div className="sheet__actions">
          <button type="button" className="btn btn--quiet" onClick={() => setBulkOpen(false)}>
            Cancelar
          </button>
          <button type="button" className="btn" onClick={addBulk} disabled={busy || preview.length === 0}>
            {preview.length ? `Agregar ${preview.length}` : "Agregar"}
          </button>
        </div>
      </Sheet>

      <ConfirmSheet
        open={Boolean(deleting)}
        title={deleting ? `¿Sacar a ${deleting.name}?` : ""}
        detail="Se borran sus votos y los que recibió. Quienes lo habían votado recuperan ese voto."
        action="Sacar de la fiesta"
        danger
        busy={busy}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
      />
    </div>
  );
}
