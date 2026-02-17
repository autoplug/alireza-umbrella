import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const buttonStyle = (isActive) => ({
    flex: 1,
    background: isActive ? "rgba(0,0,0,0.08)" : "none",
    border: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 0",
    fontSize: 12,
    cursor: "pointer",
    borderRadius: 30,
    transition: "0.2s",
    userSelect: "none",
  });

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "rgba(255,255,255,0.9)",
        borderRadius: 50,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        display: "flex",
        width: "90%",
        maxWidth: 400,
        padding: "8px",
        zIndex: 1000,
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={buttonStyle(currentPath === "/")}
      >
        <i className="fas fa-home" style={{ fontSize: 20, marginBottom: 2 }}></i>
        Home
      </button>

      <button
        onClick={() => navigate("/trades")}
        style={buttonStyle(currentPath === "/markets")}
      >
        <i className="fas fa-chart-line" style={{ fontSize: 20, marginBottom: 2 }}></i>
        Trades
      </button>

      <button
        onClick={() => navigate("/settings")}
        style={buttonStyle(currentPath === "/settings")}
      >
        <i className="fas fa-cog" style={{ fontSize: 20, marginBottom: 2 }}></i>
        Settings
      </button>
    </div>
  );
}

export default BottomNavigation;

