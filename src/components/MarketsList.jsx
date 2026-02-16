import React, { useEffect, useState } from "react";

// Helper to read cached markets from localStorage
const getCache = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : {};
};

export default function MarketList() {
  const [markets, setMarkets] = useState({});

  useEffect(() => {
    const cachedMarkets = getCache("MARKETS_CACHE");
    console.log("Markets loaded:", cachedMarkets); // debug
    setMarkets(cachedMarkets);
  }, []);

  const marketKeys = Object.keys(markets);

  if (!marketKeys.length) return <div>No market data available</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {marketKeys.map((key) => {
        const market = markets[key];
        return (
          <div
            key={key}
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Market pair */}
            <div style={{ fontWeight: 600 }}>{key.toUpperCase()}</div>

            {/* Market details */}
            <div style={{ display: "flex", gap: 24 }}>
              <div>
                <strong>Latest:</strong> {market.latest}
              </div>
              <div>
                <strong>Best Buy:</strong> {market.bestBuy}
              </div>
              <div>
                <strong>Best Sell:</strong> {market.bestSell}
              </div>
              <div>
                <strong>Day Change:</strong> {market.dayChange}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}