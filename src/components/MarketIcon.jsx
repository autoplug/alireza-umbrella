import React, { useEffect, useRef, useState } from "react";
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
  const divRef = useRef(null); // changed from spanRef
  const [fontPx, setFontPx] = useState(14); // fallback if parent font not ready

  // Read parent's computed font size on mount
  useEffect(() => {
    if (divRef.current) {
      const style = window.getComputedStyle(divRef.current);
      setFontPx(parseFloat(style.fontSize));
    }
  }, []);

  const [base, quote] = market.split("-");
  const showQuote = !!quote && quote !== base;

  const baseImg = logoMap[base] || "";
  const quoteImg = logoMap[quote] || "";

  // Optional size modifier for icons
  const sizeModifiers = {
    small: 0.8,   // 80% of fontPx
    normal: 1,    // 100% of fontPx
    large: 2,   // 140% of fontPx
  };
  const scale = sizeModifiers[size] || 1;

  // Calculate icon dimensions proportional to fontPx
  const iconHeight = (fontPx + 8) * scale;  // slightly larger than text
  const iconWidth = iconHeight * 1.4;       // overlap proportion

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

      {/* Market name: now using div */}
      <div
        ref={divRef}
        style={{
          fontWeight: "bold",
          fontSize: "inherit",
          fontFamily: "inherit",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: 120,
        }}
      >
        {market}
      </div>
    </div>
  );
}