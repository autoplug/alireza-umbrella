import React, { useEffect, useState } from "react";

const WORKER_URL = "https://api.alireza-b83.workers.dev";

function DebugPanel() {
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => setLogs((prev) => [...prev, msg]);

  useEffect(() => {
    const fetchWallets = async () => {
      addLog("Starting fetch for wallets...");

      try {
        const token = localStorage.getItem("NOBITEX_TOKEN");
        if (!token) {
          addLog("No token found in localStorage!");
          return;
        }

        // --- 1 second delay ---
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const response = await fetch(`${WORKER_URL}/users/wallets/list`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        // Read response text to prevent crash if not JSON
        const text = await response.text();

        try {
          const data = JSON.parse(text);
          addLog("Wallets result:");
          addLog(JSON.stringify(data, null, 2));
        } catch {
          addLog("Received invalid JSON:");
          addLog(text);
        }

      } catch (err) {
        addLog(`Fetch error: ${err.message}`);
      }

      addLog("Fetch complete!");
    };

    fetchWallets();
  }, []);

  return (
    <div
      style={{
        fontFamily: "monospace",
        backgroundColor: "#f0f0f0",
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