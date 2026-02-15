import React from "react";

function WalletList({ wallets = [] }) {

  if (!Array.isArray(wallets) || wallets.length === 0) {
    return <div>No wallets available</div>;
  }

  // Format numbers for better readability
  const formatBalance = (value) => {
    const number = Number(value);
    if (isNaN(number)) return value;

    // If number is large → format with commas
    if (number >= 1) {
      return number.toLocaleString();
    }

    // If small crypto → limit decimals
    return number.toFixed(6);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {wallets.map((wallet) => (
        <div
          key={wallet.currency}
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 16,
            padding: 16,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left side - Currency */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            
            {/* Circle indicator */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: "#f2f2f2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: 14,
              }}
            >
              {wallet.currency.toUpperCase()}
            </div>

            <div style={{ fontWeight: 600 }}>
              {wallet.currency.toUpperCase()}
            </div>
          </div>

          {/* Right side - Balance */}
          <div style={{ fontWeight: 500 }}>
            {formatBalance(wallet.balance)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default WalletList;