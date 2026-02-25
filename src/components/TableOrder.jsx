import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowUp, faCircleArrowDown } from "@fortawesome/free-solid-svg-icons";
import { formatPrice, formatAmount } from "../api/utils";

const DEFAULT_WIDTHS = ["5%", "35%", "45%", "15%"];

export default function TableOrder({
  orders = [],
  widths = DEFAULT_WIDTHS,
  summary = false,
  colTypes = ["id", "amount", "price", "type"], // type of each column
}) {
  if (!orders.length) {
    return <p style={{ marginLeft: "20px" }}>No orders to display.</p>;
  }

  const firstOrder = orders[0];
  const dynamicKeys = Object.keys(firstOrder).filter(k => k !== "market");
  const columns = ["id", ...dynamicKeys]; // order of columns

  const tableStyle = { width: "100%", borderCollapse: "collapse", backgroundColor: "#f9f9f9", fontWeight: "bold", marginBottom: "10px" };
  const thStyle = { borderBottom: "1px solid #aaa", textAlign: "left", padding: "8px 20px", fontSize: "14px" };
  const tdStyle = { borderBottom: "1px solid #ddd", padding: "6px 20px", fontSize: "12px", fontFamily: "monospace" };

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

  // Group orders by market
  const ordersByMarket = orders.reduce((acc, order) => {
    const key = order.market?.toUpperCase() || "UNKNOWN";
    if (!acc[key]) acc[key] = [];
    acc[key].push(order);
    return acc;
  }, {});

  // Helper to format cell based on colType
  const formatCell = (col, value, order) => {
    const type = colTypes[columns.indexOf(col)];
    if (type === "type") return renderType(value);
    if (type === "amount") return formatAmount(value, order.market);
    if (type === "price") return formatPrice(value, order.market);
    return value;
  };

  return (
    <div>
      {Object.entries(ordersByMarket).map(([market, marketOrders]) => {
        const dataRows = summary ? marketOrders.slice(0, -1) : marketOrders;
        const summaryRow = summary ? marketOrders[marketOrders.length - 1] : null;

        return (
          <div key={market} style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px", marginLeft: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              {market}
            </div>

            <table style={tableStyle}>
              <thead>
                <tr>
                  {columns.map((col, idx) => (
                    <th key={col} style={{ ...thStyle, width: widths[idx] }}>{col}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {dataRows.map((order, index) => {
                  const bgColor = index % 2 === 0 ? "#ffffff" : "#f3f3f3";

                  return (
                    <tr key={index} style={{ backgroundColor: bgColor }}>
                      {columns.map((col, idx) => {
                        const value = col === "id" ? index + 1 : order[col] ?? "";
                        return <td key={idx} style={{ ...tdStyle }}>{formatCell(col, value, order)}</td>;
                      })}
                    </tr>
                  );
                })}

                {summaryRow && (
                  <tr style={{ backgroundColor: "#eef2f7", fontWeight: "bold", borderTop: "2px solid #bbb" }}>
                    {columns.map((col, idx) => {
                      const value = col === "id" ? "T" : summaryRow[col] ?? "";
                      return <td key={idx} style={tdStyle}>{formatCell(col, value, summaryRow)}</td>;
                    })}
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