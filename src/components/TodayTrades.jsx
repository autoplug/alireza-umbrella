import React, { useState, useEffect } from "react";
import TableOrder from "./TableOrder";
import TitleBar from "./TitleBar";

const TRADES_CACHE_KEY = "TRADES_CACHE";

// Helper function to check if a timestamp is from today in Tehran timezone
const isTodayTehran = (timestamp) => {
  if (!timestamp) return false;

  const dateUtc = new Date(timestamp); // timestamp from API
  // Convert to Tehran time (UTC+3:30)
  const dateTehran = new Date(dateUtc.getTime() + 3.5 * 60 * 60 * 1000);

  const nowTehran = new Date();
  const nowTehranOffset = new Date(nowTehran.getTime() + 3.5 * 60 * 60 * 1000);

  // Get today's date in Tehran
  const year = nowTehranOffset.getUTCFullYear();
  const month = nowTehranOffset.getUTCMonth();
  const day = nowTehranOffset.getUTCDate();

  // Start of today in Tehran (00:00)
  const todayStart = new Date(Date.UTC(year, month, day, 0, 0, 0));

  return dateTehran >= todayStart;
};

export default function TodayTrades() {
  const [trades, setTrades] = useState([]);

  // Load trades from localStorage and filter by Tehran today
  useEffect(() => {
    const cached = localStorage.getItem(TRADES_CACHE_KEY);
    if (!cached) {
      setTrades([]);
      return;
    }

    try {
      const allTrades = JSON.parse(cached);

      // Filter trades with timestamp >= 00:00 Tehran today
      const todayTrades = allTrades.filter((t) => isTodayTehran(t.timestamp));

      setTrades(todayTrades);
    } catch {
      setTrades([]);
    }
  }, []); // Empty dependency array → runs once on mount

  return (
    <div>
      <TitleBar title="Today Trades" count={trades.length} />
      <TableOrder orders={trades} />
    </div>
  );
}