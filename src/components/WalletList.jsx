import React from "react";

// Import local logos (place your images in src/assets/logos/)
import BTCLogo from "../assets/logos/btc.PNG";
import ETHLogo from "../assets/logos/eth.PNG";
import USDTLogo from "../assets/logos/usdt.PNG";
import RLSLogo from "../assets/logos/rls.jpg";

// Map currency symbol to local logo
const currencyLogos = {
  BTC: BTCLogo,
  ETH: ETHLogo,
  USDT: USDTLogo,
  RLS: RLSLogo,
  // Add more currencies as needed
};

function WalletList({ wallets = [] }) {
  if (!Array.isArray(wallets) || wallets.length === 0) {
    return <div>No wallets available</div>;
  }

  // Format balances for readability
  const formatBalance = (value) => {
    const number = Number(value);
    if (isNaN(number)) return value;

    // Large numbers → commas
    if (number >= 1) return number.toLocaleString();

    // Small crypto → limit decimals
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
          {/* Left side: Logo + Currency */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Currency logo */}
            <img
              src={currencyLogos[wallet.currency.toUpperCase()]}
              alt={wallet.currency}
              style={{ width: 36, height: 36, borderRadius: "50%" }}
            />

            {/* Currency symbol */}
            <div style={{ fontWeight: 600 }}>
              {wallet.currency.toUpperCase()}
            </div>
          </div>

          {/* Right side: Balance */}
          <div style={{ fontWeight: 500 }}>
            {formatBalance(wallet.balance)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default WalletList;