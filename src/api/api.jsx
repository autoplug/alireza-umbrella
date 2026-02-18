import axios from "axios";

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";

// 5 minutes
const MIN_FETCH_INTERVAL = 5 * 60 * 1000;

const CACHE_KEYS = {
  wallets: "WALLETS_CACHE",
  orders: "ORDERS_CACHE",
  markets: "MARKETS_CACHE",
  trades: "TRADES_CACHE", // ✅ NEW
};

const CACHE_TIME_KEYS = {
  wallets: "WALLETS_CACHE_TIME",
  orders: "ORDERS_CACHE_TIME",
  markets: "MARKETS_CACHE_TIME",
  trades: "TRADES_CACHE_TIME", // ✅ NEW
};

// ---------------- CACHE HELPERS ----------------

const getCache = (type) => {
  const data = localStorage.getItem(CACHE_KEYS[type]);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

const setCache = (type, value) => {
  localStorage.setItem(CACHE_KEYS[type], JSON.stringify(value));
  localStorage.setItem(CACHE_TIME_KEYS[type], Date.now().toString());
};

const shouldFetch = (type) => {
  const last = localStorage.getItem(CACHE_TIME_KEYS[type]);
  if (!last) return true;
  return Date.now() - Number(last) > MIN_FETCH_INTERVAL;
};

// ---------------- CORE FETCH ----------------

export const fetchData = async (type) => {
  const cached = getCache(type);

  // Use cache if still valid
  if (!shouldFetch(type) && cached) {
    return cached;
  }

  try {
    let url = "";
    let headers = {};

    if (type === "wallets") {
      const token = localStorage.getItem("NOBITEX_TOKEN");
      if (!token) return [];
      headers.Authorization = `Token ${token}`;
      url = `${WORKER_URL}/users/wallets/list`;
    }

    if (type === "orders") {
      const token = localStorage.getItem("NOBITEX_TOKEN");
      if (token) headers.Authorization = `Token ${token}`;
      url = `${WORKER_URL}/market/orders/list?details=2&status=all`;
    }

    if (type === "markets") {
      url = `${WORKER_URL}/market/stats`;
    }

    // ✅ NEW ENDPOINT
    if (type === "trades") {
      const token = localStorage.getItem("NOBITEX_TOKEN");
      if (token) headers.Authorization = `Token ${token}`;
      url = `${WORKER_URL}/market/trades/list`;
    }

    const response = await axios.get(url, {
      headers,
      validateStatus: () => true,
    });

    let data;

    if (type === "wallets") {
      data = response.data?.wallets || [];
    }

    if (type === "orders") {
      data = response.data?.orders || [];
    }

    if (type === "markets") {
      data = response.data?.stats || {};
    }

    // ✅ NEW DATA HANDLING
    if (type === "trades") {
      data = response.data?.trades || [];
    }

    // Save cache only if valid data received
    const isValid =
      Array.isArray(data)
        ? data.length > 0
        : data && Object.keys(data).length > 0;

    if (isValid) {
      setCache(type, data);
    }

    return data;

  } catch (err) {
    console.error(`Fetch ${type} failed:`, err);
    return cached || (type === "markets" ? {} : []);
  }
};

// ---------------- FETCH ALL ----------------

export const fetchAllData = async () => {
  const results = {};

  for (const type of ["wallets", "orders", "markets", "trades"]) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      results[type] = await fetchData(type);
    } catch (err) {
      console.error(`Error fetching ${type}:`, err);
      results[type] = type === "markets" ? {} : [];
    }
  }

  return results;
};