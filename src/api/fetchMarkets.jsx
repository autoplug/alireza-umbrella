import axios from "axios";

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";
const CACHE_KEY = "MARKETS_CACHE";
const CACHE_TIME_KEY = "MARKETS_CACHE_TIME";
// 5 minutes
const MIN_FETCH_INTERVAL = 5 * 60 * 1000;

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

// ---------------- FETCH MARKETS ----------------
export const fetchMarkets = async () => {
  const cached = getCache();

  // Use cache if still valid
  if (!shouldFetch() && cached) {
    return cached;
  }

  // Internal function to fetch fresh data
  const fetchNewData = async () => {
    
    try {
      const url = `${WORKER_URL}/market/stats`;
      
      const response = await axios.get(url, {
        headers,
        validateStatus: () => true,
      });

      let data = response.data?.stats || {};
      data = Object.fromEntries(
        Object.entries(data)
          .filter(([_, value]) => value && value.latest != null)
          .map(([market, value]) => [market, Number(value.latest)])
      );
  
      // Update cache and trigger callback if provided
      if (data && Object.keys(data).length > 0) {
        setCache(data);
        //if (typeof onUpdate === "function") onUpdate(data);
      }

      return data;
    } catch (err) {
      console.error(`Fetch history failed :`, err);
      return cached || [];
    }
  };

  // If cache exists, return it immediately and refresh in background
  if (cached) {
    fetchNewData(); // background refresh
    return cached;
  }

  // Otherwise, fetch and return immediately
  return await fetchNewData();
};