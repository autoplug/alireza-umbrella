import React, { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { fetchAllData } from "./api/api";

import HomePage from "./pages/Home";
import MarketsPage from "./pages/Markets";
import SettingsPage from "./pages/Settings";
import BottomNavigation from "./layout/BottomNavigation";

export default function App() {
  const [wallets, setWallets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchAllData();
      setWallets(data.wallets);
      setOrders(data.orders);
      setMarkets(data.markets);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <Router>
      
      
            
 
      
      
      
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        {/* Main content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          {loading && <div>Loading...</div>}






     <div>
  <h3>Wallet Debug:</h3>
  <pre>
    {JSON.stringify(wallets, null, 2)}
  </pre>
</div>
      
      
            
      <div>
  <h3>orders Debug:</h3>
  <pre>
    {JSON.stringify(orders, null, 2)}
  </pre>
</div>
      
      
      
            
      <div>
  <h3>markets Debug:</h3>
  <pre>
    {JSON.stringify(markets, null, 2)}
  </pre>
</div>
      







          <Routes>
            <Route path="/" element={<HomePage wallets={wallets}  />} />
            <Route
              path="/markets"
              element={<MarketsPage markets={markets} orders={orders}/>}
            />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>

        {/* Bottom navigation */}
        <BottomNavigation />
      </div>
    </Router>
  );
}