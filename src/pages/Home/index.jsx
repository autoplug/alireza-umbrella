import React from "react";
import WalletList from "../components/WalletList";
import TodayTrades from "../components/TodayTrades";

export default function Home() {
  return (
    <div>
      <WalletList />
      <TodayTrades />

      {/* Spacer at the bottom to avoid overlapping with bottom menu */}
      <div style={{ height: "60px" }}></div>
    </div>
  );
}