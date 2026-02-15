import React from "react";

function BottomNav({ goHome, goSettings }) {
  function BottomNav({ goHome, goSettings, currentPage }) {
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
      userSelect: "none",        // جلوگیری از انتخاب متن
      WebkitUserSelect: "none",
      borderRadius: 30, // بیضی شدن دکمه فعال
      transition: "0.2s",
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
        zIndex: 1000,
        width: "90%",
        maxWidth: 400,
        padding: "8px 0",
      }}
    >
      {/* Home button */}
      <button
        onClick={goHome}
        style={buttonStyle(currentPage === "home")}
      >
       
        {/* Icon above the button */}
        <div>
          <i className="fas fa-home" style={{ fontSize: 20, marginBottom: 2 }}></i>
        </div>
        Home
      </button>

      {/* Settings button */}
      <button
        onClick={goSettings}
        style={buttonStyle(currentPage === "settings")}
      >
   
        {/* Icon above the button */}
        <div>
          <i className="fas fa-cog" style={{ fontSize: 20, marginBottom: 2 }}></i>
        </div>
        Settings
      </button>
    </div>
  );
}

export default BottomNav;