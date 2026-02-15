import React from "react";

// Bottom navigation footer
function Footer() {
  const handleClick = (name) => {
    alert(`You clicked ${name}`);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        padding: "10px 0",
        borderTop: "1px solid #ccc",
        backgroundColor: "#f8f8f8",
        position: "sticky",
        bottom: 0,
      }}
    >
      <button onClick={() => handleClick("Home")}>Home 2</button>
      <button onClick={() => handleClick("Deposit")}>Deposit</button>
      <button onClick={() => handleClick("Settings")}>Settings</button>
    </div>
  );
}

export default Footer;
