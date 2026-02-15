import React, { useState, useEffect } from "react";
import axios from "axios";
import WalletList from "../components/WalletList";

function Home({ token }) {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchWallets = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          "https://apiv2.nobitex.ir/users/wallets/list",
          {
            headers: {
              "Authorization": `Token ${token}`, // correct header
            },
          }
        );

        // Check the data structure returned by Nobitex
        // For example, it might be response.data.wallets or just response.data
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

  if (!token) return <div>Please enter token first</div>;

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