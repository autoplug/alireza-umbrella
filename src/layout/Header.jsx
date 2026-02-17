import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

// Keys from api.js
const CACHE_TIME_KEYS = {
  wallets: "WALLETS_CACHE_TIME",
  orders: "ORDERS_CACHE_TIME",
};

// Helper: time ago with icon color
const simpleTimeAgo = (timestamp) => {
  if (!timestamp) return { text: "Never", color: "gray" };

  const diff = Date.now() - Number(timestamp);
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return { text: "just now", color: "limegreen" }; // green
  if (minutes < 60) return { text: `${minutes} minute${minutes > 1 ? "s" : ""} ago`, color: "gold" }; // yellow
  return { text: "more than an hour ago", color: "red" }; // red
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
    const interval = setInterval(updateTime, 10000);

    const listener = () => updateTime();
    window.addEventListener("storage", listener);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", listener);
    };
  }, []);

  const { text, color } = simpleTimeAgo(lastUpdate);

  return (
    <div
        style={{
          color : "#fff",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          justifyContent: "flex-start",
          position: "fixed",
          fontFamily : "monospace",
          top: 1,
          left: 0,
          height: "40px",
          width: "100%",
          backgroundColor: "#858585",
          borderBottom: "2px solid #707070",
          padding: "8px 16px",
          zIndex: 1000,        // بالاتر از سایر المان‌ها
          fontSize: "12px",
      }}
    >
      <FontAwesomeIcon icon={faCircleCheck} style={{ color }} />
      <span> Last update: {text}</span>
    </div>
  );
}