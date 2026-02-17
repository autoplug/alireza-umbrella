import React, { useEffect, useState } from "react";

// Keys must match api.js
const CACHE_TIME_KEYS = {
  wallets: "WALLETS_CACHE_TIME",
  orders: "ORDERS_CACHE_TIME",
  markets: "MARKETS_CACHE_TIME",
};

export default function Header({ type = "wallets" }) {
  const [lastUpdate, setLastUpdate] = useState(null);

  // Format timestamp to HH:MM:SS
  const formatTime = (ts) => {
    if (!ts) return "Never";
    const date = new Date(Number(ts));
    return date.toLocaleTimeString();
  };

  useEffect(() => {
    const update = () => {
      const ts = localStorage.getItem(CACHE_TIME_KEYS[type]);
      setLastUpdate(ts);
    };

    update();

    // Optional: listen to storage events in case fetchAllData runs elsewhere
    const listener = () => update();
    window.addEventListener("storage", listener);

    return () => window.removeEventListener("storage", listener);
  }, [type]);

  return (
    <div
      style={{
        backgroundColor: "#222",
        color: "#fff",
        padding: "8px 16px",
        fontFamily: "monospace",
        textAlign: "center",
      }}
    >
      Last {type} update: {formatTime(lastUpdate)}
    </div>
  );
}