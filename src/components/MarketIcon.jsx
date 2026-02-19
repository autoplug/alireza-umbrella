import React from "react";
import BTCLogo from "../assets/logos/btc.PNG";
import ETHLogo from "../assets/logos/eth.PNG";
import USDTLogo from "../assets/logos/usdt.PNG";
import RLSLogo from "../assets/logos/rls.jpg";

// Logos mapping
const logoMap = {
  BTC: BTCLogo,
  ETH: ETHLogo,
  USDT: USDTLogo,
  RLS: RLSLogo,
};

export default function MarketIcon({ market, showName = true }) {
  const [base, quote] = market.split("-");
  const baseImg = logoMap[base] || "";
  const quoteImg = logoMap[quote] || "";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      {/* Logos */}
      <div style={{ position: "relative", width: "28px", height: "20px" }}>
        <img
          src={quoteImg}
          alt=""
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            position: "absolute",
            left: 12,
            top: 0,
            zIndex: 0,
          }}
        />
        <img
          src={baseImg}
          alt=""
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 1,
          }}
        />
      </div>

      {/* Market name (optional) */}
      {showName && (
        <span style={{ fontWeight: "bold", fontSize: "12px" }}>{market}</span>
      )}
    </div>
  );
}