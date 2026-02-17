import React from "react";
import WalletList from "../components/WalletList";
import ActiveOrders from "../components/ActiveOrders";
export default function Home() {
  return (
    <div style={{ padding: 16, maxWidth: 800, margin: "0 auto" }}>
      <WalletList />
      <ActiveOrders />
    </div>
  );
}