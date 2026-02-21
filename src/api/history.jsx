import axios from "axios";

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";
const MIN_FETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Generate cache key based on symbol & resolution
const getCacheKey = (symbol, resolution) =>
  `HISTORY_CACHE_${symbol}_${resolution}`;
const getCacheTimeKey = (symbol, resolution) =>
  `HISTORY_CACHE_TIME_${symbol}_${resolution}`;

// ---------------- CACHE HELPERS ----------------

// Retrieve cached data for a symbol & resolution
const getCache = (symbol, resolution) => {
  const data = localStorage.getItem(getCacheKey(symbol, resolution));
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

// Save data to cache with current timestamp
const setCache = (symbol, resolution, value) => {
  localStorage.setItem(getCacheKey(symbol, resolution), JSON.stringify(value));
  localStorage.setItem(getCacheTimeKey(symbol, resolution), Date.now().toString());
};

// Check if we need to fetch fresh data
const shouldFetch = (symbol, resolution) => {
  const last = localStorage.getItem(getCacheTimeKey(symbol, resolution));
  if (!last) return true;
  return Date.now() - Number(last) > MIN_FETCH_INTERVAL;
};

// ---------------- FETCH HISTORY ----------------
/**
 * Fetch historical candlestick data from Nobitex API
 * @param {string} symbol - Market symbol (e.g., "BTCIRT")
 * @param {string} resolution - Time resolution ("1H", "D", etc.)
 * @param {number} from - Start timestamp (unix seconds)
 * @param {number} to - End timestamp (unix seconds)
 * @param {number} page - Page number for pagination
 * @returns {Array} Array of candlestick objects {time, open, high, low, close, volume}
 */
export const fetchHistory = async ({
  symbol = "BTCIRT",
  resolution = "1H", // default hourly
  from = Math.floor(Date.now() / 1000) - 86400, // 1 day ago
  to = Math.floor(Date.now() / 1000),
  page = 1,
} = {}) => {
  // Check cache first
  const cached = getCache(symbol, resolution);
  if (!shouldFetch(symbol, resolution) && cached) return cached;

  try {
    // Build URL with query parameters
    const url =
      `${WORKER_URL}/market/udf/history?` +
      new URLSearchParams({ symbol, resolution, from, to, page });

    // Request historical data
    const response = await axios.get(url, { validateStatus: () => true });
    const raw = response.data;

    let data = [];

    // If API response is OK and arrays exist, map to candlestick objects
    if (raw?.s === "ok" && Array.isArray(raw.t)) {
      data = raw.t.map((time, i) => ({
        time,       // unix timestamp
        open: raw.o[i],
        high: raw.h[i],
        low: raw.l[i],
        close: raw.c[i],
        volume: raw.v[i],
      }));
    }

    // Save to cache if valid data
    if (data.length > 0) setCache(symbol, resolution, data);

    return data;
  } catch (err) {
    console.error(`Fetch history failed (${symbol}, ${resolution}):`, err);
    return cached || [];
  }
};