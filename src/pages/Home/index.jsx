import React from "react";
import Wallets from "./Wallets";
import Today from "./Today";

export default function Home() {
  return (
    <div>
      <Wallets />
      <Today />

      {/* Spacer at the bottom to avoid overlapping with bottom menu */}
      <div style={{ height: "60px" }}></div>
    </div>
  );
}