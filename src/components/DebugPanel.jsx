import React, { useEffect, useState } from "react";

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";

function DebugPanel() {
  const [markets, setMarkets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarkets = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${WORKER_URL}?type=markets`);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json();
        setMarkets(data.stats || {});
      } catch (err) {
        setError(err.message);
        setMarkets({});
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "monospace" }}>
      {loading && <div>Loading markets...</div>}

      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      <h3>Markets Data:</h3>
      {markets && Object.keys(markets).length > 0 ? (
        <pre>{JSON.stringify(markets, null, 2)}</pre>
      ) : !loading ? (
        <div>No market data available</div>
      ) : null}
    </div>
  );
}

export default DebugPanel;