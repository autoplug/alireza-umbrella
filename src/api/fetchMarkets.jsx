import axios from "axios";

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";

// Fetch all active orders
export const fetchMarkets = async ({ onUpdate } = {}) => {
  try {
    let headers = {};
    const url = `${WORKER_URL}/market/stats`;

    const res = await axios.get(url, { headers, validateStatus: () => true });
    const rawMarkets = res.data?.markets || {};

    // Normalize Data

    const lastUpdate = Date.now();

    // Callback for Header or other components
    if (typeof onUpdate === "function") {
      onUpdate({ orders, _lastUpdate: lastUpdate });
    }

    return { orders, _lastUpdate: lastUpdate };
  } catch (err) {
    console.error("fetchOrders failed:", err);
    return { orders: [], _lastUpdate: null };
  }
};