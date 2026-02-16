import axios from "axios";
import localOrders from "../assets/nobitex.json";

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";

// Cache keys for storing data
const CACHE_KEYS = {
  wallets: "WALLETS_CACHE",
  orders: "ORDERS_CACHE",
  markets: "MARKETS_CACHE",
};

// Separate cache timestamps for each data type
const CACHE_TIME_KEYS = {
  wallets: "WALLETS_CACHE_TIME",
  orders: "ORDERS_CACHE_TIME",
  markets: "MARKETS_CACHE_TIME",
};

const MIN_FETCH_INTERVAL = 5 * 60 * 1000; // Minimum 5 minutes between fetches

// Helper: sleep for specified milliseconds
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper: get cached data from localStorage
const getCache = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

// Helper: set cache in localStorage and update timestamp
const setCache = (type, key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  localStorage.setItem(CACHE_TIME_KEYS[type], Date.now().toString());
};

// Helper: check if data should be fetched (based on cache time)
const shouldFetch = (type) => {
  const lastFetch = localStorage.getItem(CACHE_TIME_KEYS[type]);
  return !lastFetch || Date.now() - Number(lastFetch) > MIN_FETCH_INTERVAL;
};

// Merge orders and remove duplicates by 'id'
const mergeOrdersUnique = (ordersArray) => {
  const uniqueMap = new Map();
  ordersArray.forEach((order) => {
    if (order.id != null) uniqueMap.set(order.id, order);
  });
  return Array.from(uniqueMap.values());
};

// Fetch a single data type: wallets, orders, or markets
export const fetchData = async (type) => {
  const token = localStorage.getItem("NOBITEX_TOKEN");
  const cacheKey = CACHE_KEYS[type];

  // Return cache if it's still valid
  if (!shouldFetch(type)) return getCache(cacheKey);

  try {
    let data = null;

    // Wallets or Orders require token
    if (type === "wallets" || type === "orders") {
      if (!token) return [];

      let url = `${WORKER_URL}?type=${type}`;
      if (type === "orders") url += "&details=2&status=all";

      const response = await axios.get(url, {
        headers: { Authorization: `Token ${token}` },
      });

      data =
        type === "wallets"
          ? response.data.wallets || []
          : response.data.orders || [];

      // Merge with local orders and remove duplicates
      if (type === "orders") {
        data = mergeOrdersUnique([...localOrders, ...data]);
      }

      // ✅ Only update cache if fetch succeeded
      setCache(type, cacheKey, data);
    }

    // Markets do not require token
    if (type === "markets") {
      const response = await axios.get(`${WORKER_URL}?type=markets`);
      data = response.data.stats || {};

      setCache(type, cacheKey, data);
    }

    return data;
  } catch (err) {
    console.error(`Fetch ${type} error:`, err);

    // On error, return cached data (or localOrders for orders)
    if (type === "orders") {
      const cached = getCache(cacheKey) || [];
      return mergeOrdersUnique([...localOrders, ...cached]);
    }

    return getCache(cacheKey) || (type === "markets" ? {} : []);
  }
};

// Fetch all data sequentially with 1-second delay between each request
export const fetchAllData = async () => {
  const wallets = await fetchData("wallets");
  await sleep(1000); // 1-second delay

  const orders = await fetchData("orders");
  await sleep(1000); // 1-second delay

  const markets = await fetchData("markets");

  return { wallets, orders, markets };
};