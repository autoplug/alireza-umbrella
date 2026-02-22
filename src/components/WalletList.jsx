import React, { useEffect, useState } from "react";

import TitleBar from "./TitleBar";
import MarketIcon from "./MarketIcon";
import {formatPrice} from "../api/utils";

//////////////////////////////////////////////
// Helper to get cached data
const getCache = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

//////////////////////////////////////////////
const calcTotalRial = (wallets, markets) => {
  const values = wallets.map((wallet) => {
    const balance = Number(wallet.balance);
    if (!balance) return 0;
    if( wallet.currency.toLowerCase() === "rls") 
      return balance
    
    
    const marketKey = `${wallet.currency.toLowerCase()}-rls`;
    const rate = markets[marketKey];

    if (!rate) return 0;

    return balance * Number(rate);
  });
  
  const result = values.reduce((sum, value) => sum + value, 0);
  return formatPrice(result, "RLS");
};

//////////////////////////////////////////////
// Calculate Rial value using MARKETS_CACHE
const calcRialValue = (amount, currency, markets) => {
  if( currency.toLowerCase() === "rls") return formatPrice(amount,"RLS");
  if (!amount || Number(amount) === 0) return "-";

  // Case-insensitive search for market key
  const searchKey = Object.keys(markets).find(
    (k) => k.toLowerCase() === `${currency}-rls`.toLowerCase()
  );

  if (!searchKey) return "-";

  const rate = Number(markets[searchKey]);
  if (!rate) return "-";

  return formatPrice(Number(amount) * rate, "RLS");
};


//////////////////////////////////////////////
export default function WalletList() {
  const [wallets, setWallets] = useState([]);
  const [markets, setMarkets] = useState({});
  
  // Load wallets from localStorage/cache on mount
  useEffect(() => {
    const loadData = async () => {
      const cachedData = await fetchWallets();
      setWallets(cachedData);
    });
    loadData();
  
    setMarkets(getCache("MARKETS_CACHE"));
  }, []);

  if (!wallets.length) return <div>No wallets available</div>;




  return (
    <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
      <TitleBar title="Wallets" count={0} />
      
      <div
        style={{
          textAlign: "center",
          marginBottom: 0,
          padding: "20px 0",
        }}
      >
        <div style={{ fontSize: 14, color: "#777" }}>
          Total Balance
        </div>
      
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            marginTop: 0,
          }}
        >
          {calcTotalRial(wallets, markets)}
        </div>
      </div>


      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 0 }}>
        {wallets.map((wallet) => (
          <div
            key={wallet.currency}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 0,
              padding: "16px 20px",
              borderTop: "1px solid #eee", 
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start", 
              transition: "transform 0.15s",
              gap : 10,
            }}
          >
            {/* Left: Market Icon */}
            <MarketIcon market={wallet.currency.toUpperCase()} size="large" />

            {/* Right: Amounts */}
            <div style={{ display: "flex", flexDirection: "column"}}>
              <div style={{ fontWeight: 700, fontSize: 16  }}>
                {formatPrice(wallet.balance, wallet.currency.toUpperCase())}
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