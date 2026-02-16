import React, { useState } from "react";

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";

export default function DebugPanel() {
  const [logs, setLogs] = useState([]);

  const log = (text) => {
    setLogs((prev) => [...prev, text]);
  };

  const directCall = async (type) => {
    log(`===== Direct Call: ${type} =====`);

    try {
      let url = `${WORKER_URL}?type=${type}`;

      if (type === "orders") {
        url += "&details=2&status=all";
      }

      log("URL:");
      log(url);

      const token = localStorage.getItem("NOBITEX_TOKEN");

      const response = await fetch(url, {
        headers: token
          ? { Authorization: `Token ${token}` }
          : {},
      });

      log("Response status:");
      log(response.status.toString());

      const data = await response.json();

      log("Response data:");
      log(JSON.stringify(data, null, 2));
    } catch (err) {
      log("ERROR:");
      log(err.toString());
    }
  };

  return (
    <div
      style={{
        padding: 15,
        background: "#000",
        color: "#0f0",
        fontSize: 12,
        maxHeight: 400,
        overflow: "auto",
      }}
    >
      <h3>Direct Worker Debug</h3>

      <button onClick={() => directCall("wallets")}>
        Direct Wallets
      </button>

      <button
        onClick={() => directCall("orders")}
        style={{ marginLeft: 10 }}
      >
        Direct Orders
      </button>

      <button
        onClick={() => directCall("markets")}
        style={{ marginLeft: 10 }}
      >
        Direct Markets
      </button>

      <pre style={{ marginTop: 15 }}>
        {logs.join("\n\n")}
      </pre>
    </div>
  );
}