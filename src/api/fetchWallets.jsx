import axios from "axios";

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";
const CACHE_KEY = "WALLETS_CACHE";
const CACHE_TIME_KEY = "WALLETS_CACHE_TIME";

// ---------------- CACHE HELPERS ----------------
const getCache = () => {
  const data = localStorage.getItem(CACHE_KEY);
  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

const setCache = (data) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
};

const shouldFetch = () => {
  const last = localStorage.getItem(CACHE_TIME_KEY);
  if (!last) return true;
  return Date.now() - Number(last) > MIN_FETCH_INTERVAL;
};

// ---------------- FETCH WALLETS ----------------
export const fetchWallets = async () => {
  const cached = getCache();

  // Internal function to fetch fresh data
  const fetchNewData = async () => {
    let headers = {};
    
    try {
      const token = localStorage.getItem("NOBITEX_TOKEN");
      if (!token) return [];
      headers.Authorization = `Token ${token}`;
      const url = `${WORKER_URL}/users/wallets/list`;
      const response = await axios.get(url, { validateStatus: () => true });
      const raw = response.data;

      let data = [];

      // Parse response if status is ok
      if (raw?.s === "ok" && Array.isArray(raw.t)) {
        data = raw.t.map((time, i) => ({
          time,                // unix timestamp in seconds
          open: raw.o[i],
          high: raw.h[i],
          low: raw.l[i],
          close: raw.c[i],
          volume: raw.v[i],
        }));
      }

      // Update cache and trigger callback if provided
      if (data.length > 0) {
        setCache(symbol, resolution, data);
        if (typeof onUpdate === "function") onUpdate(data);
      }

      return data;
    } catch (err) {
      console.error(`Fetch history failed (${symbol}, ${resolution}):`, err);
      return cached || [];
    }
  };

  // If cache exists, return it immediately and refresh in background
  if (cached) {
    fetchNewData(); // background refresh
    return cached;
  }

  // Otherwise, fetch and return immediately
  return await fetchNewData();
};