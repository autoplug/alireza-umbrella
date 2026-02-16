import React, { useEffect, useState } from "react";
import axios from "axios";

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";

function DebugPanel() {
  const [wallets, setWallets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWallets = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("NOBITEX_TOKEN");
        if (!token) throw new Error("No token found");

        const response = await axios.get(`${WORKER_URL}?type=wallets`, {
          headers: { Authorization: `Token ${token}` },
        });

        setWallets(response.data.wallets || []);
      } catch (err) {
        setError(err.message);
        setWallets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "monospace" }}>
      {loading && <div>Loading wallets...</div>}

      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      <h3>Wallets Data:</h3>
      {wallets && wallets.length > 0 ? (
        <pre>{JSON.stringify(wallets, null, 2)}</pre>
      ) : !loading ? (
        <div>No wallets available</div>
      ) : null}
    </div>
  );
}

export default DebugPanel;