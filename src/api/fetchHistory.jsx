import axios from "axios";

const WORKER_URL = "https://nobitex3.alireza-b83.workers.dev";

export const fetchHistory = async ({
  symbol,
  resolution,
  from,
  to,
} = {}) => {
  try {
    if (!symbol) return { candles: [], _lastUpdate: null };

    const url = `${WORKER_URL}/market/history`;

    const response = await axios.get(url, {
      params: {
        symbol: symbol.toLowerCase(),
        resolution,
        from,
        to,
      },
      validateStatus: () => true,
    });

    const raw = response.data?.candles || [];

    // Normalize for Lightweight Charts
    const candles = raw.map((c) => ({
      time: Number(c.time),      // unix (seconds)
      open: Number(c.open),
      high: Number(c.high),
      low: Number(c.low),
      close: Number(c.close),
      volume: Number(c.volume),
    }));

    return {
      candles,
      _lastUpdate: Date.now(),
    };
  } catch (error) {
    console.error("fetchHistory failed:", error);
    return { candles: [], _lastUpdate: null };
  }
};