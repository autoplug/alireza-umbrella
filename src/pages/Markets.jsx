import React, { useState, useEffect } from "react";

// Sample market data (replace with API later)
const sampleMarkets = [
  { pair: "BTC/USDT", price: "28,500", change: "+2.5%" },
  { pair: "ETH/USDT", price: "1,800", change: "-1.2%" },
  { pair: "USDT/RLS", price: "42000", change: "+0.1%" },
  { pair: "BTC/RLS", price: "1,200,000,000", change: "+0.5%" },
];

function Markets() {
  const [markets, setMarkets] = useState([]);

  useEffect(() => {
    // Load sample data initially
    setMarkets(sampleMarkets);

    // Later: fetch real data from API
    // fetchMarkets();
  }, []);

  // Format large numbers
  const formatNumber = (value) => {
    const number = Number(value.toString().replace(/,/g, ""));
    if (isNaN(number)) return value;
    return number.toLocaleString();
  };

  return (
    <div style={{ padding: 16, paddingBottom: 120 }}>
      <h2 style={{ marginBottom: 16 }}>Markets</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {markets.map((market) => (
          <div
            key={market.pair}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 16,
              borderRadius: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              backgroundColor: "#ffffff",
            }}
          >
            <div style={{ fontWeight: 600 }}>{market.pair}</div>
            <div style={{ fontWeight: 500 }}>
              {formatNumber(market.price)}
            </div>
            <div
              style={{
                color: market.change.startsWith("+") ? "green" : "red",
                fontWeight: 500,
              }}
            >
              {market.change}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Markets;