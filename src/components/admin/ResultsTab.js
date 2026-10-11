import React from "react";
import LoadError from "./LoadError";
import useAdminData from "../../hooks/useAdminData";

export default function ResultsTab({ admin }) {

  const { data: results, error: loadError, load } = useAdminData(admin.results);

  if (loadError && results === null) return <LoadError error={loadError} onRetry={load} />;
  if (results === null) return null;

  return (
    <section className="panel stack">
      {results.length === 0 ? (
        <p className="muted">Todavía nadie votó.</p>
      ) : (
        <div>
          {results.map((row) => (
            <div key={row.id} className="result">
              <div>
                <p className="candidate__costume">{row.costume}</p>
                <p className="candidate__name">{row.name}</p>
              </div>
              <p className="result__count">
                {row.votes_count} {row.votes_count === 1 ? "voto" : "votos"}
              </p>
              {row.data?.length > 0 && (
                <ul className="result__messages">
                  {row.data.map((m, i) => (
                    <li key={i}>
                      <strong>{m.user}</strong>
                      {m.message ? `: ${m.message}` : " (sin mensaje)"}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
      <div>
        <button type="button" className="btn btn--quiet" onClick={load}>
          Actualizar
        </button>
      </div>
    </section>
  );
}
