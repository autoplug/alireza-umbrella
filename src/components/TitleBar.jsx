import React from "react";

export default function TitleBar({ title, count }) {
  const barStyle = {
    backgroundColor: "#f5e1c9",       // کرم روشن
    borderTop: "2px solid #d9bfae",   // کرم تیره‌تر
    borderBottom: "2px solid #d9bfae",
    padding: "6px 10px",
    margin: "10px 0",
    fontWeight: "bold",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  return (
    <div style={barStyle}>
      {title} {typeof count === "number" ? `[${count}]` : ""}
    </div>
  );
}