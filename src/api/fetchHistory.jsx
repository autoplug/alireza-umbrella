import axios from "axios";
import { formatChartPrice } from "./utils";

const WORKER_URL = "https://nobitex3.alireza-b83.workers.dev";

export const fetchHistory = async ({
  symbol = "BTCIRT",
  resolution = "60",
  onUpdate = null,
} = {}) => {
  let from = Math.floor(Date.now() / 1000);
  if(resolution === "1D"){
    from -= 60 * 60 * 24 * 30 * 36; //3 years
  }else{
    from -= 60 * 60 * 24 * 90; //60 day
  }
    
  
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

    let candles = [];
    
    if (raw?.s === "ok" && Array.isArray(raw.t)) {
      candles = raw.t.map((time, i) => ({
        time: Number(raw.t[i]),   // ✅ بدون تقسیم بر 1000
        open: formatChartPrice(raw.o[i], symbol),
        high: formatChartPrice(raw.h[i], symbol),
        low: formatChartPrice(raw.l[i], symbol),
        close: formatChartPrice(raw.c[i], symbol),
        volume: Number(raw.v[i]),
      }));
    }

    return {candles, _lastUpdate: Date.now(),};
  } catch (error) {
    console.error("fetchHistory failed:", error);
    return { candles: [], _lastUpdate: null };
  }
};