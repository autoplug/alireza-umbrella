import React, { useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import BottomNavigation from "./layout/BottomNavigation";
import Header from "./layout/Header";
import { fetchAllData } from "./api/api";

// Pages
import Home from "./pages/Home";
import Trades from "./pages/Trades";
import Settings from "./pages/Settings";

export default function App() {

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <Router>
      <div style={{ minHeight: "100vh", paddingBottom: "60px" }}>
        
        {/* Header above all pages */}
        <Header />
        
        {/* Spacer برای محتوای صفحه */}
        <div style={{ height: "48px" }}></div> 
        
        {/* Routes */}
        <Routes>
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


