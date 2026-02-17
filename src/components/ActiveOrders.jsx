import React, { useEffect, useState } from "react";
import TableOrder from "./TableOrder";

const ORDERS_CACHE_KEY = "ORDERS_CACHE";

export default function ActiveOrders() {
  const [orders, setOrders] = useState([]);

  const loadOrders = () => {
    const cached = localStorage.getItem(ORDERS_CACHE_KEY);
    if (!cached) {
      setOrders([]);
      return;
    }

    try {
      const allOrders = JSON.parse(cached);
      // Filter Active orders
      const activeOrders = allOrders.filter((o) => o.status === "Active");
      setOrders(activeOrders);
    } catch {
      setOrders([]);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3 style={{ marginLeft: "10px" }}>
        Active Orders ({orders.length})
      </h3>
      <TableOrder orders={orders} />
    </div>
  );
}