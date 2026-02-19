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

  // Define icon sizes based on "size" prop
  const iconSizes = {
    small: 16,
    normal: 20,
    large: 28,
  };

  const iconHeight = iconSizes[size] || iconSizes.normal;
  const iconWidth = iconHeight * 1.4; // proportion for overlapping

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

      {/* Market name (always displayed, font controlled externally) */}
      <span
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          
        }}
      >
        {market}
      </span>
    </div>
  );
}