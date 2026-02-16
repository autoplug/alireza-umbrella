import React from "react";
import OrdersList from "../components/OrdersList";
import MarketsList from "../components/MarketsList"; // if you prefer a Markets component

export default function MarketPage() {
  return (
    <div style={{ padding: 16, maxWidth: 1000, margin: "0 auto" }}>
      {/* Markets section */}
      <h1>Markets</h1>
      <MarketsList />

      {/* Orders section */}
      <h1 style={{ marginTop: 32 }}>Orders</h1>
      <OrdersList />
    </div>
  );
}