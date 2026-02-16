import React, { useEffect, useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Markets from "./pages/Markets";
import SettingsPage from "./pages/Settings";

// Components
import BottomNavigation from "./layouts/BottomNavigation"; // یا مسیر صحیح کامپوننت

// API
import { fetchAllData } from "./api/api";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData()
      .then(() => setLoading(false))
      .catch((err) => {
        console.error("Failed to fetch data:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Loader text at top */}
      {loading && (
        <div style={{ padding: 12, textAlign: "center", fontWeight: 600 }}>
          Loading data...
        </div>
      )}

      {/* Main content */}
      {!loading && (
        <div style={{ flex: 1 }}>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/markets" element={<Markets />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </HashRouter>
        </div>
      )}

      {/* Bottom navigation always visible */}
      <BottomNavigation />
    </div>
  );
}