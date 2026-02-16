import React, { useEffect, useState } from "react";
import axios from "axios";// optional, not needed for wallets

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";
const CACHE_KEY = "WALLETS_CACHE";
const CACHE_TIME_KEY = "WALLETS_CACHE_TIME";
const MIN_FETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes

function DebugPanel() {
  const [wallets, setWallets] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const addLog = (msg) => setLogs((prev) => [...prev, msg]);

  useEffect(() => {
    const fetchWallets = async () => {
      setLoading(true);
      addLog("Starting fetchWallets...");

      try {
        // Read cache
        const cachedRaw = localStorage.getItem(CACHE_KEY);
        const cached = cachedRaw ? JSON.parse(cachedRaw) : null;
        addLog(cached);
        const lastFetchRaw = localStorage.getItem(CACHE_TIME_KEY);
        const lastFetch = lastFetchRaw ? Number(lastFetchRaw) : 0;
        const now = Date.now();

        // Only fetch if cache expired
        if (cached && now - lastFetch < MIN_FETCH_INTERVAL) {
          addLog("Using cached wallets");
          setWallets(cached);
          setLoading(false);
          return;
        }

        // Get token
        const token = localStorage.getItem("NOBITEX_TOKEN");
        if (!token) {
          addLog("No token found, returning empty array");
          setWallets([]);
          setLoading(false);
          return;
        }

        addLog("Fetching from worker...");
        const response = await axios.get(`${WORKER_URL}?type=wallets`, {
          headers: { Authorization: `Token ${token}` },
        });

        const data = response.data.wallets || [];
        addLog(`Fetched wallets: ${JSON.stringify(data, null, 2)}`);

        // Save cache only if data is not empty
        if (data.length > 0) {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
          localStorage.setItem(CACHE_TIME_KEY, now.toString());
          addLog("Cache updated");
        } else {
          addLog("Fetched empty wallets, cache not updated");
        }

        setWallets(data);
      } catch (err) {
        addLog(`Error fetching wallets: ${err.message}`);
        // Fallback to cache
        const cachedRaw = localStorage.getItem(CACHE_KEY);
        const cached = cachedRaw ? JSON.parse(cachedRaw) : [];
        setWallets(cached);
      }

      setLoading(false);
      addLog("fetchWallets finished");
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