import React, { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import BottomNavigation from "./layout/BottomNavigation";
import { fetchAllData } from "./api/api";

// Pages
import Home from "./pages/Home";
import Markets from "./pages/Markets";
import Settings from "./pages/Settings";

export default function App() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

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

  return (
    <Router>
      <div style={{ minHeight: "100vh", paddingBottom: "60px" }}>
        
        {/* Loader text */}
        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "10px",
              fontWeight: "bold"
            }}
          >
            Loading data...
          </div>
        )}

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>

        {/* Bottom Navigation */}
        <BottomNavigation />

      </div>
    </Router>
  );
}


