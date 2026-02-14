import React from "react";

function App() {
  // Function to handle button clicks
  const handleClick = (name) => {
    alert(`You clicked ${name}`);
  };

  return (
    // Main container with full viewport height and column layout
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Main content area */}
      <div style={{ flex: 1, padding: "20px", textAlign: "center" }}>
        <h1>Welcome to My App</h1>
        <p>This is the main content area.</p>
      </div>

      {/* Footer with buttons fixed at the bottom */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "10px 0",
          borderTop: "1px solid #ccc",
          backgroundColor: "#f8f8f8",
          position: "sticky",
          bottom: 0,
        }}
      >
        {/* Each button triggers handleClick with its name */}
        <button onClick={() => handleClick("Home")}>Home</button>
        <button onClick={() => handleClick("Profile")}>Profile</button>
        <button onClick={() => handleClick("Settings")}>Settings</button>
      </div>
    </div>
  );
}

export default App;