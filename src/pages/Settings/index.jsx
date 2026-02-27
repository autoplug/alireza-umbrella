import React, { useState } from "react";
import NobitexToken from "./NobitexToken";

function Settings() {
  const [token, setToken] = useState(localStorage.getItem("NOBITEX_TOKEN") || "");

  const handleTokenSave = (newToken) => {
    localStorage.setItem("NOBITEX_TOKEN", newToken);
    setToken(newToken);
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Settings</h2>
      <NobitexToken initialToken={token} onSave={handleTokenSave} />
      {/* Additional settings can be added here */}
    </div>
  );
}

export default Settings;