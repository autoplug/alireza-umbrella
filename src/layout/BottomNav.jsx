import React from "react";

function BottomNav({ goHome, goSettings, goMarkets, currentPage }) {
  // Button style with active pill
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
    userSelect: "none", // prevent text selection
    WebkitUserSelect: "none",
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
      {/* Home Button */}
      <button onClick={goHome} style={buttonStyle(currentPage === "home")}>
        <i
          className="fas fa-home"
          style={{
            fontSize: 20,
            marginBottom: 2,
            color: currentPage === "home" ? "#000" : "#555",
          }}
        ></i>
        Home
      </button>

      {/* Markets Button */}
      <button
        onClick={goMarkets}
        style={buttonStyle(currentPage === "markets")}
      >
        <i
          className="fas fa-chart-line"
          style={{
            fontSize: 20,
            marginBottom: 2,
            color: currentPage === "markets" ? "#000" : "#555",
          }}
        ></i>
        Markets
      </button>

      {/* Settings Button */}
      <button
        onClick={goSettings}
        style={buttonStyle(currentPage === "settings")}
      >
        <i
          className="fas fa-cog"
          style={{
            fontSize: 20,
            marginBottom: 2,
            color: currentPage === "settings" ? "#000" : "#555",
          }}
        ></i>
        Settings
      </button>
    </div>
  );
}

export default BottomNav;