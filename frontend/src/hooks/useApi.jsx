import { useState, useEffect, useCallback } from "react";
import apiFetch from "../services/apiFetch";

function useApi(path, deps = []) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try   { setData(await apiFetch(path)); }
    catch (e) { setError(e.message); }
    finally   { setLoading(false); }
  }, [path]);

  useEffect(() => { load(); }, deps);
  return { data, loading, error, reload: load };
}

export default useApi;