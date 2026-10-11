import { useCallback, useEffect, useState } from "react";
import { describe } from "../components/admin/LoadError";

// Loads data for an admin tab (optionally polling) and keeps a readable error.
// `fetcher` must be stable (e.g. a method of the memoized adminApi object).
export default function useAdminData(fetcher, pollMs = 0) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(
    () =>
      fetcher()
        .then((result) => {
          setData(result);
          setError("");
        })
        .catch((e) => setError(describe(e))),
    [fetcher]
  );

  useEffect(() => {
    load();
    if (!pollMs) return;
    const id = setInterval(load, pollMs);
    return () => clearInterval(id);
  }, [load, pollMs]);

  return { data, error, load };
}
