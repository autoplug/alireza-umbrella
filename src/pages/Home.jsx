import React, { useState, useEffect } from "react";
import axios from "axios";
import TokenInput from "../components/TokenInput";

function Home() {
  // Load token from localStorage if it exists
  const [token, setToken] = useState(localStorage.getItem("API_TOKEN") || "");

  // Wallet data from API
  const [wallets, setWallets] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Save token to localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("API_TOKEN", token);
    }
  }, [token]);

  // Fetch wallets automatically when token is available
  useEffect(() => {
    if (!token) return;

    // Define async function inside useEffect to avoid dependency warnings
    const fetchWallets = async () => {
      setLoading(true);
      setError(null);

      try {
        // ⚠️ Unsafe: token is used directly in frontend
        const response = await axios.get("https://apiv2.nobitex.ir/users/wallets/list", {
          headers: {
            "Authorization": `Token ${token}`, // or X-API-TOKEN depending on API
          },
        });

        setWallets(response.data); // store wallet data in state
      } catch (err) {
        setError("Failed to fetch wallets: " + err.message);
        setWallets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, [token]); // Only run when token changes

  // If no token exists, show the TokenInput component
  if (!token) {
    return <TokenInput onTokenSubmit={setToken} />;
  }

  // If token exists, display the wallet list
  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Your Wallets</h2>

      {/* Loading and error messages */}
      {loading && <div>Loading wallets...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Show message if no wallets found */}
      {!loading && wallets.length === 0 && !error && <div>No wallets found.</div>}

      {/* List wallets */}
      <ul>
        {wallets.map((wallet) => (
          <li key={wallet.id} style={{ marginBottom: "10px" }}>
            <strong>{wallet.name}</strong>: {wallet.balance} {wallet.currency}
          </li>
        ))}
      </ul>

      {/* Refresh button */}
      <button
        onClick={() => {
          const fetchWalletsAgain = async () => {
            setLoading(true);
            setError(null);

            try {
              const response = await axios.get("https://api.nobitex.ir/user/wallets", {
                headers: {
                  "Authorization": `Bearer ${token}`,
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