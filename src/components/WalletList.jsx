import React from "react";

function WalletList({ wallets }) {
  if (!wallets || wallets.length === 0) {
    return <div>No wallets found.</div>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {wallets.map((wallet) => (
        <li
          key={wallet.id}
          style={{
            padding: "15px",
            marginBottom: "10px",
            background: "#f1f1f1",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        >
          <strong>{wallet.name}</strong>: {wallet.balance} {wallet.currency}
        </li>
      ))}
    </ul>
  );
}

export default WalletList;