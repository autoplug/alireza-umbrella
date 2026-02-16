import React, { useEffect, useState } from "react";

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";

function DebugPanel() {
  const [wallets, setWallets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("");

  useEffect(() => {
    const fetchWallets = async () => {
      setLoading(true);
      setSource("");

      try {
        const token = localStorage.getItem("NOBITEX_TOKEN");
        if (!token) throw new Error("No token found");

        const response = await fetch(`${WORKER_URL}?type=wallets`, {
          headers: { Authorization: `Token ${token}` },
        });

        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json();
        setWallets(data.wallets || []);
        setSource("Worker API");
      } catch (err) {
        setWallets([]);
        setSource("Local file (fallback)");
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "monospace" }}>
      {loading && <div>Loading wallets...</div>}

      {!loading && <div>Data source: {source}</div>}

      <h3>Wallets Data:</h3>
      {wallets && wallets.length > 0 ? (
        <pre>{JSON.stringify(wallets, null, 2)}</pre>
      ) : (
        !loading && <div>No wallets available</div>
      )}
    </div>
  );
}

export default DebugPanel;