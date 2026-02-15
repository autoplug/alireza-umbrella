import React, { useState, useEffect } from "react";
import axios from "axios";
import WalletList from "../components/WalletList";
import BottomNav from "../layout/BottomNav";
import Settings from "./Settings";

function Home() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("NOBITEX_TOKEN") || "");
  const [currentPage, setCurrentPage] = useState(token ? "home" : "settings");

  const workerUrl = "https://wallet.alireza-b83.workers.dev";

  const fetchWallets = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(workerUrl, {
        headers: { Authorization: `Token ${token}` },
      });
      setWallets(response.data.wallets || []);
    } catch (err) {
      setError("Failed to load wallets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, [token]);

  const handleTokenSave = (newToken) => {
    localStorage.setItem("NOBITEX_TOKEN", newToken);
    setToken(newToken);
    setCurrentPage("home");
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      {currentPage === "settings" ? (
        <Settings token={token} onSaveToken={handleTokenSave} />
      ) : (
        <div id="wallet-section" style={{ padding: 16 }}>
          {loading ? <div>Loading...</div> : error ? <div>{error}</div> : <WalletList wallets={wallets} />}
        </div>
      )}

      <BottomNav goHome={() => setCurrentPage("home")} goSettings={() => setCurrentPage("settings")} />
    </div>
  );
}

export default Home;