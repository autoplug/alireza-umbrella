import React, { useState, useEffect } from "react";
import axios from "axios";
import WalletList from "../components/WalletList";
import TokenInput from "../components/TokenInput";
import BottomNav from "../layout/BottomNav";

function Home() {
  // State
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("NOBITEX_TOKEN") || "");
  const [currentPage, setCurrentPage] = useState(token ? "home" : "settings");

  const workerUrl = "https://wallet.alireza-b83.workers.dev";

  // Fetch wallets from Worker
  const fetchWallets = async (currentToken) => {
    if (!currentToken) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(workerUrl, {
        headers: { Authorization: `Token ${currentToken}` },
      });
      setWallets(response.data.wallets || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load wallets");
    } finally {
      setLoading(false);
    }
  };

  // Load wallets on token change
  useEffect(() => {
    if (token) fetchWallets(token);
  }, [token]);

  // Save token to localStorage
  const handleTokenSave = (newToken) => {
    localStorage.setItem("NOBITEX_TOKEN", newToken);
    setToken(newToken);
    setCurrentPage("home"); // go back to home after saving
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Page content */}
      {currentPage === "settings" ? (
        <div id="token-input-section" style={{ padding: 16 }}>
          <h2>Settings</h2>
          <TokenInput onSave={handleTokenSave} initialToken={token} />
          {/* Additional settings can be added here */}
        </div>
      ) : (
        <div id="wallet-section" style={{ padding: 16 }}>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <WalletList wallets={wallets} />
          )}
        </div>
      )}

      {/* Footer / Bottom Navigation */}
      <BottomNav goHome={() => setCurrentPage("home")} goSettings={() => setCurrentPage("settings")} />
    </div>
  );
}

export default Home;