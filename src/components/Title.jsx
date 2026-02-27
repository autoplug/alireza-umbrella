import React from "react";

export default function Title({ title }) {
  const barStyle = {
    padding: "10px 10px",
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
        {title}
      </h3>
    </div>
  );
}