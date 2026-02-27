import React, { useState } from "react";
import NobitexToken from "./NobitexToken";

const rowStyle = {
  padding: "10px 0",
  margin: "0 0",
  marginTop: "20px",
  overflowY: "auto" ,
  backgroundColor: "#fff",
  borderTop: "1px solid #CCC",
  borderBottom: "1px solid #CCC",
};

export default function Settings() {
  const [token, setToken] = useState(localStorage.getItem("NOBITEX_TOKEN") || "");

  const handleTokenSave = (newToken) => {
    localStorage.setItem("NOBITEX_TOKEN", newToken);
    setToken(newToken);
  };

  return (
    <div style={{...rowStyle }}>
      <h2>Settings</h2>
      <NobitexToken initialToken={token} onSave={handleTokenSave} />
      {/* Additional settings can be added here */}
    </div>
  );
}


