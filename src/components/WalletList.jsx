import React, { useEffect, useState } from "react";

import TitleBar from "./TitleBar";

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
    <TitleBar title="Active Orders" count=0 />
      
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
          <div style={{ fontWeight: 500, textAlign: "left" }}>
            {formatBalance(wallet.balance, wallet.currency)}
          </div>
        </div>
      ))}
    </div>
  );
}