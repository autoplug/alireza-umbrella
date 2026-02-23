import axios from "axios";

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";

// Fetch all active orders
export const fetchHistory = async ({ onUpdate } = {}) => {
  try {
    const headers = { };

    const url =
      `${WORKER_URL}/market/udf/history?` +
      new URLSearchParams({ symbol, resolution, from, to });

      const response = await axios.get(url, { validateStatus: () => true });
      const raw = response.data;
      
      let markets = []
      // Parse response if status is ok
      if (raw?.s === "ok" && Array.isArray(raw.t)) {
        markets = raw.t.map((time, i) => ({
          time,                // unix timestamp in seconds
          open: raw.o[i],
          high: raw.h[i],
          low: raw.l[i],
          close: raw.c[i],
          volume: raw.v[i],
        }));
      }

    const lastUpdate = Date.now();

    // Callback for Header or other components
    if (typeof onUpdate === "function") {
      onUpdate({ markets, _lastUpdate: lastUpdate });
    }

    return { markets, _lastUpdate: lastUpdate };
  } catch (err) {
    console.error("fetchOrders failed:", err);
    return { markets: [], _lastUpdate: null };
  }
};