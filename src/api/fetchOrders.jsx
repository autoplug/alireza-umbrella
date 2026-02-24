import axios from "axios";

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";

// Fetch all active orders
export const fetchOrders = async ({ onUpdate } = {}) => {
  try {
    const token = localStorage.getItem("NOBITEX_TOKEN");
    if (!token) return { orders: [], _lastUpdate: null };

    const url = `${WORKER_URL}/market/orders/list?status=Active&details=2`;
    const headers = { Authorization: `Token ${token}` };

    const response = await axios.get(url, { headers, validateStatus: () => true });
    const rawOrders = response.data?.orders || [];

    // Normalize data
    const orders = rawOrders.map((o) => ({
      ...o,
      price: Number(o.price),
      amount: Number(o.amount),
      fee: Number(o.fee),
      market: o.market?.toLowerCase() || o.market,
    }));

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