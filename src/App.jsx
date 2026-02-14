import React, { useState, useEffect } from "react";

function App() {
  // State برای ذخیره خروجی
  const [output, setOutput] = useState("Loading...");

  useEffect(() => {
    // اینجا می‌تونی فایل JSON یا HTML که اکشن تولید کرده بخونی
    // برای مثال از یک لینک GitHub Pages
    fetch("https://username.github.io/repo-name/index.html")
      .then((res) => res.text())
      .then((data) => setOutput(data))
      .catch(() => setOutput("Failed to load output"));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial, sans-serif" }}>
      <h1>Project Output</h1>
      <div
        className="result"
        dangerouslySetInnerHTML={{ __html: output }} // برای نمایش HTML
        style={{ fontSize: "20px", color: "#333", margin: "20px 0" }}
      ></div>
    </div>
  );
}

export default App;