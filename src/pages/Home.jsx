import React from "react";
import WalletList from "../components/WalletList";
import ActiveOrders from "../components/ActiveOrders";
import TodayTrades from "../components/TodayTrades";

export default function Home() {
  return (
    <div>
      <WalletList />
      <ActiveOrders />
      <TodayTrades />
    </div>
  );
}