import axios from "axios";
import localOrders from "../assets/nobitex.json";

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";

const CACHE_KEYS = {
  wallets: "WALLETS_CACHE",
  orders: "ORDERS_CACHE",
  markets: "MARKETS_CACHE",
};

const CACHE_TIME_KEYS = {
  wallets: "WALLETS_CACHE_TIME",
  orders: "ORDERS_CACHE_TIME",
  markets: "MARKETS_CACHE_TIME",
};

// 5 minutes (you had 100ms before)
const MIN_FETCH_INTERVAL = 5 * 60 * 1000;


// ---------------- CACHE HELPERS ----------------

const getCache = (key) => {
  const data = localStorage.getItem(key);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

const setCache = (key, value, type) => {
  localStorage.setItem(key, JSON.stringify(value));
  localStorage.setItem(CACHE_TIME_KEYS[type], Date.now().toString());
};

const shouldFetch = (type) => {
  const last = localStorage.getItem(CACHE_TIME_KEYS[type]);
  if (!last) return true;
  return Date.now() - Number(last) > MIN_FETCH_INTERVAL;
};


// ---------------- ORDERS MERGE ----------------

const mergeOrdersUnique = (ordersArray) => {
  const map = new Map();
  ordersArray.forEach((order) => {
    if (order?.id != null) map.set(order.id, order);
  });
  return Array.from(map.values());
};


// ---------------- FETCH DATA ----------------

export const fetchData = async (type) => {
  const cacheKey = CACHE_KEYS[type];
  const cached = getCache(cacheKey);

  // Use cache if still valid
  if (!shouldFetch(type) && cached) {
    return cached;
  }

  try {
    let url = "";
    let data = null;

    // ----- WALLET -----
    if (type === "wallets") {
      const token = localStorage.getItem("NOBITEX_TOKEN");
      if (!token) return [];

      url = `${WORKER_URL}/users/wallets/list`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Token ${token}`,
        },
        validateStatus: () => true,
      });

      data = response.data?.wallets || [];

      if (Array.isArray(data) && data.length > 0) {
        setCache(cacheKey, data, type);
      }

      return data;
    }

    // ----- ORDERS -----
    if (type === "orders") {
      const token = localStorage.getItem("NOBITEX_TOKEN");

      url = `${WORKER_URL}/market/orders/list?details=2&status=all`;

      const response = await axios.get(url, {
        headers: token ? { Authorization: `Token ${token}` } : {},
        validateStatus: () => true,
      });

      data = response.data?.orders || [];

      const merged = mergeOrdersUnique([...localOrders, ...data]);

      if (merged.length > 0) {
        setCache(cacheKey, merged, type);
      }

      return merged;
    }

    // ----- MARKETS -----
    if (type === "markets") {
      url = `${WORKER_URL}/market/stats`;

      const response = await axios.get(url, {
        validateStatus: () => true,
      });

      data = response.data?.stats || {};

      if (data && Object.keys(data).length > 0) {
        setCache(cacheKey, data, type);
      }

      return data;
    }

  } catch (err) {
    console.error(`Fetch ${type} failed:`, err);

    if (type === "orders") {
      const fallback = cached || [];
      return mergeOrdersUnique([...localOrders, ...fallback]);
    }

    return cached || (type === "markets" ? {} : []);
  }
};


// ---------------- FETCH ALL ----------------

export const fetchAllData = async () => {
  const results = {};

  for (const type of ["wallets", "orders", "markets"]) {
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