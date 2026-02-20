import React, { useState } from "react";
import TokenInput from "../components/TokenInput";

export default function Chart() {
  const [token, setToken] = useState(localStorage.getItem("NOBITEX_TOKEN") || "");

  const handleTokenSave = (newToken) => {
    localStorage.setItem("NOBITEX_TOKEN", newToken);
    setToken(newToken);
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Chart</h2>
      <TokenInput initialToken={token} onSave={handleTokenSave} />
      {/* Additional settings can be added here */}
    </div>
  );
}

