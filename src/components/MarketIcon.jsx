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
  const spanRef = useRef(null);
  const [fontPx, setFontPx] = useState(14); // default fallback

  // Read parent's computed font size on mount
  useEffect(() => {
    if (spanRef.current) {
      const style = window.getComputedStyle(spanRef.current);
      setFontPx(parseFloat(style.fontSize)); // in pixels
    }
  }, []);

  const [base, quote] = market.split("-");
  const showQuote = !!quote && quote !== base;

  const baseImg = logoMap[base] || "";
  const quoteImg = logoMap[quote] || "";

  // Icon scales based on fontPx
  const iconHeight = fontPx + 8;       // icons slightly larger than text
  const iconWidth = iconHeight * 1.4;  // overlap proportion

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      {/* Logos container */}
      <div style={{ position: "relative", width: iconWidth, height: iconHeight }}>
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

      {/* Market name: inherit font family and size */}
      <span
        ref={spanRef}
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
      </span>
    </div>
  );
}