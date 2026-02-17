import React, { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import BottomNavigation from "./layout/BottomNavigation";
import Header from "./components/Header";
import { fetchAllData } from "./api/api";

// Pages
import Home from "./pages/Home";
import Trades from "./pages/Trades";
import Settings from "./pages/Settings";

export default function App() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await fetchAllData();
      } catch (error) {
        console.log("App fetch error:", error.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <Router>
      <div style={{ minHeight: "100vh", paddingBottom: "60px" }}>
        {/* Routes */}
        <Routes>
          {/* Header above all pages */}
          <Header />
          
          <Route path="/" element={<Home />} />
          <Route path="/trades" element={<Trades />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>

        {/* Bottom Navigation */}
        <BottomNavigation />

      </div>
    </Router>
  );
}


