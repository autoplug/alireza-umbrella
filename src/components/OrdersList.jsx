import React, { useEffect, useState } from "react";

// Helper to get cached orders
const getCache = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export default function OrdersList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Load cached orders from localStorage
    const cachedOrders = getCache("ORDERS_CACHE");
    console.log("Orders loaded:", cachedOrders); // debug
    setOrders(cachedOrders);
  }, []);

  if (!orders.length) return <div>No orders available</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {orders.map(order => (
        <div
          key={order.id}
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 16,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left side: Order info */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div><strong>Pair:</strong> {order.pair}</div>
            <div><strong>Type:</strong> {order.type}</div>
            <div><strong>Status:</strong> {order.status}</div>
          </div>

          {/* Right side: Amount */}
          <div style={{ textAlign: "right" }}>
            <div><strong>Price:</strong> {order.price}</div>
            <div><strong>Amount:</strong> {order.amount}</div>
          </div>
        </div>
      ))}
    </div>
  );
}