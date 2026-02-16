import React from "react";

export default function OrdersList({ orders }) {
  if (!orders || orders.length === 0) return <div>No orders</div>;

  // Sort orders by id descending (latest first)
  const sorted = [...orders].sort((a, b) => b.id - a.id);

  return (
    <div>
      {sorted.map((order) => (
        <div
          key={order.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 8,
            borderBottom: "1px solid #ccc",
          }}
        >
          <span>{order.currency?.toUpperCase() || order.id}</span>
          <span>{order.amount || "-"}</span>
        </div>
      ))}
    </div>
  );
}