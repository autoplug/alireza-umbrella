import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./layout/Footer";

function App() {
  return (
    <Router>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;