import React, { useEffect, useState } from "react";

const ORDERS_CACHE_KEY = "ORDERS_CACHE";

// Shared table styles
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#f9f9f9",
  color: "#000",
  margin: 0,
};

const thStyle = {
  borderBottom: "1px solid #aaa",
  textAlign: "left",
  padding: "14px 20px", // reduced height
};

const tdStyle = {
  borderBottom: "1px solid #ddd",
  padding: "14px 20px", // reduced height
};

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

  const getRowStyle = (type) => {
    if (!type) return {};
    if (type.toLowerCase() === "buy")
      return { backgroundColor: "#e6f4ea" }; // lighter green
    if (type.toLowerCase() === "sell")
      return { backgroundColor: "#fdecea" }; // lighter red
    return {};
  };

  return (
    <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
      <h3 style={{ marginLeft: "10px" }}>Active Orders</h3>

      {Object.keys(ordersByMarket).length === 0 ? (
        <p style={{ marginLeft: "10px" }}>No active orders.</p>
      ) : (
        Object.entries(ordersByMarket).map(([market, orders]) => (
          <div key={market} style={{ marginBottom: "24px" }}>
            <h4 style={{ marginBottom: "8px", paddingLeft: "10px" }}>
              {market}
            </h4>

            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, width: "10%" }}>#</th>
                  <th style={{ ...thStyle, width: "35%" }}>Amount</th>
                  <th style={{ ...thStyle, width: "35%" }}>Price</th>
                  <th style={{ ...thStyle, width: "20%" }}>Type</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index} style={getRowStyle(order.type)}>
                    <td style={tdStyle}>{index + 1}</td>
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