import React from "react";

export default function Title({ title }) {
  const barStyle = {
    padding: "5px 20px",
    margin: "5px 0",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  const h2Style = {
    margin: 0,
    fontWeight: "bold",
  };

  return (
    <div style={barStyle}>
      <h2 style={h2Style}>
        {title}
      </h2>
    </div>
  );
}