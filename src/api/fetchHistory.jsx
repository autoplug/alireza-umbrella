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
 * Fetch historical candlestick data with "stale-while-revalidate" and optional callback
 * @param {Object} options
 * @param {string} options.symbol - Market symbol e.g., "BTCIRT"
 * @param {string} options.resolution - "1H" or "D" etc.
 * @param {number} options.from - Unix timestamp start (seconds)
 * @param {number} options.to - Unix timestamp end (seconds)
 * @param {number} options.page - Page number for pagination
 * @param {function} options.onUpdate - Optional callback called with new data
 */
export const fetchHistory = async ({
  symbol = "BTCIRT",
  resolution = "1H",
  from = Math.floor(Date.now() / 1000) - 86400, // default: 1 day ago
  to = Math.floor(Date.now() / 1000),
  page = 1,
  onUpdate = null, // callback for updated data
} = {}) => {
  const cached = getCache(symbol, resolution);

  // Async fetch function
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

      // Update cache and call callback if provided
      if (data.length > 0) {
        setCache(symbol, resolution, data);
        if (typeof onUpdate === "function") onUpdate(data);
      }

      return data;
    } catch (err) {
      console.error(`Fetch history failed (${symbol}, ${resolution}):`, err);
      return cached || [];