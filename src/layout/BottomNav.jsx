import React from "react";

function BottomNav({ goHome, goSettings }) {
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
        zIndex: 1000,
        width: "90%", // make it wide enough for touch
        maxWidth: 400,
        padding: "8px 0",
      }}
    >
      {/* Home button */}
      <button
        onClick={goHome}
        style={{
          flex: 1,
          background: "none",
          border: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 0",
          color: "#333",
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        <i className="fas fa-home" style={{ fontSize: 20, marginBottom: 2 }}></i>
        Home
      </button>

      {/* Settings button */}
      <button
        onClick={goSettings}
        style={{
          flex: 1,
          background: "none",
          border: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 0",
          color: "#333",
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        <i className="fas fa-cog" style={{ fontSize: 20, marginBottom: 2 }}></i>
        Settings
      </button>
    </div>
  );
}

export default BottomNav;