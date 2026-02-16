import axios from "axios";
import localOrders from "../assets/nobitex.json";

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";

const CACHE_KEYS = {
  wallets: "WALLETS_CACHE",
  orders: "ORDERS_CACHE",
  markets: "MARKETS_CACHE",
};

// No cache time needed now
// const CACHE_TIME_KEYS = {...};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getCache = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

const setCache = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Check if we need to fetch: only if cache is empty
const shouldFetch = (type) => {
  const cacheKey = CACHE_KEYS[type];
  const cached = localStorage.getItem(cacheKey);
  return !cached;
};

const mergeOrdersUnique = (ordersArray) => {
  const uniqueMap = new Map();
  ordersArray.forEach((order) => {
    if (order.id != null) uniqueMap.set(order.id, order);
  });
  return Array.from(uniqueMap.values());
};

// Fetch a single data type
export const fetchData = async (type) => {
  const token = localStorage.getItem("NOBITEX_TOKEN");
  const cacheKey = CACHE_KEYS[type];

  // Only fetch if no cached data
  if (!shouldFetch(type)) return getCache(cacheKey);

  try {
    let data = null;

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

      if (type === "orders") {
        data = mergeOrdersUnique([...localOrders, ...data]);
      }

      // Only cache if fetch succeeded
      setCache(cacheKey, data);
    }

    if (type === "markets") {
      const response = await axios.get(`${WORKER_URL}?type=markets`);
      data = response.data.stats || {};
      setCache(cacheKey, data);
    }

    return data;
  } catch (err) {
    console.error(`Fetch ${type} error:`, err);

    if (type === "orders") {
      const cached = getCache(cacheKey) || [];
      return mergeOrdersUnique([...localOrders, ...cached]);
    }

    return getCache(cacheKey) || (type === "markets" ? {} : []);
  }
};

// Fetch all data sequentially with 1-second delay
export const fetchAllData = async () => {
  const wallets = await fetchData("wallets");
  await sleep(1000);

  const orders = await fetchData("orders");
  await sleep(1000);

  const markets = await fetchData("markets");

  return { wallets, orders, markets };
};