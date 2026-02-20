import React, { useEffect, useState } from "react";
import TitleBar from "./TitleBar";
import MarketIcon from "./MarketIcon";

const WALLETS_CACHE_KEY = "WALLETS_CACHE";
const MARKETS_CACHE_KEY = "MARKETS_CACHE";

const getCache = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  } catch (err) {
    console.error(`Error parsing ${key}:`, err);
    return {};
  }
};

// Format balance for display
const formatBalance = (value, currency) => {
  const number = Number(value);
  if (isNaN(number) || number === 0) return null;

  const c = currency.toUpperCase();

  if (c === "RLS") {
    if (number < 100_000_000) return "IRT " + Math.floor(number / 10).toLocaleString("en-US");
    else return "IRM " + Math.floor(number / 10_000_000).toLocaleString("en-US");
  }

  if (c === "USD" || c === "USDT") {
    if (number < 10) return number.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    else return Math.floor(number).toLocaleString("en-US");
  }

  if (number >= 1) return number.toLocaleString("en-US");
  return number.toFixed(6);
};

// Calculate Rial value using MARKETS_CACHE object
const calcRialValue = (currency, amount, markets) => {
  if (!amount || amount === 0) return "-";

  const key = `${currency.toLowerCase()}-rls`;
  const rate = markets[key];
  if (!rate) return "-";

  return formatBalance(amount * rate, "RLS");
};

export default function WalletList() {
  const [wallets, setWallets] = useState({});
  const [markets, setMarkets] = useState({});

  useEffect(() => {
    setWallets(getCache(WALLETS_CACHE_KEY)); // { USDT: 5, BTC: 0.02 }
    setMarkets(getCache(MARKETS_CACHE_KEY));  // { "usdt-rls": 1357, "btc-rls": 1200000000 }
  }, []);

  const currencies = Object.keys(wallets).filter((c) => wallets[c] > 0);

  if (!currencies.length) return <div>No wallets available</div>;

  return (
    <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
      <TitleBar title="Wallets" count={currencies.length} />

      {currencies.map((currency) => (
        <div
          key={currency}
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
          {/* Left: MarketIcon */}
          <MarketIcon market={currency} size="large" />

          {/* Right: Amount + Rial equivalent */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>
              {formatBalance(wallets[currency], currency)}
            </div>
            <div style={{ fontWeight: 500, fontSize: 14, color: "#555" }}>
              {calcRialValue(currency, wallets[currency], markets)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}