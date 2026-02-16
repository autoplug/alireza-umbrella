import axios from "axios";
import localOrders from "../assets/nobitex.json";

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";

const CACHE_KEYS = {
  wallets: "WALLETS_CACHE",
  orders: "ORDERS_CACHE",
  markets: "MARKETS_CACHE",
};

const CACHE_TIME_KEY = "API_CACHE_TIME";
const MIN_FETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes

// 1 second delay helper
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

// Merge orders and remove duplicates by id
const mergeOrdersUnique = (ordersArray) => {
  const uniqueMap = new Map();
  ordersArray.forEach((order) => {
    if (order.id != null) uniqueMap.set(order.id, order);
  });
  return Array.from(uniqueMap.values());
};

// Fetch single type
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

      data =
        type === "wallets"
          ? response.data.wallets || []
          : response.data.orders || [];

      if (type === "orders") {
        data = mergeOrdersUnique([...localOrders, ...data]);
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
      return mergeOrdersUnique([...localOrders, ...cached]);
    }

    return getCache(cacheKey) || (type === "markets" ? {} : []);
  }
};

// Fetch all data sequentially with 1 second delay between each request
export const fetchAllData = async () => {
  const wallets = await fetchData("wallets");

  await sleep(1000); // 1 second delay

  const orders = await fetchData("orders");

  await sleep(1000); // 1 second delay

  const markets = await fetchData("markets");

  return { wallets, orders, markets };
};