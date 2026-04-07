import { useState, useEffect, useCallback } from "react";
import { historyApi } from "../services/api";

export function useHistory(token) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetch = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      let data;
      if (filter === "all") data = await historyApi.getAll(token);
      else if (filter === "errored") data = await historyApi.getErrored(token);
      else data = await historyApi.getByOperation(filter, token);
      setHistory(data);
    } catch (e) {
      setError(e.message);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [token, filter]);

  useEffect(() => { fetch(); }, [fetch]);

  const refresh = () => fetch();

  return { history, loading, error, filter, setFilter, refresh };
}
