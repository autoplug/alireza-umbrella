// src/api/fetchTrades.jsx
import axios from "axios";

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";

export const fetchTrades = async ({ onUpdate } = {}) => {
  try{
    const token = localStorage.getItem("NOBITEX_TOKEN");
    if (!token) return [];
  
    const headers = { Authorization: `Token ${token}` };
    let trades = [];
    let page = 1;
    let hasMore = true;
  
    while (hasMore) {
      const response = await axios.get(`${WORKER_URL}/market/trades/list`, {
        params: { page, pageSize: 100 },
        headers,
        validateStatus: () => true,
      });
  
      const data = response.data?.trades || [];
  
      if (data.length > 0) {
        data = [...data, ...trades];
        page++;
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2s delay
      } else {
        hasMore = false;
      }
    }


    const lastUpdate = Date.now();

    // Callback for Header or other components
    if (typeof onUpdate === "function") {
      onUpdate({ trades, _lastUpdate: lastUpdate });
    }

    return { trades, _lastUpdate: lastUpdate };
  } catch (err) {
    console.error("fetchOrders failed:", err);
    return { trades: [], _lastUpdate: null };
  }




};