import React, { useEffect, useState } from "react";
import TableOrder from "./TableOrder";

const ORDERS_CACHE_KEY = "ORDERS_CACHE";

export default function TodayTrades() {
  const [orders, setOrders] = useState([]);

  const loadOrders = () => {
    const cached = localStorage.getItem(ORDERS_CACHE_KEY);
    if (!cached) {
      setOrders([]);
      return;
    }

    try {
      const allOrders = JSON.parse(cached);
      const todayStr = new Date().toISOString().slice(0, 10);

      // Filter Done orders with created_at today
      const doneToday = allOrders.filter(
        (o) => o.status === "Done" && o.created_at && o.created_at.slice(0, 10) === todayStr
      );

      setOrders(doneToday);
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
        Today Trades ({orders.length})
      </h3>
      <TableOrder orders={orders} />
    </div>
  );
}