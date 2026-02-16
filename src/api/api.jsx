import axios from "axios";
import localOrders from "../assets/localOrders.json"; // local JSON file

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";

const CACHE_KEYS = {
  wallets: "WALLETS_CACHE",
  orders: "ORDERS_CACHE",
  markets: "MARKETS_CACHE",
};

const CACHE_TIME_KEY = "API_CACHE_TIME";
const MIN_FETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes

const getCache = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

const setCache = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
};

const shouldFetch = () => {
  const lastFetch = localStorage.getItem(CACHE_TIME_KEY);
  return !lastFetch || Date.now() - Number(lastFetch) > MIN_FETCH_INTERVAL;
};

export const fetchData = async (type) => {
  const token = localStorage.getItem("NOBITEX_TOKEN");
  const cacheKey = CACHE_KEYS[type];

  if (!shouldFetch()) return getCache(cacheKey);

  try {
    let data = null;

    if (type === "wallets" || type === "orders") {
      if (!token) return [];

      let url = `${WORKER_URL}?type=${type}`;
      if (type === "orders") url += "&details=2&status=all";

      const response = await axios.get(url, {
        headers: { Authorization: `Token ${token}` },
      });

      data = type === "wallets" ? response.data.wallets || [] : response.data.orders || [];

      if (type === "orders") {
        // Merge with localOrders but avoid duplicates by id
        const combined = [...localOrders, ...data];
        const uniqueMap = new Map();
        combined.forEach((order) => {
          if (order.id != null) uniqueMap.set(order.id, order);
        });
        data = Array.from(uniqueMap.values());
      }
    }

    if (type === "markets") {
      const response = await axios.get(`${WORKER_URL}?type=markets`);
      data = response.data.stats || {};
    }

    setCache(cacheKey, data);
    return data;
  } catch (err) {
    console.error(`Fetch ${type} error:`, err);

    if (type === "orders") {
      const cached = getCache(cacheKey) || [];
      const combined = [...localOrders, ...cached];
      const uniqueMap = new Map();
      combined.forEach((order) => {
        if (order.id != null) uniqueMap.set(order.id, order);
      });
      return Array.from(uniqueMap.values());
    }

    return getCache(cacheKey) || (type === "markets" ? {} : []);
  }
};

// Fetch all data at once
export const fetchAllData = async () => {
  const [wallets, orders, markets] = await Promise.all([
    fetchData("wallets"),
    fetchData("orders"),
    fetchData("markets"),
  ]);

  return { wallets, orders, markets };
};