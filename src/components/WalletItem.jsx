import React from "react";

// Single wallet item component
function WalletItem({ wallet }) {
  return (
    <div
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
  );
}

export default WalletItem;
