// src/api/fetchHistory.jsx
import axios from "axios";

const WORKER_URL = "https://nobitex3.alireza-b83.workers.dev";
const CACHE_KEY = "WALLETS_CACHE";
const CACHE_TIME_KEY = "WALLETS_CACHE_TIME";
// ---------------- CACHE HELPERS ----------------
const getCacheKey = (symbol, resolution) => `HISTORY_CACHE_${symbol}_${resolution}`;
const getCacheTimeKey = (symbol, resolution) => `HISTORY_CACHE_TIME_${symbol}_${resolution}`;

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
export const fetchHistory = async ({
  symbol = "BTCIRT",
  resolution = "60",
  from = Math.floor(Date.now() / 1000) - 3600, // default 1 hour ago
  to = Math.floor(Date.now() / 1000),
  onUpdate = null,
} = {}) => {
  const cached = getCache(symbol, resolution);

  // Internal function to fetch fresh data
  const fetchNewData = async () => {
    try {
      const url =
        `${WORKER_URL}/market/udf/history?` +
        new URLSearchParams({ symbol, resolution, from, to });

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