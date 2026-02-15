import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function TokenInput({ onTokenSubmit }) {
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!token) return;

    onTokenSubmit(token); // Save token in parent/localStorage
    navigate("/");        // Go to Home page
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Enter Your API Token</h2>
      <input
        type="password"
        placeholder="API Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "15px", fontSize: "16px" }}
      />
      <button
        onClick={handleSubmit}
        style={{ width: "100%", padding: "10px", fontSize: "16px" }}
      >
        Save Token
      </button>
    </div>
  );
}

export default TokenInput;