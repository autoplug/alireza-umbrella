import React, { useEffect, useState } from "react";
import axios from "axios";

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";
const CACHE_KEY = "WALLETS_CACHE";
const CACHE_TIME_KEY = "WALLETS_CACHE_TIME";
const MIN_FETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes

function DebugPanel() {
  const [wallets, setWallets] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cache, setCacheState] = useState(null); // cache current value

  const addLog = (msg) => setLogs((prev) => [...prev, msg]);

  useEffect(() => {
    const fetchWallets = async () => {
      setLoading(true);
      addLog("=== DebugPanel: Start fetchWallets ===");

      // Read current cache
      const cachedRaw = localStorage.getItem(CACHE_KEY);
      const cachedData = cachedRaw ? JSON.parse(cachedRaw) : null;
      setCacheState(cachedData);
      addLog(`Current cache: ${JSON.stringify(cachedData, null, 2)}`);

      // Read last fetch time
      const lastFetchRaw = localStorage.getItem(CACHE_TIME_KEY);
      const lastFetch = lastFetchRaw ? Number(lastFetchRaw) : 0;
      const now = Date.now();

      // Decide if fetch needed
      if (cachedData && now - lastFetch < MIN_FETCH_INTERVAL) {
        addLog("Cache is still valid, using cached wallets");
        setWallets(cachedData);
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("NOBITEX_TOKEN");
        if (!token) {
          addLog("No token found, returning empty array");
          setWallets([]);
          setLoading(false);
          return;
        }

        addLog("Fetching wallets from Worker...");
        const response = await axios.get(`${WORKER_URL}?type=wallets`, {
          headers: { Authorization: `Token ${token}` },
        });

        const data = response.data.wallets || [];
        addLog(`Fetched wallets: ${JSON.stringify(data, null, 2)}`);

        if (data.length > 0) {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
          localStorage.setItem(CACHE_TIME_KEY, now.toString());
          addLog("Cache updated with new data");
        } else {
          addLog("Fetched empty wallets, cache not updated");
        }

        setWallets(data);
      } catch (err) {
        addLog(`Error fetching wallets: ${err.message}`);
        // fallback to cache
        setWallets(cachedData || []);
        addLog("Using cached data as fallback");
      }

      setLoading(false);
      addLog("=== DebugPanel: fetchWallets finished ===");
    };

    fetchWallets();
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
          marginBottom: 10,
        }}
      >
        {logs.map((log, idx) => (
          <pre key={idx} style={{ margin: 0 }}>
            {log}
          </pre>
        ))}
      </div>

      <h3>Current Cache:</h3>
      <pre>{cache ? JSON.stringify(cache, null, 2) : "No cache yet"}</pre>

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