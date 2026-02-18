import React, { useEffect, useState } from "react";

export default function DebugPanel() {
  const [markets, setMarkets] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("MARKETS_CACHE");

      if (!stored) {
        setError("No cached market data found.");
        return;
      }

      const parsed = JSON.parse(stored);

      // فقط دو مورد اول برای دیباگ سبک
      const firstTwo = Object.fromEntries(
        Object.entries(parsed).slice(0, 2)
      );

      setMarkets(firstTwo);
    } catch (err) {
      console.error(err);
      setError("Failed to parse cached data.");
    }
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>Market Cache Debug Panel</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {markets ? (
        <pre>{JSON.stringify(markets, null, 2)}</pre>
      ) : !error ? (
        <p>Loading cached market data...</p>
      ) : null}
    </div>
  );
}