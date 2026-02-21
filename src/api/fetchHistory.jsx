import axios from "axios";

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";
const MIN_FETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Generate cache key based on symbol & resolution
const getCacheKey = (symbol, resolution) =>
  `HISTORY_CACHE_${symbol}_${resolution}`;
const getCacheTimeKey = (symbol, resolution) =>
  `HISTORY_CACHE_TIME_${symbol}_${resolution}`;

// ---------------- CACHE HELPERS ----------------
const getCache = (symbol, resolution) => {
  const data = localStorage.getItem(getCacheKey(symbol, resolution));
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

const setCache = (symbol, resolution, value) => {
  localStorage.setItem(getCacheKey(symbol, resolution), JSON.stringify(value));
  localStorage.setItem(getCacheTimeKey(symbol, resolution), Date.now().toString());
};

// ---------------- FETCH HISTORY ----------------
/**
 * Fetch historical candlestick data from Nobitex API
 * Implements "stale-while-revalidate": returns cache immediately if available, then updates cache
 */
export const fetchHistory = async ({
  symbol = "BTCIRT",
  resolution = "1H", // default hourly
  from = Math.floor(Date.now() / 1000) - 86400, // 1 day ago
  to = Math.floor(Date.now() / 1000),
  page = 1,
} = {}) => {
  const cached = getCache(symbol, resolution);

  // Start async fetch in background regardless of cache
  const fetchNewData = async () => {
    try {
      const url =
        `${WORKER_URL}/market/udf/history?` +
        new URLSearchParams({ symbol, resolution, from, to, page });

      const response = await axios.get(url, { validateStatus: () => true });
      const raw = response.data;

      let data = [];

      if (raw?.s === "ok" && Array.isArray(raw.t)) {
        data = raw.t.map((time, i) => ({
          time,
          open: raw.o[i],
          high: raw.h[i],
          low: raw.l[i],
          close: raw.c[i],
          volume: raw.v[i],
        }));
      }

      if (data.length > 0) setCache(symbol, resolution, data);

      return data;
    } catch (err) {
      console.error(`Fetch history failed (${symbol}, ${resolution}):`, err);
      return cached || [];
    }
  };

  // If cache exists, return it immediately, then update in background
  if (cached) {
    fetchNewData(); // async background refresh
    return cached;
  }

  // Otherwise, fetch and return data immediately
  return await fetchNewData();
};