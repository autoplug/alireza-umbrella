import React from "react";
import OrdersList from "../components/OrdersList";

export default function Markets({ markets, orders }) {
  return (
    <div style={{ padding: 16 }}>
      <h2>Markets</h2>
      {markets && Object.keys(markets).length > 0 ? (
        <div>
          {Object.entries(markets).map(([pair, info]) => (
            <div
              key={pair}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: 8,
                borderBottom: "1px solid #ccc",
              }}
            >
              <span>{pair}</span>
              <span>{info.last || "-"}</span>
            </div>
          ))}
        </div>
      ) : (
        <div>No market data</div>
      )}

      <h2 style={{ marginTop: 24 }}>Orders</h2>
      {orders && orders.length > 0 ? (
        <OrdersList orders={orders} />
      ) : (
        <div>No orders available</div>
      )}
    </div>
  );
}