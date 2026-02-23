import axios from "axios";

const WORKER_URL = "https://nobitex3.alireza-b83.workers.dev";

export const fetchHistory = async ({
  symbol = "BTCIRT",
  resolution = "60",
  from = Math.floor(Date.now() / 1000) - 3600, // default 1 hour ago
  to = Math.floor(Date.now() / 1000),
  onUpdate = null,
} = {}) => {
  try {
    if (!symbol) return { history: [], _lastUpdate: null };

    const url = `${WORKER_URL}/market/history`;

    const response = await axios.get(url, {
      params: {
        symbol: symbol.toLowerCase(),
        resolution,
        from,
        to,
      },
      validateStatus: () => true,
    });

    const raw = response.data;

    // Normalize for Lightweight Charts
    let history = [];

    // Parse response if status is ok
    if (raw?.s === "ok" && Array.isArray(raw.t)) {
      history = raw.t.map((time, i) => ({
        time,                // unix timestamp in seconds
        open: raw.o[i],
        high: raw.h[i],
        low: raw.l[i],
        close: raw.c[i],
        volume: raw.v[i],
      }));
    }

    return {history, _lastUpdate: Date.now(),};
  } catch (error) {
    console.error("fetchHistory failed:", error);
    return { history: [], _lastUpdate: null };
  }
};