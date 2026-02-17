import axios from "axios";
import localOrders from "../assets/nobitex.json"; // local backup for orders

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

const MIN_FETCH_INTERVAL = 100; // 5 minutes

// Read from cache safely
const getCache = (key) => {
  const data = localStorage.getItem(key);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

// Save to cache and update its timestamp
const setCache = (key, value, type) => {
  localStorage.setItem(key, JSON.stringify(value));
  localStorage.setItem(CACHE_TIME_KEYS[type], Date.now().toString());
};

// Check if we need to fetch based on last fetch time for this type
const shouldFetch = (type) => {
  const last = localStorage.getItem(CACHE_TIME_KEYS[type]);
  if (!last) return true;
  return Date.now() - Number(last) > MIN_FETCH_INTERVAL;
};

// Merge orders and remove duplicates by id
const mergeOrdersUnique = (ordersArray) => {
  const map = new Map();
  ordersArray.forEach((order) => {
    if (order.id != null) map.set(order.id, order);
  });
  return Array.from(map.values());
};

// Fetch a specific type of data
export const fetchData = async (type) => {
  const cacheKey = CACHE_KEYS[type];
  const cached = getCache(cacheKey);

  // Use cache if valid and recent
  if (!shouldFetch(type) && cached) {
    return cached;
  }

  try {
    let data = null;

    if (type === "wallets" || type === "orders") {
      const token = localStorage.getItem("NOBITEX_TOKEN");
      if (!token && type === "wallets") return [];

      let url = `${WORKER_URL}?type=${type}`;
      if (type === "orders") url += "&details=2&status=all";

      const response = await axios.get(url, {
        headers: token ? { Authorization: `Token ${token}` } : {},
      });

      data = type === "wallets" ? response.data.wallets || [] : response.data.orders || [];

      if (type === "orders") {
        data = mergeOrdersUnique([...localOrders, ...data]);
      }

      // ✅ Save to cache ONLY if data is valid and non-empty
      if (data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)) {
        setCache(cacheKey, data, type);
      }
    }

    if (type === "markets") {
      const response = await axios.get(`${WORKER_URL}?type=markets`);
      data = response.data.stats || {};
      if (data && Object.keys(data).length > 0) {
        setCache(cacheKey, data, type);
      }
    }

    return data;
  } catch (err) {
    console.error(`Fetch ${type} failed:`, err);

    // Fallback: use cached data or localOrders for orders
    if (type === "orders") {
      const fallback = cached || [];
      return mergeOrdersUnique([...localOrders, ...fallback]);
    }

    return cached || (type === "markets" ? {} : []);
  }
};

// Fetch all types independently
export const fetchAllData = async () => {
  const results = {};

  for (const type of ["wallets", "orders", "markets"]) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      results[type] = await fetchData(type);
    } catch (err) {
      console.error(`Error fetching ${type}:`, err);
      results[type] = type === "markets" ? {} : [];
    }
  }

  return results;
};