import axios from "axios";

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";

// Fetch wallets
export const fetchWallets = async ({ onUpdate } = {}) => {
  try {
    const token = localStorage.getItem("NOBITEX_TOKEN");
    if (!token) return { wallets: [], _lastUpdate: null };

    const url = `${WORKER_URL}/users/wallets/list`;
    const headers = { Authorization: `Token ${token}` };

    const response = await axios.get(url, { headers, validateStatus: () => true });
    const wallets = response.data?.wallets || [];

    const lastUpdate = Date.now();

    // Callback for Header or other components
    if (typeof onUpdate === "function") {
      onUpdate({ wallets, _lastUpdate: lastUpdate });
    }

    return { wallets, _lastUpdate: lastUpdate };
  } catch (err) {
    console.error("fetchOrders failed:", err);
    return { wallets: [], _lastUpdate: null };
  }
};