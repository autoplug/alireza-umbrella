import React, { useEffect, useState } from "react";
import axios from "axios";
import WalletList from "../components/WalletList";

function Home() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("nobitex_token");
  const workerUrl = "https://wallet.alireza-b83.workers.dev"; // ← لینک Cloudflare Worker

  useEffect(() => {
    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    const fetchWallets = async () => {
      try {
        const response = await axios.get(workerUrl, {
          headers: { Authorization: `Token ${token}` },
        });

        // Safely get wallets array or empty array
        setWallets(response.data.wallets || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load wallets");
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return <WalletList wallets={wallets} />;
}

export default Home;