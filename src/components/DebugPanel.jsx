import React, { useEffect, useState } from "react";

export default function DebugPanel() {
  const [markets, setMarkets] = useState({});

  useEffect(() => {
    const storedMarkets = localStorage.getItem("MARKETS_CACHE");
    if (storedMarkets) {
      try {
        setMarkets(JSON.parse(storedMarkets));
      } catch (e) {
        console.error("Failed to parse MARKETS_CACHE:", e);
        setMarkets({});
      }
    }
  }, []);

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
      <h3 style={{ marginBottom: "10px" }}>Debug Dashboard: MARKETS_CACHE</h3>
      <pre
        style={{
          backgroundColor: "#222",
          color: "#0f0",
          padding: "10px",
          borderRadius: "4px",
          overflowX: "auto",
          fontFamily: "monospace",
          fontSize: "14px",
        }}
      >
        {JSON.stringify(markets, null, 2)}
      </pre>
    </div>
  );
}