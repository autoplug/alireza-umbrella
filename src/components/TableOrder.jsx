import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowUp, faCircleArrowDown } from "@fortawesome/free-solid-svg-icons";

// Import MarketIcon from your centralized component
import MarketIcon from "./MarketIcon";

// Column widths
const COLUMN_WIDTHS = {
  index: "5%",
  amount: "35%",
  price: "45%",
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

// Format amount
const formatAmount = (amount, market) => {
  if (amount == null) return "";
  let value = Number(amount);

  if (market && market.toUpperCase().startsWith("BTC")) {
    const newAmount = value * 1_000_000;
    return "BTC " + newAmount.toLocaleString("en-US");
  }

  if (market && market.toUpperCase().startsWith("USD")) {
    if (value < 10) {
      // Show two decimal places if below 10
      return "USD " + value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else {
      // No decimals if 10 or above
      return "USD " + Math.floor(value).toLocaleString("en-US");
    }
  }

  return Number(amount).toLocaleString("en-US");
};

// Format price
const formatPrice = (price, market) => {
  let value = Number(price);

  // Return zero if value is invalid
  if (!value || isNaN(value)) return "0";

  // Extract quote currency from market string (e.g. BTC-IRT → IRT)
  const quoteCurrency = market?.split("-")[1]?.toUpperCase();

  // ===== IRT (Iranian Rial) =====
  if (quoteCurrency === "RLS") {
    if (value < 100_000_000) {
      // Remove one zero (divide by 10)
      value = value / 10;
      return "IRT " + Math.floor(value).toLocaleString("en-US");
    } else {
      // Remove seven zeros (divide by 10,000,000)
      value = value / 10_000_000;
      return "IRM " + Math.floor(value).toLocaleString("en-US");
    }
  }

  // ===== USD / USDT =====
  if (quoteCurrency === "USD" || quoteCurrency === "USDT") {
    if (value < 10) {
      // Show two decimal places if below 10
      return "USD " + value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else {
      // No decimals if 10 or above
      return "USD " + Math.floor(value).toLocaleString("en-US");
    }
  }

  // ===== Default fallback =====
  return value.toLocaleString("en-US");
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

export default function TableOrder({ orders, sortBy = "time", profit = false }) {
  // Group by market
  const ordersByMarket = orders.reduce((acc, order) => {
    const key = order.market || "Unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(order);
    return acc;
  }, {});

  let rowCounter = 0;

  return (
    <div>
      {Object.keys(ordersByMarket).length === 0 ? (
        <p style={{ marginLeft: "20px" }}>No orders to display.</p>
      ) : (
        Object.entries(ordersByMarket)
          .sort(([a], [b]) => b.localeCompare(a)) // Reverse  Sort markets alphabetically
          .map(([market, marketOrders]) => {
            // 🔹 Sort inside table
            const sortedOrders = [...marketOrders].sort((a, b) => {
              if (sortBy === "price") {
                return Number(a.price) - Number(b.price);
              }

              // default: time
              return (
                new Date(a.created_at || a.timestamp) -
                new Date(b.created_at || b.timestamp)
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
                      <th style={{ ...thStyle, width: COLUMN_WIDTHS.amount }}>{profit ? "Profit" : "Amount" }</th>
                      <th style={{ ...thStyle, width: COLUMN_WIDTHS.price }}>{profit ? "Avg Price" : "Price" }</th>
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
                            {profit ? formatPrice(order.amount, order.market) : formatAmount(order.amount, order.market)}
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