import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Markets from "./pages/Markets";
import Settings from "./pages/Settings";
import BottomNav from "./layout/BottomNav";

function App() {
  return (
    <Router>
      <div style={{ paddingBottom: "100px" }}> {/* space for BottomNav */}
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>

      <BottomNav />
    </Router>
  );
}

export default App;