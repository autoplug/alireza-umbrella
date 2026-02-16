import React, { useEffect, useState } from "react";
import { fetchAllData } from "../api/api";

function Home() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchAllData();
      setWallets(data.wallets || []);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div>
      {loading ? <div>Loading...</div> : <WalletList wallets={wallets} />}
    </div>
  );
}

export default Home;
