import React from "react";

// WalletList component receives wallets as props
function WalletList({ wallets }) {
  return (
    <div style={{ padding: "20px" }}>
      <h2>My Wallets</h2>

      {/* Loop through wallets and render each item */}
      {wallets.map((wallet) => (
        <div
          key={wallet.id}
          style={{
            padding: "15px",
            marginBottom: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <strong>{wallet.name}</strong>
          <div>{wallet.balance}</div>
        </div>
      ))}
    </div>
  );
}

export default WalletList;
