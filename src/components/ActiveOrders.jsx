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
      const activeOrders = allOrders.filter((o) => o.status === "Active");

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
    <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
      <h3 style={{ marginLeft: "10px" }}>Active Orders</h3>

      {Object.keys(ordersByMarket).length === 0 ? (
        <p style={{ marginLeft: "10px" }}>No active orders.</p>
      ) : (
        Object.entries(ordersByMarket).map(([market, orders]) => (
          <div key={market} style={{ marginBottom: "24px" }}>
            {/* Market header */}
            <h4 style={{ marginBottom: "8px", paddingLeft: "10px" }}>{market}</h4>

            {/* Table for active orders */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "#f9f9f9",
                color: "#000",
                margin: 0,
              }}
            >
              <thead>
                <tr>
                  <th style={{ ...thStyle, width: "40%", position: "sticky", top: 0, backgroundColor: "#f9f9f9", zIndex: 2 }}>Amount</th>
                  <th style={{ ...thStyle, width: "40%", position: "sticky", top: 0, backgroundColor: "#f9f9f9", zIndex: 2 }}>Price</th>
                  <th style={{ ...thStyle, width: "20%", position: "sticky", top: 0, backgroundColor: "#f9f9f9", zIndex: 2 }}>Type</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index}>
                    <td style={tdStyle}>{order.amount}</td>
                    <td style={tdStyle}>{order.price}</td>
                    <td style={tdStyle}>{order.type}</td>
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
  borderBottom: "1px solid #aaa",
  textAlign: "left",
  padding: "8px",
};

const tdStyle = {
  borderBottom: "1px solid #ddd",
  padding: "8px",
};