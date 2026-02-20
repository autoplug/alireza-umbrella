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


  // Format balance for display
  const formatBalance = (value, currency) => {
    const number = Number(value);
    if (isNaN(number) || number === 0) return null;
  
    const c = currency.toUpperCase();
  
    if (c === "RLS") {
      if (number < 100_000_000)
        return "IRT " + Math.floor(number / 10).toLocaleString("en-US");
      else return "IRM " + Math.floor(number / 10_000_000).toLocaleString("en-US");
    }
  
    if (c === "USD" || c === "USDT") {
      if (number < 10)
        return number.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      else return Math.floor(number).toLocaleString("en-US");
    }
  
    if (number >= 1) return number.toLocaleString("en-US");
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
            <MarketIcon market={wallet.currency.toUpperCase()} size="large"/>
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