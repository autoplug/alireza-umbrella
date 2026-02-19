import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowUp, faCircleArrowDown } from "@fortawesome/free-solid-svg-icons";

// Logos
import BTCLogo from "../assets/logos/btc.PNG";
import ETHLogo from "../assets/logos/eth.PNG";
import USDTLogo from "../assets/logos/usdt.PNG";
import RLSLogo from "../assets/logos/rls.jpg";

// Column widths
const COLUMN_WIDTHS = {
  index: "5%",
  amount: "40%",
  price: "40%",
  type: "15%",
};

// Table styles
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#f9f9f9",
  margin: 0,
  fontWeight: "bold",
  marginBottom : "10px",
};

const thStyle = {
  borderBottom: "1px solid #aaa",
  textAlign: "left",
  padding: "8px 20px",
  fontSize: "14px",
};

const tdStyle = {
  borderBottom: "1px solid #ddd",
  padding: "6px 20px",
  fontSize: "12px",
  fontFamily: "monospace",
};

// Logos mapping
const logoMap = {
  BTC: BTCLogo,
  ETH: ETHLogo,
  USDT: USDTLogo,
  RLS: RLSLogo,
};

// Market Icon
const MarketIcon = ({ market }) => {
  const [base, quote] = market.split("-");
  const baseImg = logoMap[base] || "";
  const quoteImg = logoMap[quote] || "";

  return (
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
  );
};

// Format amount
const formatAmount = (amount, market) => {
  if (amount == null) return "";

  if (market && market.toUpperCase().startsWith("BTC")) {
    const newAmount = Number(amount) * 1000000;
    return newAmount.toLocaleString("en-US") + " e-6";
  }

  return Number(amount).toLocaleString("en-US");
};

// Format price
const formatPrice = (price, market) => {
  if (price == null) return "";

  let value = Number(price);
  let unit = "";

  if (market) {
    const parts = market.split("-");
    const quote = parts[1] || "";

    if (quote.toUpperCase() === "RLS") {
      if (market.toUpperCase() === "USDT-RLS") {
        value = value / 10;
        unit = "IRT";
      } else if (
        market.toUpperCase() === "BRC-RLS" ||
        market.toUpperCase() === "BTC-RLS"
      ) {
        value = Math.floor(value / 10000000);
        unit = "IRM";
      } else {
        value = Math.floor(value / 10000000);
      }
    } else if (quote.toUpperCase() === "USDT" && market.toUpperCase() !== "USDT-RLS") {
      unit = "USD";
    }
  }

  return unit
    ? `${value.toLocaleString("en-US")} ${unit}`
    : `${value.toLocaleString("en-US")}`;
};

// Render type
const renderType = (type) => {
  if (!type) return "";
  const isBuy = type.toLowerCase() === "buy";

  return (
    <span
      style={{
        color: isBuy ? "#568546" : "#c2191c",
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <FontAwesomeIcon
        icon={isBuy ? faCircleArrowUp : faCircleArrowDown}
        size="sm"
      />
      {type}
    </span>
  );
};

export default function TableOrder({ orders, sortBy = "time" }) {
  // Group by market
  const ordersByMarket = orders.reduce((acc, order) => {
    const key = order.market || "Unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(order);
    return acc;
  }, {});

  let rowCounter = 0;

  return (
    <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
      {Object.keys(ordersByMarket).length === 0 ? (
        <p style={{ marginLeft: "20px" }}>No orders to display.</p>
      ) : (
        Object.entries(ordersByMarket)
          .sort(([a], [b]) => b.localeCompare(a)) // Reverse  Sort markets alphabetically
          .map(([market, marketOrders]) => {
            // 🔹 Sort inside table
            const sortedOrders = [...marketOrders].sort((a, b) => {
              if (sortBy === "price") {
                return Number(b.price) - Number(a.price);
              }

              // default: time
              return (
                new Date(b.created_at || b.timestamp) -
                new Date(a.created_at || a.timestamp)
              );
            });

            return (
              <div key={market} style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    marginBottom: "5px",
                    marginLeft: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <MarketIcon market={market} size={"normal"}/>
    
              </div>

                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={{ ...thStyle, width: COLUMN_WIDTHS.index }}>#</th>
                      <th style={{ ...thStyle, width: COLUMN_WIDTHS.amount }}>Amount</th>
                      <th style={{ ...thStyle, width: COLUMN_WIDTHS.price }}>Price</th>
                      <th style={{ ...thStyle, width: COLUMN_WIDTHS.type }}>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedOrders.map((order, index) => {
                      rowCounter += 1;

                      const isBuy = order.type?.toLowerCase() === "buy";
                      const baseColor = isBuy ? "#568546" : "#c2191c";
                      const bgColor = index % 2 === 0 ? "#ffffff" : "#f3f3f3";

                      return (
                        <tr key={rowCounter} style={{ backgroundColor: bgColor }}>
                          <td style={{ ...tdStyle, color: baseColor }}>
                            {rowCounter}
                          </td>
                          <td style={{ ...tdStyle, color: baseColor }}>
                            {formatAmount(order.amount, order.market)}
                          </td>
                          <td style={{ ...tdStyle, color: baseColor }}>
                            {formatPrice(order.price, order.market)}
                          </td>
                          <td style={{ ...tdStyle, color: baseColor }}>
                            {renderType(order.type)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })
      )}
    </div>
  );
}