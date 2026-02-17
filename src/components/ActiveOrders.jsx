import React, { useEffect, useState } from "react";

// Cache key must match api.js
const ORDERS_CACHE_KEY = "ORDERS_CACHE";

export default function ActiveOrders() {
  const [ordersByMarket, setOrdersByMarket] = useState({});

  const loadOrdersFromCache = () => {
    const cached = localStorage.getItem(ORDERS_CACHE_KEY);
    if (!cached) {
      setOrdersByMarket({});
      return;
    }

    try {
      const allOrders = JSON.parse(cached);

      // Filter orders with Status = "Active"
      const activeOrders = allOrders.filter((o) => o.status === "Active");

      // Group by market
      const grouped = activeOrders.reduce((acc, order) => {
        const key = order.market || "Unknown";
        if (!acc[key]) acc[key] = [];
        acc[key].push(order);
        return acc;
      }, {});

      setOrdersByMarket(grouped);
    } catch {
      setOrdersByMarket({});
    }
  };

  useEffect(() => {
    loadOrdersFromCache();

    const interval = setInterval(loadOrdersFromCache, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "16px" }}>
      <h2>Active Orders</h2>

      {Object.keys(ordersByMarket).length === 0 ? (
        <p>No active orders.</p>
      ) : (
        Object.entries(ordersByMarket).map(([market, orders]) => (
          <div key={market} style={{ marginBottom: "24px" }}>
            {/* Market title */}
            <h4 style={{ marginBottom: "8px" }}>{market}</h4>

            {/* Table for orders */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "#1e1e1e",
                color: "#fff",
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle}>Amount</th>
                  <th style={thStyle}>Price</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Order ID</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td style={tdStyle}>{order.amount}</td>
                    <td style={tdStyle}>{order.price}</td>
                    <td style={tdStyle}>{order.status}</td>
                    <td style={tdStyle}>{order.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}

// Common styles
const thStyle = {
  borderBottom: "1px solid #555",
  textAlign: "left",
  padding: "8px",
};

const tdStyle = {
  borderBottom: "1px solid #333",
  padding: "8px",
};