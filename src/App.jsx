import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import TokenInput from "./components/TokenInput";
import Footer from "./components/Footer";

function App() {
  const [token, setToken] = useState(localStorage.getItem("API_TOKEN") || "");

  useEffect(() => {
    if (token) localStorage.setItem("API_TOKEN", token);
  }, [token]);

  return (
    <Router>
      <div style={{ paddingBottom: "70px" }}> {/* paddingBottom to avoid overlap with Footer */}
        <Routes>
          <Route
            path="/"
            element={token ? <Home token={token} /> : <Navigate to="/token" replace />}
          />
          <Route
            path="/token"
            element={<TokenInput onTokenSubmit={(t) => setToken(t)} />}
          />
        </Routes>
      </div>

      <Footer /> {/* Always visible at bottom */}
    </Router>
  );
}

export default App;