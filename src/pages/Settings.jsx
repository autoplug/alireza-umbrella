import React, { useState, useEffect } from "react";
import TokenInput from "../components/TokenInput";

function Settings() {
  const [token, setToken] = useState(localStorage.getItem("NOBITEX_TOKEN") || "");

  const handleTokenSave = (newToken) => {
    localStorage.setItem("NOBITEX_TOKEN", newToken);
    setToken(newToken);
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Settings</h2>
      <TokenInput initialToken={token} onSave={handleTokenSave} />
      {/* Additional settings can be added here */}
    </div>
  );
}

export default Settings;