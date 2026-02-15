import React, { useEffect, useState } from "react";
import WalletList from "../components/wallet/WalletList";
import { fetchWallets } from "../services/walletService";

// Home page component
function Home() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch wallets when component mounts
  useEffect(() => {
    const loadWallets = async () => {
      try {
        const data = await fetchWallets();
        setWallets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadWallets();
  }, []);

  if (loading) return <div style={{ padding: "20px" }}>Loading...</div>;
  if (error) return <div style={{ padding: "20px" }}>Error: {error}</div>;

  return <WalletList wallets={wallets} />;
}

export default Home;
