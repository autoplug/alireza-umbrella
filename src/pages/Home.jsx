import React from "react";
import WalletList from "../components/WalletList";
import ActiveOrders from "../components/ActiveOrders";
export default function Home() {
  return (
    <div>
      <WalletList />
      <ActiveOrders />
    </div>
  );
}