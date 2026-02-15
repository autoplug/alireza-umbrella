import React from "react";
import TokenInput from "../components/TokenInput";

function Settings({ token, onSaveToken }) {
  return (
    <div style={{ padding: 16 }}>
      <h2>Settings</h2>

      {/* Token setting */}
      <div style={{ marginBottom: 16 }}>
        <h4>Nobitex Token</h4>
        <TokenInput onSave={onSaveToken} initialToken={token} />
      </div>

      {/* Other settings can be added here */}
    </div>
  );
}

export default Settings;