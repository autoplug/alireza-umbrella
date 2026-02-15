import React from "react";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "space-around",
        padding: "10px 0",
        background: "#1976d2",
        color: "white",
        fontWeight: "bold",
        boxShadow: "0 -2px 5px rgba(0,0,0,0.2)"
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          background: "white",
          color: "#1976d2",
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Home
      </button>
      <button
        onClick={() => navigate("/token")}
        style={{
          background: "white",
          color: "#1976d2",
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Token
      </button>
    </div>
  );
}

export default Footer;