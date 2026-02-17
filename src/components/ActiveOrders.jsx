import React, { useEffect, useState } from "react";

// Cache key must match api.js
const ORDERS_CACHE_KEY = "ORDERS_CACHE";

export default function ActiveOrders() {
  const [ordersByPair, setOrdersByPair] = useState({});

  const loadOrdersFromCache = () => {
    const cached = localStorage.getItem(ORDERS_CACHE_KEY);
    if (!cached) {
      setOrdersByPair({});
      return;
    }

    try {
      const allOrders = JSON.parse(cached);

      // Filter orders with Status = "Active"
      const activeOrders = allOrders.filter((o) => o.status === "Active");

      // Group by pair or symbol
      const grouped = activeOrders.reduce((acc, order) => {
        const key = order.pair || order.symbol || "Unknown";
        if (!acc[key]) acc[key] = [];
        acc[key].push(order);
        return acc;
      }, {});

      setOrdersByPair(grouped);
    } catch {
      setOrdersByPair({});
    }
  };

  useEffect(() => {
    loadOrdersFromCache();

    // Optional: refresh every 30s
    const interval = setInterval(loadOrdersFromCache, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "16px" }}>
      <h2>Active Orders</h2>
      {Object.keys(ordersByPair).length === 0 ? (
        <p>No active orders.</p>
      ) : (
        Object.entries(ordersByPair).map(([pair, orders]) => (
          <div key={pair} style={{ marginBottom: "16px" }}>
            {/* Currency title */}
            <h4 style={{ marginBottom: "8px" }}>{pair}</h4>

            {/* List of orders for this pair */}
            <ul>
              {orders.map((order) => (
                <li key={order.id}>
                  {order.amount} @ {order.price} — {order.status}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}