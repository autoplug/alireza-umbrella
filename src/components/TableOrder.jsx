import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowUp, faCircleArrowDown } from "@fortawesome/free-solid-svg-icons";
import MarketIcon from "./MarketIcon";
import { formatPrice, formatAmount } from "../api/utils";

// Default column widths
const COLUMN_WIDTHS = {
  id: "5%",
  Amount: "35%",
  Price: "45%",
  Type: "15%",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#f9f9f9",
  margin: 0,
  fontWeight: "bold",
  marginBottom: "10px",
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

// Render buy/sell type with icon
const renderType = (type) => {
  if (!type) return "";
  const isBuy = type.toLowerCase() === "buy";

  return (
    <span style={{ color: isBuy ? "#568546" : "#c2191c", display: "flex", alignItems: "center", gap: "6px" }}>
      <FontAwesomeIcon icon={isBuy ? faCircleArrowUp : faCircleArrowDown} size="sm" />
      {type}
    </span>
  );
};

export default function TableOrder({ orders = [], total = null }) {
  if (!orders || orders.length === 0) {
    return <p style={{ marginLeft: "20px" }}>No orders to display.</p>;
  }

  // Group orders by market
  const ordersByMarket = orders.reduce((acc, order) => {
    const key = order.market?.toUpperCase() || "UNKNOWN";
    if (!acc[key]) acc[key] = [];
    acc[key].push(order);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(ordersByMarket).map(([market, marketOrders]) => {
        const hasTotal = total && typeof total === "object";
        const cols = hasTotal ? Object.keys(total) : Object.keys(COLUMN_WIDTHS);
        const colWidths = hasTotal
          ? Object.values(total).map((v) => `${v}%`)
          : Object.values(COLUMN_WIDTHS);

        return (
          <div key={market} style={{ marginBottom: "20px" }}>
            {/* Market header */}
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
              <MarketIcon market={market} size="normal" />
            </div>

            <table style={tableStyle}>
              <thead>
                <tr>
                  {cols.map((col, idx) => (
                    <th key={col} style={{ ...thStyle, width: colWidths[idx] }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {marketOrders.map((order, index) => {
                  const isBuy = order.type?.toLowerCase() === "buy";
                  const baseColor = isBuy ? "#568546" : "#c2191c";
                  const bgColor = index % 2 === 0 ? "#ffffff" : "#f3f3f3";

                  return (
                    <tr key={index} style={{ backgroundColor: bgColor }}>
                      <td style={{ ...tdStyle, color: baseColor }}>{index + 1}</td>
                      <td style={{ ...tdStyle, color: baseColor }}>{formatAmount(order.amount, order.market)}</td>
                      <td style={{ ...tdStyle, color: baseColor }}>{formatPrice(order.price, order.market)}</td>
                      <td style={{ ...tdStyle, color: baseColor }}>{renderType(order.type)}</td>
                    </tr>
                  );
                })}

                {/* Total row */}
                {hasTotal && (
                  <tr style={{ backgroundColor: "#eef2f7", fontWeight: "bold", borderTop: "2px solid #bbb" }}>
                    {cols.map((col, idx) => (
                      <td key={col} style={{ ...tdStyle }}>
                        {idx === 0 ? "T" : total[col] ?? ""}
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}