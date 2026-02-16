import React from "react";

export default function MarketsList({ markets }) {
  if (!markets || Object.keys(markets).length === 0)
    return <div>No market data</div>;

  return (
    <div>
      {Object.entries(markets).map(([pair, info]) => (
        <div
          key={pair}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 8,
            borderBottom: "1px solid #ccc",
          }}
        >
          <span>{pair}</span>
          <span>{info.last || "-"}</span>
        </div>
      ))}
    </div>
  );
}