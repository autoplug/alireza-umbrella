import React from "react";
import OrdersList from "../components/OrdersList";
import MarketsList from "../components/MarketsList"; // if you prefer a Markets component

export default function MarketPage() {
  return (
    <div style={{ padding: 16, maxWidth: 1000, margin: "0 auto" }}>
      {/* Orders section */}
      <h1>Orders</h1>
      <OrdersList />
      
      {/* Markets section */}
      <h1 style={{ marginTop: 32 }}>Markets</h1>
      <MarketsList />

    </div>
  );
}