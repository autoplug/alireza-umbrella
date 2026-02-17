import React from "react";

export default function TitleBar({ title, count }) {
  const barStyle = {
    backgroundColor: "#f5e1c9",       // کرم روشن
    borderTop: "2px solid #d9bfae",   // کرم تیره‌تر
    borderBottom: "2px solid #d9bfae",
    padding: "18px 10px",
    margin: "16px 0",
    marginBottom : "3px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  const h3Style = {
    margin: 0,
    fontWeight: "bold",
    fontSize: "16px",
  };

  return (
    <div style={barStyle}>
      <h3 style={h3Style}>
        {title} {count > 0 ? `(${count})` : ""}
      </h3>
    </div>
  );
}