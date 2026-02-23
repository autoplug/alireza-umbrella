import axios from "axios";

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";

// Fetch all active orders
export const fetchMarkets = async ({ onUpdate } = {}) => {
  try {
    let headers = {};
    const url = `${WORKER_URL}/market/stats`;

    const response = await axios.get(url, { headers, validateStatus: () => true });

    // Normalize Data
    let markets = response.data?.stats || {};
    markets = Object.fromEntries(
      Object.entries(markets)
        .filter(([_, value]) => value && value.latest != null)
        .map(([market, value]) => [market, Number(value.latest)])
      );

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