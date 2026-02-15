import React, { useState } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import TokenInput from "./components/TokenInput";

function App() {
  const [token, setToken] = useState(localStorage.getItem("API_TOKEN") || "");

  return (
    <Router>
      <Routes>
        {/* Home page */}
        <Route
          path="/"
          element={token ? <Home /> : <Navigate to="/token" replace />}
        />

        {/* Token input page */}
        <Route
          path="/token"
          element={<TokenInput onTokenSubmit={setToken} />}
        />
      </Routes>
    </Router>
  );
}

export default App;