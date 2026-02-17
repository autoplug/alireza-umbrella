import React, { useEffect, useState } from "react";

// Key must match api.js
const ORDERS_CACHE_KEY = "ORDERS_CACHE";

export default function ActiveOrders() {
  const [orders, setOrders] = useState([]);

  const loadOrdersFromCache = () => {
    const cached = localStorage.getItem(ORDERS_CACHE_KEY);
    if (!cached) {
      setOrders([]);
      return;
    }

    try {
      const allOrders = JSON.parse(cached);
      // Only keep orders with Status = "Active"
      const activeOrders = allOrders.filter((o) => o.status === "Active");
      setOrders(activeOrders);
    } catch {
      setOrders([]);
    }
  };

  useEffect(() => {
    loadOrdersFromCache();

    // Optional: refresh every 30 seconds in case cache updated
    const interval = setInterval(loadOrdersFromCache, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "16px" }}>
      <h3>Active Orders</h3>
      {orders.length === 0 ? (
        <p>No active orders.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              {order.pair || order.symbol} — {order.amount} @ {order.price} — {order.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}