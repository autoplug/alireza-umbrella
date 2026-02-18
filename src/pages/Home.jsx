import React from "react";
import WalletList from "../components/WalletList";
import ActiveOrders from "../components/ActiveOrders";
import TodayTrades from "../components/TodayTrades";

export default function Home() {
  return (
    <div>
      
      fffffffffffffff
      <WalletList />
      <ActiveOrders />
      <TodayTrades />

      {/* Spacer at the bottom to avoid overlapping with bottom menu */}
      <div style={{ height: "60px" }}></div>
    </div>
  );
}