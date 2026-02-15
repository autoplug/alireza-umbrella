import React, { useEffect, useState } from "react";
import axios from "axios";
import TokenInput from "../components/TokenInput";

function Home() {
  const [token, setToken] = useState(localStorage.getItem("API_TOKEN") || "");
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Save token to localStorage whenever it changes
  useEffect(() => {
    if (token) localStorage.setItem("API_TOKEN", token);
  }, [token]);

  // Fetch wallets when token is set
  useEffect(() => {
    if (token) {
      fetchWallets();
    }
  }, [token]);

  const fetchWallets = async () => {
    setLoading(true);
    setError(null);

    try {
      // ⚠️ Unsafe: token is in frontend
      const response = await axios.get("https://api.nobitex.ir/user/wallets", {
        headers: {
          "Authorization": `Bearer ${token}`, // یا X-API-TOKEN بسته به API
        },
      });
      setWallets(response.data);
    } catch (err) {
      setError("Failed to fetch wallets: " + err.message);
      setWallets([]);
    } finally {
      setLoading(false);
    }
  };

  // If no token, show TokenInput page
  if (!token) {
    return <TokenInput onTokenSubmit={setToken} />;
  }

  // If token exists, show wallets
  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Your Wallets</h2>

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

      <button onClick={fetchWallets} disabled={loading}>
        Refresh Wallets
      </button>
    </div>
  );
}

export default Home;