import axios from "axios";

const WORKER_URL = "https://nobitex3.alireza-b83.workers.dev";

export const fetchHistory = async ({
  symbol = "BTCIRT",
  resolution = "60",
  onUpdate = null,
} = {}) => {
  let from = Math.floor(Date.now() / 1000);
  if(resolution === "60")
    from -= 60 * 60 * 24 * 5;
  if(resolution === "1D")
    from -= 60 * 60 * 24 * 30;
  
  const to = Math.floor(Date.now() / 1000);
  
  try {
    let headers = {};
    
    if (!symbol) return { history: [], _lastUpdate: null };
    symbol = symbol.toUpperCase().replace("RLS","IRT").replace("-","");
    
    const url = `${WORKER_URL}/market/udf/history`;

    const response = await axios.get(url, {
      params: {
        symbol,
        resolution,
        from,
        to,
      },
      headers,
      validateStatus: () => true,
    });

    const raw = response.data;

    // Normalize for Lightweight Charts
    let candles = [];

    // Parse response if status is ok
    if (raw?.s === "ok" && Array.isArray(raw.t)) {
      candles = raw.t.map((time, i) => ({
        time: Math.floor(Number(raw.t[i]) / 1000),  // unix timestamp in seconds
        open: Number(raw.o[i]),
        high: Number(raw.h[i]),
        low: Number(raw.l[i]),
        close: Number(raw.c[i]),
        volume: Number(raw.v[i]),
      }));
    }

    return {candles, _lastUpdate: Date.now(),};
  } catch (error) {
    console.error("fetchHistory failed:", error);
    return { candles: [], _lastUpdate: null };
  }
};