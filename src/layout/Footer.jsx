import React from "react";

function Footer() {
  var topImageUrl="https://example.com/footer-top.png";
  const handleHome = () => {
    const walletSection = document.getElementById("wallet-section");
    if (walletSection) {
      walletSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSettings = () => {
    const tokenSection = document.getElementById("token-input-section");
    if (tokenSection) {
      tokenSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        borderTop: "1px solid #ccc",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
      }}
    >
      {/* Top image above buttons */}
      {topImageUrl && (
        <img
          src={topImageUrl}
          alt="footer icon"
          style={{ width: 40, height: 40, marginTop: 4, marginBottom: 4 }}
        />
      )}

      {/* Buttons */}
      <div style={{ display: "flex", width: "100%" }}>
        {/* Home */}
        <button
          onClick={handleHome}
          style={{
            flex: 1,
            padding: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "none",
            background: "none",
            fontSize: 12,
          }}
        >
          <img
            src="https://img.icons8.com/ios-filled/50/000000/home.png"
            alt="Home"
            style={{ width: 24, height: 24, marginBottom: 2 }}
          />
          Home
        </button>

        {/* Settings */}
        <button
          onClick={handleSettings}
          style={{
            flex: 1,
            padding: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "none",
            background: "none",
            fontSize: 12,
          }}
        >
          <img
            src="https://img.icons8.com/ios-filled/50/000000/settings.png"
            alt="Settings"
            style={{ width: 24, height: 24, marginBottom: 2 }}
          />
          Settings
        </button>
      </div>
    </div>
  );
}

export default Footer;



