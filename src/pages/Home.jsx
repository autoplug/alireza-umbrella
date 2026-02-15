import React, { useState, useEffect } from "react";

function Home() {
  const [token, setToken] = useState(localStorage.getItem("API_TOKEN") || "");
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) localStorage.setItem("API_TOKEN", token);
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const fetchWallets = async () => {
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

    fetchWallets();
  }, [token]);

  if (!token) return <div>Please enter token first</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "50px auto" }}>
      <h2>Your Wallets (Mock Data)</h2>

      {loading && <div>Loading wallets...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {!loading && wallets.length === 0 && !error && <div>No wallets found.</div>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {wallets.map((wallet) => (
          <li
            key={wallet.id}
            style={{
              padding: "15px",
              marginBottom: "10px",
              background: "#f1f1f1",
              borderRadius: "8px",
              fontSize: "16px"
            }}
          >
            <strong>{wallet.name}</strong>: {wallet.balance} {wallet.currency}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;