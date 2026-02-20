import React, { useEffect, useState } from "react";
import TitleBar from "./TitleBar";
import MarketIcon from "./MarketIcon"; // import MarketIcon

const WALLETS_CACHE_KEY = "WALLETS_CACHE";

// Load wallet data from localStorage
const getWalletsFromCache = () => {
  try {
    const data = localStorage.getItem(WALLETS_CACHE_KEY);
    if (!data) return [];
    return JSON.parse(data) || [];
  } catch (err) {
    console.error("Error parsing WALLETS_CACHE:", err);
    return [];
  }
};

// Format balance based on currency
const formatBalance = (value, currency) => {
  const number = Number(value);
  if (isNaN(number) || number === 0) return null;

  const c = currency.toUpperCase();

  if (c === "RLS") {
    if (number < 100_000_000) {
      return "IRT " + Math.floor(number / 10).toLocaleString("en-US");
    } else {
      return "IRM " + Math.floor(number / 10_000_000).toLocaleString("en-US");
    }
  }

  if (c === "USD" || c === "USDT") {
    if (number < 10) {
      return number.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
      return Math.floor(number).toLocaleString("en-US");
    }
  }

  if (number >= 1) return number.toLocaleString("en-US");
  return number.toFixed(6);
};

export default function WalletList() {
  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    const cached = getWalletsFromCache();
    setWallets(cached);
  }, []);

  const visibleWallets = wallets.filter((w) => Number(w.balance) > 0);

  if (!visibleWallets.length) return <div>No wallets available</div>;

  return (
    <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
      <TitleBar title="Wallets" count={visibleWallets.length} />

      {visibleWallets.map((wallet) => (
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
            marginBottom: 10,
          }}
        >
          {/* Left side: MarketIcon + Currency */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <MarketIcon market={wallet.currency} size="large" />
          </div>

          {/* Right side: Formatted balance */}
          <div style={{ fontWeight: 500, textAlign: "left" }}>
            {formatBalance(wallet.balance, wallet.currency)}
          </div>
        </div>
      ))}
    </div>
  );
}