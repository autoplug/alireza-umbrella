import React from "react";
import WalletList from "../components/WalletList";
import OrdersList from "../components/OrdersList";

export default function Home({ wallets, orders }) {
  return (
    <div>
      <h2>Wallets</h2>
      <WalletList wallets={wallets} />

      <h2>Orders</h2>
      <OrdersList orders={orders} />
    </div>
  );
}