import React, { useEffect, useState } from "react";
import { fetchAllData, fetchData } from "./api/api";

function DebugPanel() {
  const [wallets, setWallets] = useState(null);
  const [orders, setOrders] = useState(null);
  const [markets, setMarkets] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to append log messages
  const addLog = (msg) => setLogs((prev) => [...prev, msg]);

  useEffect(() => {
    const debugFetch = async () => {
      setLoading(true);
      addLog("Starting fetchAllData...");

      try {
        // Fetch each type individually
        const types = ["wallets", "orders", "markets"];
        for (const type of types) {
          addLog(`Fetching ${type}...`);
          try {
            const data = await fetchData(type);
            addLog(`Fetched ${type}: ${JSON.stringify(data, null, 2)}`);

            // Update state
            if (type === "wallets") setWallets(data);
            if (type === "orders") setOrders(data);
            if (type === "markets") setMarkets(data);
          } catch (err) {
            addLog(`Error fetching ${type}: ${err.message}`);
          }
        }

        addLog("fetchAllData finished!");
      } catch (err) {
        addLog(`Unexpected error: ${err.message}`);
      }

      setLoading(false);
    };

    debugFetch();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "monospace" }}>
      <h2>Debug Panel</h2>
      {loading && <div style={{ marginBottom: 10 }}>Loading data...</div>}

      <h3>Logs:</h3>
      <div
        style={{
          background: "#f0f0f0",
          padding: 10,
          borderRadius: 8,
          maxHeight: 400,
          overflowY: "auto",
        }}
      >
        {logs.map((log, idx) => (
          <pre key={idx} style={{ margin: 0 }}>
            {log}
          </pre>
        ))}
      </div>

      <h3>Wallets:</h3>
      <pre>{JSON.stringify(wallets, null, 2)}</pre>

      <h3>Orders:</h3>
      <pre>{JSON.stringify(orders, null, 2)}</pre>

      <h3>Markets:</h3>
      <pre>{JSON.stringify(markets, null, 2)}</pre>
    </div>
  );
}

export default DebugPanel;