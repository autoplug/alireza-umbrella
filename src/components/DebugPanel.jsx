import React, { useEffect, useState } from "react";
import { fetchData } from "../api/api"; // مسیر فایل شما

export default function DebugPanel() {
  const [wallets, setWallets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [markets, setMarkets] = useState({});
  const [trades, setTrades] = useState([]);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const walletsData = await fetchData("wallets");
      const ordersData = await fetchData("orders");
      const marketsData = await fetchData("markets");
      const tradesData = await fetchData("trades");

      setWallets(walletsData.slice(0, 2));  // only first 2 rows
      setOrders(ordersData.slice(0, 2));
      setMarkets(Object.fromEntries(Object.entries(marketsData).slice(0, 2))); // first 2 markets
      setTrades(tradesData.slice(0, 2));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>Debug Panel</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <h3>Wallets</h3>
      <pre>{JSON.stringify(wallets, null, 2)}</pre>

      <h3>Orders</h3>
      <pre>{JSON.stringify(orders, null, 2)}</pre>

      <h3>Markets</h3>
      <pre>{JSON.stringify(markets, null, 2)}</pre>

      <h3>Trades</h3>
      <pre>{JSON.stringify(trades, null, 2)}</pre>
    </div>
  );
}