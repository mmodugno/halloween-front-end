import React, { useCallback, useEffect, useState } from "react";
import LoadError, { describe } from "./LoadError";

export default function ResultsTab({ admin }) {
  const [results, setResults] = useState(null);

  const [loadError, setLoadError] = useState("");
  const load = useCallback(
    () =>
      admin
        .results()
        .then((data) => {
          setResults(data);
          setLoadError("");
        })
        .catch((e) => setLoadError(describe(e))),
    [admin]
  );

  useEffect(() => {
    load();
  }, [load]);

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
