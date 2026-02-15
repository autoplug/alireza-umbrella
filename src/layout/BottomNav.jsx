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
        width: "90%",
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
        {/* Icon above the button */}
        <div style={{ marginBottom: 4 }}>
          <i className="fas fa-wallet" style={{ fontSize: 18 }}></i>
        </div>
        <div>
          <i className="fas fa-home" style={{ fontSize: 20, marginBottom: 2 }}></i>
        </div>
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
        {/* Icon above the button */}
        <div style={{ marginBottom: 4 }}>
          <i className="fas fa-sliders-h" style={{ fontSize: 18 }}></i>
        </div>
        <div>
          <i className="fas fa-cog" style={{ fontSize: 20, marginBottom: 2 }}></i>
        </div>
        Settings
      </button>
    </div>
  );
}

export default BottomNav;