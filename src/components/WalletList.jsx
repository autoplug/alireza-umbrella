import React, { useEffect, useState } from "react";

import TitleBar from "./TitleBar";
import MarketIcon from "./MarketIcon";

// Helper to get cached data
const getCache = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export default function WalletList() {
  const [wallets, setWallets] = useState([]);

  // Load wallets from localStorage/cache on mount
  useEffect(() => {
    const cachedWallets = getCache("WALLETS_CACHE");
    setWallets(cachedWallets);
  }, []);

  if (!wallets.length) return <div>No wallets available</div>;

  // Format balances for readability
  const formatBalance = (value, currency) => {
    if (currency.toLowerCase() === "rls") {
      const toman = Math.floor(Number(value) / 10);
      return `${toman.toLocaleString()}`;
    }
    const number = Number(value);
    if (isNaN(number)) return value;

    // Large numbers → commas
    if (number >= 1) return number.toLocaleString();

    // Small crypto → limit decimals
    return number.toFixed(6);
  };

  return (
    <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
    <TitleBar title="Wallets" count={0} />
      
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
            <MarketIcon market={wallet.currency} size="large" />
  
            {/* Currency symbol */}
            <div style={{ fontWeight: 600 }}>
              {wallet.currency.toUpperCase()}
            </div>
          </div>

          {/* Right side: Balance */}
          <div style={{ fontWeight: 500, textAlign: "left" }}>
            {formatBalance(wallet.balance, wallet.currency)}
          </div>
        </div>
      ))}
    </div>
  );
}