import axios from "axios";

// Worker URL
const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";

// LocalStorage keys
const CACHE_KEYS = {
  wallets: "WALLETS_CACHE",
  orders: "ORDERS_CACHE",
  markets: "MARKETS_CACHE",
};

// Single cache timestamp for all types
const CACHE_TIME_KEY = "API_CACHE_TIME";

// Minimum interval between server calls (5 min)
const MIN_FETCH_INTERVAL = 5 * 60 * 1000;

// Read cache
const getCache = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

// Write cache + update timestamp
const setCache = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
};

// Check if cache expired
const shouldFetch = () => {
  const lastFetch = localStorage.getItem(CACHE_TIME_KEY);
  return !lastFetch || Date.now() - Number(lastFetch) > MIN_FETCH_INTERVAL;
};

// Fetch data for a type: wallets / orders / markets
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
    }

    if (type === "markets") {
      // fetch from Worker (or direct API) and extract 'stats'
      const response = await axios.get(`${WORKER_URL}?type=markets`);
      data = response.data.stats || {};
    }

    setCache(cacheKey, data);
    return data;
  } catch (err) {
    console.error(`Fetch ${type} error:`, err);
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