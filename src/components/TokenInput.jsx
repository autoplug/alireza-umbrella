import React, { useState } from "react";

function TokenInput({ onTokenSubmit }) {
  const [token, setToken] = useState("");

  const handleSubmit = () => {
    if (!token) return;
    // Call parent callback
    onTokenSubmit(token);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Enter Your API Token</h2>
      <input
        type="password"
        placeholder="API Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <button onClick={handleSubmit} style={{ width: "100%" }}>
        Save Token
      </button>
    </div>
  );
}

export default TokenInput;