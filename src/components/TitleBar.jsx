import React from "react";

export default function TitleBar({ title, count }) {
  const barStyle = {
    backgroundColor: "#f5e1c9",       // کرم روشن
    borderTop: "2px solid #d9bfae",   // کرم تیره‌تر
    padding: "18px 10px",
    margin: "0 0",
    marginBottom : "10px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  const h3Style = {
    margin: 0,
    fontWeight: "bold",
  };

  return (
    <div style={barStyle}>
      <h3 style={h3Style}>
        {title} {count > 0 ? `(${count})` : ""}
      </h3>
    </div>
  );
}