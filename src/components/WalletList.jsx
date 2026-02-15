import React from "react";
import WalletItem from "./WalletItem";

// Wallet list component
function WalletList({ wallets }) {
  return (
    <div style={{ padding: "20px" }}>
      <h2>My Wallets</h2>

      {/* Render each wallet item */}
      {wallets.map((wallet) => (
        <WalletItem key={wallet.id} wallet={wallet} />
      ))}
    </div>
  );
}

export default WalletList;
