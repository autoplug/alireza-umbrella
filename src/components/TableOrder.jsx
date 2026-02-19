import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowUp, faCircleArrowDown } from "@fortawesome/free-solid-svg-icons";

// Import MarketIcon from your centralized component
import MarketIcon from "./MarketIcon"; // <-- make sure path is correct

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
          .sort(([a], [b]) => b.localeCompare(a)) // Reverse sort markets alphabetically
          .map(([market, marketOrders]) => {
            const sortedOrders = [...marketOrders].sort((a, b) => {
              if (sortBy === "price") return Number(b.price) - Number(a.price);
              return (
                new Date(b.created_at || b.timestamp) -
                new Date(a.created_at || a.timestamp)
              );
            });

            return (
              <div key={market} style={{ marginBottom: "20px" }}>
                {/* Use centralized MarketIcon component here */}
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    marginBottom: "5px",
                    marginLeft: "20px",
                  }}
                >
                  <MarketIcon market={market} size="normal" />
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
                          <td style={{ ...tdStyle, color: baseColor }}>{rowCounter}</td>
                          <td style={{ ...tdStyle, color: baseColor }}>{order.amount}</td>
                          <td style={{ ...tdStyle, color: baseColor }}>{order.price}</td>
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