import React, { useEffect, useState } from "react";

// Keys from api.js
const CACHE_TIME_KEYS = {
  wallets: "WALLETS_CACHE_TIME",
  orders: "ORDERS_CACHE_TIME",
};

// Helper: simplified time ago in English
const simpleTimeAgo = (timestamp) => {
  if (!timestamp) return "Never";

  const diff = Date.now() - Number(timestamp);
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "more than an hour ago";
};

export default function Header() {
  const [lastUpdate, setLastUpdate] = useState(null);

  const updateTime = () => {
    const walletTs = localStorage.getItem(CACHE_TIME_KEYS.wallets);
    const ordersTs = localStorage.getItem(CACHE_TIME_KEYS.orders);

    const latest = [walletTs, ordersTs]
      .filter(Boolean)
      .map(Number)
      .sort((a, b) => b - a)[0];

    setLastUpdate(latest || null);
  };

  useEffect(() => {
    updateTime();

    // Refresh every 30 seconds for accuracy
    const interval = setInterval(updateTime, 30000);

    // Listen to storage events
    const listener = () => updateTime();
    window.addEventListener("storage", listener);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", listener);
    };
  }, []);

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
      Last update: {simpleTimeAgo(lastUpdate)}
    </div>
  );
}