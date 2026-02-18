import React, { useEffect, useState } from "react";

export default function WorkerMarketDebugPanel() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const loadMarket = async () => {
    try {
      const response = await fetch(
        "https://nobitex2.alireza-b83.workers.dev/market/stats",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // اگر نیاز باشد می‌توان Authorization اضافه کرد
            // "Authorization": "Token YOUR_TOKEN"
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();
      setData(json);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch market data");
    }
  };

  useEffect(() => {
    loadMarket();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>Worker Market Debug Panel</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading market data from Worker...</p>
      )}
    </div>
  );
}