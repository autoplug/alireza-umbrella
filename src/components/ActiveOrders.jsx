import React, { useEffect, useState } from "react";

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

      // Filter active orders
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
    <div style={{ padding: "16px", maxHeight: "80vh", overflowY: "auto" }}>
      {/* Main title */}
      <h3>Active Orders</h3>

      {Object.keys(ordersByMarket).length === 0 ? (
        <p>No active orders.</p>
      ) : (
        Object.entries(ordersByMarket).map(([market, orders]) => (
          <div key={market} style={{ marginBottom: "24px" }}>
            {/* Market header with H4 and left padding */}
            <h4 style={{ marginBottom: "8px", paddingLeft: "10px" }}>{market}</h4>

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
                  <th style={{ ...thStyle, position: "sticky", top: 0, backgroundColor: "#1e1e1e", zIndex: 2 }}>Amount</th>
                  <th style={{ ...thStyle, position: "sticky", top: 0, backgroundColor: "#1e1e1e", zIndex: 2 }}>Price</th>
                  <th style={{ ...thStyle, position: "sticky", top: 0, backgroundColor: "#1e1e1e", zIndex: 2 }}>Status</th>
                  <th style={{ ...thStyle, position: "sticky", top: 0, backgroundColor: "#1e1e1e", zIndex: 2 }}>Order ID</th>
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

// Styles
const thStyle = {
  borderBottom: "1px solid #555",
  textAlign: "left",
  padding: "8px",
};

const tdStyle = {
  borderBottom: "1px solid #333",
  padding: "8px",
};