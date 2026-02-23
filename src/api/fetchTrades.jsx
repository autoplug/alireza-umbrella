// src/api/fetchTrades.jsx
import axios from "axios";

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";

export const fetchTrades = async ({ onUpdate } = {}) => {
  const token = localStorage.getItem("NOBITEX_TOKEN");
  if (!token) return [];

  const headers = { Authorization: `Token ${token}` };
  let allTrades = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await axios.get(`${WORKER_URL}/market/trades/list`, {
      params: { page, pageSize: 100 },
      headers,
      validateStatus: () => true,
    });

    const trades = response.data?.trades || [];

    if (trades.length > 0) {
      allTrades = [...allTrades, ...trades];
      page++;
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2s delay
    } else {
      hasMore = false;
    }
  }

  return allTrades;
};