import React from "react";
import WalletList from "../components/WalletList";
import DebugPanel from "../components/DebugPanel";
export default function Home() {
  return (
    <div style={{ padding: 16, maxWidth: 800, margin: "0 auto" }}>
      <h1>Wallets</h1>
      <DebugPanel />
      <WalletList />
    </div>
  );
}