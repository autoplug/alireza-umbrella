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

export default function MarketIcon({ market, size = "normal" }) {
  // جدا کردن پایه و ارز دوم
  const [base, quote] = market.split("-");

  // اگر مارکت فقط یک ارز باشد، فقط لوگوی اول نمایش داده شود
  const showQuote = !!quote && quote !== base;

  const baseImg = logoMap[base] || "";
  const quoteImg = logoMap[quote] || "";

  // تنظیم اندازه‌ها بر اساس سایز
  const dimensions = {
    small: { width: 20, height: 14, fontSize: 10 },
    normal: { width: 28, height: 20, fontSize: 12 },
    large: { width: 40, height: 28, fontSize: 16 },
  };

  const { width, height, fontSize } = dimensions[size] || dimensions.normal;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      {/* Logos */}
      <div style={{ position: "relative", width: width, height: height }}>
        {showQuote && (
          <img
            src={quoteImg}
            alt=""
            style={{
              width: height,
              height: height,
              borderRadius: "50%",
              position: "absolute",
              left: width - height,
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
              width: height,
              height: height,
              borderRadius: "50%",
              position: "absolute",
              left: 0,
              top: 0,
              zIndex: 1,
            }}
          />
        )}
      </div>

      {/* Market name همیشه نمایش داده می‌شود */}
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