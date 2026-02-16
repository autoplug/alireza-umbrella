import React, { useState, useEffect } from "react";
import WalletList from "../components/WalletList";
import WalletSkeleton from "../components/WalletSkeleton";

const CACHE_KEY = "WALLET_CACHE";
const CACHE_TIME_KEY = "WALLET_CACHE_TIME";
const MIN_FETCH_INTERVAL = 60 * 1000; // 1 minute

function Home() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = Date.now();
    const cachedData = localStorage.getItem(CACHE_KEY);
    const lastFetch = localStorage.getItem(CACHE_TIME_KEY);

    // 1️⃣ If cache exists → show immediately
    if (cachedData) {
      setWallets(JSON.parse(cachedData));
      setLoading(false);
    }

    // 2️⃣ Prevent frequent API calls
    if (lastFetch && now - Number(lastFetch) < MIN_FETCH_INTERVAL) {
      return;
    }

    // 3️⃣ Fetch fresh data
    const fetchWallets = async () => {
      try {
        const token = localStorage.getItem("NOBITEX_TOKEN");

        const response = await fetch("YOUR_WORKER_URL", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const data = await response.json();

        setWallets(data.wallets);

        // Save to cache
        localStorage.setItem(CACHE_KEY, JSON.stringify(data.wallets));
        localStorage.setItem(CACHE_TIME_KEY, now.toString());
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Wallets</h2>

      {loading ? (
        <WalletSkeleton />
      ) : (
        <WalletList wallets={wallets} />
      )}
    </div>
  );
}

export default Home;