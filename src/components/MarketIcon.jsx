import React from "react";
import BTCLogo from "../assets/logos/btc.PNG";
import ETHLogo from "../assets/logos/eth.PNG";
import USDTLogo from "../assets/logos/usdt.PNG";
import RLSLogo from "../assets/logos/rls.jpg";

// Mapping of asset symbols to logos
const logoMap = {
  BTC: BTCLogo,
  ETH: ETHLogo,
  USDT: USDTLogo,
  RLS: RLSLogo,
};

export default function MarketIcon({ market, size = "normal" }) {
  // Split market string into base and quote assets
  const [base, quote] = market.split("-");

  // Show quote logo only if different from base
  const showQuote = !!quote && quote !== base;

  const baseImg = logoMap[base] || "";
  const quoteImg = logoMap[quote] || "";

  // Define font sizes
  const fontSizes = {
    small: 12,
    normal: 14,
    large: 16,
  };

  const fontSize = fontSizes[size] || fontSizes.normal;

  // Icon dimensions proportional to font size
  const iconHeight = fontSize + 8; // e.g., 20px for small, 22px normal, 24px large
  const iconWidth = iconHeight * 1.4; // proportion for overlap

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      {/* Logos container */}
      <div style={{ position: "relative", width: iconWidth, height: iconHeight }}>
        {/* Quote logo */}
        {showQuote && (
          <img
            src={quoteImg}
            alt=""
            style={{
              width: iconHeight,
              height: iconHeight,
              borderRadius: "50%",
              position: "absolute",
              left: iconWidth - iconHeight,
              top: 0,
              zIndex: 0,
            }}
          />
        )}
        {/* Base logo */}
        {baseImg && (
          <img
            src={baseImg}
            alt=""
            style={{
              width: iconHeight,
              height: iconHeight,
              borderRadius: "50%",
              position: "absolute",
              left: 0,
              top: 0,
              zIndex: 1,
            }}
          />
        )}
      </div>

      {/* Market name */}
      <span
        style={{
          fontWeight: "bold",
          fontSize: fontSize,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: 120,
        }}
      >
        {market}
      </span>
    </div>
  );
}