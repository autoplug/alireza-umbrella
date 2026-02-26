import React from "react";
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
    fontFamily: "monospace",
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
  };

  const getOrderTime = (order) => {
    if (order.timestamp) return new Date(order.timestamp).getTime();
    if (order.created_at) return new Date(order.created_at).getTime();
    return 0;
  };

  // Group by market
  const grouped = orders.reduce((acc, order) => {
    const key = order.market?.toUpperCase() || "UNKNOWN";
    if (!acc[key]) acc[key] = [];
    acc[key].push(order);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(grouped).map(([market, marketOrders]) => {
        const orderType = marketOrders[0].type?.toLowerCase();
        let sorted = [...marketOrders];

        // Sorting
        if (!summary) {
          sorted.sort((a, b) => getOrderTime(b) - getOrderTime(a));
        }

        if (summary && orderType === "buy") {
          sorted.sort((a, b) => b.price - a.price);
        }

        if (summary && orderType === "sell") {
          sorted.sort((a, b) => getOrderTime(b) - getOrderTime(a));
        }

        // Summary calculations
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

        const weightedAvg =
          totalAmount > 0 ? weightedSum / totalAmount : 0;

        let headers = ["Id", "Amount", "Price", "Type"];

        if (summary && orderType === "sell") {
          headers = ["Id", "Profit", "Avg Price", "Type"];
        }

        const arrow = orderType === "sell" ? "↓" : "↑";

        return (
          <div key={market}>
            {/* Title */}
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
              <span>{market}</span>
              <span>{arrow}</span>
            </div>

            <table style={tableStyle}>
              <thead>
                <tr>
                  {headers.map((h, i) => (
                    <th
                      key={h}
                      style={{ ...thStyle, width: COLUMN_WIDTHS[i] }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {sorted.map((order, index) => {
                  const rowColor =
                    order.type?.toLowerCase() === "sell"
                      ? "#d32f2f"
                      : "#2e7d32";

                  return (
                    <tr key={index} style={{ color: rowColor }}>
                      <td style={{ ...tdStyle, width: COLUMN_WIDTHS[0] }}>
                        {index + 1}
                      </td>

                      <td style={{ ...tdStyle, width: COLUMN_WIDTHS[1] }}>
                        {summary &&
                        order.type?.toLowerCase() === "sell"
                          ? formatPrice(order.profit, market)
                          : formatAmount(order.amount, market)}
                      </td>

                      <td style={{ ...tdStyle, width: COLUMN_WIDTHS[2] }}>
                        {formatPrice(order.price, market)}
                      </td>

                      <td style={{ ...tdStyle, width: COLUMN_WIDTHS[3] }}>
                        {order.type}
                      </td>
                    </tr>
                  );
                })}

                {summary && (
                  <tr
                    style={{
                      backgroundColor: "#eef2f7",
                      fontWeight: "bold",
                      borderTop: "2px solid #bbb",
                    }}
                  >
                    <td style={{ ...tdStyle, width: COLUMN_WIDTHS[0] }}>
                      T
                    </td>

                    {orderType === "buy" && (
                      <>
                        <td style={{ ...tdStyle, width: COLUMN_WIDTHS[1] }}>
                          {formatAmount(totalAmount, market)}
                        </td>
                        <td style={{ ...tdStyle, width: COLUMN_WIDTHS[2] }}>
                          {formatPrice(weightedAvg, market)}
                        </td>
                        <td style={{ ...tdStyle, width: COLUMN_WIDTHS[3] }}>
                          buy
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
                          sell
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