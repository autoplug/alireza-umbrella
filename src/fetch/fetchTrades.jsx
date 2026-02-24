import axios from "axios";

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";
const CASHE_KEY = "MARKETS_CACHE";
// 5 minutes
const MIN_FETCH_INTERVAL = 5 * 60 * 1000;

// ---------------- CACHE HELPERS ----------------
const getCache = () => {
  const data = localStorage.getItem(CASHE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

const setCache = (value) => {
  localStorage.setItem( CACHE_KEY, JSON.stringify(value));
  localStorage.setItem(`${CACHE_KEY}_TIME`, Date.now().toString());
};

const shouldFetch = () => {
  const last = localStorage.getItem(`${CACHE_KEY}_TIME`);
  if (!last) return true;
  return Date.now() - Number(last) > MIN_FETCH_INTERVAL;
};

// ---------------- FETCH TRADES ----------------
export const fetchTrades = async ( onUpdate = null) => {
  
  const cached = getCache();

  // Use cache if still valid
  if (!shouldFetch() && cached) {
    return cached;
  }

  // Internal function to fetch fresh data
  const fetchNewData = async () => {
    try {
      const url =
        `${WORKER_URL}/market/udf/history?` +
        new URLSearchParams({ symbol, resolution, from, to });

      const response = await axios.get(url, { validateStatus: () => true });
      const raw = response.data;

      let data = [];

      // Update cache and trigger callback if provided
      if (data.length > 0) {
        setCache(data);
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