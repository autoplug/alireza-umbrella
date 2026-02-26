import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowUp, faCircleArrowDown } from "@fortawesome/free-solid-svg-icons";
import { formatPrice, formatAmount } from "../api/utils";
import MarketIcon from "../components/MarketIcon";

export default function TableOrder({ orders = [], summary = false }) {
  if (!orders.length) {
    return <p style={{ marginLeft: "20px" }}>No orders to display.</p>;
  }

  const COLUMN_WIDTHS = ["5%", "35%", "45%", "15%"];

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#f9f9f9",
    marginBottom: "25px",
    fontWeight: "bold",
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

  const getOrderTime = (order) => {
    if (order.timestamp) return new Date(order.timestamp).getTime();
    if (order.created_at) return new Date(order.created_at).getTime();
    return 0;
  };

  const renderType = (type) => {
    if (!type) return "";
    const isBuy = type.toLowerCase() === "buy";

    return (
      <span
        style={{
          color: isBuy ? "#568546" : "#d32f2f",
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

  // Group by market
  const grouped = orders.reduce((acc, order) => {
    const key = order.market?.toUpperCase() || "UNKNOWN";
    if (!acc[key]) acc[key] = [];
    acc[key].push(order);
    return acc;
  }, {});

  // Sort markets alphabetically
  const sortedMarkets = Object.keys(grouped).sort((a, b) => a.localeCompare(b));

  return (
    <div>
      {sortedMarkets.map((market) => {
        const marketOrders = grouped[market];
        const orderType = marketOrders[0].type?.toLowerCase();
        let sorted = [...marketOrders];

        // Default sort by time reversed
        sorted.sort((a, b) => getOrderTime(a) - getOrderTime(b));

        // Summary + buy → sort by price reversed
        if (summary && orderType === "buy") {
          sorted.sort((a, b) => a.price - b.price);
        }

        // For display only: sell + summary → last 5 orders reversed
        let displayOrders = sorted;
        if (summary && orderType === "sell") {
          displayOrders = sorted.slice(-20);
        }

        // Summary calculations: always from all orders
        let totalAmount = 0;
        let totalProfit = 0;
        let weightedSum = 0;

        if (summary) {
          sorted.forEach((order) => {
            const amount = Number(order.amount || 0);
            const price = Number(order.price || 0);
            const profit = Number(order.profit || 0);

            totalAmount += amount;
            weightedSum += amount * price;
            totalProfit += profit;
          });
        }

        const weightedAvg = totalAmount > 0 ? weightedSum / totalAmount : 0;

        let headers = ["Id", "Amount", "Price", "Type"];
        if (summary && orderType === "sell") {
          headers = ["Id", "Profit", "Avg Price", "Type"];
        }

        return (
          <div key={market}>
            {/* Only show market icon, no name or arrow */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginLeft: "20px",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              <MarketIcon market={market} />
            </div>

            <table style={tableStyle}>
              <thead>
                <tr>
                  {headers.map((h, i) => (
                    <th key={h} style={{ ...thStyle, width: COLUMN_WIDTHS[i] }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {displayOrders.map((order, index) => (
                  <tr
                    key={index}
                    style={{
                      color: order.type?.toLowerCase() === "sell" ? "#d32f2f" : "#568546",
                    }}
                  >
                    <td style={{ ...tdStyle, width: COLUMN_WIDTHS[0] }}>{index + 1}</td>

                    <td style={{ ...tdStyle, width: COLUMN_WIDTHS[1] }}>
                      {summary && orderType === "sell"
                        ? formatPrice(order.profit, market)
                        : formatAmount(order.amount, market)}
                    </td>

                    <td style={{ ...tdStyle, width: COLUMN_WIDTHS[2] }}>
                      {summary && orderType === "sell"
                        ? formatPrice(order.avgPrice, market)
                        : formatPrice(order.price, market)}
                    </td>

                    <td style={{ ...tdStyle, width: COLUMN_WIDTHS[3] }}>
                      {renderType(order.type)}
                    </td>
                  </tr>
                ))}

                {summary && (
                  <tr
                    style={{
                      backgroundColor: "#eef2f7",
                      fontWeight: "bold",
                      borderTop: "2px solid #bbb",
                    }}
                  >
                    <td style={{ ...tdStyle, width: COLUMN_WIDTHS[0] }}>T</td>

                    {orderType === "buy" && (
                      <>
                        <td style={{ ...tdStyle, width: COLUMN_WIDTHS[1] }}>
                          {formatAmount(totalAmount, market)}
                        </td>
                        <td style={{ ...tdStyle, width: COLUMN_WIDTHS[2] }}>
                          {formatPrice(weightedAvg, market)}
                        </td>
                        <td style={{ ...tdStyle, width: COLUMN_WIDTHS[3] }}>
                          {renderType("buy")}
                        </td>
                      </>
                    )}

                    {orderType === "sell" && (
                      <>
                        <td style={{ ...tdStyle, width: COLUMN_WIDTHS[1] }}>
                          {formatPrice(totalProfit, market)}
                        </td>
                        <td style={{ ...tdStyle, width: COLUMN_WIDTHS[2] }}>
                          {formatPrice(weightedAvg, market)}
                        </td>
                        <td style={{ ...tdStyle, width: COLUMN_WIDTHS[3] }}>
                          {renderType("sell")}
                        </td>
                      </>
                    )}
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