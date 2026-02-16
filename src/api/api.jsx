import axios from "axios";

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";
const CACHE_TIME_KEY = "API_CACHE_TIME";
const CACHE_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const fetchAllData = async () => {
  const now = Date.now();
  const lastFetch = localStorage.getItem(CACHE_TIME_KEY);

  // Prevent frequent calls
  if (lastFetch && now - Number(lastFetch) < CACHE_INTERVAL) {
    return JSON.parse(localStorage.getItem("API_CACHE")) || {};
  }

  try {
    const token = localStorage.getItem("NOBITEX_TOKEN");
    if (!token) return {};

    // Fetch all endpoints
    const [walletsRes, ordersRes] = await Promise.all([
      axios.get(`${WORKER_URL}?type=wallets`, {
        headers: { Authorization: `Token ${token}` },
      }),
      axios.get(`${WORKER_URL}?type=myorders&details=2`, {
        headers: { Authorization: `Token ${token}` },
      }),
    ]);

    const data = {
      wallets: walletsRes.data.wallets || [],
      orders: ordersRes.data.orders || [],
    };

    // Save to localStorage
    localStorage.setItem("API_CACHE", JSON.stringify(data));
    localStorage.setItem(CACHE_TIME_KEY, now.toString());

    return data;
  } catch (err) {
    console.error("Fetch all data error:", err);
    return JSON.parse(localStorage.getItem("API_CACHE")) || {};
  }
};