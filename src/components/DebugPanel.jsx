import React, { useEffect, useState } from "react";
import { fetchWallets } from "./api/fetchWallets";

function DebugPanel() {
  const [wallets, setWallets] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to append log messages
  const addLog = (msg) => setLogs((prev) => [...prev, msg]);

  useEffect(() => {
    const debugFetchWallets = async () => {
      setLoading(true);
      addLog("Starting fetchWallets...");

      try {
        const data = await fetchWallets();
        addLog(`Fetched wallets: ${JSON.stringify(data, null, 2)}`);

        setWallets(data);
      } catch (err) {
        addLog(`Error fetching wallets: ${err.message}`);
        setWallets([]);
      }

      setLoading(false);
      addLog("fetchWallets finished!");
    };

    debugFetchWallets();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "monospace" }}>
      <h2>Debug Panel - Wallets</h2>
      {loading && <div style={{ marginBottom: 10 }}>Loading wallets...</div>}

      <h3>Logs:</h3>
      <div
        style={{
          background: "#f0f0f0",
          padding: 10,
          borderRadius: 8,
          maxHeight: 300,
          overflowY: "auto",
        }}
      >
        {logs.map((log, idx) => (
          <pre key={idx} style={{ margin: 0 }}>
            {log}
          </pre>
        ))}
      </div>

      <h3>Wallets Data:</h3>
      {wallets ? (
        <pre>{JSON.stringify(wallets, null, 2)}</pre>
      ) : (
        <div>No wallets data available</div>
      )}
    </div>
  );
}

export default DebugPanel;