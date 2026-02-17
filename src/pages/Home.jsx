import React from "react";
import WalletList from "../components/WalletList";

export default function Home() {
  return (
    <div style={{ padding: 16, maxWidth: 800, margin: "0 auto" }}>
      <h1>Wallets</h1>
      <WalletList />
    </div>
  );
}