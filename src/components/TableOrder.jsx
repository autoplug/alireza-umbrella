import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowUp, faCircleArrowDown } from "@fortawesome/free-solid-svg-icons";

// Import MarketIcon from your centralized component
import MarketIcon from "./MarketIcon";
import {formatPrice} from "../api/utils";

// Column widths
const COLUMN_WIDTHS = {
  id: "5%",
  Amount: "35%",
  Price: "45%",
  Type: "15%",
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

export default function TableOrder({ orders, sortBy = "time", total = null }) {

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


            // Determine columns: total keys or COLUMN_WIDTHS keys
            const cols = total ? Object.keys(total) : Object.keys(COLUMN_WIDTHS);
            const hasTotal = !!total


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
                      {cols.map((col) => (
                        <th key={col} style={{ ...thStyle, width: COLUMN_WIDTHS[col] || "auto" }}>
                          {col}
                        </th>
                      ))}
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
                            {hasTotal ? formatPrice(order.amount, order.market) : formatAmount(order.amount, order.market)}
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
                    
                    
                    {/* Total row */}
                    {hasTotal && (
                      <tr style={{ backgroundColor: "#eef2f7", fontWeight: "bold", borderTop: "2px solid #bbb"}}>
                        {cols.map((col, cidx) => (
                          <td key={col} style={{ ...tdStyle, padding: "6px 20px" }}>
                            {cidx === 0 ? "Total" : total[col] ?? ""}
                          </td>
                        ))}
                      </tr>
                    )}
                       
                    
                  </tbody>
                </table>
              </div>
            );
          })
      )}
    </div>
  );
}