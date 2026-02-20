import React, { useEffect, useState } from "react";

import TitleBar from "./TitleBar";
import MarketIcon from "./MarketIcon";
import {formatPrice} from "../api/utils";

// Helper to get cached data
const getCache = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};


// Calculate Rial value using MARKETS_CACHE
const calcRialValue = (amount, currency, markets) => {
  if( currency.toLowerCase() === "rls") return amount;
  if (!amount || Number(amount) === 0) return "-";

  // Case-insensitive search for market key
  const searchKey = Object.keys(markets).find(
    (k) => k.toLowerCase() === `${currency}-rls`.toLowerCase()
  );

  if (!searchKey) return "-";

  const rate = Number(markets[searchKey]);
  if (!rate) return "-";

  return formatBalance(Number(amount) * rate, "RLS");
};



export default function WalletList() {
  const [wallets, setWallets] = useState([]);
  const [markets, setMarkets] = useState({});
  
  // Load wallets from localStorage/cache on mount
  useEffect(() => {
    setWallets(getCache("WALLETS_CACHE"));
    setMarkets(getCache("MARKETS_CACHE"));
  }, []);

  if (!wallets.length) return <div>No wallets available</div>;




  return (
    <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
      <TitleBar title="Wallets" count={0} />

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
        {wallets.map((wallet) => (
          <div
            key={wallet.currency}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 16,
              padding: "16px 20px",
              boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start", 
              transition: "transform 0.15s",
              gap : 50,
            }}
          >
            {/* Left: Market Icon */}
            <MarketIcon market={wallet.currency.toUpperCase()} size="large" />

            {/* Right: Amounts */}
            <div style={{ display: "flex", flexDirection: "column"}}>
              <div style={{ fontWeight: 700, fontSize: 16  }}>
                {formatPrice(wallet.balance, wallet.currency)}
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#555" }}>
                {calcRialValue(wallet.balance, wallet.currency, markets)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}