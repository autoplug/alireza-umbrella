import React, { useState, useEffect } from "react";
import axios from "axios";
import WalletList from "../components/WalletList";
import WalletSkeleton from "../components/WalletSkeleton";

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";

const CACHE_KEY = "WALLET_CACHE";
const CACHE_TIME_KEY = "WALLET_CACHE_TIME";
const MIN_FETCH_INTERVAL = 5 * 60 * 1000; // 1 minute

function Home() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = Date.now();
    const cachedData = localStorage.getItem(CACHE_KEY);
    const lastFetch = localStorage.getItem(CACHE_TIME_KEY);

    // 1️⃣ Show cached data immediately if exists
    if (cachedData) {
      setWallets(JSON.parse(cachedData));
      setLoading(false);
    }

    // 2️⃣ Prevent frequent API calls
    if (lastFetch && now - Number(lastFetch) < MIN_FETCH_INTERVAL) {
      return;
    }

    const fetchWallets = async () => {
      try {
        const token = localStorage.getItem("NOBITEX_TOKEN");

        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(WORKER_URL, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (response.data && response.data.wallets) {
          setWallets(response.data.wallets);

          // Save to cache
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify(response.data.wallets)
          );
          localStorage.setItem(CACHE_TIME_KEY, now.toString());
        }
      } catch (error) {
        console.error("Wallet fetch error:", error);
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