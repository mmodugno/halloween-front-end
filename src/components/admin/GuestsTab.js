import React, { useState } from "react";
import Sheet from "../pixel/Sheet";
import GuestSheet from "./GuestSheet";
import ConfirmSheet from "./ConfirmSheet";
import LoadError from "./LoadError";
import useAdminData from "../../hooks/useAdminData";
import { copy } from "../../clipboard";

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

// Guests grouped by costume (sorted by costume), people without one last.
export function groupByCostume(guests) {
  const groups = new Map();
  for (const g of guests) {
    const key = g.costume_id || 0;
    if (!groups.has(key)) groups.set(key, { id: key, name: g.costume, friendGroup: g.friend_group || "", members: [] });
    groups.get(key).members.push(g);
  }
  return [...groups.values()].sort((a, b) => !a.id - !b.id || a.name.localeCompare(b.name, "es"));
}

export default function GuestsTab({ admin, session, toast }) {
  const [editing, setEditing] = useState(null); // guest object, or {} to add one
  const [deleting, setDeleting] = useState(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [bulkVotes, setBulkVotes] = useState(2);
  const [busy, setBusy] = useState(false);
  const [fresh, setFresh] = useState([]); // ids just created, highlighted
  const [renaming, setRenaming] = useState(null); // { id, name } of a costume
  const [grouping, setGrouping] = useState(null); // { id, name, group } of a costume

  const { data: guests, error: loadError, load } = useAdminData(admin.users);

  const created = async (users) => {
    setFresh(users.map((u) => u.id));
    await load();
    toast(
      users.length === 1
        ? `Listo, la contraseña de ${users[0].name} es ${users[0].pw_code}`
        : `Agregaste ${users.length} invitados`,
      "success",
    );
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

  const rename = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await admin.renameCostume(renaming.id, renaming.name);
      setRenaming(null);
      await load();
      toast("Disfraz renombrado", "success");
    } catch (err) {
      toast(`No se pudo renombrar: ${err.message}`);
    }
    setBusy(false);
  };

  const saveGroup = async (group) => {
    setBusy(true);
    try {
      await admin.setFriendGroup(grouping.id, group);
      toast(group.trim() ? `${grouping.name} quedó en "${group.trim()}"` : `${grouping.name} ya no está en un grupo`, "success");
      setGrouping(null);
      await load();
    } catch (err) {
      toast(`No se pudo guardar el grupo: ${err.message}`);
    }
    setBusy(false);
  };

  const copyAll = async () => {
    const text = groupByCostume(guests)
      .map((c) => `${c.name || "Sin disfraz"}\n${c.members.map((g) => `  ${g.name}: ${g.pw_code}`).join("\n")}`)
      .join("\n\n");
    toast((await copy(text)) ? "Copiaste todas las contraseñas" : "No se pudo copiar");
  };

  if (loadError && guests === null) return <LoadError error={loadError} onRetry={load} />;
  if (guests === null) return null;
  const preview = parseGuestList(bulkText, bulkVotes);
  const groups = groupByCostume(guests);
  // Friend groups with their costumes, for the summary and the suggestions.
  const friendGroups = new Map();
  for (const c of groups) {
    if (!c.friendGroup) continue;
    const key = c.friendGroup.toLowerCase();
    if (!friendGroups.has(key)) friendGroups.set(key, { name: c.friendGroup, costumes: [] });
    friendGroups.get(key).costumes.push(c.name);
  }

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

      {guests.length > 0 && (
        <p className="muted">
          {guests.length} {guests.length === 1 ? "invitado" : "invitados"} en {groups.filter((c) => c.id).length} disfraces
        </p>
      )}

      {groups.some((c) => c.id) && (
        <section className="panel stack">
          <h2 className="admin__subtitle">Grupos de amigos</h2>
          <p className="muted">
            Los disfraces de un mismo grupo no se pueden votar entre sí. Tocá "Grupo" en cada disfraz para armarlos. Solo vos los
            ves.
          </p>
          {friendGroups.size === 0 ? (
            <p className="muted">Todavía no armaste ningún grupo.</p>
          ) : (
            <ul className="guest-list">
              {[...friendGroups.values()].map((fg) => (
                <li key={fg.name} className="guest">
                  <div className="guest__info">
                    <p className="candidate__costume">{fg.name}</p>
                    <p className="candidate__name">{fg.costumes.join(" · ")}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section className="panel">
        {guests.length === 0 ? (
          <p className="muted">Todavía no hay invitados. Compartí el link para que se anoten, o agregalos vos.</p>
        ) : (
          groups.map((c) => (
            <div key={c.id} className="costume-group">
              <div className="costume-group__head">
                <h3>
                  {c.name || "Sin disfraz"} {c.friendGroup && <span className="tag tag--mint">{c.friendGroup}</span>}
                </h3>
                {c.id > 0 && (
                  <span className="costume-group__actions">
                    <button
                      type="button"
                      className="link"
                      onClick={() => setGrouping({ id: c.id, name: c.name, group: c.friendGroup })}
                    >
                      Grupo
                    </button>
                    <button type="button" className="link" onClick={() => setRenaming({ id: c.id, name: c.name })}>
                      Renombrar
                    </button>
                  </span>
                )}
              </div>
              <ul className="guest-list">
                {c.members.map((g) => (
                  <li key={g.id} className={`guest ${fresh.includes(g.id) ? "guest--fresh" : ""}`}>
                    <div className="guest__info">
                      <p className="candidate__costume">
                        {g.name} {g.is_admin && <span className="tag">admin</span>}
                      </p>
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
            </div>
          ))
        )}
      </section>

      <GuestSheet
        guest={editing}
        costumes={groups.filter((c) => c.id).map((c) => c.name)}
        isSelf={editing?.id === session.userID}
        onSave={save}
        onDelete={setDeleting}
        onClose={() => setEditing(null)}
      />

      <Sheet open={bulkOpen} onClose={() => setBulkOpen(false)} labelledBy="bulk-title">
        <h2 id="bulk-title">Pegar una lista</h2>
        <p className="muted">
          Un invitado por renglón: nombre y disfraz separados por una coma. Si dos personas tienen el mismo disfraz, quedan en el
          mismo grupo.
        </p>
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

      <Sheet open={Boolean(grouping)} onClose={() => setGrouping(null)} labelledBy="group-title">
        {grouping && (
          <form
            className="stack"
            onSubmit={(e) => {
              e.preventDefault();
              saveGroup(grouping.group);
            }}
            noValidate
          >
            <h2 id="group-title">Grupo de {grouping.name}</h2>
            <input
              className="input"
              value={grouping.group}
              onChange={(e) => setGrouping({ ...grouping, group: e.target.value })}
              maxLength={60}
              list="friend-group-options"
              placeholder="ej: Amigos de la facu"
              aria-label="Grupo de amigos"
              autoFocus
            />
            <datalist id="friend-group-options">
              {[...friendGroups.values()].map((fg) => (
                <option key={fg.name} value={fg.name} />
              ))}
            </datalist>
            <p className="muted">
              Escribí el mismo nombre en los disfraces de un mismo grupo: no se van a poder votar entre ellos. Los votos que ya
              hicieron no cambian.
            </p>
            <div className="sheet__actions" style={{ justifyContent: "space-between" }}>
              {grouping.group ? (
                <button type="button" className="btn btn--quiet" disabled={busy} onClick={() => saveGroup("")}>
                  Sacar del grupo
                </button>
              ) : (
                <span />
              )}
              <div className="sheet__actions">
                <button type="button" className="btn btn--quiet" onClick={() => setGrouping(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn" disabled={busy}>
                  Guardar
                </button>
              </div>
            </div>
          </form>
        )}
      </Sheet>

      <Sheet open={Boolean(renaming)} onClose={() => setRenaming(null)} labelledBy="rename-title">
        {renaming && (
          <form className="stack" onSubmit={rename} noValidate>
            <h2 id="rename-title">Renombrar disfraz</h2>
            <input
              className="input"
              value={renaming.name}
              onChange={(e) => setRenaming({ ...renaming, name: e.target.value })}
              maxLength={60}
              aria-label="Nombre del disfraz"
              autoFocus
            />
            <p className="muted">Cambia para todo el grupo. Los votos que recibió se mantienen.</p>
            <div className="sheet__actions">
              <button type="button" className="btn btn--quiet" onClick={() => setRenaming(null)}>
                Cancelar
              </button>
              <button type="submit" className="btn" disabled={busy || !renaming.name.trim()}>
                Guardar
              </button>
            </div>
          </form>
        )}
      </Sheet>

      <ConfirmSheet
        open={Boolean(deleting)}
        title={deleting ? `¿Sacar a ${deleting.name}?` : ""}
        detail="Se borran los votos que hizo. Si era la única persona con ese disfraz, el disfraz también se va y quienes lo habían votado recuperan ese voto."
        action="Sacar de la fiesta"
        danger
        busy={busy}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
      />
    </div>
  );
}
