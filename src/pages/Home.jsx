import React, { useState, useEffect } from "react";
import axios from "axios";
import WalletList from "../components/WalletList";

function Home({ token }) {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch wallets from Nobitex API
  useEffect(() => {
    if (!token) return;

    const fetchWallets = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get("https://api.nobitex.ir/user/wallets", {
          headers: {
            "Authorization": `Bearer ${token}`, // or "X-API-TOKEN"
          },
        });

        // Inspect response to match the structure
        setWallets(response.data);
      } catch (err) {
        setError("Failed to fetch wallets: " + err.message);
        setWallets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, [token]);

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "50px auto" }}>
      <h2>Your Wallets</h2>

      {loading && <div>Loading wallets...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* WalletList component */}
      <WalletList wallets={wallets} />
    </div>
  );
}

export default Home;