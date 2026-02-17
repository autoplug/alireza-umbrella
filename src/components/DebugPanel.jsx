import React, { useEffect, useState } from "react";
import axios from "axios";

const WORKER_URL = "https://nobitex.alireza-b83.workers.dev";

function DebugPanel() {
  const [logs, setLogs] = useState([]);

  const log = (message) => {
    setLogs((prev) => [...prev, message]);
  };

  useEffect(() => {
    const runDebug = async () => {
      log("=== WALLET DEBUG (AXIOS) START ===");

      try {
        const token = localStorage.getItem("NOBITEX_TOKEN");

        if (!token) {
          log("❌ No token found in localStorage");
          return;
        }

        log("✅ Token found");
        log("Sending request with axios...");

        const response = await axios.get(
          `${WORKER_URL}/users/wallets/list`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
            validateStatus: () => true, // prevent axios from throwing on non-200
          }
        );

        log(`Response status: ${response.status}`);

        if (typeof response.data === "object") {
          log("✅ JSON received:");
          log(JSON.stringify(response.data, null, 2));
        } else {
          log("⚠ Non-JSON response received:");
          log(response.data);
        }

      } catch (error) {
        log("❌ Axios error:");

        if (error.response) {
          log(`Status: ${error.response.status}`);
          log(JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
          log("No response received (Network error)");
        } else {
          log(error.message);
        }
      }

      log("=== WALLET DEBUG END ===");
    };

    runDebug();
  }, []);

  return (
    <div
      style={{
        fontFamily: "monospace",
        background: "#111",
        color: "#0f0",
        padding: 16,
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      {logs.map((item, index) => (
        <div key={index} style={{ whiteSpace: "pre-wrap" }}>
          {item}
        </div>
      ))}
    </div>
  );
}

export default DebugPanel;