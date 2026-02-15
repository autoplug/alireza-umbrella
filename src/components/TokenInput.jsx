import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function TokenInput({ onTokenSubmit }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("API_TOKEN") || "");

  const handleSubmit = () => {
    if (!token) return;
    localStorage.setItem("API_TOKEN", token);
    onTokenSubmit(token);
    navigate("/");
  };

  const handleClear = () => {
    localStorage.removeItem("API_TOKEN");
    setToken("");
    onTokenSubmit("");
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
        style={{ width: "100%", padding: "10px", fontSize: "16px", marginBottom: "10px" }}
      >
        Save Token
      </button>
      <button
        onClick={handleClear}
        style={{ width: "100%", padding: "10px", fontSize: "16px", background: "#f44336" ,color: "white"}}
      >
        Clear Token
      </button>
    </div>
  );
}

export default TokenInput;