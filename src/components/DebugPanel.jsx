import React, { useState } from "react";
import { fetchData } from "../api/api";

export default function DebugPanel() {
  const [logs, setLogs] = useState([]);

  const log = (text) => {
    setLogs((prev) => [...prev, text]);
  };

  const test = async (type) => {
    log(`----- Testing ${type} -----`);

    try {
      const result = await fetchData(type);

      log("Result:");
      log(JSON.stringify(result, null, 2));

      const cacheKey =
        type === "wallets"
          ? "WALLETS_CACHE"
          : type === "orders"
          ? "ORDERS_CACHE"
          : "MARKETS_CACHE";

      log("Saved in localStorage:");
      log(localStorage.getItem(cacheKey) || "Nothing saved");
    } catch (err) {
      log("ERROR:");
      log(err.toString());
    }
  };

  return (
    <div
      style={{
        padding: 15,
        background: "#111",
        color: "#0f0",
        fontSize: 12,
        maxHeight: 400,
        overflow: "auto",
      }}
    >
      <h3>Debug Panel</h3>

      <div style={{ marginBottom: 10 }}>
        <button onClick={() => test("wallets")}>Test Wallets</button>
        <button onClick={() => test("orders")} style={{ marginLeft: 10 }}>
          Test Orders
        </button>
        <button onClick={() => test("markets")} style={{ marginLeft: 10 }}>
          Test Markets
        </button>
      </div>

      <pre>{logs.join("\n\n")}</pre>
    </div>
  );
}