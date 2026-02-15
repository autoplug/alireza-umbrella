import React, { useState } from "react";

function TokenInput({ onSave, initialToken = "" }) {
  const [token, setToken] = useState(initialToken);

  const handleSave = () => {
    if (!token) return alert("Please enter a token");
    onSave(token);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label htmlFor="token">Nobitex Token:</label>
      <input
        id="token"
        type="text"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        style={{
          padding: 8,
          fontSize: 14,
          borderRadius: 4,
          border: "1px solid #ccc",
        }}
        placeholder="Enter your token here"
      />
      <button
        onClick={handleSave}
        style={{
          padding: 8,
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Save Token
      </button>
    </div>
  );
}

export default TokenInput;
