import React, { useEffect, useState } from "react";
import { fetchData } from "../api/api";

function DebugPanel() {
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => setLogs((prev) => [...prev, msg]);

  useEffect(() => {
    const runDebug = async () => {
      addLog("Starting fetchData for wallets...");

      try {
        const wallets = await fetchData("wallets");
        addLog("Wallets result:");
        addLog(JSON.stringify(wallets, null, 2));
      } catch (err) {
        addLog(`Wallets error: ${err.message}`);
      }

      addLog("Starting fetchData for orders...");

      try {
        const orders = await fetchData("orders");
        addLog("Orders result:");
        addLog(JSON.stringify(orders, null, 2));
      } catch (err) {
        addLog(`Orders error: ${err.message}`);
      }

      addLog("Starting fetchData for markets...");

      try {
        const markets = await fetchData("markets");
        addLog("Markets result:");
        addLog(JSON.stringify(markets, null, 2));
      } catch (err) {
        addLog(`Markets error: ${err.message}`);
      }

      addLog("DebugPanel fetch complete!");
    };

    runDebug();
  }, []);

  return (
    <div
      style={{
        fontFamily: "monospace",
        backgroundColor: "#f5f5f5",
        padding: 12,
        borderRadius: 8,
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      {logs.map((log, index) => (
        <div key={index} style={{ marginBottom: 6, whiteSpace: "pre-wrap" }}>
          {log}
        </div>
      ))}
    </div>
  );
}

export default DebugPanel;