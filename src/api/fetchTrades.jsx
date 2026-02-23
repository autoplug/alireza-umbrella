import axios from "axios";

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";

const CACHE_KEY = "TRADES_CACHE";
const CACHE_TIME_KEY = "TRADES_CACHE_TIME";

const MIN_FETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes

// ---------------- CACHE HELPERS ----------------
const getCache = () => {
  const data = localStorage.getItem(CACHE_KEY);
  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

const setCache = (data) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
};

const shouldFetch = () => {
  const last = localStorage.getItem(CACHE_TIME_KEY);
  if (!last) return true;
  return Date.now() - Number(last) > MIN_FETCH_INTERVAL;
};

// ---------------- DELAY ----------------
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------------- FETCH TRADES ----------------
export const fetchTrades = async (onUpdate) => {
  const cached = getCache();

  // 🔹 If cache exists and still valid → return it AND trigger onUpdate
  if (!shouldFetch() && cached) {
    if (typeof onUpdate === "function") {
      onUpdate(cached);
    }
    return cached;
  }

  const fetchAllPages = async () => {
    try {
      const token = localStorage.getItem("NOBITEX_TOKEN");
      if (!token) return [];

      const headers = {
        Authorization: `Token ${token}`,
      };

      let allTrades = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await axios.get(
          `${WORKER_URL}/market/trades/list`,
          {
            params: {
              page,
              pageSize: 100,
            },
            headers,
            validateStatus: () => true,
          }
        );

        const trades = response.data?.trades || [];

        if (trades.length > 0) {
          allTrades = [...allTrades, ...trades];
          page++;
          await delay(2000);
        } else {
          hasMore = false;
        }
      }

      if (allTrades.length > 0) {
        setCache(allTrades);

        if (typeof onUpdate === "function") {
          onUpdate(allTrades);
        }
      }

      return allTrades;

    } catch (err) {
      console.error("Fetch trades failed:", err);

      // 🔹 On error → return cache and also trigger onUpdate
      if (cached && typeof onUpdate === "function") {
        onUpdate(cached);
      }

      return cached || [];
    }
  };

  // 🔹 If cache exists but expired → return cache immediately + refresh
  if (cached) {
    if (typeof onUpdate === "function") {
      onUpdate(cached);
    }

    fetchAllPages(); // background refresh
    return cached;
  }

  // 🔹 No cache → fetch fresh
  return await fetchAllPages();
};