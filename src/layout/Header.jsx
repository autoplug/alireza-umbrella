import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useUpdateTime } from "../context/UpdateTimeContext";

// Helper: time ago with icon color
const simpleTimeAgo = (timestamp) => {
  if (!timestamp) return { text: "No data", color: "gray" };

  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / 60000);

  if (seconds < 30)
    return { text: "Live", color: "limegreen" };

  if (minutes < 2)
    return { text: "Recently updated", color: "gold" };

  if (minutes < 60)
    return { text: `${minutes} minute${minutes > 1 ? "s" : ""} ago`, color: "orange" };

  return { text: "Stale data", color: "red" };
};

export default function Header() {
  const HEADER_HEIGHT = 56;

  // 🔥 Read from global context (auto updates when any query updates)
  const { lastUpdate } = useUpdateTime();

  const { text, color } = simpleTimeAgo(lastUpdate);

  return (
    <div
      style={{
        transform: "translateX(0%)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        justifyContent: "flex-start",
        position: "fixed",
        fontFamily: "monospace",
        top: 0,
        left: 0,
        height: `calc(${HEADER_HEIGHT}px + env(safe-area-inset-top))`,
        width: "100%",
        backgroundColor: "#858585",
        borderBottom: "2px solid #707070",
        padding: "8px 16px",
        zIndex: 1000,
        fontSize: "12px",
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <FontAwesomeIcon icon={faCircleCheck} style={{ color }} />
      <span>Last update: {text}</span>
    </div>
  );
}