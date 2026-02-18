import { useEffect, useState } from "react";

export default function DebugPanel() {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        // URL Worker Cloudflare
        const WORKER_URL = "https://nobitex.alireza-b83.workers.dev/market/stats";

        const res = await fetch(WORKER_URL);
        if (!res.ok) throw new Error(`Network response was not ok: ${res.status}`);
        //const data = await res.json();
        setMarketData(res);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMarket();
  }, []);

  if (loading) return <p>Loading market data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Market Data Debug (Cloudflare Worker)</h2>
      <pre
        style={{
          background: "#f0f0f0",
          padding: "10px",
          borderRadius: "6px",
          overflowX: "auto",
        }}
      >
        {JSON.stringify(marketData, null, 2)}
      </pre>
    </div>
  );
}