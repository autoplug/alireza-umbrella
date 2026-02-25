import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowUp, faCircleArrowDown } from "@fortawesome/free-solid-svg-icons";

// Import MarketIcon from your centralized component
import MarketIcon from "./MarketIcon";
import {formatPrice, formatAmount} from "../api/utils";

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

export default function TableOrder({ orders, total = null }) {

  // Group by market
  const ordersByMarket = orders.reduce((acc, order) => {
    const key = order.market.toUpperCase() || "Unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(order);
    return acc;
  }, {});

  // Return early if no orders
  if (!orders || orders.length === 0) {
    return <p style={{ marginLeft: "20px" }}>No orders to display.</p>;
  }


  return (
    <div>
        Object.entries(ordersByMarket)
          .sort(([a], [b]) => b.localeCompare(a)) // Reverse  Sort markets alphabetically
          .map(([market, marketOrders]) => {
            // Determine columns: total keys or COLUMN_WIDTHS keys
            const hasTotal = !!total
            const cols = hasTotal ? total : COLUMN_WIDTHS;
            
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
                      {cols.map((col, idx) => (
                        <th key={idx} style={{ ...thStyle, width: cols[col] }}>
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
                        <tr key={rowCounter} style={{ backgroundColor: bgColor }}>
                          <td style={{ ...tdStyle, color: baseColor }}>
                            {index+1}
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
                          <td key={col} style={{ ...tdStyle}}>
                            {cidx === 0 ? "T" : total[col] ?? ""}
                          </td>
                        ))}
                      </tr>
                    )}
                       
                    
                  </tbody>
                </table>
              </div>
            );
          })
    </div>
  );
}