import React, { useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import MarketsPage from "./pages/Markets";
import SettingsPage from "./pages/Settings";

// Bottom navigation in layout folder
import BottomNavigation from "./layout/BottomNavigation";

// API
import { fetchAllData } from "./api/api";

export default function App() {
  useEffect(() => {
    // Fetch all data once to fill cache/localStorage
    const loadData = async () => {
      try {
        await fetchAllData();
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    loadData();
  }, []);

  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Main content */}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/markets" element={<MarketsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>

        {/* Bottom navigation */}
        <BottomNavigation />
      </div>
    </Router>
  );
}