import React, { useState, useEffect } from "react";
import axios from "axios";
import WalletList from "../components/WalletList";
import BottomNav from "../layout/BottomNav";
import Settings from "./Settings";

// Cache expiration time (5 minutes)
const CACHE_TIME = 5 * 60 * 1000;

function Home() {
  // State variables
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load token from localStorage
  const [token, setToken] = useState(
    localStorage.getItem("NOBITEX_TOKEN") || ""
  );

  // Control which page is currently visible
  const [currentPage, setCurrentPage] = useState(
    token ? "home" : "settings"
  );

  const workerUrl = "https://wallet.alireza-b83.workers.dev";

  useEffect(() => {
    if (!token) return;
  
    const loadWallets = async () => {
      const cachedData = localStorage.getItem("NOBITEX_WALLETS");
      const lastFetchTime = localStorage.getItem("NOBITEX_LAST_FETCH");
      const now = Date.now();
      const FIVE_MINUTES = 5 * 60 * 1000;
  
      // ✅ If we already have cached wallets → always show them
      if (cachedData) {
        setWallets(JSON.parse(cachedData));
      }
  
      // ✅ If last fetch was less than 5 minutes ago → DO NOT call API
      if (lastFetchTime && now - Number(lastFetchTime) < FIVE_MINUTES) {
        return;
      }
  
      // ✅ Otherwise call API
      try {
        setLoading(true);
        setError(null);
  
        const response = await axios.get(workerUrl, {
          headers: { Authorization: `Token ${token}` },
        });
  
        const walletsData = response.data.wallets || [];
  
        setWallets(walletsData);
  
        // Save fresh data
        localStorage.setItem(
          "NOBITEX_WALLETS",
          JSON.stringify(walletsData)
        );
  
        // Save last fetch time (for rate limiting only)
        localStorage.setItem(
          "NOBITEX_LAST_FETCH",
          now.toString()
        );
  
      } catch (err) {
        setError("Unable to update wallets");
      } finally {
        setLoading(false);
      }
    };
  
    loadWallets();
  
  }, [token]);



  // Save token and clear old cache
  const handleTokenSave = (newToken) => {
    localStorage.setItem("NOBITEX_TOKEN", newToken);

    // Clear previous wallet cache
    localStorage.removeItem("NOBITEX_WALLETS");
    localStorage.removeItem("NOBITEX_WALLETS_TIME");

    setToken(newToken);
    setCurrentPage("home");
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      {currentPage === "settings" ? (
        <Settings token={token} onSaveToken={handleTokenSave} />
      ) : (
        <div style={{ padding: 16 }}>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <WalletList wallets={wallets} />
          )}
        </div>
      )}

      <BottomNav
        currentPage={currentPage}
        goHome={() => setCurrentPage("home")}
        goSettings={() => setCurrentPage("settings")}
      />
    </div>
  );
}

export default Home;