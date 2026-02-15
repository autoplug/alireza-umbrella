import React, { useState, useEffect } from "react";
import TokenInput from "../components/TokenInput";

function Home() {
  // Load token from localStorage if it exists
  const [token, setToken] = useState(localStorage.getItem("API_TOKEN") || "");

  // Wallets state
  const [wallets, setWallets] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Save token to localStorage whenever it changes
  useEffect(() => {
    if (token) localStorage.setItem("API_TOKEN", token);
  }, [token]);

  // When token exists, fetch wallets (mock for testing)
  useEffect(() => {
    if (!token) return;

    const fetchWallets = async () => {
      setLoading(true);
      setError(null);

      try {
        // Mock wallet data for testing UI
        const mockWallets = [
          { id: 1, name: "Bitcoin", balance: 0.5, currency: "BTC" },
          { id: 2, name: "Ethereum", balance: 1.2, currency: "ETH" },
          { id: 3, name: "Tether", balance: 1000, currency: "USDT" },
        ];

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        setWallets(mockWallets);
      } catch (err) {
        setError("Failed to fetch wallets");
        setWallets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, [token]);

  // If no token, show TokenInput component
  if (!token) {
    return <TokenInput onTokenSubmit={setToken} />;
  }

  // Display wallets when token exists
  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Your Wallets (Mock Data)</h2>

      {loading && <div>Loading wallets...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {!loading && wallets.length === 0 && !error && <div>No wallets found.</div>}

      <ul>
        {wallets.map((wallet) => (
          <li key={wallet.id} style={{ marginBottom: "10px" }}>
            <strong>{wallet.name}</strong>: {wallet.balance} {wallet.currency}
          </li>
        ))}
      </ul>

      {/* Refresh button to reload mock data */}
      <button
        onClick={() => {
          const fetchWalletsAgain = async () => {
            setLoading(true);
            setError(null);
            try {
              const mockWallets = [
                { id: 1, name: "Bitcoin", balance: 0.5, currency: "BTC" },
                { id: 2, name: "Ethereum", balance: 1.2, currency: "ETH" },
                { id: 3, name: "Tether", balance: 1000, currency: "USDT" },
              ];
              await new Promise((resolve) => setTimeout(resolve, 500));
              setWallets(mockWallets);
            } catch (err) {
              setError("Failed to fetch wallets");
              setWallets([]);
            } finally {
              setLoading(false);
            }
          };
          fetchWalletsAgain();
        }}
        disabled={loading}
      >
        Refresh Wallets
      </button>
    </div>
  );
}

export default Home;