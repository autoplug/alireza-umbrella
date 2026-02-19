import React, { useState, useEffect } from "react";
import TitleBar from "./TitleBar";
import localOrders from "../assets/nobitex.json";

// Import utils
import { removeDuplicates, applyFee } from "../api/utils";

// Import MarketIcon
import MarketIcon from "./MarketIcon";

// ----------------- Styles -----------------
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#f9f9f9",
  margin: 0,
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

const COLUMN_WIDTHS = {
  market: "40%",
  amount: "30%",
  profit: "30%",
};

// ----------------- Helper Functions -----------------
const formatAmount = (amount, base) => {
  if (base === "BTC") return (amount * 1e6).toLocaleString("en-US") + " BTC";
  if (base === "USDT") return Math.floor(amount).toLocaleString("en-US") + " USD";
  return Number(amount).toLocaleString("en-US");
};

const formatProfit = (profit, market) => {
  const quote = market.split("-")[1]?.toUpperCase() || "";
  if (quote === "USDT") return Math.floor(profit).toLocaleString("en-US") + " USD";
  if (quote === "RLS") return Math.floor(profit / 10).toLocaleString("en-US") + " IRT";
  return Number(profit).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// ---------------- ProfitSummary Component -----------------
export default function ProfitSummary() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("ORDERS_CACHE") || "[]");
    const storedMarkets = JSON.parse(localStorage.getItem("MARKETS_CACHE") || "{}");

    let combinedOrders = [...storedOrders, ...localOrders];
    combinedOrders = combinedOrders.filter((o) => o.status === "Done");

    const uniqueOrders = removeDuplicates(combinedOrders);

    const ordersByMarket = {};
    uniqueOrders.forEach((order) => {
      const market = order.market || "Unknown";
      if (!ordersByMarket[market]) ordersByMarket[market] = [];
      ordersByMarket[market].push(order);
    });

    const data = Object.entries(ordersByMarket)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([market, marketOrders]) => {
        const ordersWithFee = applyFee(marketOrders);

        let totalBuyValue = 0;
        let totalBuyAmount = 0;
        let totalSellValue = 0;
        let totalSellAmount = 0;

        ordersWithFee.forEach((order) => {
          const amt = Number(order.amount);
          const price = Number(order.feePrice);
          if (order.type.toLowerCase() === "buy") {
            totalBuyValue += amt * price;
            totalBuyAmount += amt;
          } else if (order.type.toLowerCase() === "sell") {
            totalSellValue += amt * price;
            totalSellAmount += amt;
          }
        });

        const remainingAmount = totalBuyAmount - totalSellAmount;
        const currentPrice = Number(storedMarkets[market.toLowerCase()] || 0);
        const totalSold = totalSellValue + remainingAmount * currentPrice;
        const profit = totalSold - totalBuyValue;

        const base = market.split("-")[0].toUpperCase();

        return { market, amount: remainingAmount, base, profit };
      });

    setTableData(data);
    setLoading(false);
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <TitleBar title="Profit Summary" count={tableData.length} />

      <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
        {tableData.length === 0 ? (
          <p style={{ marginLeft: "20px" }}>No data to display.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: COLUMN_WIDTHS.market }}>Market</th>
                <th style={{ ...thStyle, width: COLUMN_WIDTHS.amount }}>Remaining</th>
                <th style={{ ...thStyle, width: COLUMN_WIDTHS.profit }}>Profit</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => {
                const bgColor = index % 2 === 0 ? "#ffffff" : "#f3f3f3";
                const profitColor = row.profit >= 0 ? "#568546" : "#c2191c";

                return (
                  <tr key={index} style={{ backgroundColor: bgColor }}>
                    <td
                      style={{
                        ...tdStyle,
                        width: COLUMN_WIDTHS.market,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <MarketIcon market={row.market} />
                  
                    </td>
                    <td style={{ ...tdStyle, width: COLUMN_WIDTHS.amount }}>
                      {formatAmount(row.amount, row.base)}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        width: COLUMN_WIDTHS.profit,
                        color: profitColor,
                        fontWeight: "bold",
                      }}
                    >
                      {formatProfit(row.profit, row.market)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}