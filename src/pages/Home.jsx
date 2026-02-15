import React, { useEffect, useState } from "react";
import WalletList from "../components/wallet/WalletList";
import { fetchWallets } from "../services/WalletService";

function Home() {
  // Local state for wallets
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchWallets();
        setWallets(data);
      } catch (err) {
        setError("Failed to load wallets");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div style={{ padding: "20px" }}>Loading...</div>;
  if (error) return <div style={{ padding: "20px" }}>{error}</div>;

  return <WalletList wallets={wallets} />;
}

export default Home;