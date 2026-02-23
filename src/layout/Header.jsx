import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

import { useUpdate } from "../context/UpdateContext";

// Helper: time ago with icon color
const simpleTimeAgo = (timestamp) => {
  if (!timestamp) return { text: "Never", color: "gray" };

  const diff = Date.now() - Number(timestamp);
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return { text: "just now", color: "limegreen" }; // green
  if (minutes < 60) return { text: `${minutes} minute${minutes > 1 ? "s" : ""} ago`, color: "gold" }; // yellow
  return { text: "more than an hour ago", color: "red" }; // red
};

export default function Header() {
  const { lastUpdate } = useUpdate();
  const { text, color } = simpleTimeAgo(lastUpdate);

  return (
    <div
        style={{
          transform: "translateX(0%)",
          color : "#fff",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          justifyContent: "flex-start",
          position: "fixed",
          fontFamily : "monospace",
          top: 1,
          left: 0,
          height: "40px",
          width: "100%",
          backgroundColor: "#858585",
          borderBottom: "2px solid #707070",
          padding: "8px 16px",
          zIndex: 1000,        // بالاتر از سایر المان‌ها
          fontSize: "12px",
          paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <FontAwesomeIcon icon={faCircleCheck} style={{ color }} />
      <span> Last update: {text}</span>
    </div>
  );
}