import React, { useState } from "react";
import WalletList from "./components/WalletList";

function App() {
  // State to store wallet data
  const [wallets] = useState([
    { id: 1, name: "Bitcoin Wallet", balance: "0.45 BTC" },
    { id: 2, name: "Ethereum Wallet", balance: "2.1 ETH" },
    { id: 3, name: "USDT Wallet", balance: "1500 USDT" },
  ]);

  // Function to handle button clicks
  const handleClick = (name) => {
    alert(`You clicked ${name}`);
  };

  return (
    // Main layout container
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Load WalletList component */}
      <div style={{ flex: 1 }}>
        <WalletList wallets={wallets} />
      </div>

      {/* Bottom navigation buttons */}
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
        <button onClick={() => handleClick("Home")}>Home</button>
        <button onClick={() => handleClick("Deposit")}>Deposit</button>
        <button onClick={() => handleClick("Settings")}>Settings</button>
      </div>
    </div>
  );
}

export default App;