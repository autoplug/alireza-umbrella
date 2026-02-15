import React from "react";
import Home from "./pages/Home";
import Footer from "./layout/Footer";

// Root application component
function App() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Page content */}
      <div style={{ flex: 1 }}>
        <Home />
      </div>

      {/* Bottom footer */}
      <Footer />
    </div>
  );
}

export default App;