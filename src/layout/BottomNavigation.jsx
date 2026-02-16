import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const buttons = [
    { label: "Home", path: "/" },
    { label: "Markets", path: "/markets" },
    { label: "Settings", path: "/settings" },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        padding: 8,
        background: "rgba(255,255,255,0.9)",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
      }}
    >
      {buttons.map((btn) => {
        const active = location.pathname === btn.path;
        return (
          <button
            key={btn.path}
            onClick={() => navigate(btn.path)}
            style={{
              padding: "8px 16px",
              borderRadius: 16,
              background: active ? "#007bff" : "transparent",
              color: active ? "#fff" : "#000",
              border: "none",
              cursor: "pointer",
            }}
          >
            {btn.label}
          </button>
        );
      })}
    </div>
  );
}